import {
  IUserRepository,
  ILearningRepository,
  IConstitutionRepository,
  ILawyerRepository,
  ITransactionRepository,
  ISupportRepository,
} from './interfaces';
import {
  MockUserRepository,
  MockLearningRepository,
  MockConstitutionRepository,
  MockLawyerRepository,
  MockTransactionRepository,
  MockSupportRepository,
} from './mockRepositories';

/**
 * Global repository switch:
 * True = frontend operates 100% on typed mock repositories.
 * False = future real backend / Supabase clients.
 */
export const USE_MOCK_REPOSITORIES = true;

// Singleton instances
export const userRepository: IUserRepository = new MockUserRepository();
export const learningRepository: ILearningRepository = new MockLearningRepository();
export const constitutionRepository: IConstitutionRepository = new MockConstitutionRepository();
export const lawyerRepository: ILawyerRepository = new MockLawyerRepository();
export const transactionRepository: ITransactionRepository = new MockTransactionRepository();
export const supportRepository: ISupportRepository = new MockSupportRepository();

export * from './interfaces';
export * from './mockRepositories';
