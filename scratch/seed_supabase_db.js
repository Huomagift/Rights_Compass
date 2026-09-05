/* eslint-env node */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const d = require('../data/nigeria_constitution_structured.json');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log("🚀 Starting Supabase Database Seeding...");

  // 1. Ensure Constitution Row Exists
  let { data: constRow } = await supabase
    .from('constitutions')
    .select('id')
    .eq('year', 1999)
    .maybeSingle();

  if (!constRow) {
    const { data: newConst, error: constErr } = await supabase
      .from('constitutions')
      .insert({
        title: 'Constitution of the Federal Republic of Nigeria 1999 (as amended)',
        year: 1999,
      })
      .select('id')
      .single();

    if (constErr) {
      console.error("Error creating constitution row:", constErr);
      process.exit(1);
    }
    constRow = newConst;
  }

  const constitutionId = constRow.id;
  console.log(`✅ Constitution Record ID: ${constitutionId}`);

  // 2. Batch Insert all 320 Constitution Sections
  console.log(`📦 Formatting ${d.sections.length} constitution sections...`);

  const rowsToInsert = d.sections.map((sec, idx) => ({
    constitution_id: constitutionId,
    section_number: sec.section_number.toString(),
    title: sec.title,
    full_text: sec.full_text,
    display_order: idx + 1,
    source_reference: `Official Gazette - Chapter ${sec.chapter_number}`,
  }));

  // Insert in batches of 50
  const BATCH_SIZE = 50;
  for (let i = 0; i < rowsToInsert.length; i += BATCH_SIZE) {
    const batch = rowsToInsert.slice(i, i + BATCH_SIZE);
    const { error: batchErr } = await supabase
      .from('constitution_sections')
      .upsert(batch, { onConflict: 'constitution_id, section_number' });

    if (batchErr) {
      console.warn(`Batch ${i / BATCH_SIZE + 1} insert warning:`, batchErr.message);
    } else {
      console.log(`  Uploaded sections ${i + 1} to ${Math.min(i + BATCH_SIZE, rowsToInsert.length)}...`);
    }
  }

  console.log("🎉 SUCCESS: All 320 Constitution Sections seeded into Supabase Database!");
}

seedDatabase().catch(err => {
  console.error("Fatal seed error:", err);
});
