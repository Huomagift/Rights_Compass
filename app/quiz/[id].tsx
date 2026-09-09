import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, CheckCircle2, AlertCircle, Flame, Sun, Moon } from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { SAMPLE_QUIZZES } from '../../data/constitutionStore';
import { updateDailyStreak } from '../../services/offlineStorage';
import { ErrorState } from '../../components/ErrorState';

export default function QuizScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const searchId = id || 'police-stops';
  const quiz = SAMPLE_QUIZZES[searchId] || {
    id: `q_${searchId}`,
    guideId: searchId,
    scenario: `In a scenario involving ${searchId.startsWith('s') ? `Section ${searchId.substring(1)}` : searchId}, an official claims they can override your statutory rights without court process. What does the law dictate?`,
    options: [
      { id: 'A', text: 'Officials have absolute discretion to bypass statutory laws.', isCorrect: false },
      { id: 'B', text: 'Constitutional rights apply only during official office hours.', isCorrect: false },
      { id: 'C', text: 'No! Section 1(1) of the Constitution guarantees supreme legal protection against arbitrary official actions.', isCorrect: true },
      { id: 'D', text: 'The official can act arbitrarily if verbal warning was given.', isCorrect: false },
    ],
    explanation: 'Section 1(1) of the 1999 Constitution of Nigeria establishes constitutional supremacy: any law or action inconsistent with constitutional provisions is void.',
    citation: `Constitution of Nigeria / Law Provision ${searchId}`,
  };

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [newStreakCount, setNewStreakCount] = useState<number | null>(null);

  if (!quiz) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          padding: Spacing.lg,
        }}
      >
        <ErrorState
          title="Quiz Scenario Not Found"
          message="The scenario quiz for this legal guide is currently unavailable."
          onRetry={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const chosenOptionObj = quiz.options.find((o) => o.id === selectedOption);

  const handleSubmit = async () => {
    if (!selectedOption) return;
    const updated = await updateDailyStreak();
    setNewStreakCount(updated.streakCount);
    setSubmitted(true);
  };

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
          accessibilityLabel="Close Quiz"
        >
          <X size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Daily Scenario Quiz</Text>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={[styles.themeToggleBtn, { backgroundColor: colors.cardBackground }]}
            onPress={toggleTheme}
            accessibilityLabel="Toggle Theme"
          >
            {isDark ? (
              <Sun size={17} color={colors.text} />
            ) : (
              <Moon size={17} color={colors.text} />
            )}
          </TouchableOpacity>

          <View style={[styles.streakBadge, { backgroundColor: colors.streakBadgeBg }]}>
            <Flame size={12} color={colors.streakBadgeText} style={{ marginRight: 4 }} />
            <Text style={[styles.streakText, { color: colors.streakBadgeText }]}>
              {newStreakCount !== null ? `${newStreakCount}d` : 'Streak'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.scenarioCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.scenarioLabel, { color: colors.primary }]}>
            REAL-WORLD SCENARIO
          </Text>
          <Text style={[styles.scenarioText, { color: colors.text }]}>
            {quiz.scenario}
          </Text>
        </View>

        <Text style={[styles.optionsPrompt, { color: colors.textMuted }]}>
          Select the correct legal answer:
        </Text>

        {quiz.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          let optBg = colors.cardWhite;
          let optBorder = colors.border;
          let optTextColor = colors.text;

          if (submitted) {
            if (opt.isCorrect) {
              optBg = isDark ? 'rgba(74, 186, 114, 0.15)' : '#F0FDF4';
              optBorder = colors.success;
              optTextColor = colors.success;
            } else if (isSelected && !opt.isCorrect) {
              optBg = isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2';
              optBorder = '#EF4444';
              optTextColor = '#EF4444';
            }
          } else if (isSelected) {
            optBg = colors.accentLight;
            optBorder = colors.primary;
            optTextColor = colors.primary;
          }

          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.optionCard,
                {
                  backgroundColor: optBg,
                  borderColor: optBorder,
                },
              ]}
              activeOpacity={0.8}
              disabled={submitted}
              onPress={() => setSelectedOption(opt.id)}
            >
              <View
                style={[
                  styles.optionLetterBadge,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionLetter,
                    { color: isSelected ? '#FFFFFF' : colors.primary },
                  ]}
                >
                  {opt.id}
                </Text>
              </View>
              <Text style={[styles.optionText, { color: optTextColor }]}>
                {opt.text}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* FEEDBACK EXPLANATION CARD */}
        {submitted && (
          <View
            style={[
              styles.feedbackCard,
              {
                backgroundColor: chosenOptionObj?.isCorrect
                  ? isDark
                    ? 'rgba(74, 186, 114, 0.12)'
                    : '#F0FDF4'
                  : isDark
                  ? 'rgba(245, 158, 11, 0.12)'
                  : '#FFFBEB',
                borderColor: chosenOptionObj?.isCorrect ? colors.success : colors.warning,
              },
            ]}
          >
            <View style={styles.feedbackHeader}>
              {chosenOptionObj?.isCorrect ? (
                <CheckCircle2 size={22} color={colors.success} />
              ) : (
                <AlertCircle size={22} color={colors.warning} />
              )}
              <Text
                style={[
                  styles.feedbackTitle,
                  { color: chosenOptionObj?.isCorrect ? colors.success : colors.warning },
                ]}
              >
                {chosenOptionObj?.isCorrect ? 'Correct Answer! 🔥 Streak Boosted' : 'Scenario Review 💡'}
              </Text>
            </View>

            <Text style={[styles.explanationText, { color: colors.text }]}>
              {quiz.explanation}
            </Text>

            <View
              style={[
                styles.citationBadge,
                { backgroundColor: colors.cardWhite, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.citationText, { color: colors.primary }]}>
                Source: {quiz.citation}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.continueBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.replace('/(tabs)' as any)}
            >
              <Text style={styles.continueBtnText}>Return to Compass Home</Text>
            </TouchableOpacity>
          </View>
        )}

        {!submitted && (
          <TouchableOpacity
            style={[
              styles.submitBtn,
              { backgroundColor: selectedOption ? colors.accent : colors.cardBackground },
              !selectedOption && styles.submitBtnDisabled,
            ]}
            disabled={!selectedOption}
            onPress={handleSubmit}
          >
            <Text
              style={[
                styles.submitBtnText,
                { color: selectedOption ? '#FFFFFF' : colors.textMuted },
              ]}
            >
              Submit Answer & Claim Streak
            </Text>
          </TouchableOpacity>
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
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeToggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 80,
  },
  scenarioCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    ...Shadows.md,
  },
  scenarioLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  scenarioText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  optionsPrompt: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    ...Shadows.sm,
  },
  optionLetterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '800',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  submitBtn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    borderWidth: 1.5,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 6,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  citationBadge: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  citationText: {
    fontSize: 11,
    fontWeight: '700',
  },
  continueBtn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
