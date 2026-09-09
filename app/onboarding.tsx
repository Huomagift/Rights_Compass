import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Clock,
  Shield,
  Home,
  Briefcase,
  ShoppingBag,
  Scale,
  Check,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sun,
  Moon,
  User,
  Phone,
  Sparkles,
  Zap,
  Book,
  WifiOff,
  Flame,
  Bot,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import {
  checkOnboardingStatus,
  saveDraftProgress,
  completeOnboarding,
  clearDraftProgress,
} from '../services/onboardingService';

interface DomainOption {
  id: string;
  label: string;
  description: string;
  Icon: any;
}

const DOMAIN_OPTIONS: DomainOption[] = [
  {
    id: 'police',
    label: 'Police Stop & Arrest Rights',
    description: 'Checkpoint rules, search warrants, phone searches & bail rights.',
    Icon: Shield,
  },
  {
    id: 'tenancy',
    label: 'Tenant & Housing Rights',
    description: 'Rent increase limits, valid quit notice periods & landlord obligations.',
    Icon: Home,
  },
  {
    id: 'employment',
    label: 'Employment & Labor Law',
    description: 'Wrongful termination, statutory severance, notice pay & workplace safety.',
    Icon: Briefcase,
  },
  {
    id: 'consumer',
    label: 'Consumer Rights & Refunds',
    description: 'Digital subscriptions, defective items, unfair billing & FCCPA protections.',
    Icon: ShoppingBag,
  },
  {
    id: 'civil',
    label: 'Fundamental Civil Rights',
    description: 'Freedom of expression, peaceful assembly, privacy & fair hearing rights.',
    Icon: Scale,
  },
  {
    id: 'other',
    label: 'General Knowledge',
    description: '',
    Icon: Book,
  }
];

interface TimeOption {
  time: string;
  label: string;
  subtitle: string;
  recommended?: boolean;
}

const TIME_OPTIONS: TimeOption[] = [
  {
    time: '07:00 AM',
    label: 'Early Morning',
    subtitle: 'Start your morning with a 1-minute legal insight',
  },
  {
    time: '08:00 AM',
    label: 'Morning Commute',
    subtitle: 'Recommended • Perfect for your daily routine',
    recommended: true,
  },
  {
    time: '12:00 PM',
    label: 'Midday Break',
    subtitle: 'Quick read during your lunch pause',
  },
  {
    time: '07:00 PM',
    label: 'Evening Review',
    subtitle: 'Wind down and reflect on your daily rights',
  },
];

