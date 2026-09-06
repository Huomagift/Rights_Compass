import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_API_TOKEN") || "";
const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") || "";
const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN") || "rights_compass_secure_token";

serve(async (req) => {
  const url = new URL(req.url);

  // 1. Webhook Verification (GET request from Meta)
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Meta WhatsApp Webhook Verified!");
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // 2. Inbound Message Handling (POST request from Meta)
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message && message.type === "text") {
        const from = message.from; // User WhatsApp Phone Number
        const userText = message.text.body; // User Question

        console.log(`📩 Inbound WhatsApp query from ${from}: "${userText}"`);

        // Forward query to AI Tutor pipeline
        const aiTutorUrl = `${url.origin}/functions/v1/ai-tutor`;
        const aiRes = await fetch(aiTutorUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: userText }),
        });

        const aiData = await aiRes.json();
        const replyText = `${aiData.answer}\n\n📚 Source: ${aiData.citation}`;

        // Send reply back to user via WhatsApp Cloud API
        if (WHATSAPP_TOKEN && PHONE_NUMBER_ID) {
          await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: from,
              type: "text",
              text: { body: replyText },
            }),
          });
        }
      }
      return new Response("EVENT_RECEIVED", { status: 200 });
    } catch (err: any) {
      console.error("WhatsApp webhook error:", err);
      return new Response("Internal Error", { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
});
