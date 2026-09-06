import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Expanded Server-Side Urgency Keywords
const SERVER_URGENCY_KEYWORDS = [
  'right now',
  'happening now',
  'searching my car',
  'searching me',
  'they are arresting',
  'arresting me',
  'help me',
  'in police station',
  'at the station',
  'handcuffed',
  'handcuffs',
  'beating me',
  'slapped me',
  'holding me',
  'forced me',
  'extorting me',
  'detained me',
  'in custody'
];

interface TutorPayload {
  query: string;
  history?: Array<{ sender: string; text: string }>;
  userProfile?: { name?: string; interests?: string[] };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: TutorPayload = await req.json();
    const query = payload.query?.trim() || "";

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Missing query parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Urgency Detection
    const qLower = query.toLowerCase();
    const matchedUrgencyKw = SERVER_URGENCY_KEYWORDS.find((kw) => qLower.includes(kw));
    const isUrgent = !!matchedUrgencyKw;

    // 2. Database RAG Retrieval via Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Retrieve matching constitution sections
    const { data: sections } = await supabase
      .from("constitution_sections")
      .select("section_number, title, full_text, source_reference")
      .limit(20);

    // Retrieve matching approved published guides
    const { data: guides } = await supabase
      .from("guides")
      .select("title, description, content")
      .eq("signoff_status", "approved")
      .eq("published", true)
      .limit(10);

    // Simple RAG relevance scoring
    const terms = qLower.replace(/[^\w\s]/g, "").split(/\s+/).filter((t) => t.length > 2);
    const scoredSources: Array<{ citation: string; title: string; text: string; score: number }> = [];

    if (sections) {
      for (const sec of sections) {
        let score = 0;
        const numMatch = sec.section_number === qLower.replace(/\D/g, "");
        if (numMatch) score += 100;

        const titleLower = sec.title.toLowerCase();
        const textLower = sec.full_text.toLowerCase();

        terms.forEach((term) => {
          if (titleLower.includes(term)) score += 20;
          if (textLower.includes(term)) score += 5;
        });

        if (qLower.includes("phone") || qLower.includes("search") || qLower.includes("privacy")) {
          if (sec.section_number === "37") score += 100;
        }
        if (qLower.includes("arrest") || qLower.includes("detain") || qLower.includes("checkpoint") || qLower.includes("handcuff")) {
          if (sec.section_number === "35") score += 100;
          if (sec.section_number === "34") score += 50;
        }

        if (score > 0) {
          scoredSources.push({
            citation: `1999 Constitution Section ${sec.section_number}`,
            title: sec.title,
            text: sec.full_text,
            score,
          });
        }
      }
    }

    if (guides) {
      for (const g of guides) {
        let score = 0;
        const tLower = g.title.toLowerCase();
        terms.forEach((term) => {
          if (tLower.includes(term)) score += 25;
        });
        if (score > 0) {
          scoredSources.push({
            citation: `Rights Compass Guide: ${g.title}`,
            title: g.title,
            text: g.content,
            score,
          });
        }
      }
    }

    scoredSources.sort((a, b) => b.score - a.score);
    const topSources = scoredSources.slice(0, 3);

    // 3. AI Model Call (Checks for secret environment variable)
    const aiApiKey = Deno.env.get("AI_API_KEY") || Deno.env.get("OPENAI_API_KEY") || Deno.env.get("GEMINI_API_KEY");
    let answerText = "";
    let primaryCitation = topSources[0]?.citation || "1999 Constitution of Nigeria";

    if (aiApiKey) {
      // AI Model API integration (e.g. OpenAI / Gemini)
      try {
        const promptContext = topSources
          .map((s) => `[Source: ${s.citation} - ${s.title}]\n${s.text.slice(0, 400)}`)
          .join("\n\n");

        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${aiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are Rights Compass AI Tutor, a warm, plain-language legal educator grounded strictly in the 1999 Constitution of the Federal Republic of Nigeria and Nigerian Law. Always cite exact Section numbers and statutory references. Keep answers concise, clear, and actionable.\n\nRetrieved Legal Context:\n${promptContext}`,
              },
              { role: "user", content: query },
            ],
            temperature: 0.3,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          answerText = aiData.choices?.[0]?.message?.content || "";
        }
      } catch (e) {
        console.warn("AI Model API call error, falling back to grounded RAG answer", e);
      }
    }

    // Fallback if AI API key is pending or call fails
    if (!answerText) {
      if (topSources.length > 0) {
        const top = topSources[0];
        answerText = `Under ${top.citation} (${top.title}):\n\n${top.text.slice(0, 300)}...\n\nEvery citizen is protected under Nigerian law. You can assert your rights calmly.`;
      } else {
        answerText = "Under Chapter IV of the 1999 Constitution of Nigeria, your fundamental human rights are protected by law. You have the right to dignity, personal liberty, fair hearing, and privacy.";
      }
    }

    let emergencyTip: string | undefined = undefined;
    if (isUrgent) {
      emergencyTip = "Stay calm, do not resist physically, ask for the legal basis of the action, and demand to contact a legal practitioner or family member immediately.";
    }

    return new Response(
      JSON.stringify({
        success: true,
        answer: answerText,
        citation: primaryCitation,
        sources: topSources.map((s) => `${s.citation}: ${s.title}`),
        isUrgent,
        emergencyTip,
        mode: "online",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
