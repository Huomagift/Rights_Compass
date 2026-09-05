import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Share2, Bookmark, Scale, CheckCircle2, Sun, Moon } from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { FEATURED_GUIDE, RECENT_GUIDES } from '../../data/mockData';
import { CONSTITUTION_SECTIONS } from '../../data/constitutionStore';
import { EmptyState } from '../../components/EmptyState';

export default function GuideDetailScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find in guides or constitution sections
  const allGuides = [FEATURED_GUIDE, ...RECENT_GUIDES];
  const guide = allGuides.find((g) => g.id === id);
  const constSection = CONSTITUTION_SECTIONS.find(
    (s) => s.id === id || s.sectionNumber === parseInt(id || '', 10)
  );

  const title = guide?.title || constSection?.title || 'Legal Rights Guide';
  const category = guide?.category || constSection?.chapter || '1999 Constitution of Nigeria';
  const citation = guide?.citation || `${constSection?.section} — ${constSection?.chapter}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.cardBackground }]}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.cardBackground }]}
            onPress={toggleTheme}
            accessibilityLabel="Toggle Theme"
          >
            {isDark ? (
              <Sun size={17} color={colors.text} />
            ) : (
              <Moon size={17} color={colors.text} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.accentLight }]}
            accessibilityLabel="Share Guide"
          >
            <Share2 size={17} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.categoryBadge, { backgroundColor: colors.accentLight }]}>
          <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>{category}</Text>
        </View>

        <Text style={[styles.mainTitle, { color: colors.text }]}>{title}</Text>

        <View
          style={[
            styles.citationBox,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Bookmark size={14} color={colors.primary} />
          <Text style={[styles.citationText, { color: colors.primary }]}>
            Legal Citation: {citation}
          </Text>
        </View>

        {guide ? (
          guide.content.map((para, i) => (
            <Text key={i} style={[styles.paragraph, { color: colors.text }]}>
              {para}
            </Text>
          ))
        ) : constSection ? (
          <>
            {/* PLAIN LANGUAGE SUMMARY */}
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: colors.cardWhite, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.sectionHeaderLabel, { color: colors.textMuted }]}>
                PLAIN LANGUAGE SUMMARY
              </Text>
              <Text style={[styles.summaryBody, { color: colors.text }]}>
                {constSection.plainLanguageSummary}
              </Text>
            </View>

            {/* KEY TAKEAWAY */}
            <View
              style={[
                styles.takeawayCard,
                { backgroundColor: colors.accentLight, borderLeftColor: colors.primary },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <CheckCircle2 size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.takeawayTitle, { color: colors.primary }]}>KEY TAKEAWAY</Text>
              </View>
              <Text style={[styles.takeawayBody, { color: colors.text }]}>
                {constSection.keyTakeaway}
              </Text>
            </View>

            {/* VERBATIM LEGAL TEXT */}
            <View
              style={[
                styles.verbatimCard,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Scale size={18} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.verbatimTitle, { color: colors.primary }]}>
                  VERBATIM CONSTITUTIONAL TEXT
                </Text>
              </View>
              <Text style={[styles.verbatimBody, { color: colors.text }]}>
                {constSection.verbatimText}
              </Text>
            </View>
          </>
        ) : (
          <EmptyState
            icon="compass"
            title="Legal Provision Not Found"
            description="The requested legal guide or constitutional section could not be located."
            actionLabel="Return to Library"
            onAction={() => router.push('/(tabs)/library' as any)}
          />
        )}

        {/* QUIZ CTA CARD */}
        <View
          style={[
            styles.quizCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.primary },
          ]}
        >
          <Text style={[styles.quizCardTitle, { color: colors.text }]}>
            Ready to test your knowledge?
          </Text>
          <Text style={[styles.quizCardSub, { color: colors.textMuted }]}>
            Answer a quick 1-minute scenario quiz on this provision to earn knowledge points!
          </Text>
          <TouchableOpacity
            style={[styles.startQuizBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.push(`/quiz/${id || 'police-stops'}` as any)}
          >
            <Text style={styles.startQuizBtnText}>Take Scenario Quiz →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: Spacing.xs,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 80,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  citationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    ...Shadows.sm,
  },
  citationText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    ...Shadows.sm,
  },
  sectionHeaderLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  summaryBody: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  takeawayCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
  },
  takeawayTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  takeawayBody: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  verbatimCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    ...Shadows.sm,
  },
  verbatimTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  verbatimBody: {
    fontSize: 14,
    lineHeight: 22,
  },
  quizCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1.5,
    ...Shadows.md,
  },
  quizCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  quizCardSub: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  startQuizBtn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  startQuizBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
