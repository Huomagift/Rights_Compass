import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  preferredTime: string; // e.g. "08:00"
  phoneNumber?: string;
  onboarded: boolean;
  streakCount: number;
  lastOpenedDate: string; // YYYY-MM-DD
  interests: string[];
}

const USER_PROFILE_KEY = '@rights_compass_user_profile';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex',
  preferredTime: '08:00',
  onboarded: false,
  streakCount: 12,
  lastOpenedDate: new Date().toISOString().split('T')[0],
  interests: ['Police Stops', 'Tenant Rights', 'Employment Law'],
};

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

export const saveStoredProfile = async (profile: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const current = await getStoredProfile();
    const updated = { ...current, ...profile };
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save user profile to storage', e);
    return { ...DEFAULT_PROFILE, ...profile };
  }
};

export const resetStoredProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  } catch (e) {
    console.error('Failed to reset user profile', e);
  }
};
