import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import {
  Scale,
  Sparkles,
  Zap,
  WifiOff,
  Bot,
  HelpCircle,
  ArrowRight,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

interface StepWelcomeProps {
  onStart: () => void;
  onAlreadyHaveAccount?: () => void;
}

export const StepWelcome: React.FC<StepWelcomeProps> = ({
  onStart,
  onAlreadyHaveAccount,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.stepBox}>
      {/* BRAND HEADER & PILL */}
      <View style={styles.welcomeBadgeRow}>
        <Image
          source={require('../../assets/images/rights_compass_logo.png')}
          style={styles.welcomeLogo}
          contentFit="contain"
        />
        <View
          style={[
            styles.compassPill,
            { backgroundColor: colors.streakBadgeBg, borderColor: colors.border },
          ]}
        >
          <Scale size={12} color={colors.primary} style={{ marginRight: 4 }} />
          <Text style={[styles.compassPillText, { color: colors.primary }]}>
            LEGAL CLARITY APP
          </Text>
        </View>
      </View>

      <Text style={[styles.headlineTitle, { color: colors.text }]}>
        Welcome to Rights Compass
      </Text>
      <Text style={[styles.headlineSubtitle, { color: colors.textMuted }]}>
        Everyday legal rights for everyday Nigerians. Practical, straightforward, and 100% offline.
      </Text>

      {/* AEGIS MASCOT INTRO CARD */}
      <View
        style={[
          styles.aegisSpeechCard,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.aegisAvatarContainer}>
          <Image
            source={require('../../assets/images/mascot.png')}
            style={styles.aegisAvatar}
            contentFit="cover"
          />
          <View style={[styles.aegisSparklePill, { backgroundColor: colors.accent }]}>
            <Sparkles size={10} color="#FFFFFF" />
          </View>
        </View>

        <View
          style={[
            styles.aegisSpeechBubble,
            {
              backgroundColor: colors.cardWhite,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.aegisBubbleTail,
              { borderRightColor: colors.cardWhite },
            ]}
          />
          <View style={styles.aegisNameTag}>
            <Text style={[styles.aegisNameText, { color: colors.primary }]}>
              AEGIS • YOUR LEGAL GUIDE
            </Text>
          </View>
          <Text style={[styles.aegisSpeechQuote, { color: colors.text }]}>
            &quot;Hi! I&apos;m <Text style={{ color: colors.primary, fontWeight: '800' }}>Aegis</Text> 👋 I&apos;ll be right beside you to make complex Nigerian laws clear, practical, and ready whenever you need them!&quot;
          </Text>
        </View>
      </View>

      {/* 4 CORE VALUE PILLARS */}
      <View style={styles.valuePillarsGrid}>
        <View
          style={[
            styles.pillarCard,
            { backgroundColor: colors.cardWhite, borderColor: colors.border },
          ]}
        >
          <View style={[styles.pillarIconCircle, { backgroundColor: colors.accentLight }]}>
            <Zap size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pillarTitle, { color: colors.text }]}>
              1-Minute Daily Lessons
            </Text>
            <Text style={[styles.pillarDesc, { color: colors.textMuted }]}>
              Bite-sized legal literacy you can finish on your morning commute.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.pillarCard,
            { backgroundColor: colors.cardWhite, borderColor: colors.border },
          ]}
        >
          <View style={[styles.pillarIconCircle, { backgroundColor: colors.accentLight }]}>
            <WifiOff size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pillarTitle, { color: colors.text }]}>
              100% Offline Access
            </Text>
            <Text style={[styles.pillarDesc, { color: colors.textMuted }]}>
              All Nigerian legal references stay on your device without internet.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.pillarCard,
            { backgroundColor: colors.cardWhite, borderColor: colors.border },
          ]}
        >
          <View style={[styles.pillarIconCircle, { backgroundColor: colors.accentLight }]}>
            <Bot size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pillarTitle, { color: colors.text }]}>
              24/7 AI Legal Tutor
            </Text>
            <Text style={[styles.pillarDesc, { color: colors.textMuted }]}>
              Instant guidance on police, tenancy, and civil rules in plain language.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.pillarCard,
            { backgroundColor: colors.cardWhite, borderColor: colors.border },
          ]}
        >
          <View style={[styles.pillarIconCircle, { backgroundColor: colors.accentLight }]}>
            <HelpCircle size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pillarTitle, { color: colors.text }]}>
              Interactive Quizzes
            </Text>
            <Text style={[styles.pillarDesc, { color: colors.textMuted }]}>
              Test your understanding with short scenarios. Learn it. Test it. Remember it.
            </Text>
          </View>
        </View>
      </View>

      {/* "I ALREADY HAVE AN ACCOUNT" LINK */}
      {onAlreadyHaveAccount && (
        <TouchableOpacity
          style={styles.alreadyAccountBtn}
          onPress={onAlreadyHaveAccount}
          activeOpacity={0.7}
        >
          <Text style={[styles.alreadyAccountText, { color: colors.textMuted }]}>
            Already verified your phone?{' '}
            <Text style={{ color: colors.primary, fontWeight: '700' }}>
              Sign in with OTP
            </Text>
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stepBox: {
    width: '100%',
  },
  welcomeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  welcomeLogo: {
    width: 44,
    height: 44,
  },
  compassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  compassPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
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
  aegisSpeechCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  aegisAvatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  aegisAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  aegisSparklePill: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aegisSpeechBubble: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    position: 'relative',
  },
  aegisBubbleTail: {
    position: 'absolute',
    left: -8,
    top: 22,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  aegisNameTag: {
    marginBottom: 4,
  },
  aegisNameText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  aegisSpeechQuote: {
    fontSize: 13,
    lineHeight: 18,
  },
  valuePillarsGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  pillarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  pillarIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  pillarTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  pillarDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  alreadyAccountBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  alreadyAccountText: {
    fontSize: 13,
  },
});
