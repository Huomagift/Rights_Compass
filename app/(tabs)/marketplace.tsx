import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Lock, ShieldCheck, CheckCircle2, Bell, Scale, Sparkles, Sun, Moon } from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export default function MarketplaceScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [notified, setNotified] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerTopRow}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>Find Legal Aid</Text>
            <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
              Connect with NBA-verified pro bono lawyers and accredited legal representation.
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.themeToggleBtn,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.8}
            accessibilityLabel="Toggle Theme"
          >
            {isDark ? (
              <Sun size={17} color={colors.text} />
            ) : (
              <Moon size={17} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* COMING SOON LOCKED CARD */}
        <View
          style={[
            styles.comingSoonCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.lockIconCircle,
              { backgroundColor: colors.accentLight, borderColor: colors.border },
            ]}
          >
            <Lock size={28} color={colors.primary} />
          </View>

          <View
            style={[
              styles.phaseBadge,
              { backgroundColor: colors.streakBadgeBg },
            ]}
          >
            <Text style={[styles.phaseBadgeText, { color: colors.primary }]}>
              PHASE 2 • COMING SOON
            </Text>
          </View>

          <Text style={[styles.cardTitle, { color: colors.text }]}>
            NBA Legal Aid Network
          </Text>
          <Text style={[styles.cardDescription, { color: colors.textMuted }]}>
            We are currently verifying and onboarding accredited Nigerian Bar Association (NBA) legal practitioners and pro bono organizations. Direct lawyer matching and intake requests will launch in our next release.
          </Text>

          {/* TEASER FEATURE LIST */}
          <View
            style={[
              styles.teaserBox,
              { backgroundColor: colors.cardWhite, borderColor: colors.border },
            ]}
          >
            <View style={styles.teaserRow}>
              <CheckCircle2 size={16} color={colors.success} style={{ marginRight: 8 }} />
              <Text style={[styles.teaserText, { color: colors.text }]}>
                NBA Enrollment Database Verification
              </Text>
            </View>

            <View style={styles.teaserRow}>
              <ShieldCheck size={16} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.teaserText, { color: colors.text }]}>
                Pro Bono & Free Legal Representation
              </Text>
            </View>

            <View style={styles.teaserRow}>
              <Scale size={16} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.teaserText, { color: colors.text }]}>
                State & Specialty Case Intake Matching
              </Text>
            </View>
          </View>

          {/* WAITLIST / NOTIFY BUTTON */}
          <TouchableOpacity
            style={[
              styles.notifyBtn,
              { backgroundColor: colors.accent },
              notified && { backgroundColor: colors.success },
            ]}
            activeOpacity={0.85}
            onPress={() => setNotified(!notified)}
          >
            {notified ? (
              <View style={styles.btnRow}>
                <Sparkles size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.notifyBtnText}>You&apos;re on the Waitlist!</Text>
              </View>
            ) : (
              <View style={styles.btnRow}>
                <Bell size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.notifyBtnText}>Notify Me When Live</Text>
              </View>
            )}
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  themeToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  scrollContent: {
    padding: Spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 100, // tab bar clearance
  },
  comingSoonCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    ...Shadows.md,
  },
  lockIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    ...Shadows.sm,
  },
  phaseBadge: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
  },
  phaseBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  teaserBox: {
    width: '100%',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    ...Shadows.sm,
  },
  teaserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  teaserText: {
    fontSize: 13,
    fontWeight: '600',
  },
  notifyBtn: {
    width: '100%',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
