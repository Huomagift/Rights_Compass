import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  reconcileLocalAndRemoteProfile,
  saveStoredProfile,
} from './offlineStorage';

export interface DraftOnboardingData {
  step: number; // 0: Welcome, 1: Name & Phone, 2: Topics, 3: Daily Routine Time, 4: Learning Reminder, 5: Disclaimer
  name: string;
  phone: string;
  preferredTime: string;
  selectedDomains: string[];
  learningReminderEnabled: boolean;
  learningReminderTime: string;
  dailyCommitmentMinutes?: number; // 2, 5, or 10 min
  consentChecked: boolean;
}

const DRAFT_STORAGE_KEY = '@rights_compass_onboarding_draft';

export const DEFAULT_DRAFT_ONBOARDING: DraftOnboardingData = {
  step: 0,
  name: 'Alex',
  phone: '',
  preferredTime: '08:00 AM',
  selectedDomains: ['police', 'tenancy'],
  learningReminderEnabled: true,
  learningReminderTime: '07:00 PM',
  dailyCommitmentMinutes: 5,
  consentChecked: false,
};

/**
 * Save draft onboarding step and form state to AsyncStorage.
 * Allows mid-onboarding resumption if app is closed.
 */
export const saveDraftProgress = async (draft: DraftOnboardingData): Promise<void> => {
  try {
    await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch (e) {
    console.error('Failed to save draft onboarding progress', e);
  }
};

/**
 * Retrieve saved draft onboarding progress
 */
export const getDraftProgress = async (): Promise<DraftOnboardingData | null> => {
  try {
    const raw = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as DraftOnboardingData;
    }
  } catch (e) {
    console.error('Failed to load draft onboarding progress', e);
  }
  return null;
};

/**
 * Clear draft onboarding progress upon successful completion
 */
export const clearDraftProgress = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear draft onboarding progress', e);
  }
};

/**
 * Complete Onboarding:
 * 1. Save profile to local AsyncStorage instantly.
 * 2. Clear mid-onboarding draft state.
 */
export const completeOnboarding = async (
  draft: DraftOnboardingData
): Promise<{ success: boolean; error?: string }> => {
  try {
    const consentTime = new Date().toISOString();

    await saveStoredProfile({
      name: draft.name.trim() || 'Alex',
      phoneNumber: draft.phone.trim(),
      preferredTime: draft.preferredTime || '08:00 AM',
      interests: draft.selectedDomains || ['police', 'tenancy'],
      learningReminderEnabled: draft.learningReminderEnabled ?? true,
      learningReminderTime: draft.learningReminderTime || '07:00 PM',
      dailyCommitmentMinutes: draft.dailyCommitmentMinutes || 5,
      onboarded: true,
      consentStatus: true,
      consentTimestamp: consentTime,
    });

    await clearDraftProgress();

    return { success: true };
  } catch (err: any) {
    console.error('Error completing onboarding:', err);
    return { success: false, error: err?.message };
  }
};

/**
 * Check overall onboarding status for app boot routing.
 */
export const checkOnboardingStatus = async (): Promise<{
  onboarded: boolean;
  step: number;
  draft?: DraftOnboardingData;
}> => {
  const profile = await reconcileLocalAndRemoteProfile();
  if (profile.onboarded) {
    return { onboarded: true, step: 5 };
  }

  const draft = await getDraftProgress();
  if (draft && draft.step > 0) {
    return { onboarded: false, step: draft.step, draft };
  }

  return { onboarded: false, step: 0 };
};

