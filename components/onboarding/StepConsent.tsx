import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import {
  User,
  Clock,
  Shield,
  Zap,
  Bell,
  Briefcase,
  AlertCircle,
  Check,
  CheckCircle2,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

interface StepConsentProps {
  name: string;
  phone: string;
  isOtpVerified: boolean;
  preferredTime: string;
  selectedDomainsCount: number;
  dailyCommitmentMinutes: number;
  learningReminderEnabled: boolean;
  learningReminderTime: string;
  isLawyerPath: boolean;
  marketplaceEnabled: boolean;
  consentChecked: boolean;
  onToggleConsent: (checked: boolean) => void;
}

export const StepConsent: React.FC<StepConsentProps> = ({
  name,
  phone,
  isOtpVerified,
  preferredTime,
  selectedDomainsCount,
  dailyCommitmentMinutes,
  learningReminderEnabled,
  learningReminderTime,
  isLawyerPath,
  marketplaceEnabled,
  consentChecked,
  onToggleConsent,
}) => {
  const { colors } = useTheme();

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
          &quot;Almost there! Review your profile and accept the educational notice to enter.&quot;
        </Text>
      </View>

      {/* USER SUMMARY CARDS */}
      <View
        style={[
          styles.summaryReviewCard,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.summaryReviewHeading, { color: colors.textMuted }]}>
          YOUR COMPASS PROFILE
        </Text>
        <View style={styles.summaryPillRow}>
          <View
            style={[
              styles.reviewChip,
              { backgroundColor: colors.cardWhite, borderColor: colors.border },
            ]}
          >
            <User size={12} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.reviewChipText, { color: colors.text }]}>
              {name.trim() || 'Alex'}
            </Text>
          </View>

          <View
            style={[
              styles.reviewChip,
              { backgroundColor: colors.cardWhite, borderColor: colors.border },
            ]}
          >
            <CheckCircle2 size={12} color={colors.success} style={{ marginRight: 4 }} />
            <Text style={[styles.reviewChipText, { color: colors.text }]}>
              {phone || 'Verified WhatsApp'}
            </Text>
          </View>

          <View
            style={[
              styles.reviewChip,
              { backgroundColor: colors.cardWhite, borderColor: colors.border },
            ]}
          >
            <Clock size={12} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.reviewChipText, { color: colors.text }]}>
              Daily Card: {preferredTime}
            </Text>
          </View>

          <View
            style={[
              styles.reviewChip,
              { backgroundColor: colors.cardWhite, borderColor: colors.border },
            ]}
          >
            <Shield size={12} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.reviewChipText, { color: colors.text }]}>
              {selectedDomainsCount} Priority Topics
            </Text>
          </View>

          <View
            style={[
              styles.reviewChip,
              { backgroundColor: colors.cardWhite, borderColor: colors.border },
            ]}
          >
            <Zap size={12} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.reviewChipText, { color: colors.text }]}>
              {dailyCommitmentMinutes} min / day Goal
            </Text>
          </View>

          {learningReminderEnabled && (
            <View
              style={[
                styles.reviewChip,
                { backgroundColor: colors.cardWhite, borderColor: colors.border },
              ]}
            >
              <Bell size={12} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={[styles.reviewChipText, { color: colors.text }]}>
                Reminder: {learningReminderTime}
              </Text>
            </View>
          )}

          {marketplaceEnabled && isLawyerPath && (
            <View
              style={[
                styles.reviewChip,
                { backgroundColor: colors.accentLight, borderColor: colors.primary },
              ]}
            >
              <Briefcase size={12} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={[styles.reviewChipText, { color: colors.primary, fontWeight: '700' }]}>
                Lawyer Track Active
              </Text>
            </View>
          )}
        </View>
      </View>

      <Text style={[styles.headlineTitle, { color: colors.text }]}>
        Important Legal Notice
      </Text>
      <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
        Please review our educational guidance terms before entering Rights Compass.
      </Text>

      {/* LEGAL DISCLAIMER BOX */}
      <View
        style={[
          styles.disclaimerBox,
          { backgroundColor: colors.cardWhite, borderColor: colors.border },
        ]}
      >
        <View style={styles.disclaimerHeaderRow}>
          <AlertCircle size={18} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={[styles.disclaimerBoxTitle, { color: colors.text }]}>
            Educational Disclaimer
          </Text>
        </View>

        <Text style={[styles.disclaimerParagraph, { color: colors.textMuted }]}>
          Rights Compass provides general legal information and educational guidance based on verified legal sources in Nigeria (including the 1999 Constitution and Administration of Criminal Justice Act).
        </Text>

        <Text style={[styles.disclaimerParagraph, { color: colors.textMuted }]}>
          The information does not constitute formal legal advice and does not create an attorney-client relationship. For decisions with critical legal consequences, always consult a licensed Nigerian legal practitioner.
        </Text>

        <Text style={[styles.disclaimerParagraph, { color: colors.textMuted }]}>
          By continuing, you acknowledge that you have read and understood this educational scope.
        </Text>
      </View>

      {/* CONSENT CHECKBOX ROW */}
      <TouchableOpacity
        style={[
          styles.consentCheckboxCard,
          {
            backgroundColor: consentChecked ? colors.accentLight : colors.cardWhite,
            borderColor: consentChecked ? colors.primary : colors.border,
            borderWidth: consentChecked ? 2 : 1,
          },
        ]}
        activeOpacity={0.85}
        onPress={() => onToggleConsent(!consentChecked)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: consentChecked }}
      >
        <View
          style={[
            styles.checkIndicatorCircle,
            {
              backgroundColor: consentChecked ? colors.primary : 'transparent',
              borderColor: consentChecked ? colors.primary : colors.border,
              marginRight: 12,
            },
          ]}
        >
          {consentChecked && <Check size={14} color="#FFFFFF" />}
        </View>
        <Text style={[styles.consentCheckboxLabel, { color: colors.text }]}>
          I have read and understood the disclaimer and agree to continue.
        </Text>
      </TouchableOpacity>
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
  summaryReviewCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  summaryReviewHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  summaryPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  reviewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  reviewChipText: {
    fontSize: 12,
    fontWeight: '600',
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
  disclaimerBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  disclaimerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  disclaimerBoxTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  disclaimerParagraph: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },
  consentCheckboxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  checkIndicatorCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consentCheckboxLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
});
