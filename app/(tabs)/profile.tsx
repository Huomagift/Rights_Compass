import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Clock,
  Bell,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Flame,
  LogOut,
  Sun,
  Moon,
  Shield,
  Sparkles,
  User,
  Smartphone,
} from 'lucide-react-native';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
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
        <View style={styles.headerTopRow}>
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
        {/* MATERIAL 3 ELEVATED USER PROFILE CARD */}
        <View style={[styles.userCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={[styles.avatarBig, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarLetter}>
              {profile.name ? profile.name[0].toUpperCase() : 'A'}
            </Text>
          </View>

          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={[styles.userName, { color: colors.text }]}>{profile.name}</Text>
            {profile.phoneNumber ? (
              <View style={styles.userSubRow}>
                <Smartphone size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
                <Text style={[styles.userPhone, { color: colors.textMuted }]}>{profile.phoneNumber}</Text>
              </View>
            ) : (
              <Text style={[styles.userPhone, { color: colors.textMuted }]}>WhatsApp Sync Ready</Text>
            )}

            <View style={[styles.streakRow, { backgroundColor: colors.streakBadgeBg }]}>
              <Flame size={13} color={colors.streakBadgeText} style={{ marginRight: 4 }} />
              <Text style={[styles.streakBadgeText, { color: colors.streakBadgeText }]}>
                {profile.streakCount} Day Streak Active
              </Text>
            </View>
          </View>
        </View>

        {/* APPEARANCE & THEME SETTINGS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance & Theme</Text>
        <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.settingIconCircle, { backgroundColor: colors.accentLight }]}>
              {isDark ? (
                <Sun size={18} color={colors.primary} />
              ) : (
                <Moon size={18} color={colors.primary} />
              )}
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Expressive Dark Mode</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                {isDark ? 'Dark theme active (OLED optimized)' : 'Light theme active (Warm accent)'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* DAILY HABIT SETTINGS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Habit & Offline Sync</Text>
        <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.settingIconCircle, { backgroundColor: colors.accentLight }]}>
              <Clock size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Daily Notification Time</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                Delivered 100% offline at {profile.preferredTime}
              </Text>
            </View>
            <TouchableOpacity style={styles.changeBtn}>
              <Text style={[styles.changeBtnText, { color: colors.primary }]}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.settingIconCircle, { backgroundColor: colors.accentLight }]}>
              <Shield size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Offline 1999 Constitution Engine</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                320 sections cached locally for offline emergency access
              </Text>
            </View>
            <CheckCircle2 size={20} color={colors.success} />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleResetStreak}
            activeOpacity={0.8}
          >
            <View style={[styles.settingIconCircle, { backgroundColor: colors.streakBadgeBg }]}>
              <Flame size={18} color={colors.streakBadgeText} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Reset Daily Streak</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                Reset streak counter back to Day 1
              </Text>
            </View>
            <Text style={[styles.changeBtnText, { color: colors.primary }]}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* ACCOUNT ACTIONS & PRIVACY */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account & Privacy (NDPR Guidelines)</Text>
        <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
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
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>End active session & return to onboarding</Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleResetData}
            activeOpacity={0.8}
          >
            <View style={[styles.settingIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Trash2 size={18} color="#DC2626" />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: '#DC2626' }]}>
                Delete My Account & Data (NDPR)
              </Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                Permanent deletion of local profile & streak stats
              </Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
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
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
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
    maxWidth: 720,
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
  avatarBig: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  avatarLetter: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
  },
  userSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userPhone: {
    fontSize: 13,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  streakBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
    paddingLeft: 4,
  },
  settingsGroup: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  settingIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
  changeBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  changeBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
