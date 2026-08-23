import rawData from './nigeria_constitution_structured.json';

export interface LegalSection {
  id: string;
  chapter: string;
  section: string;
  sectionNumber: number;
  title: string;
  category: 'police' | 'civil' | 'tenancy' | 'employment' | 'legislature' | 'executive' | 'judicature' | 'general';
  verbatimText: string;
  plainLanguageSummary: string;
  keyTakeaway: string;
}

// Special curated summaries for key fundamental rights and police sections
const CURATED_OVERALAYS: Record<string, { summary: string; takeaway: string; category?: LegalSection['category'] }> = {
  '33': {
    summary: 'Every person has a constitutional right to life. No authority or individual can unlawfully take your life except in execution of a lawful court sentence in a criminal trial.',
    takeaway: 'Lethal force is illegal under Nigerian law except in extreme legal self-defense or court sentence.',
    category: 'civil',
  },
  '34': {
    summary: 'You are entitled to respect for the dignity of your person. Torture, physical abuse, forced labor, or degrading treatment by law enforcement or anyone else is strictly illegal.',
    takeaway: 'Physical harassment or torture in custody violates Section 34 of the Constitution.',
    category: 'police',
  },
  '35': {
    summary: 'You have a right to personal liberty. Anyone arrested must be informed in writing of the reasons for arrest within 24 hours (in a language understood), has the right to remain silent, and must be brought to court within 1-2 days.',
    takeaway: 'Arbitrary detention without prompt written reasons and access to a lawyer is unconstitutional.',
    category: 'police',
  },
  '36': {
    summary: 'You are presumed innocent until proven guilty by a court. You have a right to a fair, public trial within a reasonable time, to choose your own lawyer, and to be given an interpreter.',
    takeaway: 'Officers cannot declare you guilty or impose punishment on the spot; only a court of law can.',
    category: 'civil',
  },
  '37': {
    summary: 'Your privacy, home, telephone conversations, emails, and personal devices (phones, laptops) are guaranteed and protected by the Constitution.',
    takeaway: 'Searching your phone, laptop, or home without reasonable suspicion of a felony or a warrant violates Section 37.',
    category: 'police',
  },
  '38': {
    summary: 'Every person is free to hold any religious belief, freedom of thought, and conscience, and to practice or change their religion without coercion.',
    takeaway: 'Religious freedom is guaranteed throughout Nigeria.',
    category: 'civil',
  },
  '39': {
    summary: 'Every person has the right to freedom of expression, including holding opinions and receiving or sharing ideas and information without unlawful interference.',
    takeaway: 'Peaceful expression of political or social views is protected by law.',
    category: 'civil',
  },
  '40': {
    summary: 'You have the right to assemble peacefully and associate with others, including joining political parties, trade unions, or civic groups.',
    takeaway: 'Peaceful gathering and association are protected constitutional rights.',
    category: 'civil',
  },
  '41': {
    summary: 'Every Nigerian citizen has the right to move freely throughout Nigeria and reside in any part of the country.',
    takeaway: 'State or local authorities cannot expel or restrict Nigerian citizens from moving across state borders.',
    category: 'civil',
  },
  '42': {
    summary: 'No citizen of Nigeria shall be subjected to discrimination or disability based on ethnic group, place of origin, sex, religion, or political opinion.',
    takeaway: 'Equal protection against state or administrative discrimination.',
    category: 'civil',
  },
  '43': {
    summary: 'Every citizen of Nigeria has the right to acquire and own immovable property anywhere in Nigeria.',
    takeaway: 'Property ownership rights exist nationwide across all 36 states and the FCT.',
    category: 'civil',
  },
  '214': {
    summary: 'Establishes the Nigeria Police Force as the primary law enforcement agency, prohibiting any other police service for the Federation or any part thereof.',
    takeaway: 'Police operations are governed by unified national standards under the law.',
    category: 'police',
  },
  '215': {
    summary: 'Details the appointment and lawful authority of the Inspector-General of Police and State Commissioners of Police.',
    takeaway: 'Police commands operate under statutory chain of command and constitutional limits.',
    category: 'police',
  },
};

