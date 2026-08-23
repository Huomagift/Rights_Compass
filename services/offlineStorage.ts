import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';
import { ensureAuthSession } from './authService';

export interface UserProfile {
  name: string;
  preferredTime: string; // e.g. "08:00 AM"
  phoneNumber?: string;
  onboarded: boolean;
  streakCount: number;
  lastOpenedDate: string; // YYYY-MM-DD
  interests: string[];
  consentStatus?: boolean;
  consentTimestamp?: string;
  syncedToSupabase?: boolean;
}

const USER_PROFILE_KEY = '@rights_compass_user_profile';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex',
  preferredTime: '08:00 AM',
  phoneNumber: '',
  onboarded: false,
  streakCount: 1,
  lastOpenedDate: '',
  interests: ['police', 'tenancy'],
  consentStatus: false,
  consentTimestamp: undefined,
  syncedToSupabase: false,
};

/**
 * Read profile from local AsyncStorage cache
 */
export const getStoredProfile = async (): Promise<UserProfile> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
  } catch (e) {
    console.error('Failed to load user profile from storage', e);
  }
  return DEFAULT_PROFILE;
};

/**
 * Sync local profile outward to Supabase when network is available.
 * Creates/updates profiles and user_preferences rows.
 */
export const syncProfileToSupabase = async (profile: UserProfile): Promise<boolean> => {
  try {
    const user = await ensureAuthSession();
    if (!user) return false;

    const consentTime = profile.consentTimestamp || new Date().toISOString();

    // 1. Upsert into public.profiles
    const { error: profileError } = await (supabase as any)
      .from('profiles')
      .upsert(
        {
          id: user.id,
          name: profile.name.trim() || 'Alex',
          whatsapp_number: profile.phoneNumber?.trim() || null,
          onboarding_status: profile.onboarded ? 'completed' : 'in_progress',
          consent_status: profile.consentStatus ?? profile.onboarded,
          consent_timestamp: consentTime,
        },
        { onConflict: 'id' }
      );

    if (profileError) {
      console.warn('Supabase profile sync warning:', profileError.message);
      return false;
    }

    // 2. Upsert into public.user_preferences (separate table)
    // Check if preference row already exists for this profile_id
    const { data: existingPref } = await (supabase as any)
      .from('user_preferences')
      .select('id')
      .eq('profile_id', user.id)
      .maybeSingle();

    if (existingPref) {
      await (supabase as any)
        .from('user_preferences')
        .update({
          preferred_lesson_time: profile.preferredTime,
          priority_rights: profile.interests,
        })
        .eq('id', existingPref.id);
    } else {
      await (supabase as any)
        .from('user_preferences')
        .insert({
          profile_id: user.id,
          preferred_lesson_time: profile.preferredTime,
          priority_rights: profile.interests,
        });
    }

    return true;
  } catch (err) {
    console.warn('Network error syncing profile outward to Supabase:', err);
    return false;
  }
};

/**
 * Save profile: Writes to AsyncStorage IMMEDIATELY (instant local UI),
 * then triggers outward sync to Supabase asynchronously.
 */
export const saveStoredProfile = async (profile: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const current = await getStoredProfile();
    const updated: UserProfile = { ...current, ...profile };

    // 1. Write to local AsyncStorage cache immediately (works offline & fast)
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));

    // 2. Async outward sync to Supabase (non-blocking)
    syncProfileToSupabase(updated).then((synced) => {
      if (synced && !updated.syncedToSupabase) {
        AsyncStorage.setItem(
          USER_PROFILE_KEY,
          JSON.stringify({ ...updated, syncedToSupabase: true })
        ).catch(() => {});
      }
    });

    return updated;
  } catch (e) {
    console.error('Failed to save user profile to storage', e);
    return { ...DEFAULT_PROFILE, ...profile };
  }
};

/**
 * Reconciles local AsyncStorage profile data with remote Supabase profile.
 * - If local data pre-exists (e.g. from before migration), syncs it up to Supabase.
 * - If remote data exists, updates local AsyncStorage cache.
 */
