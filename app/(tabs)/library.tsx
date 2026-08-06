import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import { CONSTITUTION_SECTIONS, LegalSection } from '../../data/constitutionStore';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Rights' },
  { id: 'police', label: 'Police & Arrest' },
  { id: 'tenancy', label: 'Tenant Rights' },
  { id: 'employment', label: 'Employment' },
  { id: 'civil', label: 'Civil Rights' },
];

export default function LibraryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSections = CONSTITUTION_SECTIONS.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.plainLanguageSummary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Legal Rights Library</Text>
        <Text style={styles.pageSubtitle}>
          Full 1999 Constitution of Nigeria & fundamental statutory laws — available 100% offline.
        </Text>

        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rights (e.g. search, arrest, quit notice)..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
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
                onPress={() => setActiveCategory(cat.id)}
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
        {filteredSections.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.rightCard}
            activeOpacity={0.8}
            onPress={() => router.push(`/guide/${item.id}` as any)}
          >
            <View style={styles.cardHeaderRow}>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{item.section}</Text>
              </View>
              <Text style={styles.chapterText}>{item.chapter}</Text>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.summaryText}>{item.plainLanguageSummary}</Text>

            <View style={styles.takeawayBox}>
              <Text style={styles.takeawayLabel}>KEY TAKEAWAY:</Text>
              <Text style={styles.takeawayText}>{item.keyTakeaway}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredSections.length === 0 && (
          <View style={styles.emptyBox}>
            <Ionicons name="journal-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No matching rights found</Text>
            <Text style={styles.emptySub}>
              Try searching for terms like "privacy", "arrest", or "eviction".
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
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
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
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  listContent: {
    padding: Spacing.md,
  },
  rightCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  sectionBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
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
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  takeawayBox: {
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  takeawayLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 2,
  },
  takeawayText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
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
  },
});
