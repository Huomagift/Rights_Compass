import {
  UserProfile,
  UserLearningProgress,
  Lesson,
  Question,
  ConstitutionChapter,
  ConstitutionSection,
  Transaction,
  TransactionState,
  Dispute,
  SupportTicket,
  LawyerProfile,
  LawyerApplication,
  ConsultationRequest,
  LawyerFilters,
} from '../../types';

export interface IUserRepository {
  getProfile(): Promise<UserProfile | null>;
  updateProfile(profile: Partial<UserProfile>): Promise<UserProfile>;
  getProgress(): Promise<UserLearningProgress>;
  updateProgress(update: Partial<UserLearningProgress>): Promise<UserLearningProgress>;
  resetAllUserData(): Promise<void>;
}

export interface ILearningRepository {
  getLessons(): Promise<Lesson[]>;
  getLessonById(id: string): Promise<Lesson | null>;
  getTodayLesson(): Promise<Lesson | null>;
  completeLesson(lessonId: string, score: number): Promise<UserLearningProgress>;
  getQuizById(id: string): Promise<{ id: string; title: string; questions: Question[] } | null>;
}

export interface IConstitutionRepository {
  getChapters(): Promise<ConstitutionChapter[]>;
  getSectionById(id: string): Promise<ConstitutionSection | null>;
  searchSections(query: string): Promise<ConstitutionSection[]>;
  getBookmarks(): Promise<string[]>;
  toggleBookmark(sectionId: string): Promise<boolean>;
}

export interface ILawyerRepository {
  getLawyers(filters?: LawyerFilters): Promise<LawyerProfile[]>;
  getLawyerById(id: string): Promise<LawyerProfile | null>;
  getApplication(): Promise<LawyerApplication | null>;
  saveApplicationDraft(app: Partial<LawyerApplication>): Promise<LawyerApplication>;
  submitApplication(app: LawyerApplication): Promise<LawyerApplication>;
  getRequests(): Promise<ConsultationRequest[]>;
  createRequest(request: Omit<ConsultationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<ConsultationRequest>;
  updateRequestStatus(requestId: string, status: ConsultationRequest['status'], reason?: string): Promise<ConsultationRequest>;
}

export interface ITransactionRepository {
  getTransactions(userId?: string): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | null>;
  createTransaction(requestId: string, lawyerId: string, amountNgn: number): Promise<Transaction>;
  transitionState(transactionId: string, nextState: TransactionState, note?: string): Promise<Transaction>;
  createDispute(transactionId: string, reason: Dispute['reason'], description: string, attachmentUris: string[]): Promise<Dispute>;
  getDisputes(userId?: string): Promise<Dispute[]>;
}

export interface ISupportRepository {
  submitTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<SupportTicket>;
  getTickets(userId?: string): Promise<SupportTicket[]>;
}
