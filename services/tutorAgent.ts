import { CONSTITUTION_SECTIONS, LegalSection } from '../data/constitutionStore';

export interface TutorResponse {
  answer: string;
  citation?: string;
  isUrgent: boolean;
  emergencyTip?: string;
  suggestedAction?: string;
}

const URGENCY_KEYWORDS = [
  'right now',
  'happening now',
  'searching my car',
  'searching me',
  'they are arresting',
  'help me',
  'in police station',
  'handcuffed',
];

export const processTutorQuery = (userQuery: string): TutorResponse => {
  const queryLower = userQuery.toLowerCase().trim();

  // 1. Detect Urgency / In-Progress Crisis Signals
  const isUrgent = URGENCY_KEYWORDS.some((kw) => queryLower.includes(kw));

  if (isUrgent) {
    return {
      isUrgent: true,
      answer:
        'STAY CALM: Under Nigerian law (s.35 & s.37 Constitution), you have the right to remain calm and politely ask for the reason for any stop or search. Do not resist physically or argue aggressively.',
      emergencyTip:
        'Say politely: "Please officer, may I know why I am being stopped?" You have the right to contact a legal practitioner or relative immediately (s.35(2)).',
      citation: 'Constitution of Nigeria 1999, s.35(2) & s.37',
      suggestedAction: 'Request Hotline Callback',
    };
  }

  // 2. Search Legal Content Store (RAG)
  let matchedSection: LegalSection | null = null;

  if (queryLower.includes('search') || queryLower.includes('phone') || queryLower.includes('bag') || queryLower.includes('car')) {
    matchedSection = CONSTITUTION_SECTIONS.find((s) => s.id === 's37') || null;
  } else if (queryLower.includes('arrest') || queryLower.includes('reason') || queryLower.includes('detain') || queryLower.includes('station')) {
    matchedSection = CONSTITUTION_SECTIONS.find((s) => s.id === 's35') || null;
  } else if (queryLower.includes('evict') || queryLower.includes('landlord') || queryLower.includes('rent') || queryLower.includes('quit')) {
    matchedSection = CONSTITUTION_SECTIONS.find((s) => s.id === 'tenancy_notice') || null;
  } else if (queryLower.includes('fire') || queryLower.includes('work') || queryLower.includes('salary') || queryLower.includes('severance') || queryLower.includes('boss')) {
    matchedSection = CONSTITUTION_SECTIONS.find((s) => s.id === 'labour_termination') || null;
  } else if (queryLower.includes('beat') || queryLower.includes('abuse') || queryLower.includes('slap') || queryLower.includes('torture')) {
    matchedSection = CONSTITUTION_SECTIONS.find((s) => s.id === 's34') || null;
  }

  if (matchedSection) {
    return {
      isUrgent: false,
      answer: `${matchedSection.plainLanguageSummary}\n\nKey Rule: ${matchedSection.keyTakeaway}`,
      citation: `${matchedSection.chapter} — ${matchedSection.section}`,
    };
  }

  // 3. Fallback Response
  return {
    isUrgent: false,
    answer:
      'Under Nigerian law, fundamental rights guarantee personal liberty (s.35), privacy (s.37), and fair hearing (s.36). For specific situations, feel free to ask about police stops, tenant quit notices, or employment rights.',
    citation: 'Constitution of the Federal Republic of Nigeria 1999',
  };
};
