import rawData from './nigeria_constitution_structured.json';

export type LegalCategory =
  | 'police'
  | 'civil'
  | 'tenancy'
  | 'employment'
  | 'legislature'
  | 'executive'
  | 'judicature'
  | 'general';

export interface LegalSection {
  id: string;
  chapter: string;
  section: string;
  sectionNumber: number;
  title: string;
  category: LegalCategory;
  categories: LegalCategory[];
  verbatimText: string;
  plainLanguageSummary: string;
  keyTakeaway: string;
  categoryTakeaways?: Partial<Record<LegalCategory, string>>;
}

export const getContextualTakeaway = (item: LegalSection, activeCategory: string): string => {
  if (
    activeCategory !== 'all' &&
    activeCategory !== 'bookmarks' &&
    item.categoryTakeaways &&
    item.categoryTakeaways[activeCategory as LegalCategory]
  ) {
    return item.categoryTakeaways[activeCategory as LegalCategory]!;
  }
  return item.keyTakeaway;
};

// Special curated summaries & contextual takeaways for key fundamental rights and police sections
const CURATED_OVERALAYS: Record<
  string,
  {
    summary: string;
    takeaway: string;
    category?: LegalCategory;
    categoryTakeaways?: Partial<Record<LegalCategory, string>>;
  }
