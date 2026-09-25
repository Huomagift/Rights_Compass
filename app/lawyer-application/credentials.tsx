/**
 * Step 2 – Credentials
 * app/lawyer-application/credentials.tsx
 */
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
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, ChevronRight, Hash, Calendar, Briefcase } from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { marketplaceService } from '../../services/marketplaceProvider';
import type { PracticeArea } from '../../types/marketplace';
import { PRACTICE_AREA_LABELS } from '../../types/marketplace';
import { ApplicationProgress } from './ApplicationProgress';

const ALL_AREAS = Object.entries(PRACTICE_AREA_LABELS) as [PracticeArea, string][];
const CURRENT_YEAR = new Date().getFullYear();

export default function CredentialsStep() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { application, refreshApplication } = useMarketplace();
  const isWide = width > 768;

  const [scnNumber, setScnNumber] = useState('');
  const [yearOfCall, setYearOfCall] = useState('');
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [yearsExp, setYearsExp] = useState('');
  const [firm, setFirm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (application?.credentials) {
      const c = application.credentials;
      setScnNumber(c.scnNumber ?? '');
      setYearOfCall(c.yearOfCall ? String(c.yearOfCall) : '');
      setPracticeAreas(c.practiceAreas ?? []);
      setYearsExp(c.yearsOfExperience ? String(c.yearsOfExperience) : '');
      setFirm(c.firmOrChambers ?? '');
    }
  }, [application]);

  const toggleArea = (area: PracticeArea) => {
    setPracticeAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const yearNum = parseInt(yearOfCall, 10);
  const expNum = parseInt(yearsExp, 10);

  const scnValid = scnNumber.trim().length >= 8;
  const yearValid = !isNaN(yearNum) && yearNum >= 1960 && yearNum <= CURRENT_YEAR;
  const areasValid = practiceAreas.length > 0;
  const expValid = !isNaN(expNum) && expNum >= 0 && expNum <= 60;

  const isValid = scnValid && yearValid && areasValid && expValid;

  const scnError = scnNumber && !scnValid ? 'SCN number appears too short' : null;
  const yearError = yearOfCall && !yearValid ? `Year must be between 1960 and ${CURRENT_YEAR}` : null;
  const expError = yearsExp && !expValid ? 'Please enter a valid number of years (0–60)' : null;

  const handleNext = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      await marketplaceService.saveApplicationDraft({
        ...application,
        currentStep: 2,
        credentials: {
          scnNumber: scnNumber.trim(),
          yearOfCall: yearNum,
          practiceAreas,
          yearsOfExperience: expNum,
          firmOrChambers: firm.trim() || undefined,
        },
      });
      await refreshApplication();
      router.push('/lawyer-application/documents' as any);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
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
            <Text style={[st.subtitle, { color: colors.textMuted }]}>Step 2 of 4 – Credentials</Text>
          </View>
        </View>

        <ApplicationProgress currentStep={1} />

        <ScrollView
          contentContainerStyle={[st.scroll, isWide && st.wideScroll]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[st.sectionHeader, { color: colors.text }]}>Your Credentials</Text>
          <Text style={[st.sectionSub, { color: colors.textMuted }]}>
            This information is used to verify your call to bar and legal standing.
          </Text>

          {/* SCN Number */}
          <Text style={[st.label, { color: colors.text }]}>Supreme Court Enrolment No. <Text style={{ color: colors.primary }}>*</Text></Text>
          <Text style={[st.hint, { color: colors.textMuted }]}>Format: SCN/LAG/0012345 or as shown on your certificate.</Text>
          <View style={[st.inputBox, { backgroundColor: colors.cardBackground, borderColor: scnError ? '#EF4444' : colors.border }]}>
            <Hash size={16} color={colors.primary} />
            <TextInput
              style={[st.input, { color: colors.text }]}
              value={scnNumber}
              onChangeText={setScnNumber}
              placeholder="e.g. SCN/LAG/0012345"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
              accessibilityLabel="Supreme Court enrolment number"
            />
            {scnValid && <Check size={14} color={colors.success} />}
          </View>
          {scnError && <Text style={st.error}>{scnError}</Text>}

          {/* Year of Call */}
          <Text style={[st.label, { color: colors.text }]}>Year of Call to Bar <Text style={{ color: colors.primary }}>*</Text></Text>
          <View style={[st.inputBox, { backgroundColor: colors.cardBackground, borderColor: yearError ? '#EF4444' : colors.border }]}>
            <Calendar size={16} color={colors.primary} />
            <TextInput
              style={[st.input, { color: colors.text }]}
              value={yearOfCall}
              onChangeText={setYearOfCall}
              placeholder={`e.g. ${CURRENT_YEAR - 5}`}
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={4}
              accessibilityLabel="Year of call to bar"
            />
            {yearValid && <Check size={14} color={colors.success} />}
          </View>
          {yearError && <Text style={st.error}>{yearError}</Text>}

          {/* Years of Experience */}
          <Text style={[st.label, { color: colors.text }]}>Years of Practice Experience <Text style={{ color: colors.primary }}>*</Text></Text>
          <View style={[st.inputBox, { backgroundColor: colors.cardBackground, borderColor: expError ? '#EF4444' : colors.border }]}>
            <Briefcase size={16} color={colors.primary} />
            <TextInput
              style={[st.input, { color: colors.text }]}
              value={yearsExp}
              onChangeText={setYearsExp}
              placeholder="e.g. 8"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={2}
              accessibilityLabel="Years of practice experience"
            />
            {expValid && <Check size={14} color={colors.success} />}
          </View>
          {expError && <Text style={st.error}>{expError}</Text>}

          {/* Firm / Chambers */}
          <Text style={[st.label, { color: colors.text }]}>Firm / Chambers (optional)</Text>
          <View style={[st.inputBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Briefcase size={16} color={colors.textMuted} />
            <TextInput
              style={[st.input, { color: colors.text }]}
              value={firm}
              onChangeText={setFirm}
              placeholder="e.g. Okonkwo & Associates"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              accessibilityLabel="Firm or chambers name"
            />
          </View>

          {/* Practice Areas */}
          <Text style={[st.label, { color: colors.text }]}>Practice Areas <Text style={{ color: colors.primary }}>*</Text></Text>
          <Text style={[st.hint, { color: colors.textMuted }]}>Select all areas you actively practise in.</Text>
          <View style={st.areasGrid}>
            {ALL_AREAS.map(([value, label]) => {
              const active = practiceAreas.includes(value);
              return (
                <TouchableOpacity
                  key={value}
                  style={[
                    st.areaChip,
                    { backgroundColor: active ? colors.accentLight : colors.cardBackground, borderColor: active ? colors.primary : colors.border, borderWidth: active ? 2 : 1 },
                  ]}
                  onPress={() => toggleArea(value)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: active }}
                  accessibilityLabel={label}
                >
                  {active && <Check size={12} color={colors.primary} />}
                  <Text style={[st.areaChipText, { color: active ? colors.primary : colors.text }]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {!areasValid && <Text style={[st.error, { marginTop: 4 }]}>Please select at least one practice area.</Text>}

          {/* Next */}
          <TouchableOpacity
            style={[st.nextBtn, { backgroundColor: colors.primary }, (!isValid || saving) && { opacity: 0.5 }]}
            onPress={handleNext}
            disabled={!isValid || saving}
            accessibilityLabel="Continue to documents"
          >
            {saving ? <ActivityIndicator color="#fff" /> : (
              <>
                <Text style={st.nextBtnText}>Continue</Text>
                <ChevronRight size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 17, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2 },
  scroll: { padding: Spacing.md, paddingBottom: 60 },
  wideScroll: { maxWidth: 640, alignSelf: 'center', width: '100%' },
  sectionHeader: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  sectionSub: { fontSize: 13, lineHeight: 19, marginBottom: Spacing.lg },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 6, marginTop: Spacing.md },
  hint: { fontSize: 12, lineHeight: 17, marginBottom: 8, marginTop: -4 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.md, borderWidth: 1, paddingHorizontal: Spacing.md, height: 48, gap: 8 },
  input: { flex: 1, fontSize: 14, outlineStyle: 'none' as any, outlineWidth: 0 as any, outlineColor: 'transparent' as any },
  error: { fontSize: 12, color: '#EF4444', marginTop: 4 },
  areasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  areaChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.pill, gap: 5, minHeight: 44 },
  areaChipText: { fontSize: 13, fontWeight: '700' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.pill, paddingVertical: 16, marginTop: Spacing.xl, gap: 8, ...Shadows.md },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
