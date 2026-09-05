/* eslint-env node */
const d = require('../data/nigeria_constitution_structured.json');

// Statutory Non-Constitutional Provisions (Tenancy & Labour)
const STATUTORY_PROVISIONS = [
  {
    section_number: 'STATUTE-TENANCY',
    chapter_number: 'Tenancy Law 2011 / Recovery of Premises Act',
    title: 'Unlawful Eviction & Quit Notices',
    full_text: 'Where a tenancy is for one year or more, 6 months notice to quit is required under Section 13. A landlord cannot forcefully eject a tenant, lock out a tenant, remove roofs or doors, or seize personal belongings without a valid Court Order of Recovery.'
  },
  {
    section_number: 'STATUTE-LABOUR',
    chapter_number: 'Labour Act Cap L1 (LFN 2004)',
    section_number_str: 'Section 11',
    title: 'Termination of Employment & Notice Periods',
    full_text: 'Either party to a contract of employment may terminate the contract on giving to the other party notice: 1 day notice for employment under 3 months, 1 week for 3 months to 2 years, 2 weeks for 2 to 5 years, and 1 month for 5+ years of continuous service.'
  }
];

// Server-side Urgency Keywords (Expanded from local list)
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

function detectServerUrgency(query) {
  const qLower = query.toLowerCase();
  const matchedKeyword = SERVER_URGENCY_KEYWORDS.find(kw => qLower.includes(kw));
  return {
    isUrgent: !!matchedKeyword,
    matchedKeyword: matchedKeyword || null
  };
}

// Full-text & Keyword Retrieval engine
function retrieveLegalSources(query, topK = 3) {
  const qLower = query.toLowerCase();
  const terms = qLower.replace(/[^\w\s]/g, '').split(/\s+/).filter(t => t.length > 2);

  const allItems = [
    ...d.sections.map(s => ({
      type: 'constitution',
      section_number: s.section_number,
      chapter: s.chapter_number,
      title: s.title,
      full_text: s.full_text,
    })),
    ...STATUTORY_PROVISIONS.map(s => ({
      type: 'statute',
      section_number: s.section_number,
      chapter: s.chapter_number,
      title: s.title,
      full_text: s.full_text,
    }))
  ];

  const scoredItems = allItems.map(item => {
    let score = 0;
    const numOnly = qLower.replace(/\D/g, '');
    if (numOnly && item.section_number === numOnly) score += 120;

    const titleLower = item.title.toLowerCase();
    const textLower = item.full_text.toLowerCase();

    terms.forEach(term => {
      if (titleLower.includes(term)) score += 20;
      if (textLower.includes(term)) score += 5;
    });

    // High relevance domain boosters
    if (qLower.includes('phone') || qLower.includes('search') || qLower.includes('privacy')) {
      if (item.section_number === '37') score += 100;
    }
    if (qLower.includes('arrest') || qLower.includes('detain') || qLower.includes('checkpoint') || qLower.includes('handcuff')) {
      if (item.section_number === '35') score += 100;
      if (item.section_number === '34') score += 50;
    }
    if (qLower.includes('evict') || qLower.includes('landlord') || qLower.includes('quit notice') || qLower.includes('tenant') || qLower.includes('rent')) {
      if (item.section_number === 'STATUTE-TENANCY' || item.title.includes('Eviction')) score += 150;
    }
    if (qLower.includes('fire') || qLower.includes('terminate') || qLower.includes('salary') || qLower.includes('severance') || qLower.includes('work')) {
      if (item.section_number === 'STATUTE-LABOUR' || item.title.includes('Employment')) score += 150;
    }
    if (qLower.includes('life') || qLower.includes('kill') || qLower.includes('death')) {
      if (item.section_number === '33') score += 100;
    }

    return {
      section: item.type === 'constitution' ? `Section ${item.section_number}` : item.section_number,
      chapter: item.chapter,
      title: item.title,
      textSnippet: item.full_text.slice(0, 220).replace(/\s+/g, ' ') + '...',
      fullText: item.full_text,
      score
    };
  });

  scoredItems.sort((a, b) => b.score - a.score);
  return scoredItems.slice(0, topK).filter(s => s.score > 0);
}

// Sample questions to test
const testQuestions = [
  "What are my rights if a police officer stops me and demands to search my phone?",
  "Can my landlord throw my things out without giving me a 6-month quit notice?",
  "What does the Constitution say about the right to life in Section 33?",
  "Help me, police officers have handcuffed me at a checkpoint right now!"
];

console.log("=== SERVER RETRIEVAL ENGINE TEST OUTPUT ===\n");

testQuestions.forEach((q, idx) => {
  const urgency = detectServerUrgency(q);
  const results = retrieveLegalSources(q);

  console.log(`Query ${idx + 1}: "${q}"`);
  console.log(`Urgency Status: ${urgency.isUrgent ? '🚨 URGENT (Keyword: "' + urgency.matchedKeyword + '")' : '🟢 Standard Query'}`);
  console.log(`Retrieved Sources (${results.length}):`);
  results.forEach(r => {
    console.log(`  - [${r.chapter} ${r.section}] ${r.title} (Relevance Score: ${r.score})`);
    console.log(`    Snippet: "${r.textSnippet}"`);
  });
  console.log("\n--------------------------------------------------\n");
});
