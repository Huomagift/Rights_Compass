import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  IUserRepository,
  ILearningRepository,
  IConstitutionRepository,
  ILawyerRepository,
  ITransactionRepository,
  ISupportRepository,
} from './interfaces';
import {
  UserProfile,
  UserLearningProgress,
  Lesson,
  Question,
  ConstitutionChapter,
  ConstitutionSection,
  Transaction,
  TransactionState,
  TRANSACTION_TRANSITIONS,
  Dispute,
  SupportTicket,
  LawyerProfile,
  LawyerApplication,
  ConsultationRequest,
  LawyerFilters,
} from '../../types';
import { CONSTITUTION_SECTIONS, LegalSection, SAMPLE_QUIZZES, ScenarioQuiz } from '../../data/constitutionStore';
import { ALL_DAILY_LESSONS, getTodayLesson as fetchTodayLesson, DailyLesson } from '../../data/lessonStore';
import { marketplaceService } from '../marketplaceProvider';
import { getStoredProfile, saveStoredProfile } from '../offlineStorage';

const TRANSACTIONS_STORAGE_KEY = '@rights_compass_transactions_v1';
const DISPUTES_STORAGE_KEY = '@rights_compass_disputes_v1';
const SUPPORT_TICKETS_KEY = '@rights_compass_support_tickets_v1';
const PROGRESS_STORAGE_KEY = '@rights_compass_learning_progress_v1';
const BOOKMARKS_STORAGE_KEY = '@rights_compass_bookmarks';

// ─── User Repository Mock ─────────────────────────────────────────────────────

export class MockUserRepository implements IUserRepository {
  async getProfile(): Promise<UserProfile | null> {
    const raw = await getStoredProfile();
    return {
      id: 'local_user_1',
      name: raw.name,
      phoneNumber: raw.phoneNumber,
      isLawyerTrack: false,
      selectedTopics: raw.interests || [],
      reminderTime: raw.learningReminderTime || '09:00 AM',
      streakDays: raw.streakCount || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const existing = await getStoredProfile();
    const updated = {
      ...existing,
      name: profile.name ?? existing.name,
      phoneNumber: profile.phoneNumber ?? existing.phoneNumber,
      learningReminderTime: profile.reminderTime ?? existing.learningReminderTime,
      interests: profile.selectedTopics ?? existing.interests,
      streakCount: profile.streakDays ?? existing.streakCount,
    };

    await saveStoredProfile(updated);

    return {
      id: 'local_user_1',
      name: updated.name,
      phoneNumber: updated.phoneNumber,
      isLawyerTrack: !!profile.isLawyerTrack,
      selectedTopics: updated.interests,
      reminderTime: updated.learningReminderTime || '09:00 AM',
      streakDays: updated.streakCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getProgress(): Promise<UserLearningProgress> {
    const raw = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return {
        completedLessonIds: ['lesson_police_stops'],
        activeLessonId: 'lesson_police_stops',
        activeStepIndex: 0,
        currentStreak: 3,
        bookmarks: [],
      };
    }
    return JSON.parse(raw);
  }

  async updateProgress(update: Partial<UserLearningProgress>): Promise<UserLearningProgress> {
    const current = await this.getProgress();
    const next: UserLearningProgress = {
      ...current,
      ...update,
    };
    await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  async resetAllUserData(): Promise<void> {
    await AsyncStorage.removeItem(PROGRESS_STORAGE_KEY);
    await AsyncStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
    await AsyncStorage.removeItem(DISPUTES_STORAGE_KEY);
    await AsyncStorage.removeItem(SUPPORT_TICKETS_KEY);
    await AsyncStorage.removeItem(BOOKMARKS_STORAGE_KEY);
  }
}

// ─── Learning Repository Mock ─────────────────────────────────────────────────

export class MockLearningRepository implements ILearningRepository {
  async getLessons(): Promise<Lesson[]> {
    return ALL_DAILY_LESSONS.map((d: DailyLesson, index: number) => ({
      id: d.id,
      title: d.topicTitle,
      topic: d.levelTitle,
      category: d.category,
      order: index + 1,
      durationMinutes: d.estimatedMinutes,
      isCompleted: index === 0,
      isLocked: index > 1,
      steps: d.cards.map((c) => ({
        id: c.id,
        type: c.type === 'scenario' ? 'scenario' : c.type === 'takeaway' ? 'reading' : 'intro',
        title: c.title,
        body: c.situationText || c.legalBasisText || c.recapSummary || '',
        citation: c.legalCitation,
      })),
    }));
  }

  async getLessonById(id: string): Promise<Lesson | null> {
    const lessons = await this.getLessons();
    return lessons.find((l) => l.id === id) || null;
  }

  async getTodayLesson(): Promise<Lesson | null> {
    const profile = await getStoredProfile();
    const today = fetchTodayLesson(profile);
    if (!today) return null;
    return {
      id: today.id,
      title: today.topicTitle,
      topic: today.levelTitle,
      category: today.category,
      order: 1,
      durationMinutes: today.estimatedMinutes,
      isCompleted: false,
      isLocked: false,
      steps: today.cards.map((c) => ({
        id: c.id,
        type: c.type === 'scenario' ? 'scenario' : 'reading',
        title: c.title,
        body: c.situationText || c.legalBasisText || '',
        citation: c.legalCitation,
      })),
    };
  }

  async completeLesson(lessonId: string, score: number): Promise<UserLearningProgress> {
    const userRepo = new MockUserRepository();
    const progress = await userRepo.getProgress();
    const completedSet = new Set(progress.completedLessonIds);
    completedSet.add(lessonId);

    const updated = await userRepo.updateProgress({
      completedLessonIds: Array.from(completedSet),
      currentStreak: progress.currentStreak + 1,
      lastCompletedDate: new Date().toISOString(),
    });

    return updated;
  }

  async getQuizById(id: string): Promise<{ id: string; title: string; questions: Question[] } | null> {
    const quiz: ScenarioQuiz | undefined = SAMPLE_QUIZZES[id];
    if (!quiz) return null;

    const questionsList: Question[] = [];

    if (quiz.questions && quiz.questions.length > 0) {
      quiz.questions.forEach((q, idx) => {
        questionsList.push({
          id: `${quiz.id}_q${idx}`,
          type: 'multiple_choice',
          prompt: q.scenario,
          options: q.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
            explanation: q.explanation,
          })),
          citation: q.citation,
        });
      });
    } else {
      questionsList.push({
        id: `${quiz.id}_q0`,
        type: 'multiple_choice',
        prompt: quiz.scenario,
        options: quiz.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
          explanation: quiz.explanation,
        })),
        citation: quiz.citation,
      });
    }

    return {
      id: quiz.id,
      title: quiz.guideId || 'Constitutional Scenario Quiz',
      questions: questionsList,
    };
  }
}

