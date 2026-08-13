import React, { useState } from 'react';
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
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Clock,
  Shield,
  Home,
  Briefcase,
  ShoppingBag,
  Scale,
  Check,
  ArrowRight,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { saveStoredProfile } from '../services/offlineStorage';

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
  const [step, setStep] = useState(0); // 0: Welcome, 1: Name & Phone, 2: Notification Time, 3: Interests

  // Form State
  const [name, setName] = useState('Alex');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('08:00 AM');
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['police', 'tenancy']);

  const toggleDomain = (id: string) => {
    if (selectedDomains.includes(id)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== id));
    } else {
      setSelectedDomains([...selectedDomains, id]);
    }
  };

  const handleFinish = async () => {
    await saveStoredProfile({
      name: name.trim() || 'Alex',
      phoneNumber: phone.trim(),
      preferredTime,
      interests: selectedDomains,
      onboarded: true,
    });
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Progress Bar Header */}
        <View style={styles.progressHeader}>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((step + 1) / 4) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.stepCounter}>Step {step + 1} of 4</Text>
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
                onPress={() => setStep(1)}
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
                This helps us personalize your daily compass experience.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Your Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  WhatsApp Phone Number (Optional)
                </Text>
                <Text style={styles.inputHint}>
                  Allows you to seamlessly receive daily lessons via WhatsApp in future updates.
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. +234 801 234 5678"
                  placeholderTextColor={Colors.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setStep(0)}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryButton, { flex: 1, marginLeft: 12 }]}
                  onPress={() => setStep(2)}
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
                      onPress={() => setPreferredTime(timeOption)}
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
                  onPress={() => setStep(1)}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryButton, { flex: 1, marginLeft: 12 }]}
                  onPress={() => setStep(3)}
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
                  onPress={() => setStep(2)}
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryButton, { flex: 1, marginLeft: 12 }]}
                  onPress={handleFinish}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.primaryButtonText}>Enter App</Text>
                    <ArrowRight size={18} color={Colors.white} style={{ marginLeft: 6 }} />
                  </View>
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
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
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
  domainIcon: {
    fontSize: 22,
    marginRight: Spacing.md,
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
  checkboxCheck: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
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
