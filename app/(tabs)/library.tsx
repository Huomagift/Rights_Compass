import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import {
  Search,
  XCircle,
  BookOpen,
  Shield,
  Home,
  Briefcase,
  Scale,
  Landmark,
  Gavel,
  FileText,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Filter,
  Download,
  FileDown,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { CONSTITUTION_SECTIONS, LegalSection, getContextualTakeaway } from '../../data/constitutionStore';
import { EmptyState } from '../../components/EmptyState';

const BOOKMARKS_STORAGE_KEY = '@rights_compass_bookmarked_sections';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Rights', icon: BookOpen },
  { id: 'police', label: 'Police & Arrest', icon: Shield },
  { id: 'civil', label: 'Civil Rights', icon: Scale },
  { id: 'tenancy', label: 'Tenant Rights', icon: Home },
  { id: 'employment', label: 'Employment', icon: Briefcase },
  { id: 'judicature', label: 'Courts & Judiciary', icon: Gavel },
  { id: 'legislature', label: 'Legislature', icon: Landmark },
  { id: 'bookmarks', label: 'Saved Rights', icon: Bookmark },
];

const QUICK_TOPIC_HUBS = [
  {
    id: 'police',
    title: 'Police Stops & Arrests',
    subtitle: 'Section 35 & 37 • Search & Detention Rules',
    icon: Shield,
    count: '14 Sections',
    color: '#D97706', // M3 Warm Amber
  },
  {
    id: 'civil',
    title: 'Fundamental Rights',
    subtitle: 'Chapter IV • Dignity, Fair Trial & Privacy',
    icon: Scale,
    count: '16 Sections',
    color: '#2563EB', // M3 Royal Blue
  },
  {
    id: 'tenancy',
    title: 'Tenant Protection',
    subtitle: 'Quit Notice & Illegal Eviction Laws',
    icon: Home,
    count: '8 Provisions',
    color: '#059669', // M3 Emerald Green
  },
  {
    id: 'employment',
    title: 'Workplace Rights',
    subtitle: 'Labour Act • Severance & Notice',
    icon: Briefcase,
    count: '6 Provisions',
    color: '#7C3AED', // M3 Purple
  },
];

const INITIAL_LIMIT = 24;