// ─── Constitution Repository Mock ─────────────────────────────────────────────

export class MockConstitutionRepository implements IConstitutionRepository {
  async getChapters(): Promise<ConstitutionChapter[]> {
    const chapterMap = new Map<string, LegalSection[]>();

    CONSTITUTION_SECTIONS.forEach((sec: LegalSection) => {
      const chName = sec.chapter || 'Chapter General';
      const existing = chapterMap.get(chName) || [];
      existing.push(sec);
      chapterMap.set(chName, existing);
    });

    const chapters: ConstitutionChapter[] = [];
    let idx = 1;
    chapterMap.forEach((sections, chTitle) => {
      chapters.push({
        id: `ch_${idx}`,
        number: `Chapter ${idx}`,
        title: chTitle,
        sectionRange: `s. ${sections[0]?.sectionNumber || 1} - ${sections[sections.length - 1]?.sectionNumber || 320}`,
        sections: sections.map((s) => ({
          id: s.id,
          sectionNumber: String(s.sectionNumber),
          title: s.title,
          officialText: s.verbatimText,
          plainEnglishExplanation: s.plainLanguageSummary,
          practicalTakeaway: s.keyTakeaway,
          chapter: s.chapter,
          keywords: s.categories,
        })),
      });
      idx++;
    });

    return chapters;
  }

  async getSectionById(id: string): Promise<ConstitutionSection | null> {
    const found = CONSTITUTION_SECTIONS.find((s) => s.id === id || `s${s.sectionNumber}` === id);
    if (!found) return null;
    return {
      id: found.id,
      sectionNumber: String(found.sectionNumber),
      title: found.title,
      officialText: found.verbatimText,
      plainEnglishExplanation: found.plainLanguageSummary,
      practicalTakeaway: found.keyTakeaway,
      chapter: found.chapter,
      keywords: found.categories,
    };
  }

