/**
 * Lawyer Detail Screen – app/marketplace/[id].tsx
 */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  ShieldCheck,
  Star,
  Clock,
  Calendar,
  ChevronRight,
  AlertCircle,
  MessageSquarePlus,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { marketplaceService } from '../../services/marketplaceProvider';
import type { LawyerProfile } from '../../types/marketplace';
import { PRACTICE_AREA_LABELS } from '../../types/marketplace';

function MarketplaceFooter() {
  const { colors } = useTheme();
  return (
    <View style={[ftSt.footer, { borderTopColor: colors.border }]}>
      <Text style={[ftSt.text, { color: colors.textMuted }]}>
        Rights Compass is not a law firm and does not provide legal representation. Connecting with a lawyer does not constitute legal advice.
      </Text>
    </View>
  );
}
const ftSt = StyleSheet.create({
  footer: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderTopWidth: 1, marginTop: Spacing.md },
  text: { fontSize: 11, lineHeight: 16, textAlign: 'center' },
});

export default function LawyerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    marketplaceService.getLawyer(id)
      .then((l) => {
        if (l) setLawyer(l);
        else setError('Lawyer profile not found.');
      })
      .catch(() => setError('Could not load profile. Please try again.'))
      .finally(() => setLoading(false));
  }, [id]);

  const initials = lawyer
    ? lawyer.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '';

  return (
    <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
      {/* Back header */}
      <View style={[st.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[st.backBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/marketplace' as any)}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[st.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {loading ? 'Loading…' : lawyer?.fullName ?? 'Lawyer Profile'}
        </Text>
      </View>

      {loading && (
        <View style={st.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {!loading && error && (
        <View style={st.loadingBox}>
          <AlertCircle size={40} color={colors.textMuted} />
          <Text style={[st.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity style={[st.retryBtn, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
            <Text style={st.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && lawyer && (
        <ScrollView
          contentContainerStyle={[st.scroll, isWide && st.wideScroll]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero card */}
          <View style={[st.heroCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={[st.avatar, { backgroundColor: colors.primary }]}>
              <Text style={st.avatarText}>{initials}</Text>
            </View>

            <Text style={[st.name, { color: colors.text }]}>{lawyer.fullName}</Text>

            {/* Verified badge */}
            <View style={[st.verifiedBadge, { backgroundColor: colors.success + '20' }]}>
              <ShieldCheck size={13} color={colors.success} />
              <Text style={[st.verifiedText, { color: colors.success }]}>NBA Verified</Text>
            </View>

            {/* Meta row */}
            <View style={st.metaRow}>
              <View style={st.metaItem}>
                <MapPin size={13} color={colors.textMuted} />
                <Text style={[st.metaText, { color: colors.textMuted }]}>{lawyer.city}, {lawyer.state}</Text>
              </View>
              <View style={st.metaDot} />
              <View style={st.metaItem}>
                <Briefcase size={13} color={colors.textMuted} />
                <Text style={[st.metaText, { color: colors.textMuted }]}>{lawyer.yearsOfExperience} yrs exp</Text>
              </View>
              {lawyer.rating && (
                <>
                  <View style={st.metaDot} />
                  <View style={st.metaItem}>
                    <Star size={13} color="#D97706" />
                    <Text style={[st.metaText, { color: '#D97706' }]}>{lawyer.rating}</Text>
                  </View>
                </>
              )}
            </View>

            {/* Availability */}
            <View style={[st.availBadge, { backgroundColor: lawyer.isAvailable ? colors.success + '15' : colors.border }]}>
              <Clock size={12} color={lawyer.isAvailable ? colors.success : colors.textMuted} />
              <Text style={[st.availText, { color: lawyer.isAvailable ? colors.success : colors.textMuted }]}>
                {lawyer.isAvailable ? 'Currently Available' : 'Currently Unavailable'}
              </Text>
            </View>
          </View>

          {/* Bio */}
          <View style={[st.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[st.sectionTitle, { color: colors.text }]}>About</Text>
            <Text style={[st.bioText, { color: colors.textMuted }]}>{lawyer.bio}</Text>
          </View>

          {/* Practice areas */}
          <View style={[st.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[st.sectionTitle, { color: colors.text }]}>Practice Areas</Text>
            <View style={st.areaChips}>
              {lawyer.practiceAreas.map((pa) => (
                <View key={pa} style={[st.areaChip, { backgroundColor: colors.accentLight }]}>
                  <Text style={[st.areaChipText, { color: colors.primary }]}>{PRACTICE_AREA_LABELS[pa]}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Credentials */}
          <View style={[st.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[st.sectionTitle, { color: colors.text }]}>Credentials</Text>
            <View style={st.credRow}>
              <Text style={[st.credLabel, { color: colors.textMuted }]}>Supreme Court No.</Text>
              <Text style={[st.credValue, { color: colors.text }]}>{lawyer.scnNumber}</Text>
            </View>
            <View style={st.credRow}>
              <Text style={[st.credLabel, { color: colors.textMuted }]}>Year of Call</Text>
              <Text style={[st.credValue, { color: colors.text }]}>{lawyer.yearOfCall}</Text>
            </View>
            {lawyer.firmOrChambers && (
              <View style={st.credRow}>
                <Text style={[st.credLabel, { color: colors.textMuted }]}>Firm / Chambers</Text>
                <Text style={[st.credValue, { color: colors.text }]}>{lawyer.firmOrChambers}</Text>
              </View>
            )}
            {lawyer.consultationsCompleted !== undefined && (
              <View style={st.credRow}>
                <Text style={[st.credLabel, { color: colors.textMuted }]}>Consultations</Text>
                <Text style={[st.credValue, { color: colors.text }]}>{lawyer.consultationsCompleted} completed</Text>
              </View>
            )}
          </View>

          {/* Disclaimer notice */}
          <View style={[st.disclaimerBox, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
            <AlertCircle size={14} color="#92400E" />
            <Text style={st.disclaimerText}>
              This is not legal advice. Contact is made at your own discretion. Rights Compass does not guarantee any legal outcome.
            </Text>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[st.ctaBtn, { backgroundColor: colors.primary }, !lawyer.isAvailable && { opacity: 0.5 }]}
            onPress={() => router.push({ pathname: '/marketplace/request', params: { lawyerId: lawyer.id, lawyerName: lawyer.fullName } } as any)}
            disabled={!lawyer.isAvailable}
            accessibilityLabel={`Request consultation with ${lawyer.fullName}`}
            accessibilityHint={lawyer.isAvailable ? undefined : 'This lawyer is currently unavailable'}
          >
            <MessageSquarePlus size={18} color="#fff" />
            <Text style={st.ctaBtnText}>
              {lawyer.isAvailable ? 'Request Consultation' : 'Lawyer Unavailable'}
            </Text>
          </TouchableOpacity>

          <MarketplaceFooter />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '700' },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  errorText: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  retryBtn: { paddingHorizontal: Spacing.lg, paddingVertical: 12, borderRadius: BorderRadius.pill },
  retryText: { color: '#fff', fontWeight: '700' },
  scroll: { padding: Spacing.md, paddingBottom: 110 },
  wideScroll: { maxWidth: 720, alignSelf: 'center', width: '100%' },
  heroCard: { borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.md, borderWidth: 1, ...Shadows.md },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  name: { fontSize: 22, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 5, borderRadius: BorderRadius.pill, marginBottom: 12, gap: 5 },
  verifiedText: { fontSize: 12, fontWeight: '800' },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', gap: 4, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13 },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#ccc' },
  availBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.pill, gap: 6 },
  availText: { fontSize: 12, fontWeight: '700' },
  section: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: Spacing.sm },
  bioText: { fontSize: 14, lineHeight: 22 },
  areaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  areaChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.pill },
  areaChipText: { fontSize: 13, fontWeight: '700' },
  credRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.08)' },
  credLabel: { fontSize: 13 },
  credValue: { fontSize: 13, fontWeight: '700' },
  disclaimerBox: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, gap: 8 },
  disclaimerText: { flex: 1, fontSize: 12, lineHeight: 18, color: '#92400E' },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.pill, paddingVertical: 16, gap: 8, ...Shadows.md },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
