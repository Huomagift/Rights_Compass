/**
 * Marketplace Directory – components/MarketplaceDirectory.tsx
 * Lists all verified lawyers with search + filter chips inside the (tabs)/marketplace tab.
 * Allows users to browse lawyers with the fixed 4-tab bottom navigation bar always present.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  useWindowDimensions,
  RefreshControl,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  Briefcase,
  ShieldCheck,
  Sun,
  Moon,
  WifiOff,
  ChevronRight,
  X,
  MessageSquarePlus,
} from 'lucide-react-native';
import NetInfo from '@react-native-community/netinfo';
import { Spacing, BorderRadius, Shadows, CONTENT_MAX_WIDTH } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { marketplaceService } from '../services/marketplaceProvider';
import type { LawyerProfile, PracticeArea, LawyerFilters } from '../types/marketplace';
import { PRACTICE_AREA_LABELS } from '../types/marketplace';
import { SkeletonPulse } from './LoadingState';

const PRACTICE_AREA_CHIPS: { label: string; value: PracticeArea | null }[] = [
  { label: 'All Areas', value: null },
  { label: 'Tenancy & Land', value: 'tenancy_land' },
  { label: 'Employment', value: 'employment' },
  { label: 'Family Law', value: 'family' },
  { label: 'Human Rights', value: 'police_human_rights' },
  { label: 'Consumer', value: 'consumer' },
  { label: 'Business', value: 'business' },
  { label: 'Criminal', value: 'criminal' },
];

const CITY_CHIPS = ['All Cities', 'Lagos', 'Abuja', 'Port Harcourt', 'Enugu', 'Kano', 'Ibadan'];

// ─── Skeleton ────────────────────────────────────────────────────────────────

function LawyerCardSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={[sk.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <SkeletonPulse style={sk.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <SkeletonPulse style={{ height: 16, width: '60%', borderRadius: 4, marginBottom: 6 }} />
          <SkeletonPulse style={{ height: 12, width: '40%', borderRadius: 4 }} />
        </View>
        <SkeletonPulse style={{ height: 22, width: 60, borderRadius: BorderRadius.pill }} />
      </View>
      <SkeletonPulse style={{ height: 12, width: '90%', borderRadius: 4, marginBottom: 4 }} />
      <SkeletonPulse style={{ height: 12, width: '70%', borderRadius: 4, marginBottom: 12 }} />
      <SkeletonPulse style={{ height: 36, width: '100%', borderRadius: BorderRadius.md }} />
    </View>
  );
}

const sk = StyleSheet.create({
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
});

// ─── Lawyer Card ──────────────────────────────────────────────────────────────

function LawyerCard({ lawyer, onPress }: { lawyer: LawyerProfile; onPress: () => void }) {
  const { colors } = useTheme();
  const initials = lawyer.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <TouchableOpacity
      style={[cardSt.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`View profile of ${lawyer.fullName}`}
    >
      {/* Header row */}
      <View style={cardSt.headerRow}>
        <View style={[cardSt.avatar, { backgroundColor: colors.primary }]}>
          <Text style={cardSt.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[cardSt.name, { color: colors.text }]} numberOfLines={1}>{lawyer.fullName}</Text>
            <View style={[cardSt.verifiedBadge, { backgroundColor: colors.success + '20' }]}>
              <ShieldCheck size={11} color={colors.success} />
              <Text style={[cardSt.verifiedText, { color: colors.success }]}>Verified</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
            <MapPin size={11} color={colors.textMuted} />
            <Text style={[cardSt.sub, { color: colors.textMuted }]}> {lawyer.city}, {lawyer.state}</Text>
            <Text style={[cardSt.sub, { color: colors.textMuted }]}> · {lawyer.yearsOfExperience} yrs exp</Text>
          </View>
        </View>

        {/* Availability dot */}
        <View style={[cardSt.availDot, { backgroundColor: lawyer.isAvailable ? colors.success : colors.textMuted }]} />
      </View>

      {/* Practice areas */}
      <View style={cardSt.chipsRow}>
        {lawyer.practiceAreas.slice(0, 2).map((pa) => (
          <View key={pa} style={[cardSt.chip, { backgroundColor: colors.accentLight }]}>
            <Text style={[cardSt.chipText, { color: colors.primary }]} numberOfLines={1}>
              {PRACTICE_AREA_LABELS[pa]}
            </Text>
          </View>
        ))}
        {lawyer.practiceAreas.length > 2 && (
          <View style={[cardSt.chip, { backgroundColor: colors.cardBackground }]}>
            <Text style={[cardSt.chipText, { color: colors.textMuted }]}>+{lawyer.practiceAreas.length - 2}</Text>
          </View>
        )}
        {lawyer.rating && (
          <View style={[cardSt.chip, { backgroundColor: '#FEF3C7', marginLeft: 'auto' }]}>
            <Star size={10} color="#D97706" />
            <Text style={[cardSt.chipText, { color: '#D97706', marginLeft: 3 }]}>{lawyer.rating}</Text>
          </View>
        )}
      </View>

      {/* Bio snippet */}
      <Text style={[cardSt.bio, { color: colors.textMuted }]} numberOfLines={2}>{lawyer.bio}</Text>

      {/* CTA */}
      <View style={[cardSt.cta, { backgroundColor: colors.primary }]}>
        <Text style={cardSt.ctaText}>View Profile</Text>
        <ChevronRight size={15} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const cardSt = StyleSheet.create({
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, ...Shadows.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  name: { fontSize: 15, fontWeight: '800', flex: 1 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7, paddingVertical: 3, borderRadius: BorderRadius.pill, marginLeft: 6, gap: 3 },
  verifiedText: { fontSize: 10, fontWeight: '800' },
  sub: { fontSize: 12 },
  availDot: { width: 10, height: 10, borderRadius: 5 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.pill },
  chipText: { fontSize: 11, fontWeight: '700' },
  bio: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.md, paddingVertical: 10, gap: 4 },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});