> = {
  '17': {
    summary: 'Directs state policies toward social justice, human dignity, fair wages, safe working conditions, and occupational health and safety for all workers.',
    takeaway: 'Government and employers must provide safe working conditions, fair wages, and health protection.',
    category: 'civil',
    categoryTakeaways: {
      employment: 'Guarantees fair wages, safe working conditions, worker health protection, and freedom from workplace exploitation.',
      civil: 'State policy must uphold human dignity, social justice, and public health for all citizens.',
    },
  },
  '33': {
    summary: 'Every person has a constitutional right to life. No authority or individual can unlawfully take your life except in execution of a lawful court sentence in a criminal trial.',
    takeaway: 'No one—including the police—has the right to kill or physically harm you.',
    category: 'civil',
    categoryTakeaways: {
      police: 'Lethal force by police officers is illegal except in extreme court-sanctioned execution or lawful self-defense.',
      civil: 'Your right to life is supreme under Section 33 and cannot be violated by anyone.',
    },
  },
  '34': {
    summary: 'You are entitled to respect for the dignity of your person. Torture, physical abuse, forced labor, or degrading treatment by law enforcement or anyone else is strictly illegal.',
    takeaway: 'Police beatings, torture, slaps, forced labor, or degrading treatment in custody are 100% illegal.',
    category: 'police',
    categoryTakeaways: {
      police: 'Police beatings, torture, slaps, or degrading physical treatment in custody are 100% illegal.',
      employment: 'Employers cannot subject you to forced compulsory labor, unpaid slave labor, or physical abuse at work.',
      civil: 'You have an absolute constitutional right to human dignity; no authority may torture or degrade you.',
    },
  },
  '35': {
    summary: 'You have a right to personal liberty. Anyone arrested must be informed in writing of the reasons for arrest within 24 hours (in a language understood), has the right to remain silent, and must be brought to court within 1-2 days.',
    takeaway: 'If arrested, officers must tell you why in writing within 24 hours and take you to court in 1–2 days. You can stay silent.',
    category: 'police',
    categoryTakeaways: {
      police: 'Officers must state written reasons for arrest within 24h and present you to court in 1–2 days. You have the right to stay silent.',
      civil: 'Arbitrary detention without written reasons or prompt access to a lawyer violates your liberty.',
    },
  },
  '36': {
    summary: 'You are presumed innocent until proven guilty by a court. You have a right to a fair, public trial within a reasonable time, to choose your own lawyer, and to be given an interpreter.',
    takeaway: 'You are innocent until a court says otherwise. Officers cannot punish you on the spot.',
    category: 'civil',
    categoryTakeaways: {
      police: 'Police officers cannot declare you guilty or impose fines on the spot; only a court of law can try you.',
      judicature: 'Guarantees fair public trial, legal representation, and presumption of innocence before all courts.',
      civil: 'You are legally presumed innocent until a competent court finds you guilty after a fair hearing.',
    },
  },
  '37': {
    summary: 'Your privacy, home, telephone conversations, emails, and personal devices (phones, laptops) are guaranteed and protected by the Constitution.',
    takeaway: 'Police cannot search your phone, bank apps, laptop, or home without a warrant or clear proof of a crime.',
    category: 'police',
    categoryTakeaways: {
      police: 'Police cannot compel you to unlock your phone or search bank apps without a warrant or reasonable suspicion of a felony.',
      tenancy: 'Landlords, agents, or caretakers cannot invade your rented home or search your private space without your consent or court process.',
      civil: 'Your private phone calls, messages, emails, and home life are constitutionally protected from illegal intrusion.',
    },
  },
  '38': {
    summary: 'Every person is free to hold any religious belief, freedom of thought, and conscience, and to practice or change their religion without coercion.',
    takeaway: 'You can practice any religion or belief freely without force or fear.',
    category: 'civil',
    categoryTakeaways: {
      civil: 'Freedom of religion, thought, and worship is guaranteed across all states in Nigeria.',
      employment: 'Employers cannot penalize or discriminate against workers based on their personal religious beliefs.',
    },
  },
  '39': {
    summary: 'Every person has the right to freedom of expression, including holding opinions and receiving or sharing ideas and information without unlawful interference.',
    takeaway: 'You are legally free to speak your mind, express opinions, and share ideas.',
    category: 'civil',
    categoryTakeaways: {
      civil: 'Peaceful expression of political, social, or personal views is protected by law.',
      employment: 'Workers are free to express workplace grievances and share ideas without unlawful retaliation.',
    },
  },
  '40': {
    summary: 'You have the right to assemble peacefully and associate with others, including joining political parties, trade unions, or civic groups.',
    takeaway: 'You can gather peacefully and join any group, trade union, or political party.',
    category: 'civil',
    categoryTakeaways: {
      employment: 'You have the explicit constitutional right to form or join any trade union or staff association at work.',
      civil: 'Peaceful gathering and association with any civic group or political party are protected rights.',
    },
  },
  '41': {
    summary: 'Every Nigerian citizen has the right to move freely throughout Nigeria and reside in any part of the country.',
    takeaway: 'You are free to travel and live anywhere in all 36 states of Nigeria.',
    category: 'civil',
    categoryTakeaways: {
      civil: 'State or local authorities cannot expel or restrict Nigerian citizens from moving across state borders.',
    },
  },
  '42': {
    summary: 'No citizen of Nigeria shall be subjected to discrimination or disability based on ethnic group, place of origin, sex, religion, or political opinion.',
    takeaway: 'No one can deny you rights or discriminate against you in employment or public office because of your tribe, gender, or religion.',
    category: 'civil',
    categoryTakeaways: {
      employment: 'Employers and government bodies cannot deny you jobs, promotions, or public office based on tribe, gender, or religion.',
      civil: 'Protects all citizens against discriminatory government laws, policies, or administrative actions.',
    },
  },
  '43': {
    summary: 'Every citizen of Nigeria has the right to acquire and own immovable property anywhere in Nigeria.',
    takeaway: 'You can buy, build, and legally own land or property anywhere in Nigeria.',
    category: 'civil',
    categoryTakeaways: {
      tenancy: 'You have the constitutional right to acquire, lease, and hold property or tenancy anywhere in Nigeria.',
      civil: 'Property ownership rights exist nationwide across all 36 states and the FCT.',
    },
  },
  '44': {
    summary: 'No property or interest in property shall be compulsorily acquired in any part of Nigeria except under a law providing for prompt payment of compensation.',
    takeaway: 'Property or tenancy cannot be seized without prompt legal compensation.',
    category: 'civil',
    categoryTakeaways: {
      tenancy: 'Landlords or authorities cannot forcefully seize your premises or property without due court process and compensation.',
      civil: 'Protects property owners against unlawful government land seizures without compensation.',
    },
  },
  '169': {
    summary: 'Establishes the Civil Service of the Federation, governing public employment standards, civil service appointments, and federal staff administration.',
    takeaway: 'Governs federal public service employment and merit-based appointments.',
    category: 'executive',
    categoryTakeaways: {
      employment: 'Establishes statutory civil service employment rules, merit appointments, and tenure standards for federal workers.',
      executive: 'Maintains the federal administrative civil service under executive governance.',
    },
  },
  '173': {
    summary: 'Guarantees the right of public service employees to statutory pensions, prohibiting withholding or arbitrary reduction of pension benefits.',
    takeaway: 'Public service pensions are constitutionally guaranteed and cannot be withheld.',
    category: 'executive',
    categoryTakeaways: {
      employment: 'Guarantees that public service worker pensions cannot be withheld or arbitrarily reduced after retirement.',
      executive: 'Imposes constitutional duties on executive authorities to pay public pensions promptly.',
    },
  },
  '206': {
    summary: 'Establishes the Civil Service of a State, setting public employment governance for state workers.',
    takeaway: 'Governs state public service employment and worker protections.',
    category: 'executive',
    categoryTakeaways: {
      employment: 'Establishes statutory employment protections, service rules, and pension rights for state civil servants.',
      executive: 'Sets state executive administrative governance over state public servants.',
    },
  },
  '254': {
    summary: 'Grants the National Industrial Court of Nigeria (NICN) exclusive jurisdiction over all labour, employment, trade union, workplace safety, and minimum wage disputes.',
    takeaway: 'The National Industrial Court handles all workplace disputes, trade union conflicts, and wrongful dismissals.',
    category: 'judicature',
    categoryTakeaways: {
      employment: 'The National Industrial Court has exclusive power to settle workplace disputes, wrongful dismissals, trade union conflicts, and minimum wage claims.',
      judicature: 'Establishes specialized judicial authority for labour and industrial relations law.',
    },
  },
  '214': {
    summary: 'Establishes the Nigeria Police Force as the primary law enforcement agency, prohibiting any other police service for the Federation or any part thereof.',
    takeaway: 'Police officers must follow national law standards, not personal rules.',
    category: 'police',
    categoryTakeaways: {
      police: 'Police operations are governed by unified national legal standards, prohibiting illegal private security forces.',
    },
  },
  '215': {
    summary: 'Details the appointment and lawful authority of the Inspector-General of Police and State Commissioners of Police.',
    takeaway: 'Police commanders and officers must obey constitutional limits at all times.',
    category: 'police',
    categoryTakeaways: {
      police: 'Police commanders and officers must exercise authority within strict constitutional limits.',
    },
  },
};

