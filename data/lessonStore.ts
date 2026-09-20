import { UserProfile } from '../services/offlineStorage';

export type CardType = 'situation' | 'takeaway' | 'scenario' | 'feedback' | 'reinforce';

export interface LessonOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface LessonCard {
  id: string;
  type: CardType;
  title: string;
  subtitle?: string;
  situationText?: string;
  takeawayPoints?: string[];
  questionPrompt?: string;
  options?: LessonOption[];
  legalCitation?: string;
  legalBasisText?: string;
  recapSummary?: string;
}

export interface DailyLesson {
  id: string;
  levelId: number;
  levelTitle: string;
  category: string;
  topicTitle: string;
  heroQuestionTitle: string; // Used on Home Hero Card: e.g. "What can a police officer legally ask you to do?"
  estimatedMinutes: number;
  cards: LessonCard[];
}

export interface LegalLevel {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  iconName: string;
  lessons: DailyLesson[];
}

// CURATED DAILY LESSONS (Strictly using verified constitutional & statutory references)
export const ALL_DAILY_LESSONS: DailyLesson[] = [
  {
    id: 'lesson_police_stops',
    levelId: 1,
    levelTitle: 'Level 1: Checkpoints & Stops',
    category: 'Police & Civil Rights',
    topicTitle: 'Police Stops & Phone Searches',
    heroQuestionTitle: 'Can someone search your phone without your permission?',
    estimatedMinutes: 3,
    cards: [
      {
        id: 'card_1_sit',
        type: 'situation',
        title: 'Real-World Situation',
        subtitle: 'Stopped at a road checkpoint',
        situationText: 'You are driving home in the evening when a police team flags you down at a checkpoint. The officer asks you to step out and hand over your unlocked smartphone to check bank apps.',
      },
      {
        id: 'card_1_take',
        type: 'takeaway',
        title: 'Key Takeaway',
        subtitle: 'Digital Privacy Protections',
        takeawayPoints: [
          'Section 37 guarantees privacy of your phone, laptops, and messages.',
          'Officers cannot compel you to unlock your phone or search bank apps without a warrant or proof of a felony.',
          'Polite questioning helps keep you safe while establishing your position.',
        ],
      },
      {
        id: 'card_1_scen',
        type: 'scenario',
        title: 'What Would You Do?',
        questionPrompt: 'An officer demands your phone password at a checkpoint without explaining why. What is the safest legal response?',
        options: [
          {
            id: 'A',
            text: 'Ask politely for the reason for the check and whether there is a warrant or specific felony suspicion.',
            isCorrect: true,
            explanation: 'That is the safer response. Asking respectfully establishes your constitutional privacy rights without provoking physical escalation.',
          },
          {
            id: 'B',
            text: 'Physically resist and try to drive away immediately.',
            isCorrect: false,
            explanation: 'Resisting physically can endanger your personal safety. Always remain calm and assert rights verbally and politely.',
          },
          {
            id: 'C',
            text: 'Open all bank apps and hand over your phone without saying anything.',
            isCorrect: false,
            explanation: 'You are not legally required to surrender private financial apps without a warrant or reasonable felony suspicion.',
          },
          {
            id: 'D',
            text: 'Argue aggressively and accuse the officer of breaking Section 37.',
            isCorrect: false,
            explanation: 'Aggressive confrontation at a checkpoint escalates tension. State your rights calmly.',
          },
        ],
      },
      {
        id: 'card_1_fb',
        type: 'feedback',
        title: 'Legal Basis & Explanation',
        legalCitation: 'Constitution of Nigeria 1999, Section 37',
        legalBasisText: 'Section 37 guarantees privacy of citizens, their homes, telegraphic communications, and digital devices. Random device searches without warrant or reasonable suspicion of a felony are unlawful.',
        recapSummary: 'Remember: Stay calm, remain polite, and ask for the legal basis of any phone search.',
      },
      {
        id: 'card_1_reinf',
        type: 'reinforce',
        title: 'Quick Recall',
        questionPrompt: 'Under Section 37, what is required before an officer can legally search your bank apps?',
        options: [
          {
            id: 'A',
            text: 'A valid warrant or reasonable suspicion of a felony.',
            isCorrect: true,
            explanation: 'Correct! Privacy rights require a warrant or reasonable suspicion of a felony.',
          },
          {
            id: 'B',
            text: 'Any verbal order given by any officer.',
            isCorrect: false,
            explanation: 'Incorrect. Officers must have a warrant or reasonable suspicion of a felony.',
          },
        ],
      },
    ],
  },
  {
    id: 'lesson_detention_rules',
    levelId: 2,
    levelTitle: 'Level 2: Arrest & Detention',
    category: 'Police & Civil Rights',
    topicTitle: 'Personal Liberty & Cell Limits',
    heroQuestionTitle: 'What can a police officer legally ask you to do?',
    estimatedMinutes: 4,
    cards: [
      {
        id: 'card_2_sit',
        type: 'situation',
        title: 'Real-World Situation',
        subtitle: 'Asked to come to the station',
        situationText: 'An officer asks you to accompany them to the station without stating any reason or presenting written notice of a charge.',
      },
      {
        id: 'card_2_take',
        type: 'takeaway',
        title: 'Key Takeaway',
        subtitle: 'Right to Information & Silence',
        takeawayPoints: [
          'Section 35 requires officers to inform you in writing of reasons for arrest within 24 hours.',
          'You have an absolute right to remain silent until consulting a lawyer.',
          'Suspects must be brought before court within 24 to 48 hours maximum.',
        ],
      },
      {
        id: 'card_2_scen',
        type: 'scenario',
        title: 'What Would You Do?',
        questionPrompt: 'You are brought to a police station. Officers demand you write a statement immediately before your lawyer arrives. What should you do?',
        options: [
          {
            id: 'A',
            text: 'Calmly state that you wish to remain silent and speak with a legal practitioner first.',
            isCorrect: true,
            explanation: 'That is the safer response. Section 35(2) explicitly guarantees your right to remain silent until consulting a lawyer.',
          },
          {
            id: 'B',
            text: 'Sign any statement presented to you so you can leave faster.',
            isCorrect: false,
            explanation: 'Signing statements without legal review can compromise your defence.',
          },
          {
            id: 'C',
            text: 'Fabricate false details to satisfy the investigating officer.',
            isCorrect: false,
            explanation: 'Giving false statements creates serious legal complications. Exercise your right to silence.',
          },
        ],
      },
      {
        id: 'card_2_fb',
        type: 'feedback',
        title: 'Legal Basis & Explanation',
        legalCitation: 'Constitution of Nigeria 1999, Section 35(2) & ACJA 2015 s.6',
        legalBasisText: 'Section 35 guarantees personal liberty. Any arrested person has the right to remain silent until consulting a legal practitioner of their choice, and officers must provide written reasons for arrest.',
        recapSummary: 'Remember: You have the right to remain silent and request a lawyer before making any statement.',
      },
      {
        id: 'card_2_reinf',
        type: 'reinforce',
        title: 'Quick Recall',
        questionPrompt: 'Within how many hours must a suspect be brought before court if a court is within 40km?',
        options: [
          {
            id: 'A',
            text: '24 hours.',
            isCorrect: true,
            explanation: 'Correct! Section 35(5) sets 24 hours where a court is within 40km.',
          },
          {
            id: 'B',
            text: '2 weeks.',
            isCorrect: false,
            explanation: 'Incorrect. Prolonged detention without court sanction is unconstitutional.',
          },
        ],
      },
    ],
  },
  {
    id: 'lesson_tenant_eviction',
    levelId: 3,
    levelTitle: 'Level 3: Housing Rights',
    category: 'Housing & Property',
    topicTitle: 'Tenant Rights & Lockout Protections',
    heroQuestionTitle: 'What should you do if a landlord tries to lock you out?',
    estimatedMinutes: 3,
    cards: [
      {
        id: 'card_3_sit',
        type: 'situation',
        title: 'Real-World Situation',
        subtitle: 'Notice dispute with landlord',
        situationText: 'Your rent was due 2 weeks ago. The landlord threatens to remove your entrance door and change the compound gate locks tomorrow.',
      },
      {
        id: 'card_3_take',
        type: 'takeaway',
        title: 'Key Takeaway',
        subtitle: 'Illegal Self-Help Eviction',
        takeawayPoints: [
          'Landlords cannot forcibly eject tenants or remove doors without court orders.',
          'Yearly tenants are legally entitled to 6 months Notice to Quit followed by statutory court notices.',
          'Self-help eviction is strictly illegal under Nigerian tenancy laws.',
        ],
      },
      {
        id: 'card_3_scen',
        type: 'scenario',
        title: 'What Would You Do?',
        questionPrompt: 'A caretaker locks the main compound gate to prevent you from entering your flat due to rent delay. What is your legal recourse?',
        options: [
          {
            id: 'A',
            text: 'Document the lockout, state tenancy protections in writing, and report illegal self-help to police or legal aid.',
            isCorrect: true,
            explanation: 'That is the safer response. Self-help eviction (locking gates/removing doors) is illegal and actionable in court.',
          },
          {
            id: 'B',
            text: 'Break the landlord’s windows in retaliation.',
            isCorrect: false,
            explanation: 'Retaliatory property damage is a criminal offense.',
          },
          {
            id: 'C',
            text: 'Vacate the property immediately and abandon all personal belongings.',
            isCorrect: false,
            explanation: 'Tenants are entitled to due process and statutory notices under tenancy laws.',
          },
        ],
      },
      {
        id: 'card_3_fb',
        type: 'feedback',
        title: 'Legal Basis & Explanation',
        legalCitation: 'Tenancy Law 2011 / Recovery of Premises Act s.16',
        legalBasisText: 'Self-help eviction (locking out tenants, removing roof sheets, turning off utilities) is prohibited by law. Landlords must serve valid statutory quit notices and obtain a court order of recovery.',
        recapSummary: 'Remember: Only a court order can legally evict a tenant in Nigeria.',
      },
      {
        id: 'card_3_reinf',
        type: 'reinforce',
        title: 'Quick Recall',
        questionPrompt: 'How much Notice to Quit is a yearly tenant statutory entitled to under tenancy law?',
        options: [
          {
            id: 'A',
            text: '6 months.',
            isCorrect: true,
            explanation: 'Correct! Yearly tenancies require 6 months written Notice to Quit.',
          },
          {
            id: 'B',
            text: '24 hours.',
            isCorrect: false,
            explanation: 'Incorrect. 24 hours is insufficient for a yearly tenancy.',
          },
        ],
      },
    ],
  },
  {
    id: 'lesson_labour_notice',
    levelId: 4,
    levelTitle: 'Level 4: Workplace Rights',
    category: 'Employment Law',
    topicTitle: 'Workplace Severance & Dismissal',
    heroQuestionTitle: 'Can an employer dismiss you without written notice?',
    estimatedMinutes: 3,
    cards: [
      {
        id: 'card_4_sit',
        type: 'situation',
        title: 'Real-World Situation',
        subtitle: 'Verbal termination at work',
        situationText: 'After 3 years of service, your manager tells you verbally on a Friday evening not to return to work on Monday, offering no written notice or salary in lieu.',
      },
      {
        id: 'card_4_take',
        type: 'takeaway',
        title: 'Key Takeaway',
        subtitle: 'Statutory Notice Periods',
        takeawayPoints: [
          'Under Section 11 of the Labour Act, notice periods increase with length of continuous service.',
          'For 2 to 5 years of service, at least 2 weeks written notice (or salary in lieu) is mandatory.',
          'Arbitrary instant verbal dismissal without pay in lieu violates statutory labour law.',
        ],
      },
      {
        id: 'card_4_scen',
        type: 'scenario',
        title: 'What Would You Do?',
        questionPrompt: 'Your employer verbally dismisses you after 3 years without notice or pay in lieu. What step best protects your position?',
        options: [
          {
            id: 'A',
            text: 'Request written confirmation of termination and claim statutory notice pay or severance entitlement.',
            isCorrect: true,
            explanation: 'That is the safer response. Requesting written documentation creates proof required for Labour Act enforcement.',
          },
          {
            id: 'B',
            text: 'Accept verbal dismissal silently without asking for written records or final settlement.',
            isCorrect: false,
            explanation: 'Failing to document termination makes claiming statutory entitlements harder.',
          },
          {
            id: 'C',
            text: 'Refuse to leave the office premises and disrupt business operations.',
            isCorrect: false,
            explanation: 'Disrupting operations can give grounds for misconduct claims. Seek written documentation and legal resolution.',
          },
        ],
      },
      {
        id: 'card_4_fb',
        type: 'feedback',
        title: 'Legal Basis & Explanation',
        legalCitation: 'Labour Act Cap L1 s.11 & Constitution s.254C',
        legalBasisText: 'Section 11 of the Labour Act requires formal written notice or salary in lieu prior to termination. The National Industrial Court of Nigeria (NICN) handles workplace disputes and wrongful dismissal claims.',
        recapSummary: 'Remember: Always secure written termination letters to enforce statutory Labour Act notice pay.',
      },
      {
        id: 'card_4_reinf',
        type: 'reinforce',
        title: 'Quick Recall',
        questionPrompt: 'Which court in Nigeria has exclusive jurisdiction over workplace and employment disputes?',
        options: [
          {
            id: 'A',
            text: 'National Industrial Court of Nigeria (NICN).',
            isCorrect: true,
            explanation: 'Correct! NICN has exclusive authority over labour and employment law.',
          },
          {
            id: 'B',
            text: 'Customary Court.',
            isCorrect: false,
            explanation: 'Incorrect. Employment disputes fall under the National Industrial Court.',
          },
        ],
      },
    ],
  },
];