const TOTAL_STEPS = 5;

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ reOnboard?: string }>();
  const isReOnboarding = params.reOnboard === 'true';

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step state:
  // 0: Welcome & Aegis Introduction
  // 1: Personal Info (Name & WhatsApp Phone)
  // 2: Priority Legal Interests (Areas of interest)
  // 3: Daily Habit Routine (Notification Time)
  // 4: Legal Disclaimer & Consent
  const [step, setStep] = useState(0);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('08:00 AM');
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['police', 'tenancy']);
  const [consentChecked, setConsentChecked] = useState(false);

  // Animated progress bar
  const progressAnim = useRef(new Animated.Value(0.2)).current;
  // Step content fade
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const isDesktop = width >= 640;

  // Step Validations
  const isStep1Valid = name.trim().length > 0 && phone.trim().length >= 10;
  const isStep2Valid = selectedDomains.length > 0;
  const isStep3Valid = preferredTime.length > 0;
  const isStep4Valid = consentChecked;

  const isCurrentStepValid = (): boolean => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return isStep1Valid;
      case 2:
        return isStep2Valid;
      case 3:
        return isStep3Valid;
      case 4:
        return isStep4Valid;
      default:
        return true;
    }
  };

  // Animate progress whenever step changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: (step + 1) / TOTAL_STEPS,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.2,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [step, progressAnim, fadeAnim]);

  // Resume mid-onboarding progress or handle explicit re-onboarding
  useEffect(() => {
    async function initOnboarding() {
      try {
        if (isReOnboarding) {
          await clearDraftProgress();
          setStep(0);
          setIsLoading(false);
          return;
        }

        const status = await checkOnboardingStatus();
        if (status.onboarded) {
          router.replace('/(tabs)' as any);
          return;
        }

        if (status.draft && status.draft.step > 0) {
          setStep(status.draft.step);
          if (status.draft.name) setName(status.draft.name);
          if (status.draft.phone !== undefined) setPhone(status.draft.phone);
          if (status.draft.preferredTime) setPreferredTime(status.draft.preferredTime);
          if (status.draft.selectedDomains) setSelectedDomains(status.draft.selectedDomains);
          if (status.draft.consentChecked !== undefined)
            setConsentChecked(status.draft.consentChecked);
        }
      } catch (err) {
        console.error('Error checking onboarding status:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initOnboarding();
  }, [router, isReOnboarding]);

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
    saveDraftProgress({
      step: nextStep,
      name,
      phone,
      preferredTime,
      selectedDomains,
      consentChecked,
    });
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) return;
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
    saveDraftProgress({
      step,
      name,
      phone,
      preferredTime,
      selectedDomains: updated,
      consentChecked,
    });
  };

  const handleFinish = async () => {
    if (!consentChecked || isSubmitting) return;

    setIsSubmitting(true);

    await completeOnboarding({
      step: 4,
      name: name.trim() || 'Alex',
      phone: phone.trim(),
      preferredTime,
      selectedDomains,
      consentChecked: true,
    });

    setIsSubmitting(false);
    router.replace('/(tabs)' as any);
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
        {/* DUOLINGO-STYLE PROGRESSIVE TOP BAR */}
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <View style={styles.topBarContent}>
            {/* Back button (hidden on first step) */}
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

            {/* Material 3 Progress Bar Track */}
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

            {/* Right Group: Theme Switch & Step Badge */}
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
                accessibilityLabel="Toggle Dark Mode"
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

        {/* STEP CONTENT SCROLLER */}
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
            {/* =================================================== */}
            {/* STEP 0: WELCOME & AEGIS MASCOT INTRODUCTION       */}
            {/* =================================================== */}
            {step === 0 && (
              <View style={styles.stepBox}>
                {/* Brand Logo & Compass Pill */}
                <View style={styles.welcomeBadgeRow}>
                  <Image
                    source={require('../assets/images/rights_compass_logo.png')}
                    style={styles.welcomeLogo}
                    contentFit="contain"
                  />
                  <View
                    style={[
                      styles.compassPill,
                      { backgroundColor: colors.streakBadgeBg, borderColor: colors.border },
                    ]}
                  >
                    <Scale size={12} color={colors.primary} style={{ marginRight: 4 }} />
                    <Text style={[styles.compassPillText, { color: colors.primary }]}>
                      LEGAL CLARITY APP
                    </Text>
                  </View>
                </View>

                <Text style={[styles.headlineTitle, { color: colors.text }]}>
                  Welcome to Rights Compass
                </Text>
                <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
                  Everyday legal rights for everyday Nigerians. Practical, straightforward, and 100% offline.
                </Text>

                {/* DUOLINGO-STYLE AEGIS MASCOT INTRO SPEECH CARD */}
                <View
                  style={[
                    styles.aegisSpeechCard,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.aegisAvatarContainer}>
                    <Image
                      source={require('../assets/images/mascot.png')}
                      style={styles.aegisAvatar}
                      contentFit="cover"
                    />
                    <View style={[styles.aegisSparklePill, { backgroundColor: colors.accent }]}>
                      <Sparkles size={10} color="#FFFFFF" />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.aegisSpeechBubble,
                      {
                        backgroundColor: colors.cardWhite,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.aegisBubbleTail,
                        { borderRightColor: colors.cardWhite },
                      ]}
                    />
                    <View style={styles.aegisNameTag}>
                      <Text style={[styles.aegisNameText, { color: colors.primary }]}>
                        AEGIS • YOUR LEGAL GUIDE
                      </Text>
                    </View>
                    <Text style={[styles.aegisSpeechQuote, { color: colors.text }]}>
                      &quot;Hi! I&apos;m <Text style={{ color: colors.primary, fontWeight: '800' }}>Aegis</Text> 👋 I&apos;ll be right beside you to make complex Nigerian laws and rights clear, practical, and ready whenever you need them!&quot;
                    </Text>
                  </View>
                </View>

                {/* 3 CORE VALUE PILLARS */}
                <View style={styles.valuePillarsGrid}>
                  <View
                    style={[
                      styles.pillarCard,
                      { backgroundColor: colors.cardWhite, borderColor: colors.border },
                    ]}
                  >
                    <View style={[styles.pillarIconCircle, { backgroundColor: colors.accentLight }]}>
                      <Zap size={18} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.pillarTitle, { color: colors.text }]}>
                        1-Minute Daily Lessons
                      </Text>
                      <Text style={[styles.pillarDesc, { color: colors.textMuted }]}>
                        Bite-sized legal literacy you can finish on your morning commute.
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.pillarCard,
                      { backgroundColor: colors.cardWhite, borderColor: colors.border },
                    ]}
                  >
                    <View style={[styles.pillarIconCircle, { backgroundColor: colors.accentLight }]}>
                      <WifiOff size={18} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.pillarTitle, { color: colors.text }]}>
                        100% Offline Access
                      </Text>
                      <Text style={[styles.pillarDesc, { color: colors.textMuted }]}>
                        All Nigerian legal references stay on your device without internet.
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.pillarCard,
                      { backgroundColor: colors.cardWhite, borderColor: colors.border },
                    ]}
                  >
                    <View style={[styles.pillarIconCircle, { backgroundColor: colors.accentLight }]}>
                      <Bot size={18} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.pillarTitle, { color: colors.text }]}>
                        24/7 AI Legal Tutor
                      </Text>
                      <Text style={[styles.pillarDesc, { color: colors.textMuted }]}>
                        Instant, non-judgmental guidance on police, tenancy, and civil rules.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* =================================================== */}
            {/* STEP 1: PERSONAL INFORMATION (NAME & PHONE)       */}
            {/* =================================================== */}
            {step === 1 && (
              <View style={styles.stepBox}>
                {/* Aegis Mini Encouragement */}
                <View
                  style={[
                    styles.aegisMiniBanner,
                    { backgroundColor: colors.streakBadgeBg, borderColor: colors.border },
                  ]}
                >
                  <Image
                    source={require('../assets/images/mascot.png')}
                    style={styles.aegisMiniAvatar}
                    contentFit="cover"
                  />
                  <Text style={[styles.aegisMiniText, { color: colors.streakBadgeText }]}>
                    &quot;Let&apos;s personalize your compass so I can tailor your legal guides.&quot;
                  </Text>
                </View>

                <Text style={[styles.headlineTitle, { color: colors.text }]}>
                  What should we call you?
                </Text>
                <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
                  Provide your name and WhatsApp number to secure your offline legal compass.
                </Text>

                {/* NAME INPUT GROUP */}
                <View style={styles.inputGroupContainer}>
                  <Text style={[styles.inputFieldLabel, { color: colors.text }]}>
                    Full Name <Text style={{ color: colors.primary }}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: colors.cardWhite,
                        borderColor: name.trim().length > 0 ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <User size={18} color={colors.primary} style={{ marginRight: 10 }} />
                    <TextInput
                      style={[styles.nativeTextInput, { color: colors.text }]}
                      placeholder="e.g. Alex Adebayo"
                      placeholderTextColor={colors.textMuted}
                      value={name}
                      onChangeText={(val) => {
                        setName(val);
                        saveDraftProgress({
                          step: 1,
                          name: val,
                          phone,
                          preferredTime,
                          selectedDomains,
                          consentChecked,
                        });
                      }}
                      autoCapitalize="words"
                      autoFocus
                    />
                    {name.trim().length > 0 && <Check size={16} color={colors.success} />}
                  </View>
                </View>

                {/* PHONE INPUT GROUP */}
                <View style={styles.inputGroupContainer}>
                  <Text style={[styles.inputFieldLabel, { color: colors.text }]}>
                    WhatsApp Phone Number <Text style={{ color: colors.primary }}>*</Text>
                  </Text>
                  <Text style={[styles.fieldHelperText, { color: colors.textMuted }]}>
                    Used for your daily legal reminder notifications and account verification.
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        backgroundColor: colors.cardWhite,
                        borderColor: phone.trim().length >= 10 ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Phone size={18} color={colors.primary} style={{ marginRight: 10 }} />
                    <TextInput
                      style={[styles.nativeTextInput, { color: colors.text }]}
                      placeholder="e.g. 0801 234 5678"
                      placeholderTextColor={colors.textMuted}
                      value={phone}
                      onChangeText={(val) => {
                        setPhone(val);
                        saveDraftProgress({
                          step: 1,
                          name,
                          phone: val,
                          preferredTime,
                          selectedDomains,
                          consentChecked,
                        });
                      }}
                      keyboardType="phone-pad"
                    />
                    {phone.trim().length >= 10 && <Check size={16} color={colors.success} />}
                  </View>
                </View>

                {/* PRIVACY PROMISE */}
                <View
                  style={[
                    styles.privacyPromiseCard,
                    { backgroundColor: colors.cardBackground, borderColor: colors.border },
                  ]}
                >
                  <Shield size={16} color={colors.success} style={{ marginRight: 8 }} />
                  <Text style={[styles.privacyPromiseText, { color: colors.textMuted }]}>
                    Your contact information is strictly private and stored on your device. Never shared.
                  </Text>
                </View>
              </View>
            )}

            {/* =================================================== */}
            {/* STEP 2: PRIORITY LEGAL INTERESTS (LARGE CARDS)    */}
            {/* =================================================== */}
            {step === 2 && (
              <View style={styles.stepBox}>
                {/* Aegis Mini Prompt */}
                <View
                  style={[
                    styles.aegisMiniBanner,
                    { backgroundColor: colors.streakBadgeBg, borderColor: colors.border },
                  ]}
                >
                  <Image
                    source={require('../assets/images/mascot.png')}
                    style={styles.aegisMiniAvatar}
                    contentFit="cover"
                  />
                  <Text style={[styles.aegisMiniText, { color: colors.streakBadgeText }]}>
                    &quot;Pick the areas you want to master first. You can always change them!&quot;
                  </Text>
                </View>

                <View style={styles.sectionHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.headlineTitle, { color: colors.text }]}>
                      Choose Priority Rights
                    </Text>
                    <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
                      Select all legal topics relevant to your life and work.
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.selectedBadge,
                      { backgroundColor: colors.cardBackground, borderColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.selectedBadgeText, { color: colors.primary }]}>
                      {selectedDomains.length} selected
                    </Text>
                  </View>
                </View>

                {/* LARGE MATERIAL 3 SELECTION CARDS */}
                <View style={styles.selectionCardsList}>
                  {DOMAIN_OPTIONS.map((domain) => {
                    const isSelected = selectedDomains.includes(domain.id);
                    const IconComp = domain.Icon;

                    return (
                      <TouchableOpacity
                        key={domain.id}
                        style={[
                          styles.selectionCard,
                          {
                            backgroundColor: isSelected ? colors.accentLight : colors.cardWhite,
                            borderColor: isSelected ? colors.primary : colors.border,
                            borderWidth: isSelected ? 2 : 1,
                          },
                        ]}
                        activeOpacity={0.85}
                        onPress={() => toggleDomain(domain.id)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isSelected }}
                      >
                        {/* Domain Icon Pill */}
                        <View
                          style={[
                            styles.domainIconSquare,
                            {
                              backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                            },
                          ]}
                        >
                          <IconComp
                            size={22}
                            color={isSelected ? '#FFFFFF' : colors.primary}
                          />
                        </View>

                        {/* Title & Description */}
                        <View style={styles.domainTextCol}>
                          <Text
                            style={[
                              styles.domainTitleText,
                              {
                                color: isSelected ? colors.primary : colors.text,
                                fontWeight: isSelected ? '800' : '700',
                              },
                            ]}
                          >
                            {domain.label}
                          </Text>
                          <Text style={[styles.domainDescText, { color: colors.textMuted }]}>
                            {domain.description}
                          </Text>
                        </View>

                        {/* Selection Checkmark Indicator */}
                        <View
                          style={[
                            styles.checkIndicatorCircle,
                            {
                              backgroundColor: isSelected ? colors.primary : 'transparent',
                              borderColor: isSelected ? colors.primary : colors.border,
                            },
                          ]}
                        >
                          {isSelected && <Check size={14} color="#FFFFFF" />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* =================================================== */}
            {/* STEP 3: DAILY HABIT SCHEDULE (TIME SELECTION)     */}
            {/* =================================================== */}
            {step === 3 && (
              <View style={styles.stepBox}>
                {/* Aegis Mini Prompt */}
                <View
                  style={[
                    styles.aegisMiniBanner,
                    { backgroundColor: colors.streakBadgeBg, borderColor: colors.border },
                  ]}
                >
                  <Image
                    source={require('../assets/images/mascot.png')}
                    style={styles.aegisMiniAvatar}
                    contentFit="cover"
                  />
                  <Text style={[styles.aegisMiniText, { color: colors.streakBadgeText }]}>
                    &quot;Just 1 minute a day builds unshakable legal confidence!&quot;
                  </Text>
                </View>

                <Text style={[styles.headlineTitle, { color: colors.text }]}>
                  Set Your Daily Routine
                </Text>
                <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
                  Choose the best time for your 1-minute daily legal card. Works 100% offline.
                </Text>

                {/* LARGE TIME OPTION CARDS */}
                <View style={styles.selectionCardsList}>
                  {TIME_OPTIONS.map((timeOption) => {
                    const isSelected = preferredTime === timeOption.time;

                    return (
                      <TouchableOpacity
                        key={timeOption.time}
                        style={[
                          styles.selectionCard,
                          {
                            backgroundColor: isSelected ? colors.accentLight : colors.cardWhite,
                            borderColor: isSelected ? colors.primary : colors.border,
                            borderWidth: isSelected ? 2 : 1,
                          },
                        ]}
                        activeOpacity={0.85}
                        onPress={() => {
                          setPreferredTime(timeOption.time);
                          saveDraftProgress({
                            step: 3,
                            name,
                            phone,
                            preferredTime: timeOption.time,
                            selectedDomains,
                            consentChecked,
                          });
                        }}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: isSelected }}
                      >
                        <View
                          style={[
                            styles.domainIconSquare,
                            {
                              backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                            },
                          ]}
                        >
                          <Clock size={20} color={isSelected ? '#FFFFFF' : colors.primary} />
                        </View>

                        <View style={styles.domainTextCol}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                              style={[
                                styles.timeTitleText,
                                {
                                  color: isSelected ? colors.primary : colors.text,
                                  fontWeight: isSelected ? '800' : '700',
                                },
                              ]}
                            >
                              {timeOption.time}
                            </Text>
                            {timeOption.recommended && (
                              <View
                                style={[
                                  styles.recommendedPill,
                                  { backgroundColor: colors.streakBadgeBg },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.recommendedPillText,
                                    { color: colors.streakBadgeText },
                                  ]}
                                >
                                  POPULAR
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={[styles.domainDescText, { color: colors.textMuted }]}>
                            {timeOption.label} • {timeOption.subtitle}
                          </Text>
                        </View>

                        {/* Radio Checkmark Indicator */}
                        <View
                          style={[
                            styles.checkIndicatorCircle,
                            {
                              backgroundColor: isSelected ? colors.primary : 'transparent',
                              borderColor: isSelected ? colors.primary : colors.border,
                            },
                          ]}
                        >
                          {isSelected && <Check size={14} color="#FFFFFF" />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* =================================================== */}
            {/* STEP 4: REVIEW & LEGAL DISCLAIMER CONSENT         */}
            {/* =================================================== */}
            {step === 4 && (
              <View style={styles.stepBox}>
                {/* Aegis Mini Prompt */}
                <View
                  style={[
                    styles.aegisMiniBanner,
                    { backgroundColor: colors.streakBadgeBg, borderColor: colors.border },
                  ]}
                >
                  <Image
                    source={require('../assets/images/mascot.png')}
                    style={styles.aegisMiniAvatar}
                    contentFit="cover"
                  />
                  <Text style={[styles.aegisMiniText, { color: colors.streakBadgeText }]}>
                    &quot;Almost there! Review your plan and accept the educational notice to unlock your compass.&quot;
                  </Text>
                </View>

                {/* User Summary Review Pills */}
                <View
                  style={[
                    styles.summaryReviewCard,
                    { backgroundColor: colors.cardBackground, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.summaryReviewHeading, { color: colors.textMuted }]}>
                    YOUR COMPASS PROFILE
                  </Text>
                  <View style={styles.summaryPillRow}>
                    <View
                      style={[
                        styles.reviewChip,
                        { backgroundColor: colors.cardWhite, borderColor: colors.border },
                      ]}
                    >
                      <User size={12} color={colors.primary} style={{ marginRight: 4 }} />
                      <Text style={[styles.reviewChipText, { color: colors.text }]}>
                        {name.trim() || 'Alex'}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.reviewChip,
                        { backgroundColor: colors.cardWhite, borderColor: colors.border },
                      ]}
                    >
                      <Clock size={12} color={colors.primary} style={{ marginRight: 4 }} />
                      <Text style={[styles.reviewChipText, { color: colors.text }]}>
                        {preferredTime}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.reviewChip,
                        { backgroundColor: colors.cardWhite, borderColor: colors.border },
                      ]}
                    >
                      <Shield size={12} color={colors.primary} style={{ marginRight: 4 }} />
                      <Text style={[styles.reviewChipText, { color: colors.text }]}>
                        {selectedDomains.length} Priority Areas
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={[styles.headlineTitle, { color: colors.text }]}>
                  Important Legal Notice
                </Text>
                <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
                  Please review our educational guidance terms before entering Rights Compass.
                </Text>

                {/* EXACT LEGAL DISCLAIMER BOX */}
                <View
                  style={[
                    styles.disclaimerBox,
                    { backgroundColor: colors.cardWhite, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.disclaimerHeaderRow}>
                    <AlertCircle size={18} color={colors.primary} style={{ marginRight: 6 }} />
                    <Text style={[styles.disclaimerBoxTitle, { color: colors.text }]}>
                      Educational Disclaimer
                    </Text>
                  </View>

                  <Text style={[styles.disclaimerParagraph, { color: colors.textMuted }]}>
                    Rights Compass provides general legal information and educational guidance based on verified legal sources in Nigeria (including the 1999 Constitution and Administration of Criminal Justice Act).
                  </Text>

                  <Text style={[styles.disclaimerParagraph, { color: colors.textMuted }]}>
                    The information does not constitute formal legal advice and does not create an attorney-client relationship. For decisions with critical consequences, always consult a licensed Nigerian legal practitioner.
                  </Text>

                  <Text style={[styles.disclaimerParagraph, { color: colors.textMuted }]}>
                    By continuing, you acknowledge that you have read and understood this notice.
                  </Text>
                </View>

                {/* CONSENT CHECKBOX ROW */}
                <TouchableOpacity
                  style={[
                    styles.consentCheckboxCard,
                    {
                      backgroundColor: consentChecked ? colors.accentLight : colors.cardWhite,
                      borderColor: consentChecked ? colors.primary : colors.border,
                      borderWidth: consentChecked ? 2 : 1,
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => {
                    const newChecked = !consentChecked;
                    setConsentChecked(newChecked);
                    saveDraftProgress({
                      step: 4,
                      name,
                      phone,
                      preferredTime,
                      selectedDomains,
                      consentChecked: newChecked,
                    });
                  }}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: consentChecked }}
                >
                  <View
                    style={[
                      styles.checkIndicatorCircle,
                      {
                        backgroundColor: consentChecked ? colors.primary : 'transparent',
                        borderColor: consentChecked ? colors.primary : colors.border,
                        marginRight: 12,
                      },
                    ]}
                  >
                    {consentChecked && <Check size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={[styles.consentCheckboxLabel, { color: colors.text }]}>
                    I have read and understood the disclaimer and agree to continue.
                  </Text>
                </TouchableOpacity>

                {/* PRIVACY FOOTNOTE */}
                <Text style={[styles.privacyFootnoteText, { color: colors.textMuted }]}>
                  Continuing also confirms your consent to processing your provided information to deliver your personalized compass.
                </Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* =================================================== */}
        {/* STICKY PRIMARY CTA FOOTER                         */}
        {/* =================================================== */}
        <View style={[styles.bottomFooter, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
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
                    {step === 1 && 'Continue'}
                    {step === 2 && `Continue (${selectedDomains.length} Selected)`}
                    {step === 3 && 'Continue to Disclaimer'}
                    {step === 4 && 'Complete Setup & Enter'}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  progressTrackWrapper: {
    flex: 1,
    marginHorizontal: Spacing.md,
    height: 8,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  topRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 120, // space for sticky footer
  },
  desktopScrollContent: {
    paddingTop: Spacing.xl,
    paddingBottom: 140,
  },
  innerContentContainer: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
  },
  desktopInnerContainer: {
    maxWidth: 600,
  },
  stepBox: {
    width: '100%',
  },
  welcomeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  welcomeLogo: {
    width: 44,
    height: 44,
    marginRight: 10,
  },
  compassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  compassPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headlineTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 6,
    lineHeight: 32,
  },
  headlineSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: Spacing.lg,
  },
  aegisSpeechCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  aegisAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  aegisAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  aegisSparklePill: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  aegisSpeechBubble: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm + 4,
    borderWidth: 1,
    position: 'relative',
  },
  aegisBubbleTail: {
    position: 'absolute',
    left: -7,
    top: 16,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  aegisNameTag: {
    marginBottom: 2,
  },
  aegisNameText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  aegisSpeechQuote: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  valuePillarsGrid: {
    gap: Spacing.sm + 2,
  },
  pillarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
  },
  pillarIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pillarTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  pillarDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  aegisMiniBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  aegisMiniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  aegisMiniText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 17,
  },
  inputGroupContainer: {
    marginBottom: Spacing.md,
  },
  inputFieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  fieldHelperText: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    height: 50,
  },
  nativeTextInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
    padding: 0,
  },
  privacyPromiseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
    borderWidth: 1,
  },
  privacyPromiseText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  selectedBadge: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  selectionCardsList: {
    gap: Spacing.sm + 2,
  },
  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minHeight: 74,
    ...Shadows.sm,
  },
  domainIconSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  domainTextCol: {
    flex: 1,
    marginRight: 10,
  },
  domainTitleText: {
    fontSize: 15,
    marginBottom: 2,
  },
  domainDescText: {
    fontSize: 12,
    lineHeight: 17,
  },
  timeTitleText: {
    fontSize: 16,
    marginRight: 8,
  },
  recommendedPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  recommendedPillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  checkIndicatorCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryReviewCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  summaryReviewHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: Spacing.xs + 2,
  },
  summaryPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
  },
  reviewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  reviewChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  disclaimerBox: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  disclaimerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  disclaimerBoxTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  disclaimerParagraph: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: Spacing.xs + 4,
  },
  consentCheckboxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  consentCheckboxLabel: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    flex: 1,
  },
  privacyFootnoteText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: Spacing.sm,
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  bottomFooterInner: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
  },
  desktopFooterInner: {
    maxWidth: 600,
  },
  primaryCtaBtn: {
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...Shadows.sm,
  },
  primaryCtaDisabled: {
    opacity: 0.55,
  },
  ctaContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