function determineCategories(num: number, chapter: string, title: string): LegalCategory[] {
  const categories: Set<LegalCategory> = new Set();
  const lowerTitle = title.toLowerCase();

  // Curated Overlays
  if (CURATED_OVERALAYS[String(num)]?.category) {
    categories.add(CURATED_OVERALAYS[String(num)].category!);
  }

  // 1. Employment & Labour Rights (Cross-cutting)
  if (
    num === 17 ||
    num === 34 ||
    num === 40 ||
    num === 42 ||
    (num >= 169 && num <= 175) ||
    (num >= 206 && num <= 212) ||
    num === 254 ||
    num === 902 ||
    lowerTitle.includes('employment') ||
    lowerTitle.includes('labour') ||
    lowerTitle.includes('work') ||
    lowerTitle.includes('pension') ||
    lowerTitle.includes('public service') ||
    lowerTitle.includes('civil service')
  ) {
    categories.add('employment');
  }

  // 2. Police & Law Enforcement (Cross-cutting)
  if (
    num === 34 ||
    num === 35 ||
    num === 36 ||
    num === 37 ||
    (num >= 214 && num <= 216) ||
    lowerTitle.includes('police') ||
    lowerTitle.includes('arrest') ||
    lowerTitle.includes('detention')
  ) {
    categories.add('police');
  }

  // 3. Tenancy & Property Rights (Cross-cutting)
  if (
    num === 37 ||
    num === 43 ||
    num === 44 ||
    num === 901 ||
    lowerTitle.includes('property') ||
    lowerTitle.includes('tenancy') ||
    lowerTitle.includes('housing')
  ) {
    categories.add('tenancy');
  }

  // 4. Fundamental & Civil Rights (Chapter II - IV)
  if (num >= 13 && num <= 46) {
    categories.add('civil');
  }

  // 5. The Legislature (Chapter V: s. 47 - 129)
  if (num >= 47 && num <= 129) {
    categories.add('legislature');
  }

  // 6. The Executive (Chapter VI: s. 130 - 230)
  if (num >= 130 && num <= 230) {
    categories.add('executive');
  }

  // 7. Judicature & Courts (Chapter VII: s. 231 - 296)
  if (num >= 231 && num <= 296) {
    categories.add('judicature');
  }

  // 8. General Provisions
  if (categories.size === 0 || (num >= 1 && num <= 12) || (num >= 297 && num <= 320)) {
    categories.add('general');
  }

  return Array.from(categories);
}

export const sanitizeConstitutionalText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\s*Back To Top\s+Nigerian Constitution\s+\d+\s*/gi, '\n\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

function generateSummary(secNum: string, title: string, fullText: string): { summary: string; takeaway: string } {
  const cleanFullText = sanitizeConstitutionalText(fullText);
  if (CURATED_OVERALAYS[secNum]) {
    return {
      summary: CURATED_OVERALAYS[secNum].summary,
      takeaway: CURATED_OVERALAYS[secNum].takeaway,
    };
  }

  // Generate plain English takeaway & summary
  const cleanTitle = title.trim();
  const rawFirstSentence = cleanFullText.split(/\.\s+/)[0]?.replace(/^\d+\.\s*\(\d+\)\s*/, '').replace(/^[A-Z\d\(\)\.\s]+/, '').trim() || cleanTitle;
  const firstSentence = rawFirstSentence.length > 180 ? `${rawFirstSentence.substring(0, 180)}...` : rawFirstSentence;

  const summary = `${firstSentence}.`;
  const takeaway = `Protects legal standards regarding ${cleanTitle.toLowerCase()} under Nigerian law.`;
  return { summary, takeaway };
}

// Convert all 320 sections from JSON with multi-category support
const CONSTITUTION_PARSED_SECTIONS: LegalSection[] = (rawData.sections as any[]).map((sec) => {
  const num = parseInt(sec.section_number, 10);
  const cats = determineCategories(num, sec.chapter_number, sec.title);
  const primaryCat = cats[0] || 'general';
  const cleanFull = sanitizeConstitutionalText(sec.full_text);
  const { summary, takeaway } = generateSummary(sec.section_number, sec.title, cleanFull);

  return {
    id: `s${sec.section_number}`,
    chapter: `${sec.chapter_number}: ${sec.title}`,
    section: `Section ${sec.section_number}`,
    sectionNumber: num,
    title: sec.title,
    category: primaryCat,
    categories: cats,
    verbatimText: cleanFull,
    plainLanguageSummary: summary,
    keyTakeaway: takeaway,
    categoryTakeaways: CURATED_OVERALAYS[sec.section_number]?.categoryTakeaways,
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
    categories: ['tenancy', 'civil'],
    verbatimText: 'Where a tenancy is for one year or more, 6 months notice to quit is required under Section 13. A landlord cannot forcefully eject a tenant, lock out a tenant, remove roofs/doors, or seize personal belongings without a valid Court Order of Recovery.',
    plainLanguageSummary: 'Your landlord cannot throw your belongings out, change locks, or harass you without following court process. A valid Quit Notice (usually 6 months for yearly tenants) must be served first.',
    keyTakeaway: 'Self-help eviction by landlords is illegal in Nigeria.',
    categoryTakeaways: {
      tenancy: 'Self-help eviction by landlords (locking gates, removing roofs, throwing out property) is strictly illegal in Nigeria.',
      civil: 'Tenants are legally protected by statutory court processes before any eviction can take place.',
    },
  },
  {
    id: 'labour_termination',
    chapter: 'Labour Act Cap L1 (LFN 2004)',
    section: 'Section 11',
    sectionNumber: 902,
    title: 'Termination of Employment & Notice Periods',
    category: 'employment',
    categories: ['employment', 'civil'],
    verbatimText: 'Either party to a contract of employment may terminate the contract on giving to the other party notice: 1 day notice for employment under 3 months, 1 week for 3 months to 2 years, 2 weeks for 2 to 5 years, and 1 month for 5+ years of continuous service.',
    plainLanguageSummary: 'Employers must provide formal written notice or salary in lieu of notice before terminating employment, and pay all accrued wages upon termination.',
    keyTakeaway: 'Arbitrary instant dismissal without notice or pay in lieu violates the Labour Act.',
    categoryTakeaways: {
      employment: 'Arbitrary instant dismissal without written notice or salary in lieu violates Section 11 of the Labour Act.',
      civil: 'Workers have statutory rights to formal notice or pay in lieu before contract termination.',
    },
  },
];

export const CONSTITUTION_SECTIONS: LegalSection[] = [
  ...CONSTITUTION_PARSED_SECTIONS,
  ...STATUTORY_SECTIONS,
];

export interface GuideItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  badge?: string;
  progressPercent?: number;
  image?: string;
  citation: string;
  readTime?: string;
  iconName?: 'Home' | 'Briefcase' | 'ShoppingBag' | 'Shield' | 'Scale' | 'FileText';
  content: string[];
}

