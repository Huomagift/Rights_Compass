/**
 * Step 4 – Review and Declare
 * app/lawyer-application/review.tsx
 */
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  Square,
  CheckSquare,
  Send,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { marketplaceService } from '../../services/marketplaceProvider';
import { saveStoredProfile } from '../../services/offlineStorage';
import { PRACTICE_AREA_LABELS } from '../../types/marketplace';
import { ApplicationProgress } from './ApplicationProgress';

export default function ReviewStep() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { application, refreshApplication } = useMarketplace();
  const isWide = width > 768;

  const [accuracyChecked, setAccuracyChecked] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const allChecked = accuracyChecked && consentChecked && termsChecked;
  const canSubmit = allChecked && !submitting && application != null;

  const handleSubmit = async () => {
    if (!canSubmit || !application) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await marketplaceService.submitApplication(application.id);
      await refreshApplication();
      await saveStoredProfile({ onboarded: true });
      setSubmitting(false);
      setShowSuccessModal(true);
    } catch (e: any) {
      setSubmitError('Could not submit application. Please try again.');
      setSubmitting(false);
    }
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    router.replace('/(tabs)' as any);
  };

  if (!application) {
    return (
      <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
        <View style={st.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const { personal, credentials, documents } = application;

  function CheckboxRow({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
    return (
      <TouchableOpacity
        style={st.checkRow}
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={label}
      >
        {checked ? (
          <CheckSquare size={22} color={colors.primary} />
        ) : (
          <Square size={22} color={colors.border} />
        )}
        <Text style={[st.checkLabel, { color: colors.text }]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
      <View style={[st.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[st.backBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={18} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[st.title, { color: colors.text }]}>Lawyer Application</Text>
          <Text style={[st.subtitle, { color: colors.textMuted }]}>Step 4 of 4 – Review & Declare</Text>
        </View>
      </View>

      <ApplicationProgress currentStep={3} />

      <ScrollView
        contentContainerStyle={[st.scroll, isWide && st.wideScroll]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[st.sectionHeader, { color: colors.text }]}>Review Your Application</Text>
        <Text style={[st.sectionSub, { color: colors.textMuted }]}>
          Please review your information before submitting. You can go back to make corrections.
        </Text>

        {/* Personal Summary */}
        <View style={[st.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[st.cardTitle, { color: colors.text }]}>Personal Information</Text>
          {[
            ['Name', personal?.fullName],
            ['City', personal?.city],
            ['State', personal?.state],
          ].map(([label, value]) => (
            value ? (
              <View key={label} style={[st.row, { borderBottomColor: colors.border }]}>
                <Text style={[st.rowLabel, { color: colors.textMuted }]}>{label}</Text>
                <Text style={[st.rowValue, { color: colors.text }]}>{value}</Text>
              </View>
            ) : null
          ))}
          {personal?.bio ? (
            <View style={st.bioRow}>
              <Text style={[st.rowLabel, { color: colors.textMuted }]}>Bio</Text>
              <Text style={[st.bioText, { color: colors.textMuted }]} numberOfLines={3}>{personal.bio}</Text>
            </View>
          ) : null}
        </View>

        {/* Credentials Summary */}
        <View style={[st.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[st.cardTitle, { color: colors.text }]}>Credentials</Text>
          {[
            ['SCN Number', credentials?.scnNumber],
            ['Year of Call', credentials?.yearOfCall ? String(credentials.yearOfCall) : undefined],
            ['Years Experience', credentials?.yearsOfExperience !== undefined ? `${credentials.yearsOfExperience} years` : undefined],
            ['Firm / Chambers', credentials?.firmOrChambers],
          ].map(([label, value]) => (
            value ? (
              <View key={label} style={[st.row, { borderBottomColor: colors.border }]}>
                <Text style={[st.rowLabel, { color: colors.textMuted }]}>{label}</Text>
                <Text style={[st.rowValue, { color: colors.text }]}>{value}</Text>
              </View>
            ) : null
          ))}
          {credentials?.practiceAreas?.length ? (
            <View style={st.areasRow}>
              <Text style={[st.rowLabel, { color: colors.textMuted }]}>Practice Areas</Text>
              <View style={st.areaChips}>
                {credentials.practiceAreas.map((pa) => (
                  <View key={pa} style={[st.areaChip, { backgroundColor: colors.accentLight }]}>
                    <Text style={[st.areaChipText, { color: colors.primary }]}>{PRACTICE_AREA_LABELS[pa]}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>

        {/* Documents Summary */}
        <View style={[st.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[st.cardTitle, { color: colors.text }]}>Documents</Text>
          {documents?.length ? (
            documents.map((doc) => (
              <View key={doc.id} style={[st.row, { borderBottomColor: colors.border }]}>
                <FileText size={14} color={colors.success} />
                <Text style={[st.rowValue, { color: colors.text, flex: 1, marginLeft: 8 }]} numberOfLines={1}>{doc.fileName}</Text>
                <ShieldCheck size={14} color={colors.success} />
              </View>
            ))
          ) : (
            <Text style={[st.bioText, { color: '#EF4444' }]}>No documents uploaded. Please go back and upload required documents.</Text>
          )}
        </View>

        {/* Declaration Checkboxes */}
        <View style={[st.declarationCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[st.cardTitle, { color: colors.text }]}>Declaration</Text>
          <CheckboxRow
            checked={accuracyChecked}
            onToggle={() => setAccuracyChecked(!accuracyChecked)}
            label="I confirm that all information provided in this application is true, accurate, and complete to the best of my knowledge."
          />
          <CheckboxRow
            checked={consentChecked}
            onToggle={() => setConsentChecked(!consentChecked)}
            label="I consent to Rights Compass verifying my credentials with the Nigerian Bar Association and the Supreme Court of Nigeria."
          />
          <CheckboxRow
            checked={termsChecked}
            onToggle={() => setTermsChecked(!termsChecked)}
          label="I agree to the Rights Compass terms of service, practitioner code of conduct, and fee schedule and service guidelines."
          />
        </View>

        {submitError && (
          <View style={[st.errorBox, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
            <Text style={st.errorText}>{submitError}</Text>
          </View>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[st.submitBtn, { backgroundColor: colors.primary }, !canSubmit && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          accessibilityLabel="Submit application"
          accessibilityHint={!allChecked ? 'Please check all declaration boxes before submitting' : undefined}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : (
            <>
              <Send size={18} color="#fff" />
              <Text style={st.submitBtnText}>Submit Application</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={[st.footerDis, { borderTopColor: colors.border }]}>
          <Text style={[st.footerDisText, { color: colors.textMuted }]}>
            Rights Compass is not a law firm. Your application will be reviewed by our verification team. We do not guarantee approval.
          </Text>
        </View>
      </ScrollView>

      {/* Congratulatory Post-Submission Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleGoHome}
      >
        <View style={st.modalOverlay}>
          <View style={[st.modalCard, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}>
            <View style={[st.successIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <CheckCircle2 size={40} color="#16A34A" />
            </View>

            <Text style={[st.modalTitle, { color: colors.text }]}>Congratulations!</Text>
            <Text style={[st.modalSubtitle, { color: colors.primary }]}>Your application has been submitted.</Text>

            <Text style={[st.modalDesc, { color: colors.textMuted }]}>
              You can now use the main app normally while our verification team authenticates your credentials.
            </Text>

            <View style={[st.infoCallout, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[st.infoCalloutText, { color: colors.textMuted }]}>
                💡 You can check your application stage and verification status at any time from your{' '}
                <Text style={{ color: colors.text, fontWeight: '700' }}>Lawyer Dashboard</Text>.
              </Text>
            </View>

            <TouchableOpacity
              style={[st.homeCtaBtn, { backgroundColor: colors.primary }]}
              onPress={handleGoHome}
              activeOpacity={0.85}
              accessibilityLabel="Continue to Main App"
            >
              <Text style={st.homeCtaBtnText}>Continue to Main App</Text>
              <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 17, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2 },
  scroll: { padding: Spacing.md, paddingBottom: 60 },
  wideScroll: { maxWidth: 640, alignSelf: 'center', width: '100%' },
  sectionHeader: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  sectionSub: { fontSize: 13, lineHeight: 19, marginBottom: Spacing.lg },
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1 },
  cardTitle: { fontSize: 15, fontWeight: '800', marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  rowLabel: { fontSize: 13, width: 120 },
  rowValue: { flex: 1, fontSize: 13, fontWeight: '700' },
  bioRow: { paddingVertical: 10 },
  bioText: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  areasRow: { paddingVertical: 10 },
  areaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  areaChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: BorderRadius.pill },
  areaChipText: { fontSize: 12, fontWeight: '700' },
  declarationCard: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, gap: 14 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, minHeight: 44 },
  checkLabel: { flex: 1, fontSize: 13, lineHeight: 20 },
  errorBox: { borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1 },
  errorText: { fontSize: 13, color: '#DC2626' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.pill, paddingVertical: 16, gap: 8, ...Shadows.md },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  footerDis: { paddingTop: Spacing.md, borderTopWidth: 1, marginTop: Spacing.md },
  footerDisText: { fontSize: 11, lineHeight: 16, textAlign: 'center' },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    ...Shadows.lg,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  infoCallout: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  infoCalloutText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  homeCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    width: '100%',
    ...Shadows.md,
  },
  homeCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