export default function LibraryScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, isDark, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const isWide = width > 768;

  // Helper to extract static PDF URL from Metro asset bundler across web and native
  const getPdfAssetUrl = (): string => {
    try {
      const rawAsset = require('../../assets/constitution-of-the-federal-republic-of-nigeria.pdf');
      if (typeof rawAsset === 'string') return rawAsset;
      if (rawAsset?.default && typeof rawAsset.default === 'string') return rawAsset.default;
      if (rawAsset?.uri && typeof rawAsset.uri === 'string') return rawAsset.uri;
      if (rawAsset?.default?.uri && typeof rawAsset.default.uri === 'string') return rawAsset.default.uri;
    } catch (e) {
      console.warn('Error requiring PDF asset:', e);
    }
    return '/assets/constitution-of-the-federal-republic-of-nigeria.pdf';
  };

  // PDF Download Handler via Blob Fetch Strategy
  const handleDownloadPDF = async () => {
    try {
      const pdfUrl = getPdfAssetUrl();

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Fetch as Blob to trigger instant browser file download
        try {
          const response = await fetch(pdfUrl);
          if (response.ok) {
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = '1999_Constitution_of_the_Federal_Republic_of_Nigeria.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            return;
          }
        } catch (fetchErr) {
          console.warn('Blob fetch fallback to direct link:', fetchErr);
        }

        // Direct anchor fallback
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = '1999_Constitution_of_the_Federal_Republic_of_Nigeria.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        await WebBrowser.openBrowserAsync(pdfUrl);
      }
    } catch (err) {
      console.error('Failed to download/open PDF asset:', err);
    }
  };

  // Load Bookmarks on Mount
  useEffect(() => {
    AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY)
      .then((val) => {
        if (val) {
          try {
            setBookmarkedIds(JSON.parse(val));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  // Toggle Bookmark
  const toggleBookmark = async (id: string) => {
    let updated: string[];
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter((item) => item !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    try {
      await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  // Toggle Verbatim Accordion
  const toggleAccordion = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Sections Memo (Supports Multi-Category matching per section)
  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CONSTITUTION_SECTIONS.filter((item) => {
      let matchesCategory = true;
      if (activeCategory === 'bookmarks') {
        matchesCategory = bookmarkedIds.includes(item.id);
      } else if (activeCategory !== 'all') {
        matchesCategory = item.categories
          ? item.categories.includes(activeCategory as any)
          : item.category === activeCategory;
      }

      if (!matchesCategory) return false;
      if (!q) return true;

      const secNumMatch = item.sectionNumber
        ? String(item.sectionNumber) === q || `section ${item.sectionNumber}`.includes(q)
        : false;
      const titleMatch = item.title.toLowerCase().includes(q);
      const sectionStrMatch = item.section.toLowerCase().includes(q);
      const chapterMatch = item.chapter.toLowerCase().includes(q);
      const summaryMatch = item.plainLanguageSummary.toLowerCase().includes(q);
      const verbatimMatch = item.verbatimText.toLowerCase().includes(q);

      return (
        secNumMatch ||
        titleMatch ||
        sectionStrMatch ||
        chapterMatch ||
        summaryMatch ||
        verbatimMatch
      );
    });
  }, [searchQuery, activeCategory, bookmarkedIds]);

  const visibleSections = useMemo(() => {
    return filteredSections.slice(0, displayLimit);
  }, [filteredSections, displayLimit]);

  // Dynamic category count map for filter chips
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: CONSTITUTION_SECTIONS.length,
      bookmarks: bookmarkedIds.length,
    };
    CONSTITUTION_SECTIONS.forEach((item) => {
      const cats = item.categories || [item.category];
      cats.forEach((c) => {
        counts[c] = (counts[c] || 0) + 1;
      });
    });
    return counts;
  }, [bookmarkedIds]);

  // Featured Landmark Section (Section 35 or first civil right)
  const featuredProvision = useMemo(() => {
    return CONSTITUTION_SECTIONS.find((s) => s.sectionNumber === 35) || CONSTITUTION_SECTIONS[0];
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isWide && styles.wideContainer,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* MATERIAL 3 LARGE TOP APP BAR */}
        <View style={styles.topAppBar}>
          <View style={{ flex: 1 }}>
            <View style={styles.appBarBadgeRow}>
              <View
                style={[
                  styles.m3TagBadge,
                  { backgroundColor: isDark ? 'rgba(212, 98, 42, 0.2)' : colors.accentLight },
                ]}
              >
                <Sparkles size={12} color={colors.primary} />
                <Text style={[styles.m3TagText, { color: colors.primary }]}>
                  M3 Expressive Library
                </Text>
              </View>
              <Text style={[styles.offlineText, { color: colors.textMuted }]}>
                • 320 Sections 100% Offline
              </Text>
            </View>
            <Text style={[styles.pageTitle, { color: colors.text }]}>
              Legal Rights Library
            </Text>
            <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
              Explore the Constitution of Nigeria & statutory laws in simplified plain language.
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.themeToggleBtn,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.8}
            accessibilityLabel="Toggle Theme"
          >
            {isDark ? (
              <Sun size={18} color={colors.text} />
            ) : (
              <Moon size={18} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>

        {/* DOWNLOAD CONSTITUTION PDF BANNER */}
        <TouchableOpacity
          style={[
            styles.downloadPdfBanner,
            {
              backgroundColor: isDark ? 'rgba(212, 98, 42, 0.15)' : colors.accentLight,
              borderColor: colors.primary,
            },
          ]}
          onPress={handleDownloadPDF}
          activeOpacity={0.85}
          accessibilityLabel="Download Full 1999 Constitution PDF"
        >
          <View style={styles.downloadPdfIconBox}>
            <FileDown size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.downloadPdfTitle, { color: colors.primary }]}>
              Download Official 1999 Constitution PDF
            </Text>
            <Text style={[styles.downloadPdfSubtitle, { color: colors.textMuted }]}>
              Complete Unabridged Text • 2.1 MB PDF • Offline Document
            </Text>
          </View>
          <View style={[styles.downloadActionPill, { backgroundColor: colors.primary }]}>
            <Download size={14} color="#FFFFFF" />
            <Text style={styles.downloadActionText}>PDF</Text>
          </View>
        </TouchableOpacity>

        {/* MATERIAL 3 SEARCH ANCHOR */}
        <View
          style={[
            styles.m3SearchAnchor,
            {
              backgroundColor: colors.cardWhite,
              borderColor: colors.border,
            },
          ]}
        >
          <Search size={20} color={colors.primary} style={{ marginRight: Spacing.xs }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search section number or topic (e.g. '35', 'police', 'rent')..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={(txt) => {
              setSearchQuery(txt);
              setDisplayLimit(INITIAL_LIMIT);
            }}
          />
          {searchQuery !== '' && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setDisplayLimit(INITIAL_LIMIT);
              }}
              style={styles.clearBtn}
            >
              <XCircle size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* MATERIAL 3 EXPRESSIVE FILTER CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScrollContainer}
        >
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = activeCategory === cat.id;
            const IconComp = cat.icon;
            const isBookmarkTab = cat.id === 'bookmarks';
            const count = categoryCounts[cat.id] ?? 0;
            const countLabel = ` (${count})`;

            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.m3FilterChip,
                  {
                    backgroundColor: isActive
                      ? colors.primary
                      : isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : colors.cardBackground,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => {
                  setActiveCategory(cat.id);
                  setDisplayLimit(INITIAL_LIMIT);
                }}
                activeOpacity={0.8}
              >
                <IconComp
                  size={15}
                  color={isActive ? '#FFFFFF' : isBookmarkTab ? '#D97706' : colors.textMuted}
                />
                <Text
                  style={[
                    styles.m3ChipText,
                    {
                      color: isActive ? '#FFFFFF' : colors.text,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {cat.label}
                  {countLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* QUICK TOPIC HUBS (Show when no active search) */}
        {!searchQuery && activeCategory === 'all' && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              Quick Topic Hubs
            </Text>
            <View style={[styles.hubsGrid, isWide && styles.wideHubsGrid]}>
              {QUICK_TOPIC_HUBS.map((hub) => {
                const IconComponent = hub.icon;
                return (
                  <TouchableOpacity
                    key={hub.id}
                    style={[
                      styles.hubCard,
                      {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.border,
                      },
                    ]}
                    activeOpacity={0.85}
                    onPress={() => {
                      setActiveCategory(hub.id);
                      setDisplayLimit(INITIAL_LIMIT);
                    }}
                  >
                    <View
                      style={[
                        styles.hubIconBox,
                        { backgroundColor: `${hub.color}15` },
                      ]}
                    >
                      <IconComponent size={22} color={hub.color} />
                    </View>
                    <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                      <Text style={[styles.hubTitle, { color: colors.text }]}>
                        {hub.title}
                      </Text>
                      <Text style={[styles.hubSubtitle, { color: colors.textMuted }]}>
                        {hub.subtitle}
                      </Text>
                    </View>
                    <ArrowRight size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* SPOTLIGHT LANDMARK CARD */}
            {featuredProvision && (
              <View
                style={[
                  styles.spotlightCard,
                  {
                    backgroundColor: isDark ? '#1C1814' : '#FFF9F3',
                    borderColor: colors.primary,
                  },
                ]}
              >
                <View style={styles.spotlightHeader}>
                  <View
                    style={[
                      styles.spotlightBadge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.spotlightBadgeText}>LANDMARK RIGHT SPOTLIGHT</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleBookmark(featuredProvision.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Bookmark
                      size={20}
                      color={colors.primary}
                      fill={bookmarkedIds.includes(featuredProvision.id) ? colors.primary : 'none'}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.spotlightTitle, { color: colors.text }]}>
                  {featuredProvision.section}: {featuredProvision.title}
                </Text>
                <Text style={[styles.spotlightSummary, { color: colors.text }]}>
                  {featuredProvision.plainLanguageSummary}
                </Text>
                {getContextualTakeaway(featuredProvision, activeCategory) && (
                  <View
                    style={[
                      styles.takeawayPill,
                      { backgroundColor: colors.accentLight },
                    ]}
                  >
                    <CheckCircle2 size={14} color={colors.primary} />
                    <Text style={[styles.takeawayText, { color: colors.primary }]}>
                      {getContextualTakeaway(featuredProvision, activeCategory)}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={[
                    styles.readMoreBtn,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => router.push(`/guide/${featuredProvision.id}` as any)}
                >
                  <Text style={styles.readMoreBtnText}>Read Full Guide & Case Analysis</Text>
                  <ArrowRight size={15} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* PROVISIONS FEED HEADER */}
        <View style={styles.feedHeaderRow}>
          <Text style={[styles.feedCountText, { color: colors.textMuted }]}>
            Showing {visibleSections.length} of {filteredSections.length} provisions
          </Text>
          {activeCategory !== 'all' && (
            <TouchableOpacity
              onPress={() => setActiveCategory('all')}
              style={styles.resetCategoryBtn}
            >
              <Text style={[styles.resetCategoryText, { color: colors.primary }]}>
                Clear Filter
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* PROVISIONS M3 CARDS GRID */}
        <View style={[styles.cardsGrid, isWide && styles.wideCardsGrid]}>
          {visibleSections.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            const isExpanded = !!expandedIds[item.id];

            return (
              <View
                key={item.id}
                style={[
                  styles.m3Card,
                  isWide && styles.wideM3Card,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Card Header Row */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.badgeGroup}>
                    <View
                      style={[
                        styles.sectionBadge,
                        { backgroundColor: colors.accentLight },
                      ]}
                    >
                      <Text style={[styles.sectionBadgeText, { color: colors.primary }]}>
                        {item.section}
                      </Text>
                    </View>
                    <Text
                      style={[styles.chapterText, { color: colors.textMuted }]}
                      numberOfLines={1}
                    >
                      {item.chapter.split(':')[0]}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleBookmark(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel="Bookmark right"
                  >
                    <Bookmark
                      size={19}
                      color={isBookmarked ? '#D97706' : colors.textMuted}
                      fill={isBookmarked ? '#D97706' : 'none'}
                    />
                  </TouchableOpacity>
                </View>

                {/* Card Title & Summary */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push(`/guide/${item.id}` as any)}
                >
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.summaryText, { color: colors.text }]}>
                    {item.plainLanguageSummary}
                  </Text>
                </TouchableOpacity>

                {/* Key Takeaway Pill if present (Context-Aware based on active filter) */}
                {getContextualTakeaway(item, activeCategory) && (
                  <View
                    style={[
                      styles.cardTakeawayBox,
                      { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : colors.cardWhite },
                    ]}
                  >
                    <Text style={[styles.takeawayLabel, { color: colors.primary }]}>
                      KEY TAKEAWAY:
                    </Text>
                    <Text style={[styles.cardTakeawayContent, { color: colors.text }]}>
                      {getContextualTakeaway(item, activeCategory)}
                    </Text>
                  </View>
                )}

                {/* Verbatim Collapsible Accordion */}
                <View style={styles.accordionBox}>
                  <TouchableOpacity
                    style={styles.accordionToggle}
                    onPress={() => toggleAccordion(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.accordionToggleText, { color: colors.primary }]}>
                      {isExpanded ? 'Hide Official Text' : 'View Constitutional Text'}
                    </Text>
                    {isExpanded ? (
                      <ChevronUp size={16} color={colors.primary} />
                    ) : (
                      <ChevronDown size={16} color={colors.primary} />
                    )}
                  </TouchableOpacity>

                  {isExpanded && (
                    <View
                      style={[
                        styles.verbatimTextContainer,
                        {
                          backgroundColor: colors.cardWhite,
                          borderLeftColor: colors.primary,
                        },
                      ]}
                    >
                      <Text style={[styles.verbatimText, { color: colors.textMuted }]}>
                        {`"${item.verbatimText}"`}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* LOAD MORE BUTTON */}
        {visibleSections.length < filteredSections.length && (
          <TouchableOpacity
            style={[
              styles.loadMoreBtn,
              { backgroundColor: colors.cardWhite, borderColor: colors.primary },
            ]}
            onPress={() => setDisplayLimit((prev) => prev + 24)}
            activeOpacity={0.8}
          >
            <Text style={[styles.loadMoreBtnText, { color: colors.primary }]}>
              Load More Rights ({filteredSections.length - visibleSections.length} remaining) ↓
            </Text>
          </TouchableOpacity>
        )}

        {/* EMPTY STATE */}
        {filteredSections.length === 0 && (
          <EmptyState
            icon="search"
            title={
              activeCategory === 'bookmarks'
                ? 'No Bookmarked Rights Yet'
                : 'No Matching Provisions Found'
            }
            description={
              activeCategory === 'bookmarks'
                ? 'Tap the bookmark icon on any legal provision to save it here for offline quick reference.'
                : "Try searching by section number (e.g. '33', '35') or keyword ('police', 'tenant', 'court')."
            }
            actionLabel="Reset Search & Filters"
            onAction={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 110, // accommodate floating tab bar
  },
  wideContainer: {
    maxWidth: 1040,
    alignSelf: 'center',
    width: '100%',
  },
  topAppBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  appBarBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  m3TagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    marginRight: Spacing.xs,
  },
  m3TagText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  offlineText: {
    fontSize: 11,
    fontWeight: '500',
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
  },
  themeToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  downloadPdfBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1.5,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  downloadPdfIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadPdfTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  downloadPdfSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  downloadActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    marginLeft: 8,
  },
  downloadActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
  m3SearchAnchor: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28, // M3 pill search anchor
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
  },
  clearBtn: {
    padding: 2,
  },
  chipScrollContainer: {
    paddingRight: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  m3FilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20, // M3 Expressive chip
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    marginRight: Spacing.xs,
    borderWidth: 1,
  },
  m3ChipText: {
    fontSize: 12.5,
    marginLeft: 6,
  },
  sectionContainer: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  hubsGrid: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  wideHubsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    flex: 1,
    minWidth: 280,
    ...Shadows.sm,
  },
  hubIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  hubSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  spotlightCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1.5,
    ...Shadows.md,
  },
  spotlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  spotlightBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  spotlightBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  spotlightTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  spotlightSummary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  takeawayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  takeawayText: {
    fontSize: 12.5,
    fontWeight: '600',
    marginLeft: 6,
    flex: 1,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BorderRadius.pill,
  },
  readMoreBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    marginRight: 6,
  },
  feedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  feedCountText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  resetCategoryBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  resetCategoryText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  cardsGrid: {
    gap: Spacing.md,
  },
  wideCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  m3Card: {
    borderRadius: BorderRadius.lg, // M3 medium rounded corner (20px)
    padding: Spacing.md,
    borderWidth: 1,
    width: '100%',
    ...Shadows.sm,
  },
  wideM3Card: {
    width: '49%',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionBadge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginRight: Spacing.xs,
  },
  sectionBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  chapterText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 17.5,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  summaryText: {
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  cardTakeawayBox: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  takeawayLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardTakeawayContent: {
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '500',
  },
  accordionBox: {
    marginTop: Spacing.xs,
  },
  accordionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  accordionToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  verbatimTextContainer: {
    marginTop: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
  },
  verbatimText: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  loadMoreBtn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginVertical: Spacing.md,
    borderWidth: 1.5,
  },
  loadMoreBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