  async searchSections(query: string): Promise<ConstitutionSection[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results = CONSTITUTION_SECTIONS.filter(
      (s: LegalSection) =>
        s.title.toLowerCase().includes(q) ||
        String(s.sectionNumber).includes(q) ||
        s.plainLanguageSummary.toLowerCase().includes(q) ||
        s.categories.some((c: string) => c.toLowerCase().includes(q))
    );
    return results.map((s: LegalSection) => ({
      id: s.id,
      sectionNumber: String(s.sectionNumber),
      title: s.title,
      officialText: s.verbatimText,
      plainEnglishExplanation: s.plainLanguageSummary,
      practicalTakeaway: s.keyTakeaway,
      chapter: s.chapter,
      keywords: s.categories,
    }));
  }

  async getBookmarks(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  async toggleBookmark(sectionId: string): Promise<boolean> {
    const current = await this.getBookmarks();
    const exists = current.includes(sectionId);
    const next = exists ? current.filter((id) => id !== sectionId) : [...current, sectionId];
    await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
    return !exists;
  }
}

// ─── Lawyer Repository Mock ───────────────────────────────────────────────────

export class MockLawyerRepository implements ILawyerRepository {
  async getLawyers(filters?: LawyerFilters): Promise<LawyerProfile[]> {
    return marketplaceService.listLawyers(filters);
  }

  async getLawyerById(id: string): Promise<LawyerProfile | null> {
    return marketplaceService.getLawyer(id);
  }

  async getApplication(): Promise<LawyerApplication | null> {
    return marketplaceService.getMyApplication();
  }

  async saveApplicationDraft(app: Partial<LawyerApplication>): Promise<LawyerApplication> {
    return marketplaceService.saveApplicationDraft(app);
  }

  async submitApplication(app: LawyerApplication): Promise<LawyerApplication> {
    return marketplaceService.submitApplication(app.id);
  }

  async getRequests(): Promise<ConsultationRequest[]> {
    return marketplaceService.listMyRequests();
  }

