import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import {
  Clock,
  Check,
  Zap,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export interface TimeOption {
  time: string;
  label: string;
  subtitle: string;
  recommended?: boolean;
}

export const TIME_OPTIONS: TimeOption[] = [
  {
    time: '07:00 AM',
    label: 'Early Morning',
    subtitle: 'Start your day with a 1-minute legal insight',
  },
  {
    time: '08:00 AM',
    label: 'Morning Commute',
    subtitle: 'Recommended • Perfect for your daily routine',
    recommended: true,
  },
  {
    time: '12:00 PM',
    label: 'Midday Break',
    subtitle: 'Quick read during your lunch pause',
  },
  {
    time: '07:00 PM',
    label: 'Evening Review',
    subtitle: 'Wind down and reflect on your daily rights',
  },
];

interface StepRoutineProps {
  preferredTime: string;
  onSelectTime: (time: string) => void;
  dailyCommitmentMinutes: number;
  onSelectCommitment: (mins: number) => void;
}

export const StepRoutine: React.FC<StepRoutineProps> = ({
  preferredTime,
  onSelectTime,
  dailyCommitmentMinutes,
  onSelectCommitment,
}) => {
  const { colors } = useTheme();

  const COMMITMENT_OPTIONS = [
    { mins: 2, label: 'Quick Glance', desc: 'Light & breezy' },
    { mins: 5, label: 'Daily Habit', desc: 'Recommended', isRecommended: true },
    { mins: 10, label: 'Deep Diver', desc: 'Mastery focus' },
  ];

  return (
    <View style={styles.stepBox}>
      {/* AEGIS MINI BANNER */}
      <View
        style={[
          styles.aegisMiniBanner,
          { backgroundColor: colors.streakBadgeBg, borderColor: colors.border },
        ]}
      >
        <Image
          source={require('../../assets/images/mascot.png')}
          style={styles.aegisMiniAvatar}
          contentFit="cover"
        />
        <Text style={[styles.aegisMiniText, { color: colors.streakBadgeText }]}>
          &quot;Just a few minutes a day builds unshakable legal confidence!&quot;
        </Text>
      </View>

      <Text style={[styles.headlineTitle, { color: colors.text }]}>
        Set Your Daily Routine
      </Text>
      <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
        Choose your commitment and the best time for your 1-minute daily legal card. Works 100% offline.
      </Text>

      {/* COMMITMENT MINUTES SELECTOR */}
      <View style={styles.commitmentSubSection}>
        <Text style={[styles.commitmentSubHeading, { color: colors.text }]}>
          Daily Commitment
        </Text>
        <View style={styles.commitmentRow}>
          {COMMITMENT_OPTIONS.map((opt) => {
            const isSelected = dailyCommitmentMinutes === opt.mins;
            return (
              <TouchableOpacity
                key={opt.mins}
                style={[
                  styles.commitmentCard,
                  {
                    backgroundColor: isSelected ? colors.accentLight : colors.cardWhite,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => onSelectCommitment(opt.mins)}
              >
                {opt.isRecommended && (
                  <View
                    style={[
                      styles.commitmentBadge,
                      { backgroundColor: colors.streakBadgeBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.commitmentBadgeText,
                        { color: colors.streakBadgeText },
                      ]}
                    >
                      RECOMMENDED
                    </Text>
                  </View>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                  <Zap
                    size={14}
                    color={isSelected ? colors.primary : colors.textMuted}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.commitmentMinutes,
                      { color: isSelected ? colors.primary : colors.text },
                    ]}
                  >
                    {opt.mins}m
                  </Text>
                </View>
                <Text
                  style={[
                    styles.commitmentLabel,
                    { color: isSelected ? colors.primary : colors.text },
                  ]}
                >
                  {opt.label}
                </Text>
                <Text style={[styles.commitmentDesc, { color: colors.textMuted }]}>
                  {opt.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* TIME OPTIONS LIST */}
      <Text style={[styles.timeOptionsHeading, { color: colors.text }]}>
        Preferred Delivery Time
      </Text>
      <View style={styles.selectionCardsList}>
        {TIME_OPTIONS.map((timeOption) => {
          const isSelected = preferredTime === timeOption.time;

          return (
            <TouchableOpacity
              key={timeOption.time}
              style={[
                styles.selectionCard,
                {
                  backgroundColor: isSelected ? colors.accentLight : colors.cardWhite,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => onSelectTime(timeOption.time)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
            >
              <View
                style={[
                  styles.domainIconSquare,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                  },
                ]}
              >
                <Clock size={20} color={isSelected ? '#FFFFFF' : colors.primary} />
              </View>

              <View style={styles.domainTextCol}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      styles.timeTitleText,
                      {
                        color: isSelected ? colors.primary : colors.text,
                        fontWeight: isSelected ? '800' : '700',
                      },
                    ]}
                  >
                    {timeOption.time}
                  </Text>
                  {timeOption.recommended && (
                    <View
                      style={[
                        styles.recommendedPill,
                        { backgroundColor: colors.streakBadgeBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.recommendedPillText,
                          { color: colors.streakBadgeText },
                        ]}
                      >
                        RECOMMENDED
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.domainDescText, { color: colors.textMuted }]}>
                  {timeOption.label} • {timeOption.subtitle}
                </Text>
              </View>

              <View
                style={[
                  styles.checkIndicatorCircle,
                  {
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                {isSelected && <Check size={14} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepBox: {
    width: '100%',
  },
  aegisMiniBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  aegisMiniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: Spacing.sm,
  },
  aegisMiniText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  headlineTitle: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: Spacing.xs,
  },
  headlineSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  commitmentSubSection: {
    marginBottom: Spacing.lg,
  },
  commitmentSubHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  commitmentRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  commitmentCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.sm,
  },
  commitmentMinutes: {
    fontSize: 18,
    fontWeight: '800',
  },
  commitmentLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  commitmentDesc: {
    fontSize: 11,
    fontWeight: '500',
  },
  commitmentBadge: {
    position: 'absolute',
    top: -8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.pill,
  },
  commitmentBadgeText: {
    fontSize: 8,
    fontWeight: '800',
  },
  timeOptionsHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  selectionCardsList: {
    gap: Spacing.sm,
  },
  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  domainIconSquare: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  domainTextCol: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  timeTitleText: {
    fontSize: 15,
    marginRight: 6,
  },
  recommendedPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  recommendedPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  domainDescText: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  checkIndicatorCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
