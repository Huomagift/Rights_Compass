import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Flame,
  ArrowRight,
  Shield,
  BookOpen,
  Scale,
  Sparkles,
  Sun,
  Moon,
  Check,
} from 'lucide-react-native';
import { BorderRadius, Colors, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { getTodayLesson, DailyLesson, LessonCard } from '../../data/lessonStore';
import { getStoredProfile, recordCompletedLesson, UserProfile } from '../../services/offlineStorage';

const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function TodayLessonScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lesson, setLesson] = useState<DailyLesson | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [updatedStreak, setUpdatedStreak] = useState<number | null>(null);

  // Animated progress bar
  const progressAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await getStoredProfile();
    setProfile(p);
    const todayL = getTodayLesson(p);
    setLesson(todayL);
  };

  useEffect(() => {
    if (lesson) {
      Animated.timing(progressAnim, {
        toValue: (cardIndex + 1) / lesson.cards.length,
        duration: 260,
        useNativeDriver: false,
      }).start();
    }
  }, [cardIndex, lesson]);

  if (!profile || !lesson) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>Loading today&apos;s legal lesson...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard: LessonCard = lesson.cards[cardIndex];
  const totalCards = lesson.cards.length;
  const isWide = width > 768;

  const handleSelectOption = (optId: string) => {
    if (showFeedback) return;
    setSelectedOption(optId);
  };

  const handleNextCard = async () => {
    setSelectedOption(null);
    setShowFeedback(false);

    if (cardIndex < totalCards - 1) {
      setCardIndex((prev) => prev + 1);
    } else {
      const res = await recordCompletedLesson(lesson.id);
      setUpdatedStreak(res.streakCount);
      setIsCompleted(true);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setShowFeedback(true);
  };

  const chosenOption = currentCard?.options?.find((o) => o.id === selectedOption);
  const isQuestionCard = currentCard.type === 'scenario' || currentCard.type === 'reinforce';

  // Determine current day of week index (0 = Monday .. 6 = Sunday)
  const currentDayIdx = (new Date().getDay() + 6) % 7;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* DUOLINGO TOP BAR */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.closeBtn, { backgroundColor: colors.cardBackground }]}
          onPress={() => router.replace('/(tabs)' as any)}
          accessibilityLabel="Close Lesson"
        >
          <X size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* DUOLINGO SMOOTH PROGRESS BAR */}
        <View style={styles.progressTrackWrapper}>
          <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            >
              <View style={styles.progressGlint} />
            </Animated.View>
          </View>
        </View>

        {/* STREAK BADGE */}
        <View style={styles.headerRightGroup}>
          <View style={[styles.streakBadge, { backgroundColor: colors.streakBadgeBg }]}>
            <Flame size={16} color="#D97706" style={{ marginRight: 4 }} />
            <Text style={[styles.streakText, { color: colors.streakBadgeText }]}>
              {updatedStreak !== null ? updatedStreak : profile.streakCount}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isWide && styles.wideScrollContent,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================ */}
        {/* DUOLINGO LESSON COMPLETION STATE                            */}
        {/* ============================================================ */}
        {isCompleted ? (
          <View style={styles.completionWrapper}>
            {/* BIG MASCOT CELEBRATION */}
            <View style={styles.mascotCelebrationCircle}>
              <Image
                source={require('../../assets/images/mascot.png')}
                style={styles.largeMascotImage}
                contentFit="contain"
              />
            </View>

            <Text style={[styles.duoCompletionTitle, { color: colors.text }]}>
              Lesson Complete!
            </Text>
            <Text style={[styles.duoCompletionSub, { color: colors.textMuted }]}>
              You&apos;ve completed today&apos;s legal workout and strengthened your rights awareness.
            </Text>

            {/* DUOLINGO 7-DAY STREAK CALENDAR ROW */}
            <View style={[styles.streakCardDuo, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.streakCardHeader}>
                <Flame size={20} color="#D97706" style={{ marginRight: 6 }} />
                <Text style={[styles.streakCardTitle, { color: colors.text }]}>
                  {updatedStreak || profile.streakCount} Day Legal Streak!
                </Text>
              </View>

              <View style={styles.calendarRow}>
                {DAYS_OF_WEEK.map((dayName, idx) => {
                  const isPastOrToday = idx <= currentDayIdx;
                  const isToday = idx === currentDayIdx;

                  return (
                    <View key={idx} style={styles.calendarDayCol}>
                      <Text style={[styles.calendarDayText, { color: isToday ? colors.primary : colors.textMuted }]}>
                        {dayName}
                      </Text>
                      <View
                        style={[
                          styles.calendarFlameCircle,
                          {
                            backgroundColor: isPastOrToday
                              ? isToday ? colors.primary : colors.streakBadgeBg
                              : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                            borderColor: isToday ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        {isPastOrToday ? (
                          <Flame size={16} color={isToday ? '#FFFFFF' : '#D97706'} />
                        ) : (
                          <View style={styles.emptyDot} />
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* STATS ROW */}
            <View style={styles.duoStatsGrid}>
              <View style={[styles.duoStatCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <Text style={[styles.duoStatLabel, { color: colors.textMuted }]}>ACCURACY</Text>
                <Text style={[styles.duoStatVal, { color: colors.success }]}>100%</Text>
              </View>
              <View style={[styles.duoStatCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <Text style={[styles.duoStatLabel, { color: colors.textMuted }]}>TIME</Text>
                <Text style={[styles.duoStatVal, { color: colors.primary }]}>{lesson.estimatedMinutes} min</Text>
              </View>
              <View style={[styles.duoStatCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <Text style={[styles.duoStatLabel, { color: colors.textMuted }]}>COMMITMENT</Text>
                <Text style={[styles.duoStatVal, { color: '#D97706' }]}>Goal Met</Text>
              </View>
            </View>

            {/* DUOLINGO 3D CHUNKY CONTINUE BUTTON */}
            <TouchableOpacity
              style={[styles.duoButton3D, { backgroundColor: colors.primary, borderColor: colors.primaryDark }]}
              activeOpacity={0.88}
              onPress={() => router.replace('/(tabs)' as any)}
            >
              <Text style={styles.duoButton3DText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ============================================================ */
          /* DUOLINGO CARD-BY-CARD LEARNING CONTENT                      */
          /* ============================================================ */
          <View style={styles.lessonBodyWrapper}>
            {/* MASCOT AEGIS WITH DIALOGUE SPEECH BUBBLE */}
            <View style={styles.mascotDialogueRow}>
              <Image
                source={require('../../assets/images/mascot.png')}
                style={styles.duoMascotAvatar}
                contentFit="contain"
              />

              <View style={[styles.speechBubble, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}>
                <View style={[styles.bubbleTail, { borderRightColor: colors.cardWhite }]} />
                <View style={styles.bubbleHeaderRow}>
                  <Text style={[styles.bubbleTag, { color: colors.primary }]}>
                    {currentCard.type === 'situation'
                      ? 'REAL-WORLD SITUATION'
                      : currentCard.type === 'takeaway'
                      ? 'KEY TAKEAWAY'
                      : 'WHAT WOULD YOU DO?'}
                  </Text>
                </View>

                <Text style={[styles.bubbleSpeechText, { color: colors.text }]}>
                  {currentCard.type === 'situation'
                    ? currentCard.situationText
                    : currentCard.type === 'takeaway'
                    ? currentCard.title
                    : currentCard.questionPrompt}
                </Text>
              </View>
            </View>

            {/* CARD 1: SITUATION (CONTINUE PROMPT) */}
            {currentCard.type === 'situation' && (
              <View style={styles.instructionBox}>
                <Text style={[styles.instructionHint, { color: colors.textMuted }]}>
                  Read the scenario above carefully, then tap continue to learn what your legal options are.
                </Text>
              </View>
            )}

            {/* CARD 2: TAKEAWAYS (LIST OF RIGHTS) */}
            {currentCard.type === 'takeaway' && (
              <View style={styles.takeawaysDuoList}>
                {currentCard.takeawayPoints?.map((point, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.takeawayDuoCard,
                      { backgroundColor: colors.cardWhite, borderColor: colors.border },
                    ]}
                  >
                    <View style={[styles.duoCheckBadge, { backgroundColor: colors.primary }]}>
                      <Check size={14} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.takeawayDuoText, { color: colors.text }]}>
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* CARD 3 & 5: SCENARIO & REINFORCE (CHUNKY 3D OPTIONS) */}
            {isQuestionCard && (
              <View style={styles.optionsContainer}>
                {currentCard.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt.id;
                  let cardBg = colors.cardWhite;
                  let borderCol = colors.border;
                  let shadowCol = isDark ? '#1C1C1E' : '#E5D6C8';
                  let textColor = colors.text;

                  if (showFeedback) {
                    if (opt.isCorrect) {
                      cardBg = isDark ? 'rgba(34, 197, 94, 0.15)' : '#F0FDF4';
                      borderCol = colors.success;
                      shadowCol = colors.success;
                      textColor = colors.success;
                    } else if (isSelected && !opt.isCorrect) {
                      cardBg = isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2';
                      borderCol = '#EF4444';
                      shadowCol = '#DC2626';
                      textColor = '#EF4444';
                    }
                  } else if (isSelected) {
                    cardBg = colors.accentLight;
                    borderCol = colors.primary;
                    shadowCol = colors.primaryDark;
                    textColor = colors.primary;
                  }

                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.duoOptionCard,
                        {
                          backgroundColor: cardBg,
                          borderColor: borderCol,
                          borderBottomColor: shadowCol,
                        },
                        isSelected && !showFeedback && { transform: [{ translateY: 2 }] },
                      ]}
                      activeOpacity={0.85}
                      disabled={showFeedback}
                      onPress={() => handleSelectOption(opt.id)}
                    >
                      <View
                        style={[
                          styles.duoOptionPill,
                          {
                            backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                            borderColor: isSelected ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.duoOptionPillText, { color: isSelected ? '#FFFFFF' : colors.primary }]}>
                          {idx + 1}
                        </Text>
                      </View>
                      <Text style={[styles.duoOptionText, { color: textColor }]}>
                        {opt.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ============================================================ */}
      {/* DUOLINGO SIGNATURE BOTTOM ACTION DRAWER                     */}
      {/* ============================================================ */}
      {!isCompleted && (
        <View
          style={[
            styles.bottomDrawerContainer,
            showFeedback && chosenOption
              ? chosenOption.isCorrect
                ? { backgroundColor: isDark ? '#16331C' : '#D7FFB8', borderTopColor: colors.success }
                : { backgroundColor: isDark ? '#381A1A' : '#FED7D7', borderTopColor: '#EF4444' }
              : { backgroundColor: colors.cardWhite, borderTopColor: colors.border },
          ]}
        >
          {showFeedback && chosenOption ? (
            <View style={styles.feedbackDrawerContent}>
              <View style={styles.feedbackHeaderRow}>
                <View
                  style={[
                    styles.feedbackIconCircle,
                    { backgroundColor: chosenOption.isCorrect ? colors.success : '#EF4444' },
                  ]}
                >
                  {chosenOption.isCorrect ? (
                    <Check size={18} color="#FFFFFF" />
                  ) : (
                    <AlertCircle size={18} color="#FFFFFF" />
                  )}
                </View>
                <Text
                  style={[
                    styles.feedbackMainTitle,
                    { color: chosenOption.isCorrect ? (isDark ? '#4ADE80' : '#15803D') : (isDark ? '#F87171' : '#B91C1C') },
                  ]}
                >
                  {chosenOption.isCorrect ? 'That’s the safer response!' : 'Scenario Review'}
                </Text>
              </View>

              <Text
                style={[
                  styles.feedbackExplanation,
                  { color: isDark ? '#E2E8F0' : '#2C221E' },
                ]}
              >
                {chosenOption.explanation}
              </Text>

              {/* LEGAL CITATION BASIS */}
              <View
                style={[
                  styles.legalBasisPill,
                  {
                    backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.65)',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  },
                ]}
              >
                <Scale size={12} color={colors.primary} style={{ marginRight: 5 }} />
                <Text style={[styles.legalBasisPillText, { color: colors.text }]}>
                  Legal Basis: Constitution 1999, Section 37 / ACJA 2015
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.duoButton3D,
                  {
                    backgroundColor: chosenOption.isCorrect ? colors.success : '#EF4444',
                    borderColor: chosenOption.isCorrect ? '#16A34A' : '#DC2626',
                  },
                ]}
                activeOpacity={0.88}
                onPress={handleNextCard}
              >
                <Text style={styles.duoButton3DText}>CONTINUE</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.normalDrawerContent}>
              {isQuestionCard ? (
                <TouchableOpacity
                  style={[
                    styles.duoButton3D,
                    selectedOption
                      ? { backgroundColor: colors.primary, borderColor: colors.primaryDark }
                      : { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB', borderColor: isDark ? 'transparent' : '#D1D5DB' },
                  ]}
                  disabled={!selectedOption}
                  activeOpacity={0.88}
                  onPress={handleCheckAnswer}
                >
                  <Text
                    style={[
                      styles.duoButton3DText,
                      { color: selectedOption ? '#FFFFFF' : colors.textMuted },
                    ]}
                  >
                    CHECK
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.duoButton3D, { backgroundColor: colors.primary, borderColor: colors.primaryDark }]}
                  activeOpacity={0.88}
                  onPress={handleNextCard}
                >
                  <Text style={styles.duoButton3DText}>CONTINUE</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrackWrapper: {
    flex: 1,
  },
  progressTrack: {
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 7,
    position: 'relative',
  },
  progressGlint: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 160,
  },
  wideScrollContent: {
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },
  lessonBodyWrapper: {
    width: '100%',
  },
  mascotDialogueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    gap: 12,
  },
  duoMascotAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  speechBubble: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    position: 'relative',
    ...Shadows.sm,
  },
  bubbleTail: {
    position: 'absolute',
    left: -10,
    top: 24,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
    borderRightWidth: 10,
  },
  bubbleHeaderRow: {
    marginBottom: 4,
  },
  bubbleTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bubbleSpeechText: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '700',
  },
  instructionBox: {
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  instructionHint: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  takeawaysDuoList: {
    gap: 12,
    marginBottom: Spacing.lg,
  },
  takeawayDuoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    ...Shadows.sm,
  },
  duoCheckBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 4,
  },
  takeawayDuoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  optionsContainer: {
    gap: 12,
  },
  duoOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderBottomWidth: 4,
  },
  duoOptionPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
  },
  duoOptionPillText: {
    fontSize: 14,
    fontWeight: '800',
  },
  duoOptionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
  },
  bottomDrawerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 2,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    ...Shadows.lg,
  },
  normalDrawerContent: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  feedbackDrawerContent: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  feedbackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  feedbackIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  feedbackMainTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  feedbackExplanation: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  legalBasisPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  legalBasisPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  duoButton3D: {
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
  },
  duoButton3DText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  completionWrapper: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  mascotCelebrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  largeMascotImage: {
    width: 110,
    height: 110,
  },
  duoCompletionTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  duoCompletionSub: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    maxWidth: 420,
  },
  streakCardDuo: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    marginBottom: Spacing.lg,
  },
  streakCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  streakCardTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarDayCol: {
    alignItems: 'center',
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  calendarFlameCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  emptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  duoStatsGrid: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: Spacing.xl,
  },
  duoStatCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderBottomWidth: 3,
  },
  duoStatLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  duoStatVal: {
    fontSize: 18,
    fontWeight: '800',
  },
});
