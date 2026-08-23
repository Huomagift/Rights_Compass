import React, { useState, useEffect } from 'react';
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
  Dimensions,
  ActivityIndicator,
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
  AlertCircle,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';
import {
  checkOnboardingStatus,
  saveDraftProgress,
  completeOnboarding,
  clearDraftProgress,
} from '../services/onboardingService';

const { width } = Dimensions.get('window');

const DOMAIN_OPTIONS = [
  { id: 'police', label: 'Police Stop & Arrest Rights', Icon: Shield },
  { id: 'tenancy', label: 'Tenant & Housing Rights', Icon: Home },
  { id: 'employment', label: 'Employment & Labor Law', Icon: Briefcase },
  { id: 'consumer', label: 'Consumer Rights & Refunds', Icon: ShoppingBag },
  { id: 'civil', label: 'Fundamental Civil Rights', Icon: Scale },
];

const TIME_OPTIONS = ['07:00 AM', '08:00 AM', '09:00 AM', '07:00 PM'];

export default function OnboardingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ reOnboard?: string }>();
  const isReOnboarding = params.reOnboard === 'true';

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step state: 0: Welcome, 1: Name & Phone, 2: Notification Time, 3: Priority Rights, 4: Disclaimer & Consent
  const [step, setStep] = useState(0);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('08:00 AM');
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['police', 'tenancy']);
  const [consentChecked, setConsentChecked] = useState(false);

  const isStep1Valid = name.trim().length > 0 && phone.trim().length >= 11;

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
          if (status.draft.consentChecked !== undefined) setConsentChecked(status.draft.consentChecked);
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
      name,
      phone,
      preferredTime,
      selectedDomains,
      consentChecked: true,
    });

    setIsSubmitting(false);
    router.replace('/(tabs)' as any);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Progress Bar Header (5 Steps Total) */}
        <View style={styles.progressHeader}>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((step + 1) / 5) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.stepCounter}>Step {step + 1} of 5</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* STEP 0: WELCOME & BRAND INTRO */}
          {step === 0 && (
            <View style={styles.stepContainer}>
              <Image
                source={require('../assets/images/rights_compass_logo.png')}
                style={styles.brandLogo}
                contentFit="contain"
              />
              <Text style={styles.welcomeTitle}>Welcome to Rights Compass</Text>
              <Text style={styles.welcomeSubtitle}>
                Empowering everyday Nigerians with legal rights literacy. Receive short daily lessons, offline legal references, and real-time AI guidance before a crisis happens.
              </Text>

              <View style={styles.mascotPreviewBox}>
                <Image
                  source={require('../assets/images/mascot.png')}
                  style={styles.mascotImage}
                  contentFit="contain"
                />
                <View style={styles.mascotBubble}>
                  <Text style={styles.mascotBubbleText}>
                    &quot;Hi! I&apos;m your AI Legal Mascot. I&apos;m here to guide you through your rights every single day!&quot;
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={() => goToStep(1)}
              >
                <Text style={styles.primaryButtonText}>Get Started →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 1: NAME & PHONE NUMBER */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>What should we call you?</Text>
              <Text style={styles.stepSubtitle}>
                This helps us personalize your daily compass experience and account details.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Your Name (Required)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor={Colors.textMuted}
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
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  WhatsApp Phone Number (Required)
                </Text>
                <Text style={styles.inputHint}>
                  Used to deliver daily legal rights lessons and verify your account.
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. +234 801 234 5678"
                  placeholderTextColor={Colors.textMuted}
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
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => goToStep(0)}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { flex: 1, marginLeft: 12 },
                    !isStep1Valid && styles.disabledButton,
                  ]}
                  disabled={!isStep1Valid}
                  onPress={() => goToStep(2)}
                >
                  <Text style={styles.primaryButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 2: DAILY NOTIFICATION TIME */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Set Your Daily Lesson Time</Text>
              <Text style={styles.stepSubtitle}>
                Daily lessons take less than 1 minute to read and work 100% offline without internet data!
              </Text>

              <View style={styles.optionsContainer}>
                {TIME_OPTIONS.map((timeOption) => {
                  const isSelected = preferredTime === timeOption;
                  return (
                    <TouchableOpacity
                      key={timeOption}
                      style={[
                        styles.timeOptionCard,
                        isSelected && styles.timeOptionSelected,
                      ]}
                      onPress={() => {
                        setPreferredTime(timeOption);
                        saveDraftProgress({
                          step: 2,
                          name,
                          phone,
                          preferredTime: timeOption,
                          selectedDomains,
                          consentChecked,
                        });
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Clock
                          size={18}
                          color={isSelected ? Colors.primary : Colors.textMuted}
                          style={{ marginRight: 10 }}
                        />
                        <Text
                          style={[
                            styles.timeOptionText,
                            isSelected && styles.timeOptionTextSelected,
                          ]}
                        >
                          {timeOption}
                        </Text>
                      </View>
                      {isSelected && <Check size={18} color={Colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => goToStep(1)}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryButton, { flex: 1, marginLeft: 12 }]}
                  onPress={() => goToStep(3)}
                >
                  <Text style={styles.primaryButtonText}>Next Step</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 3: TOPICS OF INTEREST */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Choose Your Priority Rights</Text>
              <Text style={styles.stepSubtitle}>
                Select the legal areas you want to learn first. You can change these anytime in your library.
              </Text>

              <View style={styles.optionsContainer}>
                {DOMAIN_OPTIONS.map((domain) => {
                  const isSelected = selectedDomains.includes(domain.id);
                  const IconComp = domain.Icon;
                  return (
                    <TouchableOpacity
                      key={domain.id}
                      style={[
                        styles.domainCard,
                        isSelected && styles.domainCardSelected,
                      ]}
                      onPress={() => toggleDomain(domain.id)}
                      activeOpacity={0.7}
                    >
                      <IconComp
                        size={20}
                        color={isSelected ? Colors.primary : Colors.textMuted}
                        style={{ marginRight: 12 }}
                      />
                      <Text
                        style={[
                          styles.domainLabel,
                          isSelected && styles.domainLabelSelected,
                        ]}
                      >
                        {domain.label}
                      </Text>
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {isSelected && (
                          <Check size={14} color={Colors.white} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => goToStep(2)}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryButton, { flex: 1, marginLeft: 12 }]}
                  onPress={() => goToStep(4)}
                >
                  <Text style={styles.primaryButtonText}>Continue to Disclaimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 4: LEGAL DISCLAIMER & CONSENT SCREEN */}
          {step === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Disclaimer</Text>
              <Text style={styles.stepSubtitle}>Important Notice</Text>

              {/* Exact Unaltered Legal Disclaimer Copy Box */}
              <View style={styles.disclaimerBox}>
                <View style={styles.disclaimerHeaderRow}>
                  <AlertCircle size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.disclaimerBoxTitle}>Important Notice</Text>
                </View>

                <Text style={styles.disclaimerParagraph}>
                  This application provides general legal information and educational guidance based on the legal sources and materials available within the application. It is designed to help users better understand their rights and legal information in Nigeria.
                </Text>

                <Text style={styles.disclaimerParagraph}>
                  The information provided by this application does not constitute legal advice and does not create a lawyer-client relationship. AI-generated responses may contain errors or may not fully reflect the circumstances of a particular situation.
                </Text>

                <Text style={styles.disclaimerParagraph}>
                  Laws, legal procedures, and their interpretation may change over time. For matters requiring legal advice, representation, or a decision with significant legal consequences, users should consult a qualified legal professional.
                </Text>

                <Text style={styles.disclaimerParagraph}>
                  By continuing to use the legal guidance features of this application, you acknowledge that you have read and understood this notice.
                </Text>
              </View>

              {/* Checkbox Line */}
              <TouchableOpacity
                style={styles.consentCheckboxRow}
                activeOpacity={0.8}
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
              >
                <View
                  style={[
                    styles.checkbox,
                    consentChecked && styles.checkboxSelected,
                    { marginTop: 2, marginRight: 10 },
                  ]}
                >
                  {consentChecked && <Check size={14} color={Colors.white} />}
                </View>
                <Text style={styles.consentCheckboxLabel}>
                  I have read and understood the disclaimer and agree to continue.
                </Text>
              </TouchableOpacity>

              {/* Privacy Consent Footnote */}
              <Text style={styles.privacyFootnoteText}>
                Continuing also means you consent to your provided information being processed to operate this service, as described in our Privacy Policy.
              </Text>

              {/* Navigation Action Row */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  disabled={isSubmitting}
                  onPress={() => goToStep(3)}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { flex: 1, marginLeft: 12 },
                    (!consentChecked || isSubmitting) && styles.disabledButton,
                  ]}
                  disabled={!consentChecked || isSubmitting}
                  onPress={handleFinish}
                  activeOpacity={0.8}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.primaryButtonText}>Enter App</Text>
                      <ArrowRight size={18} color={Colors.white} style={{ marginLeft: 6 }} />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBarTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#EAE0D5',
    borderRadius: BorderRadius.pill,
    marginRight: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(229, 214, 200, 0.8)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    backgroundImage: 'linear-gradient(90deg, #8A3C1B 0%, #D8602A 100%)' as any,
    borderRadius: BorderRadius.pill,
  },
  stepCounter: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  stepContainer: {
    width: '100%',
    paddingVertical: Spacing.md,
  },
  brandLogo: {
    width: Math.min(width * 0.55, 220),
    height: 80,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  mascotPreviewBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  mascotImage: {
    width: 110,
    height: 110,
    marginBottom: Spacing.sm,
  },
  mascotBubble: {
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  mascotBubbleText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.accent,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  inputHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  textInput: {
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    ...Shadows.sm,
  },
  optionsContainer: {
    marginBottom: Spacing.xl,
  },
  timeOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  timeOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.accentLight,
  },
  timeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  timeOptionTextSelected: {
    color: Colors.primary,
  },
  domainCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  domainCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.accentLight,
  },
  domainLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  domainLabelSelected: {
    color: Colors.primary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  disclaimerBox: {
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  disclaimerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  disclaimerBoxTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  disclaimerParagraph: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  consentCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  consentCheckboxLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 20,
  },
  privacyFootnoteText: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
