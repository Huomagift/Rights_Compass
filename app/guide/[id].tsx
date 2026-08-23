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
import { ArrowLeft, Share2, Bookmark, Scale, CheckCircle2 } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { FEATURED_GUIDE, RECENT_GUIDES } from '../../data/mockData';
import { CONSTITUTION_SECTIONS } from '../../data/constitutionStore';

export default function GuideDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find in guides or constitution sections
  const allGuides = [FEATURED_GUIDE, ...RECENT_GUIDES];
  const guide = allGuides.find((g) => g.id === id);
  const constSection = CONSTITUTION_SECTIONS.find((s) => s.id === id || s.sectionNumber === parseInt(id || '', 10));

  const title = guide?.title || constSection?.title || 'Legal Rights Guide';
  const category = guide?.category || constSection?.chapter || '1999 Constitution of Nigeria';
  const citation = guide?.citation || `${constSection?.section} — ${constSection?.chapter}`;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Share2 size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{category}</Text>
        </View>

        <Text style={styles.mainTitle}>{title}</Text>

        <View style={styles.citationBox}>
          <Bookmark size={14} color={Colors.primary} />
          <Text style={styles.citationText}>Legal Citation: {citation}</Text>
        </View>

        {guide ? (
          guide.content.map((para, i) => (
            <Text key={i} style={styles.paragraph}>
              {para}
            </Text>
          ))
        ) : constSection ? (
          <>
            {/* PLAIN LANGUAGE SUMMARY */}
            <View style={styles.summaryCard}>
              <Text style={styles.sectionHeaderLabel}>PLAIN LANGUAGE SUMMARY</Text>
              <Text style={styles.summaryBody}>{constSection.plainLanguageSummary}</Text>
            </View>

            {/* KEY TAKEAWAY */}
            <View style={styles.takeawayCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <CheckCircle2 size={16} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.takeawayTitle}>KEY TAKEAWAY</Text>
              </View>
              <Text style={styles.takeawayBody}>{constSection.keyTakeaway}</Text>
            </View>

            {/* VERBATIM LEGAL TEXT */}
            <View style={styles.verbatimCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Scale size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.verbatimTitle}>VERBATIM CONSTITUTIONAL TEXT</Text>
              </View>
              <Text style={styles.verbatimBody}>
                {constSection.verbatimText}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.paragraph}>Legal section content not found.</Text>
        )}

        {/* QUIZ CTA CARD */}
        <View style={styles.quizCard}>
          <Text style={styles.quizCardTitle}>Ready to test your knowledge?</Text>
          <Text style={styles.quizCardSub}>
            Answer a quick 1-minute scenario quiz on this provision to earn knowledge points!
          </Text>
          <TouchableOpacity
            style={styles.startQuizBtn}
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
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginHorizontal: Spacing.xs,
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  citationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  citationText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 6,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  sectionHeaderLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  summaryBody: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    color: Colors.text,
  },
  takeawayCard: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  takeawayTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  takeawayBody: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    color: Colors.text,
  },
  verbatimCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  verbatimTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  verbatimBody: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
    fontFamily: undefined,
  },
  quizCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    ...Shadows.md,
  },
  quizCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  quizCardSub: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  startQuizBtn: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  startQuizBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