// ─── Footer Disclaimer ────────────────────────────────────────────────────────

function MarketplaceFooter() {
  const { colors } = useTheme();
  return (
    <View style={[ftSt.footer, { borderTopColor: colors.border }]}>
      <Text style={[ftSt.text, { color: colors.textMuted }]}>
        Rights Compass is not a law firm and does not provide legal representation. Connecting with a lawyer through this directory does not constitute legal advice.
      </Text>
    </View>
  );
}

const ftSt = StyleSheet.create({
  footer: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderTopWidth: 1, marginTop: Spacing.md },
  text: { fontSize: 11, lineHeight: 16, textAlign: 'center' },
});

// ─── Main Directory Component ──────────────────────────────────────────────────

export function MarketplaceDirectory() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<PracticeArea | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Offline detection
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });
    return unsub;
  }, []);

  // Track whether data has ever loaded (M3: first visit → spinner, subsequent → skeleton)
  const hasLoadedOnce = useRef(false);

  const fetchLawyers = useCallback(async () => {
    try {
      setError(null);
      const filters: LawyerFilters = {};
      if (searchQuery.trim()) filters.searchQuery = searchQuery.trim();
      if (selectedArea) filters.practiceArea = selectedArea;
      if (selectedCity && selectedCity !== 'All Cities') filters.city = selectedCity;

      const results = await marketplaceService.listLawyers(filters);
      setLawyers(results);
      hasLoadedOnce.current = true;
    } catch (e: any) {
      setError('Could not load lawyers. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, selectedArea, selectedCity]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(fetchLawyers, 300); // debounce search
    return () => clearTimeout(t);
  }, [fetchLawyers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLawyers();
  };

  return (
    <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
      {/* Offline banner — stays above scroll so it's always visible */}
      {!isOnline && (
        <View style={[st.offlineBanner, { backgroundColor: '#FEF3C7' }]}>
          <WifiOff size={16} color="#D97706" />
          <Text style={[st.offlineText, { color: '#92400E' }]}>
            You're offline. Showing cached lawyers.
          </Text>
        </View>
      )}

      {/* ─── Unified ScrollView (Library style) ─── */}
      <ScrollView
        contentContainerStyle={[st.scroll, isWide && st.wideScroll]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* ── Library-style Top App Bar ── */}
        <View style={st.topAppBar}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <Text style={[st.eyebrow, { color: colors.textMuted }]}>
              NBA-verified · Free to browse
            </Text>
            <Text style={[st.pageTitle, { color: colors.text }]}>Find a Lawyer</Text>
            <Text style={[st.pageSubtitle, { color: colors.textMuted }]}>
              Connect with accredited legal practitioners across Nigeria.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={[st.iconBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => router.push('/marketplace/my-requests' as any)}
              accessibilityLabel="My consultation requests"
            >
              <MessageSquarePlus size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[st.iconBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={toggleTheme}
              accessibilityLabel="Toggle theme"
            >
              {isDark ? <Sun size={18} color={colors.text} /> : <Moon size={18} color={colors.text} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Search ── */}
        <View style={[st.searchBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            style={[st.searchInput, { color: colors.text }]}
            placeholder="Search by name, area, city…"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search lawyers"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} accessibilityLabel="Clear search">
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Practice Area Filter Chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={st.chipsScroll}
        >
          {PRACTICE_AREA_CHIPS.map((chip) => {
            const active = selectedArea === chip.value;
            return (
              <TouchableOpacity
                key={chip.label}
                style={[
                  st.filterChip,
                  {
                    backgroundColor: active ? colors.primary : colors.cardBackground,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedArea(chip.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Filter by ${chip.label}`}
              >
                <Text style={[st.filterChipText, { color: active ? '#fff' : colors.text }]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── City Filter Chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[st.chipsScroll, { marginBottom: Spacing.md }]}
        >
          {CITY_CHIPS.map((city) => {
            const active = (selectedCity ?? 'All Cities') === city;
            return (
              <TouchableOpacity
                key={city}
                style={[
                  st.filterChip,
                  {
                    backgroundColor: active ? colors.primaryDark : colors.cardBackground,
                    borderColor: active ? colors.primaryDark : colors.border,
                  },
                ]}
                onPress={() => setSelectedCity(city === 'All Cities' ? null : city)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Filter by city ${city}`}
              >
                <Text style={[st.filterChipText, { color: active ? '#fff' : colors.textMuted }]}>
                  {city}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Loading ── */}
        {loading && (
          <>
            {!hasLoadedOnce.current ? (
              <View style={{ paddingVertical: 48, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 12, fontSize: 13, color: colors.textMuted, fontWeight: '600' }}>
                  Loading legal practitioners…
                </Text>
              </View>
            ) : (
              [1, 2, 3].map((i) => <LawyerCardSkeleton key={i} />)
            )}
          </>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <View style={[st.emptyBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[st.emptyTitle, { color: colors.text }]}>Something went wrong</Text>
            <Text style={[st.emptySub, { color: colors.textMuted }]}>{error}</Text>
            <TouchableOpacity
              style={[st.retryBtn, { backgroundColor: colors.primary }]}
              onPress={fetchLawyers}
              accessibilityLabel="Retry loading lawyers"
            >
              <Text style={st.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && lawyers.length === 0 && (
          <View style={[st.emptyBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <SlidersHorizontal size={40} color={colors.textMuted} />
            <Text style={[st.emptyTitle, { color: colors.text }]}>No lawyers found</Text>
            <Text style={[st.emptySub, { color: colors.textMuted }]}>
              Try adjusting your search query or practice area filter.
            </Text>
          </View>
        )}

        {/* ── Results ── */}
        {!loading && !error && lawyers.length > 0 && (
          <>
            <Text style={[st.resultCount, { color: colors.textMuted }]}>
              {lawyers.length} verified {lawyers.length === 1 ? 'lawyer' : 'lawyers'} available
            </Text>
            <View style={[st.cardGrid, isWide && st.cardGridWide]}>
              {lawyers.map((lawyer) => (
                <View key={lawyer.id} style={[isWide && st.cardGridItem]}>
                  <LawyerCard
                    lawyer={lawyer}
                    onPress={() => router.push(`/marketplace/${lawyer.id}` as any)}
                  />
                </View>
              ))}
            </View>
          </>
        )}

        <MarketplaceFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

export default MarketplaceDirectory;

const st = StyleSheet.create({
  container: { flex: 1 },
  // ── Library-style top app bar ──
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: 2,
  },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  searchBox: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, borderRadius: BorderRadius.pill, borderWidth: 1, paddingHorizontal: Spacing.md, height: 44, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, minHeight: 44, outlineStyle: 'none' as any, outlineWidth: 0 as any, outlineColor: 'transparent' as any },
  chipsScroll: { marginBottom: Spacing.sm },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: BorderRadius.pill, borderWidth: 1, marginRight: 8 },
  filterChipText: { fontSize: 12, fontWeight: '700' },
  offlineBanner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 10, gap: 8 },
  offlineText: { fontSize: 13, flex: 1 },
  scroll: { padding: Spacing.md, paddingBottom: 110 },
  wideScroll: { maxWidth: CONTENT_MAX_WIDTH, alignSelf: 'center', width: '100%' },
  resultCount: { fontSize: 13, marginBottom: Spacing.sm, fontWeight: '600' },
  cardGrid: { gap: 0 },
  cardGridWide: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cardGridItem: { flex: 1, minWidth: 360 },
  emptyBox: { borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center', borderWidth: 1, gap: 10, marginTop: Spacing.xl },
  emptyTitle: { fontSize: 18, fontWeight: '800' },
  emptySub: { fontSize: 14, textAlign: 'center' },
  retryBtn: { marginTop: 8, paddingHorizontal: Spacing.lg, paddingVertical: 12, borderRadius: BorderRadius.pill },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
