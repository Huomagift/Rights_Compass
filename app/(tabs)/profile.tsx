import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Gavel,
  LogOut,
  Moon,
  Shield,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  User,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows, CONTENT_MAX_WIDTH } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { useFeatureFlag } from '../../config/featureFlags';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  resetStoredProfile,
  resetStreakToDayOne,
  updateDailyStreak,
  UserProfile,
} from '../../services/offlineStorage';
import { signOutUser } from '../../services/authService';

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, isDark, toggleTheme } = useTheme();
  const marketplaceEnabled = useFeatureFlag('MARKETPLACE_ENABLED');
  const { application, isVerifiedLawyer, isPendingVerification, hasAppliedAsLawyer } = useMarketplace();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const isWide = width > 768;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const p = await updateDailyStreak();
    setProfile(p);
  };

  const handleResetStreak = async () => {
    const updated = await resetStreakToDayOne();
    setProfile(updated);
    Alert.alert('Streak Reset', 'Your daily streak has been reset to 1 Day.');
  };

  const handleLogOut = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of Rights Compass?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await signOutUser();
            router.replace('/onboarding' as any);
          },
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Delete My Account & Data',
      'Under NDPR guidelines, this will delete your saved profile settings, remote record, and streak counts. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete & Reset',
          style: 'destructive',
          onPress: async () => {
            await resetStoredProfile();
            router.replace('/onboarding' as any);
          },
        },
      ]
    );
  };

  if (!profile) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* MATERIAL 3 LARGE TOP APP BAR */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={[styles.headerTopRow, isWide && styles.headerTopRowWide]}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <View
              style={[
                styles.m3TagBadge,
                { backgroundColor: isDark ? 'rgba(212, 98, 42, 0.2)' : colors.accentLight },
              ]}
            >
              <Sparkles size={12} color={colors.primary} />
              <Text style={[styles.m3TagText, { color: colors.primary }]}>
                M3 Account Center
              </Text>
            </View>
            <Text style={[styles.pageTitle, { color: colors.text }]}>Account & Settings</Text>
            <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
              Manage your daily rights habit preferences, theme, and privacy controls.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.themeToggleBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={toggleTheme}
            activeOpacity={0.8}
            accessibilityLabel="Toggle Theme"
          >
            {isDark ? <Sun size={18} color={colors.text} /> : <Moon size={18} color={colors.text} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, isWide && styles.wideScrollContent]}
        showsVerticalScrollIndicator={false}
      >
        {/* USER IDENTITY CARD */}
        <View style={[styles.userCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarInitials}>
              {profile.name ? profile.name[0].toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {profile.name || 'Citizen Scholar'}
            </Text>
            <Text style={[styles.userTier, { color: colors.textMuted }]}>
              Citizen Tier • 100% Free & Open Access
            </Text>
            {profile.phoneNumber ? (
              <View style={styles.phoneBadge}>
                <Smartphone size={12} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={[styles.phoneBadgeText, { color: colors.textMuted }]}>
                  {profile.phoneNumber} (WhatsApp Active)
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* CIVIC PROGRESS STATS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Civic Engagement Stats</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Flame size={20} color="#D97706" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{profile.streakCount || 1}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Day Streak</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={[styles.statIconCircle, { backgroundColor: colors.accentLight }]}>
              <Shield size={20} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{profile.interests.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Priority Topics</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={[styles.statIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <CheckCircle2 size={20} color="#16A34A" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>Active</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Legal Habit</Text>
          </View>
        </View>

        {/* PREFERENCES SETTINGS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Habit Preferences</Text>
        <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {/* Notification Time */}
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.settingIconCircle, { backgroundColor: colors.accentLight }]}>
              <Clock size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Daily Digest Time</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                Scheduled for {profile.preferredTime || '08:00 AM'} daily
              </Text>
            </View>
          </View>

          {/* Dark Mode Switch */}
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.settingIconCircle, { backgroundColor: colors.accentLight }]}>
              {isDark ? <Sun size={18} color={colors.primary} /> : <Moon size={18} color={colors.primary} />}
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Appearance</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                {isDark ? 'OLED Dark mode active' : 'Warm parchment light theme'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Reset Streak Manually */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleResetStreak}
            activeOpacity={0.8}
            accessibilityLabel="Reset streak counter"
          >
            <View style={[styles.settingIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Flame size={18} color="#D97706" />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Reset Streak Counter</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                Start civic engagement streak back at Day 1
              </Text>
            </View>
            <Text style={[styles.changeBtnText, { color: colors.primary }]}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* ACCOUNT ACTIONS & PRIVACY */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account & Privacy (NDPR Guidelines)</Text>
        <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {/* Lawyer Portal & Status – flag-gated */}
          {marketplaceEnabled && (
            <TouchableOpacity
              style={[styles.settingItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                if (hasAppliedAsLawyer) {
                  router.push('/marketplace/dashboard' as any);
                } else {
                  router.push('/lawyer-application' as any);
                }
              }}
              activeOpacity={0.8}
              accessibilityLabel={
                hasAppliedAsLawyer ? 'Open Lawyer Dashboard' : 'Apply as a lawyer'
              }
            >
              <View style={[styles.settingIconCircle, { backgroundColor: colors.accentLight }]}>
                <Gavel size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    {hasAppliedAsLawyer ? 'Lawyer Dashboard' : 'Apply as a Lawyer'}
                  </Text>
                  {isVerifiedLawyer && (
                    <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: '#166534' }}>VERIFIED</Text>
                    </View>
                  )}
                  {isPendingVerification && (
                    <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: '#92400E' }}>UNDER REVIEW</Text>
                    </View>
                  )}
                  {application?.status === 'rejected' && (
                    <View style={{ backgroundColor: '#FEE2E2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: '#991B1B' }}>ACTION NEEDED</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                  {isVerifiedLawyer
                    ? 'Manage consultation requests & practice profile'
                    : isPendingVerification
                    ? 'Application under review • View dashboard'
                    : application?.status === 'rejected'
                    ? 'Application feedback ready • Tap to review'
                    : 'Join the NBA-verified lawyer directory'}
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={handleLogOut}
            activeOpacity={0.8}
          >
            <View style={[styles.settingIconCircle, { backgroundColor: colors.accentLight }]}>
              <LogOut size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Log Out</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                Safely end your local session
              </Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Delete Account & Data */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleResetData}
            activeOpacity={0.8}
            accessibilityLabel="Delete Account and Data"
          >
            <View style={[styles.settingIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Trash2 size={18} color="#DC2626" />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: '#DC2626' }]}>Delete Account & Data</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                Permanently erase local & remote records per NDPR
              </Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* FOOTER METADATA */}
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Rights Compass • Version 1.4.2
          </Text>
          <Text style={[styles.footerSubText, { color: colors.textMuted }]}>
            Designed for Nigerian Citizens & Legal Empowerment
          </Text>
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
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTopRowWide: {
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    width: '100%',
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
  m3TagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  themeToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 110,
  },
  wideScrollContent: {
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    width: '100%',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    ...Shadows.md,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
  },
  userTier: {
    fontSize: 12,
    marginTop: 2,
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  phoneBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    letterSpacing: 0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statBox: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    ...Shadows.sm,
  },
  statIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  settingsGroup: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  settingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingSub: {
    fontSize: 12,
    marginTop: 2,
  },
  changeBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footerSubText: {
    fontSize: 11,
  },
});