export interface QuizQuestion {
  scenario: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  citation: string;
}

export interface ScenarioQuiz {
  id: string;
  guideId: string;
  /** Legacy single-question fields (backward compat) */
  scenario: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  citation: string;
  /** Multi-question array — engine uses this when present */
  questions?: QuizQuestion[];
}

// Derived FEATURED_GUIDE from Section 35
export const FEATURED_GUIDE: GuideItem = {
  id: 's35',
  category: 'Civil & Police Rights',
  title: 'Personal Liberty & Detention Rules',
  subtitle: 'Know your constitutional protections under Section 35: 24-hour court rule, right to silence, and written reasons for arrest.',
  badge: 'CONSTITUTIONAL FEATURED',
  readTime: '5 min read',
  iconName: 'Shield',
  citation: 'Constitution of Nigeria 1999, Section 35',
  content: [
    'Under Section 35 of the 1999 Constitution, every person in Nigeria has a fundamental right to personal liberty.',
    'Any person arrested or detained must be informed in writing within 24 hours (in a language they understand) of the reasons for their arrest.',
    'Any person arrested has the right to remain silent until consulting a legal practitioner of their choice.',
    'A suspect must be brought before a court of law within a reasonable time (24 hours where a court is within 40km, or 48 hours otherwise).',
    'Holding suspects in police cells for days or weeks without court approval is strictly unconstitutional under Nigerian law.',
  ],
};

// Derived RECENT_GUIDES from Real Constitutional Sections
export const RECENT_GUIDES: GuideItem[] = [
  {
    id: 's37',
    category: 'Privacy Rights',
    title: 'Phone & Digital Privacy',
    subtitle: 'Section 37 guarantees privacy of your mobile phone, laptop, and messages.',
    progressPercent: 85,
    readTime: '4 min read',
    iconName: 'Shield',
    citation: 'Constitution of Nigeria 1999, Section 37',
    content: [
      'Section 37 of the Constitution guarantees the privacy of citizens, their homes, telegraphic communications, and digital devices.',
      'Law enforcement officers cannot compel you to unlock your phone or search bank apps without a valid warrant or reasonable suspicion of a felony.',
    ],
  },
  {
    id: 'tenancy_notice',
    category: 'Housing Rights',
    title: 'Tenant Rights & Quit Notices',
    subtitle: 'Protections against unlawful lockouts and self-help eviction.',
    progressPercent: 65,
    readTime: '4 min read',
    iconName: 'Home',
    citation: 'Tenancy Law 2011 & Recovery of Premises Act',
    content: [
      'Landlords cannot forcefully eject tenants, lock doors, or remove roof sheets without court orders.',
      'Yearly tenants are legally entitled to a 6-month Notice to Quit followed by statutory court notices.',
    ],
  },
  {
    id: 'labour_termination',
    category: 'Employment Rights',
    title: 'Workplace Severance & Notice',
    subtitle: 'Statutory termination rules under the Labour Act.',
    progressPercent: 40,
    readTime: '3 min read',
    iconName: 'Briefcase',
    citation: 'Labour Act Cap L1, Section 11',
    content: [
      'Employers must provide formal written notice or salary in lieu of notice before terminating employment.',
      'Arbitrary summary dismissal without notice or pay in lieu violates Section 11 of the Labour Act.',
    ],
  },
];

