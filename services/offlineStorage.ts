import AsyncStorage from '@react-native-async-storage/async-storage';

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
  learningReminderEnabled?: boolean;
  learningReminderTime?: string;
  dailyCommitmentMinutes?: number; // 2, 5, or 10 min
  completedLessonIds?: string[];
  currentLevelId?: number;
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
  learningReminderEnabled: true,
  learningReminderTime: '07:00 PM',
  dailyCommitmentMinutes: 5,
  completedLessonIds: [],
  currentLevelId: 1,
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
 * Save profile: Writes to AsyncStorage IMMEDIATELY
 */
export const saveStoredProfile = async (profile: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const current = await getStoredProfile();
    const updated: UserProfile = { ...current, ...profile };
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save user profile to storage', e);
    return { ...DEFAULT_PROFILE, ...profile };
  }
};

/**
 * Check local profile status for app boot routing.
 */
export const reconcileLocalAndRemoteProfile = async (): Promise<UserProfile> => {
  return await getStoredProfile();
};

/**
 * Delete profile from local device (NDPR compliance request)
 */
export const resetStoredProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    await AsyncStorage.removeItem('@rights_compass_onboarding_draft');
  } catch (e) {
    console.error('Failed to reset local user profile', e);
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

/**
 * Record a completed lesson ID and update streak
 */
export const recordCompletedLesson = async (lessonId: string): Promise<UserProfile> => {
  const profile = await updateDailyStreak();
  const currentCompleted = profile.completedLessonIds || [];
  if (!currentCompleted.includes(lessonId)) {
    const updated = await saveStoredProfile({
      completedLessonIds: [...currentCompleted, lessonId],
    });
    return updated;
  }
  return profile;
};