// LEVEL DEFINITIONS FOR PATH VIEW
export const LEGAL_LEVELS: LegalLevel[] = [
  {
    id: 1,
    title: 'Level 1: Checkpoints & Phone Searches',
    subtitle: 'Master Section 37 digital privacy & checkpoint rules',
    category: 'Police & Civil Rights',
    iconName: 'Shield',
    lessons: [ALL_DAILY_LESSONS[0]],
  },
  {
    id: 2,
    title: 'Level 2: Arrest & Detention Rights',
    subtitle: 'Section 35 liberty protections & 24h court limits',
    category: 'Police & Civil Rights',
    iconName: 'Scale',
    lessons: [ALL_DAILY_LESSONS[1]],
  },
  {
    id: 3,
    title: 'Level 3: Housing & Tenant Rights',
    subtitle: 'Tenancy laws, quit notices & lockout protections',
    category: 'Housing & Property',
    iconName: 'Home',
    lessons: [ALL_DAILY_LESSONS[2]],
  },
  {
    id: 4,
    title: 'Level 4: Workplace & Employment Law',
    subtitle: 'Labour Act notice rules & severance rights',
    category: 'Employment Law',
    iconName: 'Briefcase',
    lessons: [ALL_DAILY_LESSONS[3]],
  },
];