function determineCategory(secNum: number, chapter: string): LegalSection['category'] {
  if (CURATED_OVERALAYS[String(secNum)]?.category) {
    return CURATED_OVERALAYS[String(secNum)].category!;
  }
  if (chapter.includes('Chapter IV')) return 'civil';
  if (chapter.includes('Chapter III')) return 'civil';
  if (chapter.includes('Chapter II')) return 'civil';
  if (chapter.includes('Chapter V')) return 'legislature';
  if (chapter.includes('Chapter VI')) return 'executive';
  if (chapter.includes('Chapter VII')) return 'judicature';
  return 'general';
}

function generateSummary(secNum: string, title: string, fullText: string): { summary: string; takeaway: string } {
  if (CURATED_OVERALAYS[secNum]) {
    return {
      summary: CURATED_OVERALAYS[secNum].summary,
      takeaway: CURATED_OVERALAYS[secNum].takeaway,
    };
  }

  // Generate readable summary from full text header
  const firstSentence = fullText.split(/\.\s+/)[0]?.replace(/^\d+\.\s*\(\d+\)\s*/, '').trim() || title;
  const summary = `${title}: ${firstSentence}.`;
  const takeaway = `Constitutional provision under ${title}.`;
  return { summary, takeaway };
}

// Convert all 320 sections from JSON
const CONSTITUTION_PARSED_SECTIONS: LegalSection[] = rawData.sections.map((sec) => {
  const num = parseInt(sec.section_number, 10);
  const cat = determineCategory(num, sec.chapter_number);
  const { summary, takeaway } = generateSummary(sec.section_number, sec.title, sec.full_text);

  return {
    id: `s${sec.section_number}`,
    chapter: `${sec.chapter_number}: ${sec.title}`,
    section: `Section ${sec.section_number}`,
    sectionNumber: num,
    title: sec.title,
    category: cat,
    verbatimText: sec.full_text,
    plainLanguageSummary: summary,
    keyTakeaway: takeaway,
  };
});

// Statutory Non-Constitutional Rights (Tenancy & Labour)
const STATUTORY_SECTIONS: LegalSection[] = [
  {
    id: 'tenancy_notice',
    chapter: 'Tenancy Law 2011 / Recovery of Premises Act',
    section: 'Statutory Notice',
    sectionNumber: 901,
    title: 'Unlawful Eviction & Quit Notices',
    category: 'tenancy',
    verbatimText: 'Where a tenancy is for one year or more, 6 months notice to quit is required under Section 13. A landlord cannot forcefully eject a tenant, lock out a tenant, remove roofs/doors, or seize personal belongings without a valid Court Order of Recovery.',
    plainLanguageSummary: 'Your landlord cannot throw your belongings out, change locks, or harass you without following court process. A valid Quit Notice (usually 6 months for yearly tenants) must be served first.',
    keyTakeaway: 'Self-help eviction by landlords is illegal in Nigeria.',
  },
  {
    id: 'labour_termination',
    chapter: 'Labour Act Cap L1 (LFN 2004)',
    section: 'Section 11',
    sectionNumber: 902,
    title: 'Termination of Employment & Notice Periods',
    category: 'employment',
    verbatimText: 'Either party to a contract of employment may terminate the contract on giving to the other party notice: 1 day notice for employment under 3 months, 1 week for 3 months to 2 years, 2 weeks for 2 to 5 years, and 1 month for 5+ years of continuous service.',
    plainLanguageSummary: 'Employers must provide formal written notice or salary in lieu of notice before terminating employment, and pay all accrued wages upon termination.',
    keyTakeaway: 'Arbitrary instant dismissal without notice or pay in lieu violates the Labour Act.',
  },
];

export const CONSTITUTION_SECTIONS: LegalSection[] = [
  ...CONSTITUTION_PARSED_SECTIONS,
  ...STATUTORY_SECTIONS,
];
