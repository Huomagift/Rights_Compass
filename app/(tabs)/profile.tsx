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
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
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
  const { colors, isDark, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);

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
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Account & Settings</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
          Manage your daily rights habit preferences, theme, and privacy controls.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* USER CARD */}
        <View style={[styles.userCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={[styles.avatarBig, { backgroundColor: colors.primaryDark }]}>
            <Text style={styles.avatarLetter}>
              {profile.name ? profile.name[0].toUpperCase() : 'A'}
            </Text>
          </View>

          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={[styles.userName, { color: colors.text }]}>{profile.name}</Text>
            {profile.phoneNumber ? (
              <Text style={[styles.userPhone, { color: colors.textMuted }]}>{profile.phoneNumber}</Text>
            ) : (
              <Text style={[styles.userPhone, { color: colors.textMuted }]}>WhatsApp Not Linked</Text>
            )}
            <View style={[styles.streakRow, { backgroundColor: colors.streakBadgeBg }]}>
              <Flame size={12} color={colors.streakBadgeText} style={{ marginRight: 4 }} />
              <Text style={[styles.streakBadgeText, { color: colors.streakBadgeText }]}>
                {profile.streakCount} Day Streak Active
              </Text>
            </View>
          </View>
        </View>

        {/* APPEARANCE & THEME SETTINGS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
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
              <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                {isDark ? 'Dark theme is active' : 'Light theme is active'}
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Habit Loop</Text>
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

          <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.settingIconCircle, { backgroundColor: colors.accentLight }]}>
              <Bell size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Offline Mode & Supabase Sync</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                {profile.syncedToSupabase
                  ? 'Profile synced with Supabase database'
                  : '1999 Constitution cached on device'}
              </Text>
            </View>
            <CheckCircle2 size={20} color={colors.success} />
          </View>

          <TouchableOpacity
            style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: colors.border }]}
            onPress={handleResetStreak}
          >
            <View style={[styles.settingIconCircle, { backgroundColor: colors.streakBadgeBg }]}>
              <Flame size={18} color={colors.streakBadgeText} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Reset Streak Counter</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                Reset daily streak to Day 1
              </Text>
            </View>
            <Text style={[styles.changeBtnText, { color: colors.primary }]}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* ACCOUNT ACTIONS & PRIVACY */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account & Privacy (NDPR)</Text>
        <View style={[styles.settingsGroup, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={handleLogOut}
          >
            <View style={[styles.settingIconCircle, { backgroundColor: colors.accentLight }]}>
              <LogOut size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Log Out</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>Ends session and returns to onboarding</Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]} onPress={handleResetData}>
            <View style={[styles.settingIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Trash2 size={18} color="#DC2626" />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: '#DC2626' }]}>
                Delete My Account & Data (NDPR)
              </Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                Wipes local profile, streak, and remote record
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
    padding: Spacing.md,
    paddingBottom: 110,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  avatarBig: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  userPhone: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.streakBadgeBg,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  streakBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.streakBadgeText,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  settingsGroup: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  settingSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  changeBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  changeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});