export const reconcileLocalAndRemoteProfile = async (): Promise<UserProfile> => {
  const localProfile = await getStoredProfile();

  try {
    const user = await ensureAuthSession();
    if (!user) return localProfile;

    // Fetch remote profile
    const { data: remoteProfile } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (remoteProfile) {
      // Fetch remote preferences
      const { data: remotePref } = await (supabase as any)
        .from('user_preferences')
        .select('*')
        .eq('profile_id', user.id)
        .maybeSingle();

      const mergedProfile: UserProfile = {
        ...localProfile,
        name: remoteProfile.name || localProfile.name,
        phoneNumber: remoteProfile.whatsapp_number || localProfile.phoneNumber || '',
        onboarded: remoteProfile.onboarding_status === 'completed' || localProfile.onboarded,
        consentStatus: remoteProfile.consent_status,
        consentTimestamp: remoteProfile.consent_timestamp || localProfile.consentTimestamp,
        preferredTime: remotePref?.preferred_lesson_time || localProfile.preferredTime,
        interests: remotePref?.priority_rights || localProfile.interests,
        syncedToSupabase: true,
      };

      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(mergedProfile));
      return mergedProfile;
    } else if (localProfile.onboarded) {
      // Local profile pre-exists from before migration -> push to Supabase now
      await syncProfileToSupabase(localProfile);
    }
  } catch (err) {
    console.warn('Reconciliation fallback to local storage:', err);
  }

  return localProfile;
};

/**
 * Delete profile from local device and Supabase (NDPR compliance request)
 */
export const resetStoredProfile = async (): Promise<void> => {
  try {
    const user = await ensureAuthSession();
    if (user) {
      await supabase.from('profiles').delete().eq('id', user.id);
    }
  } catch (e) {
    console.warn('Error deleting remote profile on reset:', e);
  } finally {
    try {
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
      await AsyncStorage.removeItem('@rights_compass_onboarding_draft');
    } catch (e) {
      console.error('Failed to reset local user profile', e);
    }
  }
};

/**
 * Completely clear local storage keys for fresh onboarding testing.
 */
export const clearAllLocalStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      USER_PROFILE_KEY,
      '@rights_compass_onboarding_draft',
    ]);
  } catch (e) {
    console.error('Failed to clear local storage:', e);
  }
};

/**
 * Calculates and reconciles the user's daily streak based on calendar dates.
 * - Same day (0 days diff): Maintains streak (max 1 daily streak increment per calendar day).
 * - Next day (1 day diff): Increments streak by 1 day.
 * - Missed days (>1 day diff): Resets streak to 1 day.
 */
export const updateDailyStreak = async (): Promise<UserProfile> => {
  const profile = await getStoredProfile();
  const todayStr = new Date().toISOString().split('T')[0];
  const lastDateStr = profile.lastOpenedDate;

  if (!lastDateStr) {
    const updated = await saveStoredProfile({
      streakCount: 1,
      lastOpenedDate: todayStr,
    });
    return updated;
  }

  if (todayStr === lastDateStr) {
    // Already recorded for today — maintain current daily streak count
    return profile;
  }

  // Calculate day difference
  const todayMs = new Date(todayStr).getTime();
  const lastMs = new Date(lastDateStr).getTime();
  const diffDays = Math.round((todayMs - lastMs) / (1000 * 60 * 60 * 24));

  let newStreak = profile.streakCount || 1;

  if (diffDays === 1) {
    // Consecutive calendar day open/quiz -> increment streak by 1
    newStreak += 1;
  } else if (diffDays > 1) {
    // Missed 1 or more days -> reset streak to 1 day
    newStreak = 1;
  } else {
    newStreak = Math.max(1, newStreak);
  }

  const updatedProfile = await saveStoredProfile({
    streakCount: newStreak,
    lastOpenedDate: todayStr,
  });

  return updatedProfile;
};

/**
 * Reset streak manually to Day 1
 */
export const resetStreakToDayOne = async (): Promise<UserProfile> => {
  const todayStr = new Date().toISOString().split('T')[0];
  return await saveStoredProfile({
    streakCount: 1,
    lastOpenedDate: todayStr,
  });
};



