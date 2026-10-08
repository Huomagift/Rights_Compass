import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useFeatureFlag } from '../config/featureFlags';
import {
  checkOnboardingStatus,
  saveDraftProgress,
  completeOnboarding,
  clearDraftProgress,
  DraftOnboardingData,
} from '../services/onboardingService';
import { marketplaceService } from '../services/marketplaceProvider';
import { saveStoredProfile } from '../services/offlineStorage';
import { sendPhoneOtp } from '../services/authService';

// Modular Step Components
import { StepWelcome } from '../components/onboarding/StepWelcome';
import { StepPhone } from '../components/onboarding/StepPhone';
import { StepOtp } from '../components/onboarding/StepOtp';
import { StepTopics } from '../components/onboarding/StepTopics';
import { StepRoutine } from '../components/onboarding/StepRoutine';
import { StepReminder } from '../components/onboarding/StepReminder';
import { StepConsent } from '../components/onboarding/StepConsent';

const TOTAL_STEPS = 7;
// Step indices:
// 0: Welcome & Value Pillars
// 1: Name & Phone Number Entry
// 2: OTP WhatsApp Verification Gate (MANDATORY)
// 3: Priority Legal Topics
// 4: Daily Routine & Commitment
// 5: Daily Learning Reminder
// 6: Educational Notice & Consent

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ reOnboard?: string }>();
  const isReOnboarding = params.reOnboard === 'true';

  const marketplaceEnabled = useFeatureFlag('MARKETPLACE_ENABLED');
  const [isLawyerPath, setIsLawyerPath] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step state: 0..6
  const [step, setStep] = useState(0);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [preferredTime, setPreferredTime] = useState('08:00 AM');
  const [dailyCommitmentMinutes, setDailyCommitmentMinutes] = useState<number>(5);
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['police', 'tenancy']);
  const [learningReminderEnabled, setLearningReminderEnabled] = useState(true);
  const [learningReminderTime, setLearningReminderTime] = useState('07:00 PM');
  const [consentChecked, setConsentChecked] = useState(false);

  // Animated progress bar & step transition
  const progressAnim = useRef(new Animated.Value(1 / TOTAL_STEPS)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const isDesktop = width >= 640;

  // Step Validations
  const isStep0Valid = true;
  const isStep1Valid = name.trim().length > 0 && phone.trim().length >= 10;
  const isStep2Valid = isOtpVerified; // Hard gate: must pass OTP
  const isStep3Valid = selectedDomains.length > 0;
  const isStep4Valid = preferredTime.length > 0;
  const isStep5Valid = true; // Optional choice
  const isStep6Valid = consentChecked;

  const isCurrentStepValid = (): boolean => {
    switch (step) {
      case 0:
        return isStep0Valid;
      case 1:
        return isStep1Valid;
      case 2:
        return isStep2Valid;
      case 3:
        return isStep3Valid;
      case 4:
        return isStep4Valid;
      case 5:
        return isStep5Valid;
      case 6:
        return isStep6Valid;
      default:
        return true;
    }
  };

  // Animate progress whenever step changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: (step + 1) / TOTAL_STEPS,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.25,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [step, progressAnim, fadeAnim]);

  // Resume mid-onboarding progress or handle re-onboarding
  useEffect(() => {
    async function initOnboarding() {
      try {
        if (isReOnboarding) {
          await clearDraftProgress();
          setStep(0);
          setIsLoading(false);
          return;
        }

        const [status, lawyerApp] = await Promise.all([
          checkOnboardingStatus(),
          marketplaceService.getMyApplication().catch(() => null),
        ]);
        if (status.onboarded || (lawyerApp != null && lawyerApp.status !== 'draft')) {
          router.replace('/(tabs)' as any);
          return;
        }

        if (status.draft && status.draft.step > 0) {
          const draft = status.draft;
          setStep(draft.step);
          if (draft.name) setName(draft.name);
          if (draft.phone !== undefined) setPhone(draft.phone);
          if (draft.isOtpVerified !== undefined) setIsOtpVerified(draft.isOtpVerified);
          if (draft.isLawyerPath !== undefined) setIsLawyerPath(draft.isLawyerPath);
          if (draft.preferredTime) setPreferredTime(draft.preferredTime);
          if (draft.dailyCommitmentMinutes) setDailyCommitmentMinutes(draft.dailyCommitmentMinutes);
          if (draft.selectedDomains) setSelectedDomains(draft.selectedDomains);
          if (draft.learningReminderEnabled !== undefined)
            setLearningReminderEnabled(draft.learningReminderEnabled);
          if (draft.learningReminderTime)
            setLearningReminderTime(draft.learningReminderTime);
          if (draft.consentChecked !== undefined)
            setConsentChecked(draft.consentChecked);
        }
      } catch (err) {
        console.error('Error checking onboarding status:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initOnboarding();
  }, [router, isReOnboarding]);

  const updateDraft = (newStep: number, overrides?: Partial<DraftOnboardingData>) => {
    const currentData: DraftOnboardingData = {
      step: newStep,
      name,
      phone,
      isOtpVerified,
      isLawyerPath,
      preferredTime,
      dailyCommitmentMinutes,
      selectedDomains,
      learningReminderEnabled,
      learningReminderTime,
      consentChecked,
      ...overrides,
    };
    saveDraftProgress(currentData);
  };

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    updateDraft(nextStep);
  };

  const handleNext = async () => {
    if (!isCurrentStepValid()) return;

    // Transitioning from Phone Entry (Step 1) to OTP (Step 2): Trigger OTP dispatch
    if (step === 1 && !isOtpVerified) {
      await sendPhoneOtp(phone);
      goToStep(2);
      return;
    }

    if (step < TOTAL_STEPS - 1) {
      goToStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      goToStep(step - 1);
    }
  };

  const toggleDomain = (id: string) => {
    let updated: string[];
    if (selectedDomains.includes(id)) {
      updated = selectedDomains.filter((d) => d !== id);
    } else {
      updated = [...selectedDomains, id];
    }
    setSelectedDomains(updated);
    updateDraft(step, { selectedDomains: updated });
  };

  const handleOtpVerified = () => {
    setIsOtpVerified(true);
    updateDraft(2, { isOtpVerified: true });
    // Auto-advance to topics step upon successful OTP validation
    setTimeout(() => {
      goToStep(3);
    }, 400);
  };

  const handleFinish = async () => {
    if (!consentChecked || isSubmitting) return;

    setIsSubmitting(true);

    await completeOnboarding({
      step: 6,
      name: name.trim() || 'Alex',
      phone: phone.trim(),
      isOtpVerified: true,
      isLawyerPath,
      preferredTime,
      dailyCommitmentMinutes,
      selectedDomains,
      learningReminderEnabled,
      learningReminderTime,
      consentChecked: true,
      syncedToSupabase: true,
    });

    await saveStoredProfile({
      name: name.trim() || 'Alex',
      phoneNumber: phone.trim(),
      preferredTime,
      interests: selectedDomains,
      onboarded: true,
      consentStatus: true,
      consentTimestamp: new Date().toISOString(),
      syncedToSupabase: true,
    });

    setIsSubmitting(false);

    // If lawyer track was chosen, navigate to application flow
    if (marketplaceEnabled && isLawyerPath) {
      router.replace('/lawyer-application' as any);
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* TOP BAR WITH PROGRESS TRACK & THEME SWITCH */}
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <View style={styles.topBarContent}>
            <TouchableOpacity
              style={[
                styles.navBtn,
                {
                  opacity: step > 0 ? 1 : 0,
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
              disabled={step === 0}
              onPress={handleBack}
              activeOpacity={0.7}
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={18} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.progressTrackWrapper}>
              <View
                style={[
                  styles.progressBarTrack,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor: colors.primary,
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.topRightGroup}>
              <TouchableOpacity
                style={[
                  styles.navBtn,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.8}
                onPress={toggleTheme}
                accessibilityLabel="Toggle Theme"
              >
                {isDark ? (
                  <Sun size={17} color={colors.text} />
                ) : (
                  <Moon size={17} color={colors.text} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* STEP CONTENT CONTAINER */}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && styles.desktopScrollContent,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.innerContentContainer,
              isDesktop && styles.desktopInnerContainer,
              { opacity: fadeAnim },
            ]}
          >
            {/* STEP 0: WELCOME & MASCOT INTRO */}
            {step === 0 && (
              <StepWelcome
                onStart={handleNext}
                onAlreadyHaveAccount={() => router.push('/auth/otp' as any)}
              />
            )}

            {/* STEP 1: PERSONAL INFORMATION */}
            {step === 1 && (
              <StepPhone
                name={name}
                onChangeName={(val) => {
                  setName(val);
                  updateDraft(1, { name: val });
                }}
                phone={phone}
                onChangePhone={(val) => {
                  setPhone(val);
                  updateDraft(1, { phone: val });
                }}
                isLawyerPath={isLawyerPath}
                onToggleLawyerPath={(val) => {
                  setIsLawyerPath(val);
                  updateDraft(1, { isLawyerPath: val });
                }}
                marketplaceEnabled={marketplaceEnabled}
              />
            )}

            {/* STEP 2: WHATSAPP OTP VERIFICATION GATE */}
            {step === 2 && (
              <StepOtp
                phone={phone}
                onSuccess={handleOtpVerified}
                onChangePhone={() => goToStep(1)}
              />
            )}

            {/* STEP 3: PRIORITY LEGAL INTERESTS */}
            {step === 3 && (
              <StepTopics
                selectedDomains={selectedDomains}
                onToggleDomain={toggleDomain}
              />
            )}

            {/* STEP 4: DAILY ROUTINE */}
            {step === 4 && (
              <StepRoutine
                preferredTime={preferredTime}
                onSelectTime={(time) => {
                  setPreferredTime(time);
                  updateDraft(4, { preferredTime: time });
                }}
                dailyCommitmentMinutes={dailyCommitmentMinutes}
                onSelectCommitment={(mins) => {
                  setDailyCommitmentMinutes(mins);
                  updateDraft(4, { dailyCommitmentMinutes: mins });
                }}
              />
            )}

            {/* STEP 5: DAILY LEARNING REMINDER */}
            {step === 5 && (
              <StepReminder
                learningReminderEnabled={learningReminderEnabled}
                onToggleReminder={(enabled) => {
                  setLearningReminderEnabled(enabled);
                  updateDraft(5, { learningReminderEnabled: enabled });
                }}
                learningReminderTime={learningReminderTime}
                onSelectReminderTime={(time) => {
                  setLearningReminderTime(time);
                  updateDraft(5, { learningReminderTime: time });
                }}
              />
            )}

            {/* STEP 6: LEGAL DISCLAIMER & STATUTORY CONSENT */}
            {step === 6 && (
              <StepConsent
                name={name}
                phone={phone}
                isOtpVerified={isOtpVerified}
                preferredTime={preferredTime}
                selectedDomainsCount={selectedDomains.length}
                dailyCommitmentMinutes={dailyCommitmentMinutes}
                learningReminderEnabled={learningReminderEnabled}
                learningReminderTime={learningReminderTime}
                isLawyerPath={isLawyerPath}
                marketplaceEnabled={marketplaceEnabled}
                consentChecked={consentChecked}
                onToggleConsent={(checked) => {
                  setConsentChecked(checked);
                  updateDraft(6, { consentChecked: checked });
                }}
              />
            )}
          </Animated.View>
        </ScrollView>

        {/* STICKY PRIMARY CTA FOOTER (Hidden on Step 2 OTP since StepOtp has auto-advance & custom buttons) */}
        {step !== 2 && (
          <View
            style={[
              styles.bottomFooter,
              { borderTopColor: colors.border, backgroundColor: colors.background },
            ]}
          >
            <View style={[styles.bottomFooterInner, isDesktop && styles.desktopFooterInner]}>
              <TouchableOpacity
                style={[
                  styles.primaryCtaBtn,
                  {
                    backgroundColor: isCurrentStepValid() ? colors.primary : colors.cardBackground,
                    borderColor: isCurrentStepValid() ? colors.primary : colors.border,
                  },
                  !isCurrentStepValid() && styles.primaryCtaDisabled,
                ]}
                disabled={!isCurrentStepValid() || isSubmitting}
                onPress={handleNext}
                activeOpacity={0.85}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <View style={styles.ctaContentRow}>
                    <Text
                      style={[
                        styles.primaryCtaText,
                        { color: isCurrentStepValid() ? '#FFFFFF' : colors.textMuted },
                      ]}
                    >
                      {step === 0 && 'Get Started with Aegis'}
                      {step === 1 && 'Send WhatsApp Code'}
                      {step === 3 && `Continue (${selectedDomains.length} Selected)`}
                      {step === 4 && 'Continue'}
                      {step === 5 && 'Continue to Disclaimer'}
                      {step === 6 && 'Complete Setup & Enter'}
                    </Text>
                    <ArrowRight
                      size={18}
                      color={isCurrentStepValid() ? '#FFFFFF' : colors.textMuted}
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  progressTrackWrapper: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  topRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  desktopScrollContent: {
    paddingVertical: Spacing.xl,
  },
  innerContentContainer: {
    width: '100%',
    maxWidth: 540,
  },
  desktopInnerContainer: {
    maxWidth: 520,
  },
  bottomFooter: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  bottomFooterInner: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  desktopFooterInner: {
    maxWidth: 520,
  },
  primaryCtaBtn: {
    width: '100%',
    height: 52,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  primaryCtaDisabled: {
    opacity: 0.6,
  },
  ctaContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
