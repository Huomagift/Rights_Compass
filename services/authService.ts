import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

const USER_PROFILE_KEY = '@rights_compass_user_profile';

/**
 * Ensures an active Supabase Auth session exists.
 * Restores existing session or creates an anonymous auth session for device identity.
 */
export const ensureAuthSession = async (): Promise<User | null> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.warn('Error fetching Supabase auth session:', sessionError);
    }

    if (session?.user) {
      return session.user;
    }

    // No existing session: Create anonymous user session
    const { data: authData, error: signInError } = await supabase.auth.signInAnonymously();

    if (signInError) {
      console.warn('Anonymous sign-in warning (falling back to offline mode):', signInError.message);
      return null;
    }

    return authData.user ?? null;
  } catch (err) {
    console.error('Failed to ensure Supabase auth session:', err);
    return null;
  }
};

/**
 * Sign out the current user and clear local data cache.
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.error('Error signing out from Supabase:', e);
  } finally {
    try {
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
    } catch {}
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
};

/**
 * Listen for auth state changes (session restoration)
 */
export const subscribeToAuthChanges = (
  callback: (event: string, session: Session | null) => void
) => {
  return supabase.auth.onAuthStateChange(callback);
};
