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
import { X, CheckCircle2, AlertCircle, Flame } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { SAMPLE_QUIZZES } from '../../data/mockData';

export default function QuizScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const quiz = SAMPLE_QUIZZES[id || 'police-stops'] || SAMPLE_QUIZZES['police-stops'];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const chosenOptionObj = quiz.options.find((o) => o.id === selectedOption);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <X size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Scenario Quiz</Text>
        <View style={styles.streakBadge}>
          <Flame size={12} color={Colors.streakBadgeText} style={{ marginRight: 4 }} />
          <Text style={styles.streakText}>Streak +1</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scenarioCard}>
          <Text style={styles.scenarioLabel}>REAL-WORLD SCENARIO</Text>
          <Text style={styles.scenarioText}>{quiz.scenario}</Text>
        </View>

        <Text style={styles.optionsPrompt}>Select the correct legal answer:</Text>

        {quiz.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          let optionStyle = styles.optionCard;
          let textStyle = styles.optionText;

          if (submitted) {
            if (opt.isCorrect) {
              optionStyle = { ...styles.optionCard, ...styles.correctOption };
              textStyle = { ...styles.optionText, ...styles.correctOptionText };
            } else if (isSelected && !opt.isCorrect) {
              optionStyle = { ...styles.optionCard, ...styles.wrongOption };
              textStyle = { ...styles.optionText, ...styles.wrongOptionText };
            }
          } else if (isSelected) {
            optionStyle = { ...styles.optionCard, ...styles.selectedOption };
            textStyle = { ...styles.optionText, ...styles.selectedOptionText };
          }

          return (
            <TouchableOpacity
              key={opt.id}
              style={optionStyle}
              activeOpacity={0.8}
              disabled={submitted}
              onPress={() => setSelectedOption(opt.id)}
            >
              <View style={styles.optionLetterBadge}>
                <Text style={styles.optionLetter}>{opt.id}</Text>
              </View>
              <Text style={textStyle}>{opt.text}</Text>
            </TouchableOpacity>
          );
        })}

        {/* FEEDBACK EXPLANATION CARD */}
        {submitted && (
          <View
            style={[
              styles.feedbackCard,
              chosenOptionObj?.isCorrect ? styles.feedbackSuccess : styles.feedbackWarning,
            ]}
          >
            <View style={styles.feedbackHeader}>
              {chosenOptionObj?.isCorrect ? (
                <CheckCircle2 size={22} color={Colors.success} />
              ) : (
                <AlertCircle size={22} color={Colors.warning} />
              )}
              <Text
                style={[
                  styles.feedbackTitle,
                  { color: chosenOptionObj?.isCorrect ? Colors.success : Colors.warning },
                ]}
              >
                {chosenOptionObj?.isCorrect ? 'Correct Answer! ✅' : 'Not Quite 💡'}
              </Text>
            </View>

            <Text style={styles.explanationText}>{quiz.explanation}</Text>

            <View style={styles.citationBadge}>
              <Text style={styles.citationText}>Source: {quiz.citation}</Text>
            </View>

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.continueBtnText}>Return to Compass Home</Text>
            </TouchableOpacity>
          </View>
        )}

        {!submitted && (
          <TouchableOpacity
            style={[
              styles.submitBtn,
              !selectedOption && styles.submitBtnDisabled,
            ]}
            disabled={!selectedOption}
            onPress={() => setSubmitted(true)}
          >
            <Text style={styles.submitBtnText}>Submit Answer</Text>
          </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  streakBadge: {
    backgroundColor: Colors.streakBadgeBg,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.streakBadgeText,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  scenarioCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  scenarioLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  scenarioText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  optionsPrompt: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.accentLight,
  },
  correctOption: {
    borderColor: Colors.success,
    backgroundColor: '#F0FDF4',
  },
  wrongOption: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionLetterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.primary,
  },
  correctOptionText: {
    color: Colors.success,
  },
  wrongOptionText: {
    color: '#DC2626',
  },
  submitBtn: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  feedbackCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    borderWidth: 1.5,
  },
  feedbackSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: Colors.success,
  },
  feedbackWarning: {
    backgroundColor: '#FFFBEB',
    borderColor: Colors.warning,
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
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  citationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginBottom: Spacing.md,
  },
  citationText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
