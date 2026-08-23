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
import { Search, XCircle, BookOpen, Shield, Home, Briefcase, Scale, Landmark, Gavel, FileText } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { CONSTITUTION_SECTIONS } from '../../data/constitutionStore';

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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'police':
      return <Shield size={18} color={Colors.primary} />;
    case 'tenancy':
      return <Home size={18} color={Colors.primary} />;
    case 'employment':
      return <Briefcase size={18} color={Colors.primary} />;
    case 'civil':
      return <Scale size={18} color={Colors.primary} />;
    case 'legislature':
      return <Landmark size={18} color={Colors.primary} />;
    case 'executive':
      return <FileText size={18} color={Colors.primary} />;
    case 'judicature':
      return <Gavel size={18} color={Colors.primary} />;
    default:
      return <BookOpen size={18} color={Colors.primary} />;
  }
};

const INITIAL_LIMIT = 30;

export default function LibraryScreen() {
  const router = useRouter();
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

      const secNumMatch = item.sectionNumber ? String(item.sectionNumber) === q || `section ${item.sectionNumber}`.includes(q) : false;
      const titleMatch = item.title.toLowerCase().includes(q);
      const sectionStrMatch = item.section.toLowerCase().includes(q);
      const chapterMatch = item.chapter.toLowerCase().includes(q);
      const summaryMatch = item.plainLanguageSummary.toLowerCase().includes(q);
      const verbatimMatch = item.verbatimText.toLowerCase().includes(q);

      return secNumMatch || titleMatch || sectionStrMatch || chapterMatch || summaryMatch || verbatimMatch;
    });
  }, [searchQuery, activeCategory]);

  const visibleSections = useMemo(() => {
    return filteredSections.slice(0, displayLimit);
  }, [filteredSections, displayLimit]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Legal Rights Library</Text>
        <Text style={styles.pageSubtitle}>
          Full 1999 Constitution of Nigeria (320 Sections) & fundamental statutory laws — 100% offline.
        </Text>

        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rights or sections (e.g. 33, life, arrest, recall)..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={(txt) => {
              setSearchQuery(txt);
              setDisplayLimit(INITIAL_LIMIT);
            }}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); setDisplayLimit(INITIAL_LIMIT); }}>
              <XCircle size={18} color={Colors.textMuted} />
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
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => {
                  setActiveCategory(cat.id);
                  setDisplayLimit(INITIAL_LIMIT);
                }}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
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
        <Text style={styles.resultCountText}>
          Showing {visibleSections.length} of {filteredSections.length} provisions
        </Text>

        {visibleSections.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.rightCard}
            activeOpacity={0.8}
            onPress={() => router.push(`/guide/${item.id}` as any)}
          >
            <View style={styles.cardHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={styles.categoryIconCircle}>
                  {getCategoryIcon(item.category)}
                </View>
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>{item.section}</Text>
                </View>
              </View>
              <Text style={styles.chapterText} numberOfLines={1}>
                {item.chapter.split(':')[0]}
              </Text>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.summaryText}>{item.plainLanguageSummary}</Text>

            <View style={styles.verbatimPreviewBox}>
              <Text style={styles.verbatimLabel}>CONSTITUTIONAL TEXT EXCERPT:</Text>
              <Text style={styles.verbatimText} numberOfLines={3}>
                {`"${item.verbatimText}"`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {visibleSections.length < filteredSections.length && (
          <TouchableOpacity
            style={styles.loadMoreBtn}
            onPress={() => setDisplayLimit((prev) => prev + 40)}
          >
            <Text style={styles.loadMoreBtnText}>
              Load More Sections ({filteredSections.length - visibleSections.length} remaining) ↓
            </Text>
          </TouchableOpacity>
        )}

        {filteredSections.length === 0 && (
          <View style={styles.emptyBox}>
            <BookOpen size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No matching constitutional provisions found</Text>
            <Text style={styles.emptySub}>
              Try searching by section number (e.g. &quot;33&quot;, &quot;68&quot;) or keyword (&quot;life&quot;, &quot;governor&quot;, &quot;court&quot;).
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  pageSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginLeft: Spacing.xs,
  },
  filterScroll: {
    paddingRight: Spacing.md,
  },
  filterChip: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  listContent: {
    padding: Spacing.md,
  },
  resultCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  rightCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
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
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  chapterText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  verbatimPreviewBox: {
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  verbatimLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 2,
  },
  verbatimText: {
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
    color: Colors.textMuted,
  },
  loadMoreBtn: {
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginVertical: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  loadMoreBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
});