/**
 * Dynamically selects today's lesson for a user based on profile, interests, and rotation.
 */
export const getTodayLesson = (profile: UserProfile): DailyLesson => {
  const userInterests = profile.interests || [];
  const completed = profile.completedLessonIds || [];

  // Match lesson based on primary interest
  const primaryCat = userInterests[0] || 'police';
  const categoryMap: Record<string, string> = {
    police: 'Police & Civil Rights',
    tenancy: 'Housing & Property',
    employment: 'Employment Law',
    civil: 'Fundamental Civil Rights',
  };

  const targetCategory = categoryMap[primaryCat] || 'Police & Civil Rights';

  // Find uncompleted lesson in target category, or fall back to rotation
  let match = ALL_DAILY_LESSONS.find(
    (l) => l.category === targetCategory && !completed.includes(l.id)
  );

  if (!match) {
    match = ALL_DAILY_LESSONS.find((l) => !completed.includes(l.id));
  }

  const selectedLesson = match || ALL_DAILY_LESSONS[0];

  // Adjust card count based on daily commitment
  const commitment = profile.dailyCommitmentMinutes || 5;
  let cardLimit = 5;
  if (commitment <= 2) cardLimit = 3;
  else if (commitment >= 10) cardLimit = 5;

  const trimmedCards = selectedLesson.cards.slice(0, cardLimit);

  return {
    ...selectedLesson,
    estimatedMinutes: Math.min(commitment, selectedLesson.estimatedMinutes),
    cards: trimmedCards,
  };
};

/**
 * Returns level progress state for path view
 */
export const getLegalLevelsWithProgress = (profile: UserProfile) => {
  const completed = profile.completedLessonIds || [];

  return LEGAL_LEVELS.map((level, idx) => {
    const isCompleted = level.lessons.every((l) => completed.includes(l.id));
    const isUnlocked = idx === 0 || completed.includes(LEGAL_LEVELS[idx - 1].lessons[0]?.id);
    const isActive = isUnlocked && !isCompleted;

    return {
      ...level,
      isCompleted,
      isUnlocked,
      isActive,
    };
  });
};
