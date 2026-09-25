/**
 * Quiz Engine – app/quiz/[id].tsx
 *
 * Duolingo-inspired multi-question quiz with:
 * - Progress bar (answered / total)
 * - 3-heart lives counter
 * - Neo-brutalism answer cards (2px border, 4px hard bottom shadow, flat press)
 * - Fixed bottom drawer: CHECK → CONTINUE flow
 * - Coloured drawer flash on submit (green/red)
 * - Auto-advance on wrong answer (Duolingo-style, shows correct answer)
 * - Completion screen with XP badge + streak update
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  Animated,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Flame,
  Heart,
  Trophy,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { SAMPLE_QUIZZES, type QuizQuestion } from '../../data/constitutionStore';
import { updateDailyStreak } from '../../services/offlineStorage';
import { ErrorState } from '../../components/ErrorState';

// ─── Types ───────────────────────────────────────────────────────────────────
const MAX_HEARTS = 3;
const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isWide = width > 768;

  // ─── Resolve quiz data ──────────────────────────────────────────────────
  const searchId = id || 'police-stops';
  const quizEntry = SAMPLE_QUIZZES[searchId];

  // Build questions array — prefer questions[] or fall back to legacy single question
  const questions: QuizQuestion[] = useMemo(() => {
    if (!quizEntry) {
      // Fallback quiz (should rarely fire — only for unknown IDs)
      return [
        {
          scenario: `In a scenario involving ${searchId.startsWith('s') ? `Section ${searchId.substring(1)}` : searchId}, an official claims they can override your statutory rights without court process. What does the law dictate?`,
          options: [
            { id: 'A', text: 'Officials have absolute discretion to bypass statutory laws.', isCorrect: false },
            { id: 'B', text: 'Constitutional rights apply only during official office hours.', isCorrect: false },
            { id: 'C', text: 'No! Section 1(1) of the Constitution guarantees supreme legal protection against arbitrary official actions.', isCorrect: true },
            { id: 'D', text: 'The official can act arbitrarily if verbal warning was given.', isCorrect: false },
          ],
          explanation: 'Section 1(1) of the 1999 Constitution establishes constitutional supremacy.',
          citation: `Constitution of Nigeria / Law Provision ${searchId}`,
        },
      ];
    }
    if (quizEntry.questions && quizEntry.questions.length > 0) {
      return quizEntry.questions;
    }
    // Legacy single-question fallback
    return [
      {
        scenario: quizEntry.scenario,
        options: quizEntry.options,
        explanation: quizEntry.explanation,
        citation: quizEntry.citation,
      },
    ];
  }, [quizEntry, searchId]);

  const totalQuestions = questions.length;

  // ─── State ──────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [streakCount, setStreakCount] = useState<number | null>(null);

  const currentQ = questions[currentIndex];
  const chosenOption = currentQ?.options.find((o) => o.id === selectedOption);
  const isCorrectAnswer = chosenOption?.isCorrect ?? false;
  const progress = currentIndex / totalQuestions;

  // ─── Handlers ───────────────────────────────────────────────────────────
  const handleCheck = useCallback(async () => {
    if (!selectedOption) return;
    setSubmitted(true);
    if (isCorrectAnswer) {
      setCorrectCount((c) => c + 1);
    } else {
      setHearts((h) => Math.max(0, h - 1));
    }
  }, [selectedOption, isCorrectAnswer]);

  const handleContinue = useCallback(async () => {
    const nextIndex = currentIndex + 1;
    // Quiz ends if all questions answered or hearts reach 0
    if (nextIndex >= totalQuestions || (hearts <= 0 && !isCorrectAnswer)) {
      const updated = await updateDailyStreak();
      setStreakCount(updated.streakCount);
      setQuizFinished(true);
      return;
    }
    setCurrentIndex(nextIndex);
    setSelectedOption(null);
    setSubmitted(false);
  }, [currentIndex, totalQuestions, hearts, isCorrectAnswer]);

  // ─── Not Found ──────────────────────────────────────────────────────────
  if (!currentQ) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: Spacing.lg }}>
        <ErrorState
          title="Quiz Scenario Not Found"
          message="The scenario quiz for this legal guide is currently unavailable."
          onRetry={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  // ─── XP calculation ─────────────────────────────────────────────────────
  const xpEarned = correctCount * 10;
  const passedQuiz = correctCount >= Math.ceil(totalQuestions * 0.6);

  // ─── Completion Screen ──────────────────────────────────────────────────
  if (quizFinished) {
    return (
      <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={[st.completionContainer, isWide && { maxWidth: 560, alignSelf: 'center' }]}>
          {/* Trophy / Result */}
          <View style={[st.completionIconCircle, {
            backgroundColor: passedQuiz
              ? isDark ? 'rgba(74, 222, 128, 0.15)' : '#ECFDF5'
              : isDark ? 'rgba(248, 113, 113, 0.15)' : '#FEF2F2',
          }]}>
            <Trophy
              size={56}
              color={passedQuiz ? (isDark ? '#4ADE80' : '#16A34A') : (isDark ? '#F87171' : '#EF4444')}
            />
          </View>

          <Text style={[st.completionTitle, { color: colors.text }]}>
            {passedQuiz ? 'Well Done!' : 'Keep Practising!'}
          </Text>
          <Text style={[st.completionSubtitle, { color: colors.textMuted }]}>
            You answered {correctCount} of {totalQuestions} correctly
          </Text>

          {/* XP Badge — neo-brutalism card */}
          <View style={[st.xpCard, {
            backgroundColor: isDark ? '#1A1A2E' : '#FFFBEB',
            borderColor: isDark ? '#D97706' : '#1C1917',
          }]}>
            <Sparkles size={22} color="#D97706" />
            <Text style={[st.xpText, { color: isDark ? '#FDE68A' : '#92400E' }]}>
              +{xpEarned} XP earned
            </Text>
          </View>

          {/* Streak row */}
          {streakCount !== null && (
            <View style={[st.streakRow, { backgroundColor: colors.streakBadgeBg }]}>
              <Flame size={20} color="#D97706" />
              <Text style={[st.streakRowText, { color: colors.streakBadgeText }]}>
                {streakCount} day streak
              </Text>
            </View>
          )}

          {/* Hearts remaining */}
          <View style={st.heartsResultRow}>
            {Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <Heart
                key={i}
                size={24}
                color={i < hearts ? '#EF4444' : colors.border}
                fill={i < hearts ? '#EF4444' : 'transparent'}
              />
            ))}
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={[st.completionBtn, {
              backgroundColor: colors.primary,
              borderColor: colors.primaryDark,
            }]}
            onPress={() => router.replace('/(tabs)' as any)}
          >
            <Text style={st.completionBtnText}>BACK TO HOME</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[st.completionBtnOutline, {
              borderColor: colors.primary,
            }]}
            onPress={() => {
              setCurrentIndex(0);
              setSelectedOption(null);
              setSubmitted(false);
              setHearts(MAX_HEARTS);
              setCorrectCount(0);
              setQuizFinished(false);
              setStreakCount(null);
            }}
          >
            <Text style={[st.completionBtnOutlineText, { color: colors.primary }]}>TRY AGAIN</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Main Quiz UI ───────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[st.container, { backgroundColor: colors.background }]}>
      {/* ─ HEADER ─ */}
      <View style={[st.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[st.closeBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => router.back()}
          accessibilityLabel="Close Quiz"
        >
          <X size={20} color={colors.text} />
        </TouchableOpacity>

        {/* Progress bar */}
        <View style={[st.progressBarOuter, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB' }]}>
          <View
            style={[
              st.progressBarInner,
              {
                backgroundColor: colors.primary,
                width: `${Math.max(progress * 100, 4)}%`,
              },
            ]}
          />
        </View>

        {/* Hearts */}
        <View style={st.heartsRow}>
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <Heart
              key={i}
              size={18}
              color={i < hearts ? '#EF4444' : colors.border}
              fill={i < hearts ? '#EF4444' : 'transparent'}
              style={{ marginLeft: i > 0 ? 2 : 0 }}
            />
          ))}
        </View>
      </View>

      {/* ─ QUESTION CONTENT ─ */}
      <ScrollView
        contentContainerStyle={[
          st.scrollContent,
          isWide && st.wideScrollContent,
          { paddingBottom: 180 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Question counter */}
        <Text style={[st.questionCounter, { color: colors.textMuted }]}>
          Question {currentIndex + 1} of {totalQuestions}
        </Text>

        {/* Scenario card — neo-brutalism */}
        <View
          style={[
            st.scenarioCard,
            {
              backgroundColor: colors.cardWhite,
              borderColor: isDark ? colors.border : '#1C1917',
            },
          ]}
        >
          <View style={st.scenarioTagRow}>
            <Sparkles size={12} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[st.scenarioLabel, { color: colors.primary }]}>
              REAL-WORLD SCENARIO
            </Text>
          </View>
          <Text style={[st.scenarioText, { color: colors.text }]}>
            {currentQ.scenario}
          </Text>
        </View>

        <Text style={[st.optionsPrompt, { color: colors.textMuted }]}>
          Select the safest legal response:
        </Text>

        {/* Answer options — neo-brutalism cards */}
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedOption === opt.id;
          let optBg = colors.cardWhite;
          let optBorder = isDark ? colors.border : '#1C1917';
          let optShadow = isDark ? '#1C1C1E' : '#1C1917';
          let optTextColor = colors.text;
          let letterBg = colors.cardBackground;
          let letterColor = colors.primary;
          let letterBorder = colors.border;

          if (submitted) {
            if (opt.isCorrect) {
              optBg = isDark ? 'rgba(74, 186, 114, 0.15)' : '#F0FDF4';
              optBorder = '#16A34A';
              optShadow = '#15803D';
              optTextColor = isDark ? '#4ADE80' : '#15803D';
              letterBg = '#16A34A';
              letterColor = '#FFFFFF';
              letterBorder = '#16A34A';
            } else if (isSelected && !opt.isCorrect) {
              optBg = isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2';
              optBorder = '#EF4444';
              optShadow = '#DC2626';
              optTextColor = '#EF4444';
              letterBg = '#EF4444';
              letterColor = '#FFFFFF';
              letterBorder = '#EF4444';
            }
          } else if (isSelected) {
            optBg = colors.accentLight;
            optBorder = colors.primary;
            optShadow = colors.primaryDark;
            optTextColor = colors.primary;
            letterBg = colors.primary;
            letterColor = '#FFFFFF';
            letterBorder = colors.primary;
          }

          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                st.optionCard,
                {
                  backgroundColor: optBg,
                  borderColor: optBorder,
                  borderBottomWidth: 4,
                  borderBottomColor: optShadow,
                },
                isSelected && !submitted && { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
              ]}
              activeOpacity={0.85}
              disabled={submitted}
              onPress={() => setSelectedOption(opt.id)}
            >
              <View
                style={[
                  st.optionLetterBadge,
                  {
                    backgroundColor: letterBg,
                    borderColor: letterBorder,
                  },
                ]}
              >
                <Text style={[st.optionLetter, { color: letterColor }]}>
                  {LETTERS[idx]}
                </Text>
              </View>
              <Text style={[st.optionText, { color: optTextColor }]}>
                {opt.text}
              </Text>
              {submitted && opt.isCorrect && (
                <CheckCircle2 size={20} color="#16A34A" style={{ marginLeft: 8 }} />
              )}
              {submitted && isSelected && !opt.isCorrect && (
                <AlertCircle size={20} color="#EF4444" style={{ marginLeft: 8 }} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ─ FIXED BOTTOM DRAWER ─ */}
      <View
        style={[
          st.bottomDrawer,
          {
            backgroundColor: submitted
              ? isCorrectAnswer
                ? isDark ? '#16331C' : '#D7FFB8'
                : isDark ? '#381A1A' : '#FED7D7'
              : colors.cardWhite,
            borderTopColor: submitted
              ? isCorrectAnswer ? '#16A34A' : '#EF4444'
              : colors.border,
          },
        ]}
      >
        {submitted ? (
          <View style={[st.drawerInner, isWide && { maxWidth: 680, alignSelf: 'center' }]}>
            {/* Result header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: isCorrectAnswer ? '#16A34A' : '#EF4444',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 8,
                }}
              >
                {isCorrectAnswer ? (
                  <CheckCircle2 size={18} color="#FFFFFF" />
                ) : (
                  <AlertCircle size={18} color="#FFFFFF" />
                )}
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '800',
                  color: isCorrectAnswer
                    ? isDark ? '#4ADE80' : '#15803D'
                    : isDark ? '#F87171' : '#B91C1C',
                }}
              >
                {isCorrectAnswer ? 'Correct!' : 'Not quite right'}
              </Text>
            </View>

            {/* Explanation */}
            <Text
              style={{
                fontSize: 14,
                lineHeight: 20,
                fontWeight: '600',
                color: isDark ? '#E2E8F0' : '#2C221E',
                marginBottom: 4,
              }}
            >
              {currentQ.explanation}
            </Text>

            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: isDark ? '#94A3B8' : '#78716C',
                marginBottom: 12,
              }}
            >
              Source: {currentQ.citation}
            </Text>

            {/* CONTINUE button */}
            <TouchableOpacity
              style={[st.drawerBtn, {
                backgroundColor: isCorrectAnswer ? '#16A34A' : '#EF4444',
                borderBottomColor: isCorrectAnswer ? '#15803D' : '#DC2626',
              }]}
              activeOpacity={0.88}
              onPress={handleContinue}
            >
              <Text style={st.drawerBtnText}>
                {currentIndex + 1 >= totalQuestions || hearts <= 0 ? 'SEE RESULTS' : 'CONTINUE'}
              </Text>
              <ChevronRight size={18} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[st.drawerInner, isWide && { maxWidth: 680, alignSelf: 'center' }]}>
            <TouchableOpacity
              style={[st.drawerBtn, {
                backgroundColor: selectedOption ? colors.primary : isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB',
                borderBottomColor: selectedOption ? colors.primaryDark : isDark ? 'transparent' : '#D1D5DB',
              }]}
              disabled={!selectedOption}
              activeOpacity={0.88}
              onPress={handleCheck}
            >
              <Text
                style={[st.drawerBtnText, {
                  color: selectedOption ? '#FFFFFF' : colors.textMuted,
                }]}
              >
                CHECK
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    gap: 10,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  progressBarOuter: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    borderRadius: 7,
  },
  heartsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Scroll content
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 80,
  },
  wideScrollContent: {
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
  },

  // Question counter
  questionCounter: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },

  // Scenario card — neo-brutalism
  scenarioCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderBottomColor: '#1C1917',
  },
  scenarioTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  scenarioLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  scenarioText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },

  // Options prompt
  optionsPrompt: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },

  // Option cards — neo-brutalism
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md + 2,
    marginBottom: Spacing.sm + 4,
    borderWidth: 2,
  },
  optionLetterBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '900',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },

  // Bottom drawer
  bottomDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 2,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  drawerInner: {
    width: '100%',
  },
  drawerBtn: {
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomWidth: 4,
  },
  drawerBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },

  // Completion screen
  completionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  completionIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  xpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderBottomWidth: 5,
  },
  xpText: {
    fontSize: 18,
    fontWeight: '900',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.pill,
  },
  streakRowText: {
    fontSize: 15,
    fontWeight: '700',
  },
  heartsResultRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: Spacing.sm,
  },
  completionBtn: {
    width: '100%',
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 4,
    marginTop: Spacing.md,
  },
  completionBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  completionBtnOutline: {
    width: '100%',
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
  },
  completionBtnOutlineText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
