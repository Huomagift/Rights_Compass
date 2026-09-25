/**
 * Request Consultation – app/marketplace/request.tsx
 * Modal form: practice area, description (min 30 chars), contact, urgency, disclaimer.
 */
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
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  X,
  Check,
  AlertCircle,
  MessageSquare,
  Phone,
  Mail,
  Users,
  Zap,
  ChevronDown,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { marketplaceService } from '../../services/marketplaceProvider';
import type { PracticeArea, ContactPreference, UrgencyLevel } from '../../types/marketplace';
import { PRACTICE_AREA_LABELS } from '../../types/marketplace';

const CONTACT_OPTIONS: { value: ContactPreference; label: string; Icon: any }[] = [
  { value: 'phone', label: 'Phone Call', Icon: Phone },
  { value: 'whatsapp', label: 'WhatsApp', Icon: MessageSquare },
  { value: 'email', label: 'Email', Icon: Mail },
  { value: 'in_person', label: 'In Person', Icon: Users },
];

const URGENCY_OPTIONS: { value: UrgencyLevel; label: string; color: string }[] = [
  { value: 'low', label: 'Low – I can wait weeks', color: '#10B981' },
  { value: 'medium', label: 'Medium – Within a week', color: '#F59E0B' },
  { value: 'high', label: 'High – Within 48 hours', color: '#EF4444' },
  { value: 'urgent', label: 'Urgent – Today if possible', color: '#DC2626' },
];

const AREA_OPTIONS = Object.entries(PRACTICE_AREA_LABELS) as [PracticeArea, string][];

const MIN_DESC_LENGTH = 30;

