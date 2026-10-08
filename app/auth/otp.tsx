import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Sun,
  Moon,
  Phone,
  Shield,
  Check,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { StepOtp } from '../../components/onboarding/StepOtp';
import { sendPhoneOtp } from '../../services/authService';

export default function StandaloneOtpScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ phone?: string; returnTo?: string }>();

  const [phoneNumber, setPhoneNumber] = useState(params.phone || '');
  const [isPhoneSubmitted, setIsPhoneSubmitted] = useState(!!params.phone && params.phone.length >= 10);
  const [isSending, setIsSending] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const isDesktop = width >= 640;

  const handleSendCode = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setPhoneError('Please enter a valid phone number (at least 10 digits).');
      return;
    }
    setIsSending(true);
    setPhoneError(null);
    try {
      const res = await sendPhoneOtp(phoneNumber);
      if (res.success) {
        setIsPhoneSubmitted(true);
      } else {
        setPhoneError(res.error || 'Failed to send WhatsApp code.');
      }
    } catch {
      setPhoneError('Network error. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpSuccess = () => {
    if (params.returnTo) {
      router.replace(params.returnTo as any);
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* TOP BAR */}
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <View style={styles.topBarContent}>
            <TouchableOpacity
              style={[
                styles.navBtn,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
              onPress={() => router.back()}
              activeOpacity={0.7}
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={18} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.topBarTitle, { color: colors.text }]}>
              WhatsApp Authentication
            </Text>

            <TouchableOpacity
              style={[
                styles.navBtn,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
              activeOpacity={0.8}
              onPress={toggleTheme}
              accessibilityLabel="Toggle Theme"
            >
              {isDark ? <Sun size={17} color={colors.text} /> : <Moon size={17} color={colors.text} />}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, isDesktop && styles.desktopScrollContent]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.innerContent, isDesktop && styles.desktopInner]}>
            {!isPhoneSubmitted ? (
              <View style={styles.phoneEntryBox}>
                <View style={styles.iconCircle}>
                  <Phone size={28} color={colors.primary} />
                </View>
                <Text style={[styles.headlineTitle, { color: colors.text }]}>
                  Enter Your Phone Number
                </Text>
                <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
                  We will send a 6-digit WhatsApp verification code to authenticate your session.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>WhatsApp Number</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { backgroundColor: colors.cardWhite, borderColor: colors.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.countryCodeBadge,
                        { backgroundColor: colors.cardBackground, borderColor: colors.border },
                      ]}
                    >
                      <Text style={[styles.countryCodeText, { color: colors.text }]}>🇳🇬 +234</Text>
                    </View>
                    <TextInput
                      style={[styles.textInput, { color: colors.text }]}
                      placeholder="0801 234 5678"
                      placeholderTextColor={colors.textMuted}
                      value={phoneNumber}
                      onChangeText={(val) => {
                        setPhoneNumber(val);
                        setPhoneError(null);
                      }}
                      keyboardType="phone-pad"
                      autoFocus
                    />
                    {phoneNumber.trim().length >= 10 && <Check size={16} color={colors.success} />}
                  </View>
                </View>

                {phoneError && (
                  <Text style={[styles.errorText, { color: colors.error }]}>{phoneError}</Text>
                )}

                <View
                  style={[
                    styles.privacyCard,
                    { backgroundColor: colors.cardBackground, borderColor: colors.border },
                  ]}
                >
                  <Shield size={16} color={colors.success} style={{ marginRight: 8 }} />
                  <Text style={[styles.privacyText, { color: colors.textMuted }]}>
                    Your number is stored locally and used exclusively for your device security.
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    {
                      backgroundColor:
                        phoneNumber.trim().length >= 10 ? colors.primary : colors.cardBackground,
                      borderColor:
                        phoneNumber.trim().length >= 10 ? colors.primary : colors.border,
                    },
                  ]}
                  disabled={phoneNumber.trim().length < 10 || isSending}
                  onPress={handleSendCode}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.submitBtnText,
                      {
                        color: phoneNumber.trim().length >= 10 ? '#FFFFFF' : colors.textMuted,
                      },
                    ]}
                  >
                    {isSending ? 'Sending Code...' : 'Send Verification Code'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <StepOtp
                phone={phoneNumber}
                onSuccess={handleOtpSuccess}
                onChangePhone={() => setIsPhoneSubmitted(false)}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 860,
    width: '100%',
    alignSelf: 'center',
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  desktopScrollContent: {
    paddingVertical: Spacing.xxl,
  },
  innerContent: {
    width: '100%',
    maxWidth: 500,
  },
  desktopInner: {
    maxWidth: 480,
  },
  phoneEntryBox: {
    width: '100%',
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    backgroundColor: 'rgba(235, 94, 40, 0.1)',
  },
  headlineTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  headlineSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 52,
    ...Shadows.sm,
  },
  countryCodeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 13,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  submitBtn: {
    width: '100%',
    height: 50,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
