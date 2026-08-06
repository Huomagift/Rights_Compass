export interface LegalSection {
  id: string;
  chapter: string;
  section: string;
  title: string;
  category: 'civil' | 'police' | 'tenancy' | 'employment' | 'consumer';
  verbatimText: string;
  plainLanguageSummary: string;
  keyTakeaway: string;
}

export const CONSTITUTION_SECTIONS: LegalSection[] = [
  {
    id: 's33',
    chapter: 'Chapter IV: Fundamental Rights',
    section: 'Section 33',
    title: 'Right to Life',
    category: 'civil',
    verbatimText: 'Every person has a right to life, and no one shall be deprived intentionally of his life, save in execution of the sentence of a court in respect of a criminal offence of which he has been found guilty in Nigeria.',
    plainLanguageSummary: 'You have a constitutional right to life. Law enforcement or security personnel cannot unlawfully use lethal force against you.',
    keyTakeaway: 'Lethal force is strictly illegal except in self-defense under extreme legal conditions.',
  },
  {
    id: 's34',
    chapter: 'Chapter IV: Fundamental Rights',
    section: 'Section 34',
    title: 'Right to Dignity of Human Person',
    category: 'civil',
    verbatimText: 'Every individual is entitled to respect for the dignity of his person, and accordingly no person shall be subject to torture or to inhuman or degrading treatment.',
    plainLanguageSummary: 'You cannot be subjected to torture, physical abuse, forced labor, or humiliating treatment by anyone, including police or military officers.',
    keyTakeaway: 'Physical abuse or harassment during stops or in custody violates Section 34.',
  },
  {
    id: 's35',
    chapter: 'Chapter IV: Fundamental Rights',
    section: 'Section 35',
    title: 'Right to Personal Liberty & Reason for Arrest',
    category: 'police',
    verbatimText: 'Every person shall be entitled to his personal liberty... Any person who is arrested or detained shall be informed in writing within twenty-four hours (and in a language that he understands) of the facts and grounds for his arrest or detention.',
    plainLanguageSummary: 'You cannot be detained arbitrarily. Officers MUST give you the reason for your arrest promptly in a language you understand, and you have the right to remain silent until consulting a legal practitioner.',
    keyTakeaway: 'You have the right to ask "Why am I being stopped/arrested?" calmly and receive a clear reason.',
  },
  {
    id: 's36',
    chapter: 'Chapter IV: Fundamental Rights',
    section: 'Section 36',
    title: 'Right to Fair Hearing',
    category: 'civil',
    verbatimText: 'In the determination of his civil rights and obligations... a person shall be entitled to a fair hearing within a reasonable time by a court or other tribunal established by law.',
    plainLanguageSummary: 'You are presumed innocent until proven guilty by a court of law. You are entitled to present your defense and have a lawyer represent you.',
    keyTakeaway: 'No police officer or authority can pronounce guilt or punish you on the spot.',
  },
  {
    id: 's37',
    chapter: 'Chapter IV: Fundamental Rights',
    section: 'Section 37',
    title: 'Right to Private and Family Life (Searches)',
    category: 'police',
    verbatimText: 'The privacy of citizens, their homes, telephone conversations, telegraphic communications and emails is hereby guaranteed and protected.',
    plainLanguageSummary: 'Police officers cannot randomly search your private phone, laptop, bag, or home without reasonable grounds or a valid warrant.',
    keyTakeaway: 'Searching your phone without a warrant or reasonable suspicion of a felony is a violation of s.37.',
  },
  {
    id: 'tenancy_notice',
    chapter: 'Tenancy Law 2011 / Recovery of Premises Act',
    section: 'Section 13 & 16',
    title: 'Unlawful Eviction & Quit Notices',
    category: 'tenancy',
    verbatimText: 'Where a tenancy is for one year or more, 6 months notice to quit is required. A landlord cannot forcefully eject a tenant, lock out a tenant, or remove roof/doors without a Court order.',
    plainLanguageSummary: 'Your landlord cannot throw your belongings out, change locks, or harass you without following court process. A valid Quit Notice (usually 6 months for yearly tenants) must be served first.',
    keyTakeaway: 'Self-help eviction by landlords is illegal in Nigeria.',
  },
  {
    id: 'labour_termination',
    chapter: 'Labour Act Cap L1',
    section: 'Section 11',
    title: 'Termination of Employment & Notice Periods',
    category: 'employment',
    verbatimText: 'Either party to a contract of employment may terminate the contract on giving to the other party notice... 1 day notice for under 3 months, 1 week for 3 months-2 years, 2 weeks for 2-5 years, 1 month for 5+ years.',
    plainLanguageSummary: 'Employers must provide formal written notice or salary in lieu of notice before terminating employment, and pay all accrued wages.',
    keyTakeaway: 'Arbitrary instant dismissal without notice or pay in lieu violates the Labour Act.',
  },
];
