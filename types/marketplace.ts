// ─── Core Enums / Unions ─────────────────────────────────────────────────────

export type UserRole = 'user' | 'lawyer';

export type LawyerApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'suspended';

export type PracticeArea =
  | 'tenancy_land'
  | 'employment'
  | 'family'
  | 'police_human_rights'
  | 'consumer'
  | 'business'
  | 'criminal'
  | 'immigration'
  | 'constitutional';

export type ConsultationStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'completed';

export type ContactPreference = 'phone' | 'email' | 'whatsapp' | 'in_person';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

// ─── Practice Area Display ────────────────────────────────────────────────────

export const PRACTICE_AREA_LABELS: Record<PracticeArea, string> = {
  tenancy_land: 'Tenancy & Land',
  employment: 'Employment & Labour',
  family: 'Family Law',
  police_human_rights: 'Police & Human Rights',
  consumer: 'Consumer Rights',
  business: 'Business & Corporate',
  criminal: 'Criminal Defence',
  immigration: 'Immigration',
  constitutional: 'Constitutional Law',
};

// ─── Lawyer Profile ───────────────────────────────────────────────────────────

export interface LawyerProfile {
  id: string;
  fullName: string;
  photoUri?: string;          // local or remote URI
  city: string;
  state: string;
  bio: string;
  practiceAreas: PracticeArea[];
  yearsOfExperience: number;
  firmOrChambers?: string;
  scnNumber: string;         // Supreme Court Roll number
  yearOfCall: number;
  applicationStatus: LawyerApplicationStatus;
  isAvailable: boolean;
  rating?: number;           // future use
  consultationsCompleted?: number;
  verifiedAt?: string;       // ISO date
}

// ─── Lawyer Application ───────────────────────────────────────────────────────

export interface ApplicationPersonal {
  fullName: string;
  photoUri?: string;
  city: string;
  state: string;
  bio: string;
}

export interface ApplicationCredentials {
  scnNumber: string;
  yearOfCall: number;
  practiceAreas: PracticeArea[];
  yearsOfExperience: number;
  firmOrChambers?: string;
}

export interface ApplicationDocument {
  id: string;       // matches RequiredDocument.id
  fileName: string;
  uri: string;      // local URI from image picker
  mimeType?: string;
  uploadedAt: string; // ISO date
}

export interface LawyerApplication {
  id: string;
  userId: string;
  status: LawyerApplicationStatus;
  personal: ApplicationPersonal;
  credentials: ApplicationCredentials;
  documents: ApplicationDocument[];
  rejectionReason?: string;
  submittedAt?: string;
  lastUpdatedAt: string;
  // Draft step tracking (0-3: personal, credentials, documents, review)
  currentStep: number;
}

// ─── Consultation Request ─────────────────────────────────────────────────────

export interface ConsultationRequest {
  id: string;
  userId: string;
  lawyerId: string;
  lawyerName: string;
  practiceArea: PracticeArea;
  issueDescription: string;
  contactPreference: ContactPreference;
  urgency: UrgencyLevel;
  status: ConsultationStatus;
  createdAt: string;    // ISO date
  updatedAt: string;    // ISO date
  declineReason?: string;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface LawyerFilters {
  searchQuery?: string;
  practiceArea?: PracticeArea | null;
  city?: string | null;
}
