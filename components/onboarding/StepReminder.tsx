import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Bell,
  BellOff,
  Clock,
  Check,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export interface ReminderTimeOption {
  time: string;
  label: string;
}

export const REMINDER_TIME_OPTIONS: ReminderTimeOption[] = [
  { time: '07:00 AM', label: 'Morning commute' },
  { time: '12:30 PM', label: 'Lunch break' },
  { time: '07:00 PM', label: 'Evening review (Popular)' },
  { time: '09:00 PM', label: 'Night wind-down' },
];

interface StepReminderProps {
  learningReminderEnabled: boolean;
  onToggleReminder: (enabled: boolean) => void;
  learningReminderTime: string;
  onSelectReminderTime: (time: string) => void;
}

export const StepReminder: React.FC<StepReminderProps> = ({
  learningReminderEnabled,
  onToggleReminder,
  learningReminderTime,
  onSelectReminderTime,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.stepBox}>
      <Text style={[styles.headlineTitle, { color: colors.text }]}>
        Want a reminder to learn?
      </Text>
      <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
        Consistent micro-lessons build permanent legal literacy. We can send a daily nudge.
      </Text>

      {/* CHOICE ROW */}
      <View style={styles.reminderChoiceRow}>
        <TouchableOpacity
          style={[
            styles.reminderChoiceCard,
            {
              backgroundColor: learningReminderEnabled ? colors.accentLight : colors.cardWhite,
              borderColor: learningReminderEnabled ? colors.primary : colors.border,
              borderWidth: learningReminderEnabled ? 2 : 1,
            },
          ]}
          activeOpacity={0.85}
          onPress={() => onToggleReminder(true)}
        >
          <View
            style={[
              styles.choiceIconCircle,
              { backgroundColor: learningReminderEnabled ? colors.primary : colors.cardBackground },
            ]}
          >
            <Bell size={20} color={learningReminderEnabled ? '#FFFFFF' : colors.primary} />
          </View>
          <Text style={[styles.choiceTitle, { color: colors.text }]}>Set a reminder</Text>
          <Text style={[styles.choiceSub, { color: colors.textMuted }]}>
            Build your daily streak
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.reminderChoiceCard,
            {
              backgroundColor: !learningReminderEnabled ? colors.cardBackground : colors.cardWhite,
              borderColor: !learningReminderEnabled ? colors.textMuted : colors.border,
              borderWidth: !learningReminderEnabled ? 2 : 1,
            },
          ]}
          activeOpacity={0.85}
          onPress={() => onToggleReminder(false)}
        >
          <View
            style={[
              styles.choiceIconCircle,
              { backgroundColor: !learningReminderEnabled ? colors.border : colors.cardBackground },
            ]}
          >
            <BellOff size={20} color={colors.textMuted} />
          </View>
          <Text style={[styles.choiceTitle, { color: colors.text }]}>Not now</Text>
          <Text style={[styles.choiceSub, { color: colors.textMuted }]}>
            Learn at your own pace
          </Text>
        </TouchableOpacity>
      </View>

      {/* SUB-SECTION IF REMINDER ENABLED */}
      {learningReminderEnabled && (
        <View style={styles.timeSelectionSubSection}>
          <Text style={[styles.timeSelectionTitle, { color: colors.text }]}>
            What time works best?
          </Text>

          <View style={styles.selectionCardsList}>
            {REMINDER_TIME_OPTIONS.map((item) => {
              const isSelected = learningReminderTime === item.time;
              return (
                <TouchableOpacity
                  key={item.time}
                  style={[
                    styles.timeOptionCard,
                    {
                      backgroundColor: isSelected ? colors.accentLight : colors.cardWhite,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => onSelectReminderTime(item.time)}
                >
                  <Clock
                    size={18}
                    color={isSelected ? colors.primary : colors.textMuted}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.timeValueText,
                        { color: isSelected ? colors.primary : colors.text },
                      ]}
                    >
                      {item.time}
                    </Text>
                    <Text style={[styles.timeLabelText, { color: colors.textMuted }]}>
                      {item.label}
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stepBox: {
    width: '100%',
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
    marginBottom: Spacing.lg,
  },
  reminderChoiceRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  reminderChoiceCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  choiceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  choiceTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  choiceSub: {
    fontSize: 11,
    textAlign: 'center',
  },
  timeSelectionSubSection: {
    marginTop: Spacing.sm,
  },
  timeSelectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  selectionCardsList: {
    gap: Spacing.sm,
  },
  timeOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  timeValueText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  timeLabelText: {
    fontSize: 12,
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
