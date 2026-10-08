import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../utils/supabase';

const USER_PROFILE_KEY = '@rights_compass_user_profile';

/**
 * Ensures an active Supabase Auth session exists.
 * Restores existing session or creates an anonymous auth session for device identity.
 */
export const ensureAuthSession = async (): Promise<User | null> => {
  if (!isSupabaseConfigured) {
    return null;
  }
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
      await AsyncStorage.removeItem(VERIFIED_PHONE_KEY);
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

// ==========================================
// MOCK PHONE & WHATSAPP OTP AUTH GATEWAY
// ==========================================

const VERIFIED_PHONE_KEY = '@rights_compass_verified_phone';
const OTP_ATTEMPTS_MAP = new Map<string, { count: number; lockedUntil?: number }>();
export const MOCK_VALID_OTP = '123456';
export const MOCK_EXPIRED_OTP = '000000';
export const LOCKOUT_DURATION_MS = 30000; // 30 seconds
export const OTP_EXPIRY_SECONDS = 60; // 60 seconds countdown

export interface OtpVerificationResult {
  success: boolean;
  error?: string;
  isExpired?: boolean;
  isLockedOut?: boolean;
  attemptsRemaining?: number;
  lockoutRemainingSeconds?: number;
}

/**
 * Send a mock OTP code via WhatsApp or SMS
 */
export const sendPhoneOtp = async (phone: string): Promise<{ success: boolean; channel: 'whatsapp'; error?: string }> => {
  const cleanPhone = phone.trim();
  if (!cleanPhone || cleanPhone.length < 9) {
    return { success: false, channel: 'whatsapp', error: 'Please enter a valid phone number' };
  }

  // Artificial short delay to simulate network request
  await new Promise((r) => setTimeout(r, 400));

  const lockout = getLockoutRemaining(cleanPhone);
  if (lockout > 0) {
    return {
      success: false,
      channel: 'whatsapp',
      error: `Too many attempts. Please wait ${lockout}s before requesting a new code.`,
    };
  }

  return {
    success: true,
    channel: 'whatsapp',
  };
};

/**
 * Get remaining lockout seconds for a phone number
 */
export const getLockoutRemaining = (phone: string): number => {
  const record = OTP_ATTEMPTS_MAP.get(phone.trim());
  if (!record || !record.lockedUntil) return 0;
  const remainingMs = record.lockedUntil - Date.now();
  if (remainingMs <= 0) {
    OTP_ATTEMPTS_MAP.delete(phone.trim());
    return 0;
  }
  return Math.ceil(remainingMs / 1000);
};

/**
 * Verify 6-digit OTP code against mock authentication state
 * Locked decisions from docs/PROJECT_RULES.md:
 * - Fixed mock code '123456' always succeeds
 * - '000000' simulates expired code
 * - 3 failed attempts triggers a 30s lockout
 */
export const verifyPhoneOtp = async (phone: string, otp: string): Promise<OtpVerificationResult> => {
  const cleanPhone = phone.trim();
  const cleanOtp = otp.trim();

  // Artificial delay for realistic verification feedback
  await new Promise((r) => setTimeout(r, 450));

  // Check existing lockout
  const remainingLockout = getLockoutRemaining(cleanPhone);
  if (remainingLockout > 0) {
    return {
      success: false,
      isLockedOut: true,
      lockoutRemainingSeconds: remainingLockout,
      error: `Account temporarily locked due to repeated incorrect entries. Try again in ${remainingLockout}s.`,
    };
  }

  // Check expired test code
  if (cleanOtp === MOCK_EXPIRED_OTP) {
    return {
      success: false,
      isExpired: true,
      error: 'This verification code has expired. Please request a new code.',
    };
  }

  // Check valid code
  if (cleanOtp === MOCK_VALID_OTP) {
    // Clear attempt counters on success
    OTP_ATTEMPTS_MAP.delete(cleanPhone);
    try {
      await AsyncStorage.setItem(VERIFIED_PHONE_KEY, JSON.stringify({
        phoneNumber: cleanPhone,
        verifiedAt: new Date().toISOString(),
      }));
    } catch {}

    return { success: true };
  }

  // Handle incorrect code attempt tracking
  const currentRecord = OTP_ATTEMPTS_MAP.get(cleanPhone) || { count: 0 };
  const newCount = currentRecord.count + 1;

  if (newCount >= 3) {
    const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    OTP_ATTEMPTS_MAP.set(cleanPhone, { count: newCount, lockedUntil });
    return {
      success: false,
      isLockedOut: true,
      lockoutRemainingSeconds: 30,
      attemptsRemaining: 0,
      error: 'Too many incorrect attempts. Account locked for 30 seconds.',
    };
  }

  OTP_ATTEMPTS_MAP.set(cleanPhone, { count: newCount });
  const remaining = 3 - newCount;
  return {
    success: false,
    attemptsRemaining: remaining,
    error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
  };
};

/**
 * Check if the current user session has a verified phone
 */
export const isPhoneVerified = async (): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem(VERIFIED_PHONE_KEY);
    return !!raw;
  } catch {
    return false;
  }
};
