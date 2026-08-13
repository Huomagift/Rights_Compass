import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Lock, ShieldCheck, CheckCircle2, Bell, Scale, Sparkles } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function MarketplaceScreen() {
  const [notified, setNotified] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Find Legal Aid</Text>
        <Text style={styles.pageSubtitle}>
          Connect with NBA-verified pro bono lawyers and accredited legal representation.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* COMING SOON LOCKED CARD */}
        <View style={styles.comingSoonCard}>
          <View style={styles.lockIconCircle}>
            <Lock size={28} color={Colors.primary} />
          </View>

          <View style={styles.phaseBadge}>
            <Text style={styles.phaseBadgeText}>PHASE 2 • COMING SOON</Text>
          </View>

          <Text style={styles.cardTitle}>NBA Legal Aid Network</Text>
          <Text style={styles.cardDescription}>
            We are currently verifying and onboarding accredited Nigerian Bar Association (NBA) legal practitioners and pro bono organizations. Direct lawyer matching and intake requests will launch in our next release.
          </Text>

          {/* TEASER FEATURE LIST */}
          <View style={styles.teaserBox}>
            <View style={styles.teaserRow}>
              <CheckCircle2 size={16} color={Colors.success} style={{ marginRight: 8 }} />
              <Text style={styles.teaserText}>NBA Enrollment Database Verification</Text>
            </View>

            <View style={styles.teaserRow}>
              <ShieldCheck size={16} color={Colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.teaserText}>Pro Bono & Free Legal Representation</Text>
            </View>

            <View style={styles.teaserRow}>
              <Scale size={16} color={Colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.teaserText}>State & Specialty Case Intake Matching</Text>
            </View>
          </View>

          {/* WAITLIST / NOTIFY BUTTON */}
          <TouchableOpacity
            style={[styles.notifyBtn, notified && styles.notifyBtnActive]}
            activeOpacity={0.85}
            onPress={() => setNotified(!notified)}
          >
            {notified ? (
              <View style={styles.btnRow}>
                <Sparkles size={18} color={Colors.white} style={{ marginRight: 6 }} />
                <Text style={styles.notifyBtnText}>You&apos;re on the Waitlist!</Text>
              </View>
            ) : (
              <View style={styles.btnRow}>
                <Bell size={18} color={Colors.white} style={{ marginRight: 6 }} />
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
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textMuted,
    marginTop: 2,
  },
  scrollContent: {
    padding: Spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  comingSoonCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  lockIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  phaseBadge: {
    backgroundColor: 'rgba(150, 62, 20, 0.12)',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
  },
  phaseBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  teaserBox: {
    width: '100%',
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.text,
  },
  notifyBtn: {
    width: '100%',
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  notifyBtnActive: {
    backgroundColor: Colors.success,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
