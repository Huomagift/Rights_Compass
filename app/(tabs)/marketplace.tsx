/**
 * Marketplace Tab – entry point
 *
 * MARKETPLACE_ENABLED = false  →  existing waitlist screen (zero change)
 * MARKETPLACE_ENABLED = true   →  routes into app/marketplace/ stack
 */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, ShieldCheck, CheckCircle2, Bell, Scale, Sparkles, Sun, Moon, Gavel, UserCheck } from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows, CONTENT_MAX_WIDTH } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useFeatureFlag } from '../../config/featureFlags';
import { MarketplaceDirectory } from '../../components/MarketplaceDirectory';

// ─── Flag-Off: existing waitlist screen (unchanged JSX) ──────────────────────

function WaitlistScreen() {
  const { width } = useWindowDimensions();
  const { colors, isDark, toggleTheme } = useTheme();
  const [notified, setNotified] = useState(false);
  const isWide = width > 768;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* MATERIAL 3 LARGE TOP APP BAR */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <View style={[styles.headerInner, isWide && styles.headerInnerWide]}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>Find Legal Aid</Text>
            <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
              Connect with NBA-verified lawyers and accredited legal professionals.
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
              <Sun size={18} color={colors.text} />
            ) : (
              <Moon size={18} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isWide && styles.wideScrollContent,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* MATERIAL 3 ELEVATED CONTAINER CARD */}
        <View
          style={[
            styles.comingSoonCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.lockIconCircle,
              { backgroundColor: colors.accentLight, borderColor: colors.primary },
            ]}
          >
            <Gavel size={32} color={colors.primary} />
          </View>

          <View
            style={[
              styles.phaseBadge,
              { backgroundColor: colors.streakBadgeBg },
            ]}
          >
            <Text style={[styles.phaseBadgeText, { color: colors.primary }]}>
              PHASE 2 • NBA VERIFIED NETWORK
            </Text>
          </View>

          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Accredited Legal Aid Network
          </Text>
          <Text style={[styles.cardDescription, { color: colors.textMuted }]}>
            We are currently verifying and onboarding Nigerian Bar Association (NBA) accredited legal practitioners. Find the right lawyer for your matter, get transparent pricing, and connect directly — launching in our next release.
          </Text>

          {/* TEASER FEATURE LIST CONTAINER */}
          <View
            style={[
              styles.teaserBox,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : colors.cardWhite,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.teaserRow}>
              <View style={[styles.checkCircleBox, { backgroundColor: 'rgba(74, 186, 114, 0.15)' }]}>
                <CheckCircle2 size={16} color={colors.success} />
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                <Text style={[styles.teaserTextTitle, { color: colors.text }]}>
                  NBA Supreme Court Roll Verification
                </Text>
                <Text style={[styles.teaserTextSub, { color: colors.textMuted }]}>
                  Every attorney verified via Supreme Court SCN enrolment numbers
                </Text>
              </View>
            </View>

            <View style={styles.teaserRow}>
              <View style={[styles.checkCircleBox, { backgroundColor: colors.accentLight }]}>
                <ShieldCheck size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                <Text style={[styles.teaserTextTitle, { color: colors.text }]}>
                  Transparent Flat-Rate Services
                </Text>
                <Text style={[styles.teaserTextSub, { color: colors.textMuted }]}>
                  Know exactly what you pay upfront. No hidden fees, no surprise bills.
                </Text>
              </View>
            </View>

            <View style={styles.teaserRow}>
              <View style={[styles.checkCircleBox, { backgroundColor: colors.accentLight }]}>
                <UserCheck size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                <Text style={[styles.teaserTextTitle, { color: colors.text }]}>
                  36-State Geo Intake Matching
                </Text>
                <Text style={[styles.teaserTextSub, { color: colors.textMuted }]}>
                  Instant matching with accredited counsel in your state jurisdiction
                </Text>
              </View>
            </View>
          </View>

          {/* MATERIAL 3 NOTIFY WAITLIST PILL BUTTON */}
          <TouchableOpacity
            style={[
              styles.notifyBtn,
              { backgroundColor: colors.primary },
              notified && { backgroundColor: colors.success },
            ]}
            activeOpacity={0.85}
            onPress={() => setNotified(!notified)}
            accessibilityLabel="Join waitlist"
          >
            {notified ? (
              <View style={styles.btnRow}>
                <Sparkles size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.notifyBtnText}>You&apos;re on the Verified Waitlist!</Text>
              </View>
            ) : (
              <View style={styles.btnRow}>
                <Bell size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.notifyBtnText}>Notify Me When Network Launches</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────

export default function MarketplaceScreen() {
  const marketplaceEnabled = useFeatureFlag('MARKETPLACE_ENABLED');
  if (marketplaceEnabled) {
    return <MarketplaceDirectory />;
  }
  return <WaitlistScreen />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerInnerWide: {
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    width: '100%',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  m3TagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    marginBottom: 6,
    gap: 6,
  },
  m3TagText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  themeToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pageTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 13, lineHeight: 19, marginTop: 2 },
  scrollContent: {
    padding: Spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 100,
  },
  wideScrollContent: { maxWidth: CONTENT_MAX_WIDTH, alignSelf: 'center', width: '100%' },
  comingSoonCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    ...Shadows.md,
  },
  lockIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    ...Shadows.sm,
  },
  phaseBadge: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginBottom: Spacing.sm,
  },
  phaseBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  cardTitle: {
    fontSize: 24,
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
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    gap: 12,
  },
  teaserRow: { flexDirection: 'row', alignItems: 'center' },
  checkCircleBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teaserTextTitle: { fontSize: 14, fontWeight: '700' },
  teaserTextSub: { fontSize: 12, lineHeight: 16 },
  notifyBtn: {
    width: '100%',
    borderRadius: BorderRadius.pill,
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
  notifyBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