  async createRequest(
    request: Omit<ConsultationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<ConsultationRequest> {
    return marketplaceService.createConsultationRequest({
      lawyerId: request.lawyerId,
      practiceArea: request.practiceArea,
      issueDescription: request.issueDescription,
      contactPreference: request.contactPreference,
      urgency: request.urgency,
    });
  }

  async updateRequestStatus(
    requestId: string,
    status: ConsultationRequest['status'],
    reason?: string
  ): Promise<ConsultationRequest> {
    const action = status === 'accepted' ? 'accept' : 'decline';
    return marketplaceService.respondToRequest(requestId, action, reason);
  }
}

// ─── Transaction Repository Mock ──────────────────────────────────────────────

export class MockTransactionRepository implements ITransactionRepository {
  private async loadStored(): Promise<Transaction[]> {
    const raw = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (!raw) {
      const initial: Transaction = {
        id: 'tx_demo_01',
        requestId: 'req_001',
        clientId: 'local_user_1',
        clientName: 'Demo Client',
        lawyerId: 'lawyer_001',
        lawyerName: 'Adaeze Okonkwo',
        serviceTitle: 'Tenancy Notice & Eviction Defense',
        amountNgn: 45000,
        platformFeeNgn: 4500,
        totalNgn: 49500,
        state: 'PAYMENT_SECURED',
        stateHistory: [
          { state: 'REQUESTED', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Request initiated' },
          { state: 'LAWYER_ACCEPTED', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Lawyer accepted case' },
          { state: 'PAYMENT_PENDING', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'Invoice generated' },
          { state: 'PAYMENT_SECURED', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'Held in escrow' },
        ],
        escrowReleaseApprovedByClient: false,
        escrowReleaseApprovedByLawyer: false,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify([initial]));
      return [initial];
    }
    return JSON.parse(raw);
  }

  private async saveStored(txs: Transaction[]): Promise<void> {
    await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(txs));
  }

  async getTransactions(userId?: string): Promise<Transaction[]> {
    const txs = await this.loadStored();
    if (!userId) return txs;
    return txs.filter((t) => t.clientId === userId || t.lawyerId === userId);
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    const txs = await this.loadStored();
    return txs.find((t) => t.id === id) || null;
  }

  async createTransaction(
    requestId: string,
    lawyerId: string,
    amountNgn: number
  ): Promise<Transaction> {
    const txs = await this.loadStored();
    const platformFee = Math.round(amountNgn * 0.1);
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      requestId,
      clientId: 'local_user_1',
      clientName: 'Client',
      lawyerId,
      lawyerName: 'Assigned Lawyer',
      serviceTitle: 'Legal Consultation',
      amountNgn,
      platformFeeNgn: platformFee,
      totalNgn: amountNgn + platformFee,
      state: 'REQUESTED',
      stateHistory: [{ state: 'REQUESTED', timestamp: new Date().toISOString() }],
      escrowReleaseApprovedByClient: false,
      escrowReleaseApprovedByLawyer: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    txs.unshift(newTx);
    await this.saveStored(txs);
    return newTx;
  }

  async transitionState(
    transactionId: string,
    nextState: TransactionState,
    note?: string
  ): Promise<Transaction> {
    const txs = await this.loadStored();
    const tx = txs.find((t) => t.id === transactionId);
    if (!tx) throw new Error(`Transaction ${transactionId} not found`);

    const allowed = TRANSACTION_TRANSITIONS[tx.state] || [];
    if (!allowed.includes(nextState)) {
      throw new Error(`Invalid transition from ${tx.state} to ${nextState}`);
    }

    tx.state = nextState;
    tx.updatedAt = new Date().toISOString();
    tx.stateHistory.push({
      state: nextState,
      timestamp: new Date().toISOString(),
      note,
    });

    if (nextState === 'CLIENT_CONFIRMED') {
      tx.escrowReleaseApprovedByClient = true;
    }
    if (nextState === 'LAWYER_CONFIRMED') {
      tx.escrowReleaseApprovedByLawyer = true;
    }

    await this.saveStored(txs);
    return tx;
  }

  async createDispute(
    transactionId: string,
    reason: Dispute['reason'],
    description: string,
    attachmentUris: string[]
  ): Promise<Dispute> {
    const raw = await AsyncStorage.getItem(DISPUTES_STORAGE_KEY);
    const disputes: Dispute[] = raw ? JSON.parse(raw) : [];

    const newDispute: Dispute = {
      id: `disp_${Date.now()}`,
      transactionId,
      openedByUserId: 'local_user_1',
      reason,
      description,
      attachmentUris,
      status: 'opened',
      createdAt: new Date().toISOString(),
    };

    disputes.unshift(newDispute);
    await AsyncStorage.setItem(DISPUTES_STORAGE_KEY, JSON.stringify(disputes));

    try {
      await this.transitionState(transactionId, 'DISPUTED', `Dispute opened: ${reason}`);
    } catch {
      // ignore
    }

    return newDispute;
  }

  async getDisputes(userId?: string): Promise<Dispute[]> {
    const raw = await AsyncStorage.getItem(DISPUTES_STORAGE_KEY);
    const disputes: Dispute[] = raw ? JSON.parse(raw) : [];
    if (!userId) return disputes;
    return disputes.filter((d) => d.openedByUserId === userId);
  }
}

// ─── Support Repository Mock ──────────────────────────────────────────────────

export class MockSupportRepository implements ISupportRepository {
  async submitTicket(
    ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<SupportTicket> {
    const raw = await AsyncStorage.getItem(SUPPORT_TICKETS_KEY);
    const tickets: SupportTicket[] = raw ? JSON.parse(raw) : [];

    const newTicket: SupportTicket = {
      id: `tick_${Date.now()}`,
      userId: ticket.userId,
      category: ticket.category,
      subject: ticket.subject,
      message: ticket.message,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [
        {
          sender: 'support',
          message: 'Thank you for contacting Rights Compass support. An agent will review your request shortly.',
          sentAt: new Date().toISOString(),
        },
      ],
    };

    tickets.unshift(newTicket);
    await AsyncStorage.setItem(SUPPORT_TICKETS_KEY, JSON.stringify(tickets));
    return newTicket;
  }

  async getTickets(userId?: string): Promise<SupportTicket[]> {
    const raw = await AsyncStorage.getItem(SUPPORT_TICKETS_KEY);
    const tickets: SupportTicket[] = raw ? JSON.parse(raw) : [];
    if (!userId) return tickets;
    return tickets.filter((t) => t.userId === userId);
  }
}
