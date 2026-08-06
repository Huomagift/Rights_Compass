export interface GuideItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  badge?: string;
  progressPercent?: number;
  image?: string;
  citation: string;
  content: string[];
}

export const FEATURED_GUIDE: GuideItem = {
  id: 'tenant-2024',
  category: 'Housing & Property',
  title: 'Navigating Tenant Rights',
  subtitle: 'A comprehensive look at housing laws, quit notice requirements, and rent protection in your area.',
  badge: 'NEW GUIDE',
  citation: 'Tenancy Law s.13-16 / Constitution 1999 s.37',
  content: [
    'Under Nigerian tenancy laws, a landlord cannot forcefully eject a tenant without serving valid legal notices.',
    'For a yearly tenancy, a tenant is legally entitled to a 6-month Notice to Quit followed by a 7-day Notice of Owner’s Intention to Apply to Court for Recovery of Possession.',
    'Removing roof sheets, locking doors, or turning off water/electricity to force a tenant out is illegal and punishable under state tenancy acts.',
    'If your landlord threatens self-help eviction, you can file an application for an injunction or seek legal aid.',
  ],
};

export const RECENT_GUIDES: GuideItem[] = [
  {
    id: 'emp-severance',
    category: 'Employment Law',
    title: 'Understanding Severance',
    subtitle: 'Know your rights regarding wrongful termination and redundancy benefits.',
    progressPercent: 65,
    citation: 'Labour Act Cap L1 s.11',
    content: [
      'Employers must provide written notice or payment in lieu of notice prior to termination.',
      'Redundancy payments are statutory when workers are let off due to business downsizing.',
    ],
  },
  {
    id: 'consumer-sub',
    category: 'Consumer Rights',
    title: 'Digital Subscriptions & Refunds',
    subtitle: 'Fair transaction laws and protection against unauthorized billing.',
    progressPercent: 40,
    citation: 'FCCPA 2018 s.120',
    content: [
      'The Federal Competition and Consumer Protection Act guarantees clear disclosure of auto-renewal terms and refund rights for defective digital services.',
    ],
  },
  {
    id: 'police-stops',
    category: 'Civil Rights',
    title: 'Police Stops & Phone Searches',
    subtitle: 'What to do when stopped at a road checkpoint.',
    progressPercent: 85,
    citation: 'Constitution 1999 s.35, s.37 & ACJA 2015 s.9',
    content: [
      'Officers cannot search your mobile phone unless there is a warrant or reasonable suspicion of a felony.',
      'Always stay calm, ask polite questions ("May I know why I am being stopped?"), and do not resist physically.',
    ],
  },
];

export interface ScenarioQuiz {
  id: string;
  guideId: string;
  scenario: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  citation: string;
}

export const SAMPLE_QUIZZES: Record<string, ScenarioQuiz> = {
  'police-stops': {
    id: 'q1',
    guideId: 'police-stops',
    scenario: 'A police officer stops you at a checkpoint and demands to unlock your laptop and go through your bank apps without explaining why. Is this legal?',
    options: [
      { id: 'A', text: 'Yes, police have unlimited right to inspect all electronic devices.', isCorrect: false },
      { id: 'B', text: 'No, Section 37 guarantees privacy; officers need reasonable grounds or a warrant.', isCorrect: true },
      { id: 'C', text: 'Only if you refuse to show your driver’s license.', isCorrect: false },
    ],
    explanation: 'Section 37 of the 1999 Constitution guarantees the right to privacy of communications. Randomly searching your phone or bank apps without a warrant or reasonable suspicion of a felony is unlawful.',
    citation: 'Constitution 1999, s.37',
  },
  'tenant-2024': {
    id: 'q2',
    guideId: 'tenant-2024',
    scenario: 'Your landlord removes your entrance door because your rent is 2 weeks overdue. What does the law say?',
    options: [
      { id: 'A', text: 'Landlords can remove doors if rent is overdue by 7 days.', isCorrect: false },
      { id: 'B', text: 'Self-help eviction is illegal; landlords must follow court processes.', isCorrect: true },
      { id: 'C', text: 'You must immediately vacate without your belongings.', isCorrect: false },
    ],
    explanation: 'Self-help eviction (removing doors, locking gates) is illegal. Landlords must issue valid quit notices and obtain court orders to recover possession.',
    citation: 'Tenancy Law 2011 / Recovery of Premises Act s.16',
  },
};
