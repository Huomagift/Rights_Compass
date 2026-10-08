import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import {
  verifyPhoneOtp,
  sendPhoneOtp,
  getLockoutRemaining,
  OTP_EXPIRY_SECONDS,
  MOCK_VALID_OTP,
} from '../../services/authService';

interface StepOtpProps {
  phone: string;
  onSuccess: () => void;
  onChangePhone: () => void;
}

export const StepOtp: React.FC<StepOtpProps> = ({
  phone,
  onSuccess,
  onChangePhone,
}) => {
  const { colors } = useTheme();

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  // Timers
  const [resendCountdown, setResendCountdown] = useState(OTP_EXPIRY_SECONDS);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Check initial lockout
  useEffect(() => {
    const lockout = getLockoutRemaining(phone);
    if (lockout > 0) {
      setLockoutRemaining(lockout);
      setErrorMessage(`Account locked. Please wait ${lockout}s.`);
    }
  }, [phone]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCountdown]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          setErrorMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  const handleDigitChange = (index: number, value: string) => {
    if (lockoutRemaining > 0 || isSuccess || isVerifying) return;

    // Handle full paste (e.g. 6 digits pasted into one input)
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 1) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        if (i < cleaned.length) {
          newDigits[i] = cleaned[i];
        }
      }
      setDigits(newDigits);
      setErrorMessage(null);
      if (cleaned.length >= 6) {
        inputRefs.current[5]?.blur();
        submitOtp(newDigits.slice(0, 6).join(''));
      }
      return;
    }

    const singleDigit = cleaned.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = singleDigit;
    setDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance
    if (singleDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are populated
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      submitOtp(fullCode);
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || digits.join('');
    if (code.length < 6 || lockoutRemaining > 0 || isVerifying) return;

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const result = await verifyPhoneOtp(phone, code);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 600);
      } else {
        setErrorMessage(result.error || 'Verification failed. Please try again.');
        if (result.isLockedOut) {
          setLockoutRemaining(result.lockoutRemainingSeconds || 30);
          setDigits(['', '', '', '', '', '']);
        } else if (result.attemptsRemaining !== undefined) {
          setAttemptsRemaining(result.attemptsRemaining);
        }
      }
    } catch {
      setErrorMessage('Network error during verification. Please retry.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || lockoutRemaining > 0 || isVerifying) return;

    setDigits(['', '', '', '', '', '']);
    setErrorMessage(null);
    setIsVerifying(true);

    try {
      const res = await sendPhoneOtp(phone);
      if (res.success) {
        setResendCountdown(OTP_EXPIRY_SECONDS);
        inputRefs.current[0]?.focus();
      } else {
        setErrorMessage(res.error || 'Failed to resend code.');
      }
    } catch {
      setErrorMessage('Network error while resending. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.stepBox}>
      {/* SHIELD BADGE */}
      <View style={styles.headerIconRow}>
        <View
          style={[
            styles.shieldIconContainer,
            {
              backgroundColor: isSuccess ? colors.success + '20' : colors.accentLight,
              borderColor: isSuccess ? colors.success : colors.primary,
            },
          ]}
        >
          {isSuccess ? (
            <CheckCircle2 size={26} color={colors.success} />
          ) : lockoutRemaining > 0 ? (
            <Lock size={26} color={colors.error} />
          ) : (
            <ShieldCheck size={26} color={colors.primary} />
          )}
        </View>
      </View>

      <Text style={[styles.headlineTitle, { color: colors.text }]}>
        {isSuccess ? 'Phone Verified!' : 'Verify Your Phone'}
      </Text>
      <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
        {isSuccess
          ? 'Your WhatsApp number is authenticated.'
          : `We sent a 6-digit verification code to `}
        {!isSuccess && (
          <Text style={{ color: colors.text, fontWeight: '700' }}>
            {phone || '+234 800 000 0000'}
          </Text>
        )}
      </Text>

      {/* MOCK HINT CALLOUT */}
      <View
        style={[
          styles.mockHintBanner,
          { backgroundColor: colors.streakBadgeBg, borderColor: colors.border },
        ]}
      >
        <MessageSquare size={14} color={colors.primary} style={{ marginRight: 6 }} />
        <Text style={[styles.mockHintText, { color: colors.streakBadgeText }]}>
          Mock OTP Mode: Use <Text style={{ fontWeight: '800' }}>{MOCK_VALID_OTP}</Text> to pass, or{' '}
          <Text style={{ fontWeight: '800' }}>000000</Text> for expired state.
        </Text>
      </View>

      {/* 6 PIN BOXES */}
      <View style={styles.pinInputsContainer}>
        {digits.map((digit, index) => {
          const isFocusedCell = !digit && digits.slice(0, index).every((d) => !!d);
          const isFilled = !!digit;
          const isLocked = lockoutRemaining > 0;

          return (
            <View
              key={index}
              style={[
                styles.pinCellWrapper,
                {
                  backgroundColor: isSuccess
                    ? colors.success + '15'
                    : isLocked
                    ? colors.cardBackground
                    : colors.cardWhite,
                  borderColor: isSuccess
                    ? colors.success
                    : errorMessage
                    ? colors.error
                    : isFilled || isFocusedCell
                    ? colors.primary
                    : colors.border,
                  borderWidth: isFilled || isFocusedCell || errorMessage ? 2 : 1,
                },
              ]}
            >
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.pinTextInput,
                  {
                    color: isSuccess ? colors.success : colors.text,
                    opacity: isLocked ? 0.4 : 1,
                  },
                ]}
                value={digit}
                onChangeText={(val) => handleDigitChange(index, val)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={6} // Allow paste on any cell
                editable={!isLocked && !isSuccess && !isVerifying}
                selectTextOnFocus
                textAlign="center"
                autoFocus={index === 0}
              />
            </View>
          );
        })}
      </View>

      {/* VERIFYING SPINNER */}
      {isVerifying && (
        <View style={styles.verifyingRow}>
          <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.verifyingText, { color: colors.primary }]}>
            Verifying code...
          </Text>
        </View>
      )}

      {/* ERROR / LOCKOUT BANNER */}
      {errorMessage && !isVerifying && (
        <View
          style={[
            styles.errorBanner,
            {
              backgroundColor: lockoutRemaining > 0 ? colors.error + '18' : colors.cardBackground,
              borderColor: colors.error,
            },
          ]}
        >
          <AlertTriangle size={16} color={colors.error} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.errorText, { color: colors.error }]}>{errorMessage}</Text>
            {lockoutRemaining > 0 && (
              <Text style={[styles.lockoutSubText, { color: colors.textMuted }]}>
                Cooldown active: retry in {lockoutRemaining} seconds
              </Text>
            )}
          </View>
        </View>
      )}

      {/* RESEND AND CHANGE PHONE ROW */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[
            styles.resendBtn,
            { opacity: resendCountdown > 0 || lockoutRemaining > 0 ? 0.6 : 1 },
          ]}
          disabled={resendCountdown > 0 || lockoutRemaining > 0 || isVerifying}
          onPress={handleResend}
          activeOpacity={0.7}
        >
          <RotateCcw size={14} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={[styles.resendBtnText, { color: colors.primary }]}>
            {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend WhatsApp Code'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.changePhoneBtn}
          onPress={onChangePhone}
          disabled={isVerifying}
          activeOpacity={0.7}
        >
          <Text style={[styles.changePhoneText, { color: colors.textMuted }]}>
            Change number
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepBox: {
    width: '100%',
  },
  headerIconRow: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  shieldIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headlineTitle: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  headlineSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  mockHintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    alignSelf: 'center',
  },
  mockHintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pinInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: Spacing.md,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
  pinCellWrapper: {
    flex: 1,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  pinTextInput: {
    fontSize: 22,
    fontWeight: '800',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  verifyingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  verifyingText: {
    fontSize: 13,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '700',
  },
  lockoutSubText: {
    fontSize: 11,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  changePhoneBtn: {
    paddingVertical: 8,
  },
  changePhoneText: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