export default function RequestConsultationScreen() {
  const { lawyerId, lawyerName } = useLocalSearchParams<{ lawyerId: string; lawyerName: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  const [practiceArea, setPracticeArea] = useState<PracticeArea | null>(null);
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState<ContactPreference>('whatsapp');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');
  const [showAreaPicker, setShowAreaPicker] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const descTooShort = description.trim().length < MIN_DESC_LENGTH;
  const isValid = practiceArea && !descTooShort;

  const handleSubmit = async () => {
    if (!isValid || submitting || !lawyerId || !practiceArea) return;
    setSubmitting(true);
    setError(null);
    try {
      await marketplaceService.createConsultationRequest({
        lawyerId,
        practiceArea,
        issueDescription: description.trim(),
        contactPreference: contact,
        urgency,
      });
      setSubmitted(true);
    } catch {
      setError('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Success screen ───────────────────────────────────────────────────────

  if (submitted) {
    return (
      <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
        <View style={st.successBox}>
          <View style={[st.successCircle, { backgroundColor: colors.success + '20' }]}>
            <Check size={40} color={colors.success} />
          </View>
          <Text style={[st.successTitle, { color: colors.text }]}>Request Sent!</Text>
          <Text style={[st.successSub, { color: colors.textMuted }]}>
            Your consultation request has been sent to {lawyerName}. You'll be notified when they respond.
          </Text>
          <View style={[st.disclaimerBox, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
            <AlertCircle size={14} color="#92400E" />
            <Text style={st.disclaimerText}>
              This is not legal advice. Rights Compass does not guarantee any outcome or representation.
            </Text>
          </View>
          <TouchableOpacity
            style={[st.doneBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/marketplace/my-requests' as any)}
            accessibilityLabel="View my requests"
          >
            <Text style={st.doneBtnText}>View My Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/marketplace' as any)} style={st.backLink}>
            <Text style={[st.backLinkText, { color: colors.textMuted }]}>Back to Directory</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <View style={[st.header, { borderBottomColor: colors.border }]}>
          <Text style={[st.headerTitle, { color: colors.text }]}>Request Consultation</Text>
          <TouchableOpacity
            style={[st.closeBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={() => router.back()}
            accessibilityLabel="Close"
          >
            <X size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[st.scroll, isWide && st.wideScroll]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Lawyer name */}
          <View style={[st.lawyerBanner, { backgroundColor: colors.accentLight, borderColor: colors.border }]}>
            <Text style={[st.lawyerBannerLabel, { color: colors.textMuted }]}>Requesting consultation with</Text>
            <Text style={[st.lawyerBannerName, { color: colors.primary }]}>{lawyerName}</Text>
          </View>

          {/* Disclaimer */}
          <View style={[st.disclaimerBox, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
            <AlertCircle size={14} color="#92400E" />
            <Text style={st.disclaimerText}>
              This is not legal advice. Submitting a request does not create a lawyer-client relationship. Rights Compass facilitates contact only.
            </Text>
          </View>

          {/* Practice Area */}
          <Text style={[st.label, { color: colors.text }]}>Practice Area <Text style={{ color: colors.primary }}>*</Text></Text>
          <TouchableOpacity
            style={[st.picker, { backgroundColor: colors.cardBackground, borderColor: practiceArea ? colors.primary : colors.border }]}
            onPress={() => setShowAreaPicker(!showAreaPicker)}
            accessibilityLabel="Select practice area"
            accessibilityRole="button"
          >
            <Text style={[st.pickerText, { color: practiceArea ? colors.text : colors.textMuted }]}>
              {practiceArea ? PRACTICE_AREA_LABELS[practiceArea] : 'Select a practice area…'}
            </Text>
            <ChevronDown size={16} color={colors.textMuted} />
          </TouchableOpacity>
          {showAreaPicker && (
            <View style={[st.dropdown, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              {AREA_OPTIONS.map(([value, label]) => (
                <TouchableOpacity
                  key={value}
                  style={[st.dropdownItem, { borderBottomColor: colors.border }, practiceArea === value && { backgroundColor: colors.accentLight }]}
                  onPress={() => { setPracticeArea(value); setShowAreaPicker(false); }}
                  accessibilityRole="menuitem"
                >
                  <Text style={[st.dropdownText, { color: practiceArea === value ? colors.primary : colors.text }]}>{label}</Text>
                  {practiceArea === value && <Check size={14} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Issue Description */}
          <Text style={[st.label, { color: colors.text }]}>Describe Your Issue <Text style={{ color: colors.primary }}>*</Text></Text>
          <Text style={[st.hint, { color: colors.textMuted }]}>Minimum {MIN_DESC_LENGTH} characters. Do not include personal ID numbers or confidential documents.</Text>
          <View style={[st.textArea, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <TextInput
              style={[st.textAreaInput, { color: colors.text }]}
              placeholder="e.g. My landlord gave me a 7-day quit notice but I believe I am legally entitled to more time under Nigerian law…"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              accessibilityLabel="Describe your legal issue"
            />
          </View>
          <Text style={[st.charCount, { color: descTooShort ? '#EF4444' : colors.success }]}>
            {description.trim().length}/{MIN_DESC_LENGTH} min characters
          </Text>

          {/* Preferred Contact */}
          <Text style={[st.label, { color: colors.text }]}>Preferred Contact Method</Text>
          <View style={st.contactRow}>
            {CONTACT_OPTIONS.map(({ value, label, Icon }) => {
              const active = contact === value;
              return (
                <TouchableOpacity
                  key={value}
                  style={[st.contactChip, { backgroundColor: active ? colors.primary : colors.cardBackground, borderColor: active ? colors.primary : colors.border }]}
                  onPress={() => setContact(value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                >
                  <Icon size={13} color={active ? '#fff' : colors.textMuted} />
                  <Text style={[st.contactChipText, { color: active ? '#fff' : colors.textMuted }]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Urgency */}
          <Text style={[st.label, { color: colors.text }]}>Urgency Level</Text>
          {URGENCY_OPTIONS.map(({ value, label, color }) => {
            const active = urgency === value;
            return (
              <TouchableOpacity
                key={value}
                style={[st.urgencyRow, { backgroundColor: active ? color + '15' : colors.cardBackground, borderColor: active ? color : colors.border }]}
                onPress={() => setUrgency(value)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
              >
                <Zap size={14} color={active ? color : colors.textMuted} />
                <Text style={[st.urgencyText, { color: active ? color : colors.text, fontWeight: active ? '800' : '500' }]}>{label}</Text>
                {active && <Check size={14} color={color} style={{ marginLeft: 'auto' }} />}
              </TouchableOpacity>
            );
          })}

          {/* Error */}
          {error && (
            <View style={[st.errorBox, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
              <AlertCircle size={14} color="#DC2626" />
              <Text style={st.errorText}>{error}</Text>
            </View>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[st.submitBtn, { backgroundColor: colors.primary }, (!isValid || submitting) && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={!isValid || submitting}
            accessibilityLabel="Submit consultation request"
            accessibilityHint={!isValid ? 'Please fill all required fields' : undefined}
          >
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={st.submitBtnText}>Send Request</Text>
            }
          </TouchableOpacity>

          {/* Footer disclaimer */}
          <View style={[st.footerDisclaimer, { borderTopColor: colors.border }]}>
            <Text style={[st.footerDisclaimerText, { color: colors.textMuted }]}>
              Rights Compass is not a law firm and does not provide legal representation. Connecting with a lawyer through this app does not constitute legal advice.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  scroll: { padding: Spacing.md, paddingBottom: 60 },
  wideScroll: { maxWidth: 640, alignSelf: 'center', width: '100%' },
  lawyerBanner: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1 },
  lawyerBannerLabel: { fontSize: 12, marginBottom: 4 },
  lawyerBannerName: { fontSize: 17, fontWeight: '800' },
  disclaimerBox: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: BorderRadius.md, padding: Spacing.sm + 4, marginBottom: Spacing.md, borderWidth: 1, gap: 8 },
  disclaimerText: { flex: 1, fontSize: 12, lineHeight: 18, color: '#92400E' },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 6, marginTop: Spacing.md },
  hint: { fontSize: 12, lineHeight: 17, marginBottom: 8, marginTop: -4 },
  picker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: BorderRadius.md, borderWidth: 1, paddingHorizontal: Spacing.md, height: 48 },
  pickerText: { fontSize: 14 },
  dropdown: { borderRadius: BorderRadius.md, borderWidth: 1, marginTop: 4, overflow: 'hidden', marginBottom: Spacing.sm },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  dropdownText: { fontSize: 14 },
  textArea: { borderRadius: BorderRadius.md, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  textAreaInput: { fontSize: 14, lineHeight: 22, minHeight: 110, outlineStyle: 'none' as any, outlineWidth: 0 as any, outlineColor: 'transparent' as any },
  charCount: { fontSize: 12, marginTop: 4, marginBottom: 4, textAlign: 'right', fontWeight: '600' },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.sm },
  contactChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.pill, borderWidth: 1, gap: 6, minHeight: 44 },
  contactChipText: { fontSize: 13, fontWeight: '700' },
  urgencyRow: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.md, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: 12, marginBottom: 8, gap: 10, minHeight: 44 },
  urgencyText: { fontSize: 14 },
  errorBox: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md, borderWidth: 1, gap: 8 },
  errorText: { flex: 1, fontSize: 13, color: '#DC2626' },
  submitBtn: { borderRadius: BorderRadius.pill, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.lg, ...Shadows.md },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  // Success
  successBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: 16 },
  successCircle: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  successSub: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
  doneBtn: { width: '100%', paddingVertical: 16, borderRadius: BorderRadius.pill, alignItems: 'center', ...Shadows.md },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  backLink: { marginTop: 4 },
  backLinkText: { fontSize: 14 },
  footerDisclaimer: { marginTop: Spacing.xl, paddingTop: Spacing.md, borderTopWidth: 1 },
  footerDisclaimerText: { fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
