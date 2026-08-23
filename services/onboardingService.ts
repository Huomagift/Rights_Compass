import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveStoredProfile,
  reconcileLocalAndRemoteProfile,
} from './offlineStorage';
import { ensureAuthSession } from './authService';

export interface DraftOnboardingData {
  step: number; // 0: Welcome, 1: Name & Phone, 2: Time, 3: Interests, 4: Consent
  name: string;
  phone: string;
  preferredTime: string;
  selectedDomains: string[];
  consentChecked: boolean;
}

const DRAFT_STORAGE_KEY = '@rights_compass_onboarding_draft';

export const DEFAULT_DRAFT_ONBOARDING: DraftOnboardingData = {
  step: 0,
  name: 'Alex',
  phone: '',
  preferredTime: '08:00 AM',
  selectedDomains: ['police', 'tenancy'],
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
 * 1. Ensure Auth Session is initialized in Supabase.
 * 2. Save profile (writes to local AsyncStorage instantly + outward syncs to profiles and user_preferences in Supabase).
 * 3. Clear mid-onboarding draft state.
 */
export const completeOnboarding = async (
  draft: DraftOnboardingData
): Promise<{ success: boolean; error?: string }> => {
  try {
    // 1. Ensure active Supabase Auth session
    await ensureAuthSession();

    const consentTime = new Date().toISOString();

    // 2. Save profile (writes locally & syncs outward to Supabase profiles & user_preferences)
    await saveStoredProfile({
      name: draft.name.trim() || 'Alex',
      phoneNumber: draft.phone.trim(),
      preferredTime: draft.preferredTime,
      interests: draft.selectedDomains,
      onboarded: true,
      consentStatus: true,
      consentTimestamp: consentTime,
    });

    // 3. Clear draft state
    await clearDraftProgress();

    return { success: true };
  } catch (err: any) {
    console.error('Error completing onboarding:', err);

    // Fallback: Ensure user profile is saved locally so app remains usable offline
    await saveStoredProfile({
      name: draft.name.trim() || 'Alex',
      phoneNumber: draft.phone.trim(),
      preferredTime: draft.preferredTime,
      interests: draft.selectedDomains,
      onboarded: true,
      consentStatus: true,
      consentTimestamp: new Date().toISOString(),
    });
    await clearDraftProgress();

    return { success: true, error: err?.message };
  }
};

/**
 * Check overall onboarding status for app boot routing.
 * Reconciles local and remote profiles.
 */
export const checkOnboardingStatus = async (): Promise<{
  onboarded: boolean;
  step: number;
  draft?: DraftOnboardingData;
}> => {
  const profile = await reconcileLocalAndRemoteProfile();
  if (profile.onboarded) {
    return { onboarded: true, step: 4 };
  }

  const draft = await getDraftProgress();
  if (draft && draft.step > 0) {
    return { onboarded: false, step: draft.step, draft };
  }

  return { onboarded: false, step: 0 };
};
