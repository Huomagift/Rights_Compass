import { PracticeArea, UrgencyLevel, ContactPreference } from './marketplace';

// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  phoneNumber?: string;
  isLawyerTrack: boolean;
  selectedTopics: string[];
  reminderTime: string; // HH:MM
  streakDays: number;
  lastActiveDate?: string; // ISO
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface AuthSession {
  userId: string;
  phoneNumber: string;
  isVerified: boolean;
  token?: string;
  expiresAt?: string;
}

// ─── Learning, Lessons & Quizzes ─────────────────────────────────────────────

export type LessonStepType = 'intro' | 'reading' | 'scenario' | 'quiz' | 'completion';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean; // Note: server-side verified in real backend, present in mock
  explanation: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'scenario_match';

export interface Question {
  id: string;
  lessonId?: string;
  sectionId?: string;
  type: QuestionType;
  prompt: string;
  scenario?: string;
  options: QuestionOption[];
  citation?: string; // e.g. "Section 35(1), 1999 Constitution"
}

export interface LessonStep {
  id: string;
  type: LessonStepType;
  title: string;
  body: string;
  citation?: string;
  takeaway?: string;
  question?: Question;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  category: PracticeArea | string;
  order: number;
  durationMinutes: number;
  isCompleted: boolean;
  isLocked: boolean;
  score?: number;
  steps: LessonStep[];
}

export interface QuizResult {
  quizId: string;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  streakIncremented: boolean;
}

export interface UserLearningProgress {
  completedLessonIds: string[];
  activeLessonId?: string;
  activeStepIndex?: number;
  currentStreak: number;
  lastCompletedDate?: string;
  bookmarks: string[];
}

// ─── Constitution & Legal Library ─────────────────────────────────────────────

export interface ConstitutionSection {
  id: string;
  sectionNumber: string;
  title: string;
  officialText: string;
  plainEnglishExplanation: string;
  practicalTakeaway: string;
  chapter: string;
  part?: string;
  keywords: string[];
}

export interface ConstitutionChapter {
  id: string;
  number: string;
  title: string;
  sectionRange: string;
  sections: ConstitutionSection[];
}

export interface LegalGuide {
  id: string;
  title: string;
  category: PracticeArea | string;
  summary: string;
  readingTimeMinutes: number;
  contentMarkdown: string;
  relatedSections: string[];
  isBookmarked?: boolean;
}

// ─── Escrow & Transactions ───────────────────────────────────────────────────

/**
 * 15 Transaction States as specified in PROJECT_RULES.md:
 * Main linear path:
 * REQUESTED -> LAWYER_ACCEPTED -> PAYMENT_PENDING -> PAYMENT_SECURED -> SERVICE_IN_PROGRESS -> COMPLETION_REQUESTED -> CLIENT_CONFIRMED -> LAWYER_CONFIRMED -> COMPLETED
 * Branches:
 * DISPUTED, REFUND_PENDING, REFUNDED, CANCELLED, FAILED
 */
export type TransactionState =
  | 'REQUESTED'
  | 'LAWYER_ACCEPTED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SECURED'
  | 'SERVICE_IN_PROGRESS'
  | 'COMPLETION_REQUESTED'
  | 'CLIENT_CONFIRMED'
  | 'LAWYER_CONFIRMED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'CANCELLED'
  | 'FAILED';

export const TRANSACTION_MAIN_SEQUENCE: readonly TransactionState[] = [
  'REQUESTED',
  'LAWYER_ACCEPTED',
  'PAYMENT_PENDING',
  'PAYMENT_SECURED',
  'SERVICE_IN_PROGRESS',
  'COMPLETION_REQUESTED',
  'CLIENT_CONFIRMED',
  'LAWYER_CONFIRMED',
  'COMPLETED',
] as const;

export interface TransactionTransitionConfig {
  from: TransactionState;
  to: TransactionState[];
  actionLabel: string;
  description: string;
}

/**
 * Editable transition matrix config table (per user requirement: config-driven, not hardcoded logic)
 */
export const TRANSACTION_TRANSITIONS: Record<TransactionState, TransactionState[]> = {
  REQUESTED: ['LAWYER_ACCEPTED', 'CANCELLED'],
  LAWYER_ACCEPTED: ['PAYMENT_PENDING', 'CANCELLED'],
  PAYMENT_PENDING: ['PAYMENT_SECURED', 'FAILED', 'CANCELLED'],
  PAYMENT_SECURED: ['SERVICE_IN_PROGRESS', 'REFUND_PENDING', 'DISPUTED'],
  SERVICE_IN_PROGRESS: ['COMPLETION_REQUESTED', 'DISPUTED', 'CANCELLED'],
  COMPLETION_REQUESTED: ['CLIENT_CONFIRMED', 'DISPUTED'],
  CLIENT_CONFIRMED: ['LAWYER_CONFIRMED', 'COMPLETED', 'DISPUTED'],
  LAWYER_CONFIRMED: ['COMPLETED', 'DISPUTED'],
  COMPLETED: [], // Terminal success
  DISPUTED: ['REFUND_PENDING', 'SERVICE_IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
  REFUND_PENDING: ['REFUNDED', 'FAILED'],
  REFUNDED: [], // Terminal refund
  CANCELLED: [], // Terminal cancel
  FAILED: ['PAYMENT_PENDING', 'CANCELLED'],
};

export interface Transaction {
  id: string;
  requestId: string;
  clientId: string;
  clientName: string;
  lawyerId: string;
  lawyerName: string;
  serviceTitle: string;
  amountNgn: number;
  platformFeeNgn: number;
  totalNgn: number;
  state: TransactionState;
  stateHistory: Array<{
    state: TransactionState;
    timestamp: string;
    note?: string;
  }>;
  escrowReleaseApprovedByClient: boolean;
  escrowReleaseApprovedByLawyer: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Disputes ─────────────────────────────────────────────────────────────────

export type DisputeStatus = 'opened' | 'under_review' | 'evidence_required' | 'resolved_refund' | 'resolved_released' | 'dismissed';

export interface Dispute {
  id: string;
  transactionId: string;
  openedByUserId: string;
  reason: 'incomplete_service' | 'wrong_service' | 'unresponsive_lawyer' | 'other';
  description: string;
  attachmentUris: string[];
  status: DisputeStatus;
  adminResolutionNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationCategory = 'system' | 'learning' | 'rights' | 'lawyer' | 'transaction';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  isRead: boolean;
  createdAt: string;
  targetRoute?: string;
  targetParams?: Record<string, string>;
}

// ─── Support Tickets ──────────────────────────────────────────────────────────

export type TicketCategory = 'account' | 'learning' | 'lawyers' | 'payments' | 'disputes' | 'technical';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  userId: string;
  category: TicketCategory;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  responses?: Array<{
    sender: 'user' | 'support';
    message: string;
    sentAt: string;
  }>;
}

// ─── AI Chat & Tutor ──────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  citations?: string[];
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
}

export interface TutorScenarioPrompt {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  category: string;
}