// Curated Scenario Quizzes derived from real law
export const SAMPLE_QUIZZES: Record<string, ScenarioQuiz> = {
  's35': {
    id: 'q_s35',
    guideId: 's35',
    scenario: 'You are arrested on Friday evening. The police hold you in a cell until Wednesday without informing you in writing of the charge or bringing you to court. Is this constitutional?',
    options: [
      { id: 'A', text: 'Yes, police can detain suspects indefinitely over weekends.', isCorrect: false },
      { id: 'B', text: 'Yes, provided the station commander approved the detention length.', isCorrect: false },
      { id: 'C', text: 'Detention limits apply only during business hours.', isCorrect: false },
      { id: 'D', text: 'No! Section 35 mandates release or court appearance within 24 to 48 hours maximum.', isCorrect: true },
    ],
    explanation: 'Section 35 of the 1999 Constitution guarantees personal liberty. Anyone arrested must be brought before a court within 24 hours (or 48 hours if a court is not nearby). Holding a suspect for 5 days without court sanction is unconstitutional.',
    citation: 'Constitution 1999, s.35(4)',
    questions: [
      {
        scenario: 'You are arrested on Friday evening. The police hold you in a cell until Wednesday without informing you in writing of the charge or bringing you to court. Is this constitutional?',
        options: [
          { id: 'A', text: 'Yes, police can detain suspects indefinitely over weekends.', isCorrect: false },
          { id: 'B', text: 'Yes, provided the station commander approved the detention length.', isCorrect: false },
          { id: 'C', text: 'Detention limits apply only during business hours.', isCorrect: false },
          { id: 'D', text: 'No! Section 35 mandates release or court appearance within 24 to 48 hours maximum.', isCorrect: true },
        ],
        explanation: 'Section 35 of the 1999 Constitution guarantees personal liberty. Anyone arrested must be brought before a court within 24 hours (or 48 hours if a court is not nearby).',
        citation: 'Constitution 1999, s.35(4)',
      },
      {
        scenario: 'An officer says you must pay a "bail fee" of ₦50,000 at the station before being released on bail for a bailable offence. What does the law say?',
        options: [
          { id: 'A', text: 'This is standard police procedure for all bail cases.', isCorrect: false },
          { id: 'B', text: 'Bail at the station level is free — charging money for bail is illegal.', isCorrect: true },
          { id: 'C', text: 'The fee is legal if it goes below ₦100,000.', isCorrect: false },
          { id: 'D', text: 'Only senior officers can charge bail fees.', isCorrect: false },
        ],
        explanation: 'Under Section 35(4) and the ACJA 2015, police bail for bailable offences is free. No monetary consideration should be demanded.',
        citation: 'Constitution 1999, s.35(4) / ACJA 2015 s.32',
      },
      {
        scenario: 'Your neighbour is arrested and the police refuse to tell the family where he is being held. Is this lawful?',
        options: [
          { id: 'A', text: 'Yes, police are not required to disclose detention locations.', isCorrect: false },
          { id: 'B', text: 'The family has no rights until the suspect is formally charged.', isCorrect: false },
          { id: 'C', text: 'No — Section 35(5) requires that an arrested person be allowed to communicate with family or their lawyer.', isCorrect: true },
          { id: 'D', text: 'It depends on the severity of the alleged crime.', isCorrect: false },
        ],
        explanation: 'Section 35(5) guarantees that anyone arrested has the right to communicate with and be visited by their lawyer and family members.',
        citation: 'Constitution 1999, s.35(5)',
      },
      {
        scenario: 'A suspect is detained for a minor traffic offence and denied bail at the station. Is there a remedy?',
        options: [
          { id: 'A', text: 'Traffic offences are non-bailable by default.', isCorrect: false },
          { id: 'B', text: 'The suspect can apply for Fundamental Rights Enforcement under Section 35 at a High Court.', isCorrect: true },
          { id: 'C', text: 'Only the Inspector General can grant bail for traffic offences.', isCorrect: false },
          { id: 'D', text: 'There is no remedy until trial begins.', isCorrect: false },
        ],
        explanation: 'When bail is wrongfully denied, an arrested person can apply to the High Court to enforce their fundamental right to personal liberty under Section 35.',
        citation: 'Constitution 1999, s.35 / s.46',
      },
      {
        scenario: 'Police arrest a journalist "for investigation" but file no charges for 3 weeks. The journalist remains in custody. Is this lawful?',
        options: [
          { id: 'A', text: 'Yes, investigations can last as long as needed.', isCorrect: false },
          { id: 'B', text: 'Yes, if a magistrate verbally approves the extension.', isCorrect: false },
          { id: 'C', text: 'No — detention beyond the constitutional time limit without charges violates Section 35.', isCorrect: true },
          { id: 'D', text: 'Journalists have special extended detention rules.', isCorrect: false },
        ],
        explanation: 'Section 35 makes no exception for "investigation." Detention without charges beyond the constitutional time limit is unlawful regardless of the suspect\'s profession.',
        citation: 'Constitution 1999, s.35(4)-(5)',
      },
    ],
  },
  's37': {
    id: 'q_s37',
    guideId: 's37',
    scenario: 'A police officer stops you at a checkpoint and demands to unlock your laptop and go through your bank apps without explaining why. What does the law say?',
    options: [
      { id: 'A', text: 'No! Section 37 guarantees privacy; officers need reasonable suspicion of a felony or a warrant.', isCorrect: true },
      { id: 'B', text: 'Yes, officers have unlimited legal rights to inspect any electronic device at checkpoints.', isCorrect: false },
      { id: 'C', text: 'Only if you fail to show your vehicle registration papers.', isCorrect: false },
      { id: 'D', text: 'Yes, but only if conducted during night hours.', isCorrect: false },
    ],
    explanation: 'Section 37 of the 1999 Constitution guarantees privacy of communications and personal devices. Randomly searching your phone, laptop, or bank apps without a warrant or reasonable suspicion of a felony is unlawful.',
    citation: 'Constitution 1999, s.37',
    questions: [
      {
        scenario: 'A police officer stops you at a checkpoint and demands to unlock your laptop and go through your bank apps without explaining why. What does the law say?',
        options: [
          { id: 'A', text: 'No! Section 37 guarantees privacy; officers need reasonable suspicion of a felony or a warrant.', isCorrect: true },
          { id: 'B', text: 'Yes, officers have unlimited legal rights to inspect any electronic device at checkpoints.', isCorrect: false },
          { id: 'C', text: 'Only if you fail to show your vehicle registration papers.', isCorrect: false },
          { id: 'D', text: 'Yes, but only if conducted during night hours.', isCorrect: false },
        ],
        explanation: 'Section 37 guarantees privacy of communications and personal devices. A random search without a warrant or reasonable suspicion is unlawful.',
        citation: 'Constitution 1999, s.37',
      },
      {
        scenario: 'Your employer secretly installs software that records all your personal WhatsApp messages on your work phone. Is this legal?',
        options: [
          { id: 'A', text: 'Yes, employers own work devices and all data on them.', isCorrect: false },
          { id: 'B', text: 'Monitoring personal communications without consent or disclosure violates privacy under Section 37.', isCorrect: true },
          { id: 'C', text: 'It is only illegal if the employee is a public servant.', isCorrect: false },
          { id: 'D', text: 'Employers can monitor messages but only during work hours.', isCorrect: false },
        ],
        explanation: 'Section 37 protects private correspondence. Covert interception of personal communications without consent or legal authority is a violation.',
        citation: 'Constitution 1999, s.37',
      },
      {
        scenario: 'Police demand access to your email account as part of a "routine check." They have no warrant. Must you comply?',
        options: [
          { id: 'A', text: 'Yes, routine police checks override all digital privacy.', isCorrect: false },
          { id: 'B', text: 'Only if the officer is above the rank of Inspector.', isCorrect: false },
          { id: 'C', text: 'No — accessing your email without a court order or warrant violates Section 37 privacy rights.', isCorrect: true },
          { id: 'D', text: 'You must comply but can request a receipt.', isCorrect: false },
        ],
        explanation: 'Section 37 protects the privacy of correspondence, including electronic communications. Access requires a valid warrant.',
        citation: 'Constitution 1999, s.37',
      },
      {
        scenario: 'A building caretaker enters your apartment while you are away and searches through your belongings claiming to check for "illegal items." Is this lawful?',
        options: [
          { id: 'A', text: 'Caretakers have the right to inspect properties they manage.', isCorrect: false },
          { id: 'B', text: 'No — Section 37 protects the privacy of your home; unauthorized entry and search is unlawful.', isCorrect: true },
          { id: 'C', text: 'It depends on your tenancy agreement clause.', isCorrect: false },
          { id: 'D', text: 'Yes, if the caretaker suspects criminal activity.', isCorrect: false },
        ],
        explanation: 'Section 37 guarantees the privacy of citizens in their homes. Only law enforcement with proper legal authority (a warrant) may conduct a search.',
        citation: 'Constitution 1999, s.37',
      },
      {
        scenario: 'A bank shares your full financial records with a third party without your consent or a court order. What are your rights?',
        options: [
          { id: 'A', text: 'Banks can share customer records freely with business partners.', isCorrect: false },
          { id: 'B', text: 'Financial records are not covered by privacy laws.', isCorrect: false },
          { id: 'C', text: 'Your financial information is protected under Section 37; sharing without consent or a court order is unlawful.', isCorrect: true },
          { id: 'D', text: 'Only savings account information is protected.', isCorrect: false },
        ],
        explanation: 'Section 37 privacy protection extends to financial information. Disclosure of private banking data without consent or court order violates constitutional rights.',
        citation: 'Constitution 1999, s.37',
      },
    ],
  },
  'tenancy_notice': {
    id: 'q_tenancy',
    guideId: 'tenancy_notice',
    scenario: 'Your landlord removes your entrance door and turns off your water supply because your rent is 2 weeks overdue. What does tenancy law state?',
    options: [
      { id: 'A', text: 'Landlords are legally allowed to remove doors if rent is 14 days late.', isCorrect: false },
      { id: 'B', text: 'Removing doors is permitted if 24-hour verbal notice was given.', isCorrect: false },
      { id: 'C', text: 'Self-help eviction (removing doors/utilities) is strictly illegal; landlords must follow court processes.', isCorrect: true },
      { id: 'D', text: 'You must immediately vacate and forfeit all your personal belongings.', isCorrect: false },
    ],
    explanation: 'Self-help eviction (removing doors, locking gates, cutting water) is illegal in Nigeria. Landlords must serve valid statutory quit notices and obtain court orders for possession.',
    citation: 'Tenancy Law 2011 / Recovery of Premises Act s.16',
    questions: [
      {
        scenario: 'Your landlord removes your entrance door and turns off your water supply because your rent is 2 weeks overdue. What does tenancy law state?',
        options: [
          { id: 'A', text: 'Landlords are legally allowed to remove doors if rent is 14 days late.', isCorrect: false },
          { id: 'B', text: 'Removing doors is permitted if 24-hour verbal notice was given.', isCorrect: false },
          { id: 'C', text: 'Self-help eviction (removing doors/utilities) is strictly illegal; landlords must follow court processes.', isCorrect: true },
          { id: 'D', text: 'You must immediately vacate and forfeit all your personal belongings.', isCorrect: false },
        ],
        explanation: 'Self-help eviction is illegal. Landlords must serve valid statutory quit notices and obtain court orders for possession.',
        citation: 'Tenancy Law 2011 / Recovery of Premises Act s.16',
      },
      {
        scenario: 'Your landlord gives you a verbal "7-day notice to quit" for a yearly tenancy. Is this valid?',
        options: [
          { id: 'A', text: 'Yes, any form of notice is sufficient.', isCorrect: false },
          { id: 'B', text: 'No — a yearly tenancy requires a minimum of 6 months written notice to quit.', isCorrect: true },
          { id: 'C', text: 'Verbal notice is valid if witnessed by a neighbour.', isCorrect: false },
          { id: 'D', text: '7 days notice is standard for all tenancy types.', isCorrect: false },
        ],
        explanation: 'Recovery of Premises law requires a written notice period proportional to the tenancy type. Yearly tenancies typically require 6 months\' notice.',
        citation: 'Recovery of Premises Act / Tenancy Law 2011',
      },
      {
        scenario: 'A landlord changes the lock on your apartment while you are at work. You return to find your belongings still inside but you cannot enter. What is the legal position?',
        options: [
          { id: 'A', text: 'The landlord acted lawfully if rent was overdue.', isCorrect: false },
          { id: 'B', text: 'Lock-outs without a court order constitute illegal self-help eviction.', isCorrect: true },
          { id: 'C', text: 'It is legal if done during daylight hours.', isCorrect: false },
          { id: 'D', text: 'You must negotiate directly with the landlord before seeking legal help.', isCorrect: false },
        ],
        explanation: 'Locking out a tenant without a court order is self-help eviction and is illegal under tenancy law.',
        citation: 'Recovery of Premises Act s.16',
      },
      {
        scenario: 'Your landlord demands a rent increase mid-tenancy with no prior written agreement allowing such increases. Can they enforce this?',
        options: [
          { id: 'A', text: 'Yes, landlords can increase rent at any time.', isCorrect: false },
          { id: 'B', text: 'Rent can only be increased if the original agreement includes such a clause, or upon renewal with proper notice.', isCorrect: true },
          { id: 'C', text: 'Only increases above 50% require written notice.', isCorrect: false },
          { id: 'D', text: 'The increase is valid if approved by estate agents.', isCorrect: false },
        ],
        explanation: 'Rent increases require proper notice and cannot be imposed mid-tenancy unless the agreement provides for it.',
        citation: 'Tenancy Law 2011',
      },
      {
        scenario: 'After receiving a valid quit notice, your landlord tries to physically eject you the very next day. What should you know?',
        options: [
          { id: 'A', text: 'A quit notice means immediate eviction.', isCorrect: false },
          { id: 'B', text: 'Even after a valid quit notice expires, the landlord must still obtain a court order before physically removing a tenant.', isCorrect: true },
          { id: 'C', text: 'Physical ejection is allowed if police are present.', isCorrect: false },
          { id: 'D', text: 'You forfeit all rights once a quit notice is served.', isCorrect: false },
        ],
        explanation: 'A quit notice is not an eviction order. After the notice period expires, the landlord must obtain a court order for possession before physically removing a tenant.',
        citation: 'Recovery of Premises Act',
      },
    ],
  },
  'labour_termination': {
    id: 'q_labour',
    guideId: 'labour_termination',
    scenario: 'After 3 years of continuous work, your employer fires you verbally on a Friday afternoon without written notice or salary in lieu. Is this lawful?',
    options: [
      { id: 'A', text: 'Yes, employers can fire any worker verbally without notice at any time.', isCorrect: false },
      { id: 'B', text: 'No! Section 11 of the Labour Act entitles you to formal written notice or salary in lieu.', isCorrect: true },
      { id: 'C', text: 'Verbal dismissal is valid only if done at the end of a business week.', isCorrect: false },
      { id: 'D', text: 'You are only entitled to notice after working for 10 or more years.', isCorrect: false },
    ],
    explanation: 'Under Section 11 of the Labour Act, employees with over 2 years of service are legally entitled to 2 weeks written notice (or salary in lieu of notice) prior to termination.',
    citation: 'Labour Act Cap L1 s.11',
    questions: [
      {
        scenario: 'After 3 years of continuous work, your employer fires you verbally on a Friday afternoon without written notice or salary in lieu. Is this lawful?',
        options: [
          { id: 'A', text: 'Yes, employers can fire any worker verbally without notice at any time.', isCorrect: false },
          { id: 'B', text: 'No! Section 11 of the Labour Act entitles you to formal written notice or salary in lieu.', isCorrect: true },
          { id: 'C', text: 'Verbal dismissal is valid only if done at the end of a business week.', isCorrect: false },
          { id: 'D', text: 'You are only entitled to notice after working for 10 or more years.', isCorrect: false },
        ],
        explanation: 'Under Section 11 of the Labour Act, employees with over 2 years of service are entitled to 2 weeks written notice or salary in lieu.',
        citation: 'Labour Act Cap L1 s.11',
      },
      {
        scenario: 'An employee who has worked for 8 months is given 24 hours verbal notice of termination. Is the employer compliant?',
        options: [
          { id: 'A', text: 'Yes, employees under 1 year get no notice protection.', isCorrect: false },
          { id: 'B', text: 'No — even employees with less than 2 years of service are entitled to at least 1 week written notice under the Labour Act.', isCorrect: true },
          { id: 'C', text: '24 hours is sufficient for any employment period.', isCorrect: false },
          { id: 'D', text: 'Verbal notice is always acceptable under the Labour Act.', isCorrect: false },
        ],
        explanation: 'Section 11 of the Labour Act prescribes minimum notice periods based on length of service. Even short-tenure workers are entitled to at least 1 week.',
        citation: 'Labour Act Cap L1 s.11',
      },
      {
        scenario: 'Your employer says they do not need to give you a written contract because you are a casual worker. Is this true?',
        options: [
          { id: 'A', text: 'Yes, casual workers have no rights under the Labour Act.', isCorrect: false },
          { id: 'B', text: 'Section 7 of the Labour Act requires written terms within 3 months of employment, regardless of classification.', isCorrect: true },
          { id: 'C', text: 'Only senior staff need written contracts.', isCorrect: false },
          { id: 'D', text: 'Contracts are optional if both parties agree verbally.', isCorrect: false },
        ],
        explanation: 'Section 7 of the Labour Act mandates that written terms of employment be provided to every worker within 3 months of commencing work.',
        citation: 'Labour Act Cap L1 s.7',
      },
      {
        scenario: 'An employer deducts a large amount from your final pay as "damage penalty" without your written consent. Is this lawful?',
        options: [
          { id: 'A', text: 'Yes, employers can deduct any amount for damages.', isCorrect: false },
          { id: 'B', text: 'Deductions beyond what is expressly agreed in the contract or authorized by law are prohibited under the Labour Act.', isCorrect: true },
          { id: 'C', text: 'Deductions are valid if the HR department approved them.', isCorrect: false },
          { id: 'D', text: 'Only deductions above ₦500,000 require consent.', isCorrect: false },
        ],
        explanation: 'The Labour Act restricts unauthorized deductions from wages. Employers cannot arbitrarily deduct without written consent or legal authority.',
        citation: 'Labour Act Cap L1 s.5',
      },
      {
        scenario: 'Your employer terminates you and claims you are not entitled to any outstanding leave days because you were dismissed. Is this correct?',
        options: [
          { id: 'A', text: 'Yes, dismissal forfeits all accrued leave.', isCorrect: false },
          { id: 'B', text: 'Only resignation preserves leave entitlement.', isCorrect: false },
          { id: 'C', text: 'No — accrued but unused leave days must be compensated regardless of the reason for termination.', isCorrect: true },
          { id: 'D', text: 'Leave days are only payable after 5 years of service.', isCorrect: false },
        ],
        explanation: 'Accrued leave entitlements are part of employee compensation. They must be settled upon termination regardless of the circumstances of departure.',
        citation: 'Labour Act Cap L1 s.18',
      },
    ],
  },
  's34': {
    id: 'q_s34',
    guideId: 's34',
    scenario: 'During questioning at a station, an officer slaps a suspect to compel them to sign a confession. Is this confession admissible in court?',
    options: [
      { id: 'A', text: 'Yes, physical pressure is permitted during police interrogation.', isCorrect: false },
      { id: 'B', text: 'Yes, if the investigating officer is a senior inspector.', isCorrect: false },
      { id: 'C', text: 'No! Section 34 forbids torture and degrading treatment; forced confessions are legally void.', isCorrect: true },
      { id: 'D', text: 'Confessions obtained through slaps are valid if witnessed by another officer.', isCorrect: false },
    ],
    explanation: 'Section 34 of the Constitution protects dignity of person against torture and cruel, inhuman, or degrading treatment. Statements extracted under coercion or torture are illegal and inadmissible under ACJA 2015 s.15.',
    citation: 'Constitution 1999, s.34 / ACJA 2015 s.15',
    questions: [
      {
        scenario: 'During questioning at a station, an officer slaps a suspect to compel them to sign a confession. Is this confession admissible in court?',
        options: [
          { id: 'A', text: 'Yes, physical pressure is permitted during police interrogation.', isCorrect: false },
          { id: 'B', text: 'Yes, if the investigating officer is a senior inspector.', isCorrect: false },
          { id: 'C', text: 'No! Section 34 forbids torture and degrading treatment; forced confessions are legally void.', isCorrect: true },
          { id: 'D', text: 'Confessions obtained through slaps are valid if witnessed by another officer.', isCorrect: false },
        ],
        explanation: 'Section 34 protects dignity of person. Statements extracted under coercion are inadmissible under ACJA 2015 s.15.',
        citation: 'Constitution 1999, s.34 / ACJA 2015 s.15',
      },
      {
        scenario: 'Police threaten to arrest a suspect\'s family members unless the suspect confesses. Is any confession obtained this way valid?',
        options: [
          { id: 'A', text: 'Yes, threats to family do not affect confession validity.', isCorrect: false },
          { id: 'B', text: 'No — threats and intimidation constitute inhuman treatment; confessions obtained this way are inadmissible.', isCorrect: true },
          { id: 'C', text: 'It depends on whether the threats were carried out.', isCorrect: false },
          { id: 'D', text: 'Only physical violence invalidates confessions.', isCorrect: false },
        ],
        explanation: 'Section 34 protects against all forms of cruel, inhuman, and degrading treatment — including psychological coercion and threats.',
        citation: 'Constitution 1999, s.34',
      },
      {
        scenario: 'A suspect in custody is denied food and water for 36 hours to pressure them into cooperating. Does this violate any rights?',
        options: [
          { id: 'A', text: 'No, police are not required to feed suspects.', isCorrect: false },
          { id: 'B', text: 'Only if the suspect formally requests food.', isCorrect: false },
          { id: 'C', text: 'Yes — denying basic needs constitutes inhuman and degrading treatment under Section 34.', isCorrect: true },
          { id: 'D', text: 'It depends on the crime the suspect is accused of.', isCorrect: false },
        ],
        explanation: 'Denying basic necessities like food and water to a person in custody constitutes inhuman treatment prohibited by Section 34.',
        citation: 'Constitution 1999, s.34',
      },
      {
        scenario: 'A detention facility forces detainees to sleep on bare concrete in overcrowded cells. Is there a constitutional issue?',
        options: [
          { id: 'A', text: 'Detention conditions are outside constitutional scope.', isCorrect: false },
          { id: 'B', text: 'Yes — inhumane detention conditions violate the right to dignity of person under Section 34.', isCorrect: true },
          { id: 'C', text: 'Only sentenced prisoners have rights to decent conditions.', isCorrect: false },
          { id: 'D', text: 'This is acceptable if the facility is government-operated.', isCorrect: false },
        ],
        explanation: 'Section 34 protects the dignity of every person, including those in detention. Inhumane conditions are a constitutional violation.',
        citation: 'Constitution 1999, s.34',
      },
      {
        scenario: 'A suspect is paraded before media cameras at the police station and publicly labeled a criminal before any trial. Does this violate their rights?',
        options: [
          { id: 'A', text: 'Public parades are standard practice and perfectly legal.', isCorrect: false },
          { id: 'B', text: 'It is only illegal if the suspect objects on camera.', isCorrect: false },
          { id: 'C', text: 'Yes — suspect parades constitute degrading treatment under Section 34 and violate the presumption of innocence.', isCorrect: true },
          { id: 'D', text: 'Media parades are permitted for serious offences only.', isCorrect: false },
        ],
        explanation: 'Parading suspects before media is degrading treatment under Section 34. It also undermines the presumption of innocence under Section 36(5).',
        citation: 'Constitution 1999, s.34 / s.36(5)',
      },
    ],
  },
};
