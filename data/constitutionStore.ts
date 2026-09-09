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
const CONSTITUTION_PARSED_SECTIONS: LegalSection[] = rawData.sections.map((sec) => {
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

export interface ScenarioQuiz {
  id: string;
  guideId: string;
  scenario: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  citation: string;
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
  },
};
