import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
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
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { CONSTITUTION_SECTIONS } from '../../data/constitutionStore';
import { EmptyState } from '../../components/EmptyState';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All (320+)' },
  { id: 'police', label: 'Police & Arrest' },
  { id: 'civil', label: 'Fundamental & Civil Rights' },
  { id: 'legislature', label: 'Legislature (Ch. V)' },
  { id: 'executive', label: 'Executive (Ch. VI)' },
  { id: 'judicature', label: 'Judicature & Courts (Ch. VII)' },
  { id: 'tenancy', label: 'Tenant Rights' },
  { id: 'employment', label: 'Employment' },
];

const getCategoryIcon = (category: string, primaryColor: string) => {
  switch (category) {
    case 'police':
      return <Shield size={18} color={primaryColor} />;
    case 'tenancy':
      return <Home size={18} color={primaryColor} />;
    case 'employment':
      return <Briefcase size={18} color={primaryColor} />;
    case 'civil':
      return <Scale size={18} color={primaryColor} />;
    case 'legislature':
      return <Landmark size={18} color={primaryColor} />;
    case 'executive':
      return <FileText size={18} color={primaryColor} />;
    case 'judicature':
      return <Gavel size={18} color={primaryColor} />;
    default:
      return <BookOpen size={18} color={primaryColor} />;
  }
};

const INITIAL_LIMIT = 30;

export default function LibraryScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CONSTITUTION_SECTIONS.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;

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
  }, [searchQuery, activeCategory]);

  const visibleSections = useMemo(() => {
    return filteredSections.slice(0, displayLimit);
  }, [filteredSections, displayLimit]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerTopRow}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>
              Legal Rights Library
            </Text>
            <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
              Full 1999 Constitution of Nigeria (320 Sections) & fundamental statutory laws — 100% offline.
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
              <Sun size={17} color={colors.text} />
            ) : (
              <Moon size={17} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.cardWhite, borderColor: colors.border },
          ]}
        >
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search rights or sections (e.g. 33, life, arrest)..."
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
            >
              <XCircle size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* CATEGORY FILTER CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? colors.primary : colors.cardBackground,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => {
                  setActiveCategory(cat.id);
                  setDisplayLimit(INITIAL_LIMIT);
                }}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isActive ? '#FFFFFF' : colors.textMuted,
                      fontWeight: isActive ? '700' : '600',
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.resultCountText, { color: colors.textMuted }]}>
          Showing {visibleSections.length} of {filteredSections.length} provisions
        </Text>

        {visibleSections.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.rightCard,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
            activeOpacity={0.8}
            onPress={() => router.push(`/guide/${item.id}` as any)}
          >
            <View style={styles.cardHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                  style={[
                    styles.categoryIconCircle,
                    { backgroundColor: colors.accentLight, borderColor: colors.border },
                  ]}
                >
                  {getCategoryIcon(item.category, colors.primary)}
                </View>
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
              </View>
              <Text style={[styles.chapterText, { color: colors.textMuted }]} numberOfLines={1}>
                {item.chapter.split(':')[0]}
              </Text>
            </View>

            <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.summaryText, { color: colors.text }]}>
              {item.plainLanguageSummary}
            </Text>

            <View
              style={[
                styles.verbatimPreviewBox,
                { backgroundColor: colors.cardWhite, borderLeftColor: colors.primary },
              ]}
            >
              <Text style={[styles.verbatimLabel, { color: colors.primary }]}>
                CONSTITUTIONAL TEXT EXCERPT:
              </Text>
              <Text
                style={[styles.verbatimText, { color: colors.textMuted }]}
                numberOfLines={3}
              >
                {`"${item.verbatimText}"`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {visibleSections.length < filteredSections.length && (
          <TouchableOpacity
            style={[
              styles.loadMoreBtn,
              { backgroundColor: colors.cardWhite, borderColor: colors.primary },
            ]}
            onPress={() => setDisplayLimit((prev) => prev + 40)}
          >
            <Text style={[styles.loadMoreBtnText, { color: colors.primary }]}>
              Load More Sections ({filteredSections.length - visibleSections.length} remaining) ↓
            </Text>
          </TouchableOpacity>
        )}

        {filteredSections.length === 0 && (
          <EmptyState
            icon="search"
            title="No Matching Provisions Found"
            description="Try searching by section number (e.g. '33', '68') or keyword ('life', 'governor', 'court')."
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
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  themeToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
    marginBottom: Spacing.xs,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1.5,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: Spacing.xs,
  },
  filterScroll: {
    paddingRight: Spacing.md,
    paddingVertical: 2,
  },
  filterChip: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    marginRight: Spacing.xs,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 100, // accommodate bottom tab bar
  },
  resultCountText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  rightCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    ...Shadows.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  categoryIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
    borderWidth: 1,
  },
  sectionBadge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  chapterText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: Spacing.sm,
  },
  verbatimPreviewBox: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 3,
  },
  verbatimLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },
  verbatimText: {
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  loadMoreBtn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginVertical: Spacing.sm,
    borderWidth: 1.5,
  },
  loadMoreBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
