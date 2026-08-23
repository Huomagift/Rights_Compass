import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Bell, CheckCircle2, Trash2, ChevronRight, Flame, LogOut } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { resetStoredProfile, resetStreakToDayOne, updateDailyStreak, UserProfile } from '../../services/offlineStorage';
import { signOutUser } from '../../services/authService';

export default function ProfileScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Account & Settings</Text>
        <Text style={styles.pageSubtitle}>
          Manage your daily rights habit preferences and privacy controls.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* USER CARD */}
        <View style={styles.userCard}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarLetter}>
              {profile.name ? profile.name[0].toUpperCase() : 'A'}
            </Text>
          </View>

          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.userName}>{profile.name}</Text>
            {profile.phoneNumber ? (
              <Text style={styles.userPhone}>{profile.phoneNumber}</Text>
            ) : (
              <Text style={styles.userPhone}>WhatsApp Not Linked</Text>
            )}
            <View style={styles.streakRow}>
              <Flame size={12} color={Colors.streakBadgeText} style={{ marginRight: 4 }} />
              <Text style={styles.streakBadgeText}>{profile.streakCount} Day Streak Active</Text>
            </View>
          </View>
        </View>

        {/* DAILY HABIT SETTINGS */}
        <Text style={styles.sectionTitle}>Daily Habit Loop</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingItem}>
            <View style={styles.settingIconCircle}>
              <Clock size={18} color={Colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={styles.settingTitle}>Daily Notification Time</Text>
              <Text style={styles.settingSub}>
                Delivered 100% offline at {profile.preferredTime}
              </Text>
            </View>
            <TouchableOpacity style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
            <View style={styles.settingIconCircle}>
              <Bell size={18} color={Colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={styles.settingTitle}>Offline Mode & Supabase Sync</Text>
              <Text style={styles.settingSub}>
                {profile.syncedToSupabase
                  ? 'Profile synced with Supabase database'
                  : '1999 Constitution cached on device'}
              </Text>
            </View>
            <CheckCircle2 size={20} color={Colors.success} />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleResetStreak}>
            <View style={styles.settingIconCircle}>
              <Flame size={18} color={Colors.streakBadgeText} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={styles.settingTitle}>Reset Streak Counter</Text>
              <Text style={styles.settingSub}>
                Reset daily streak to Day 1
              </Text>
            </View>
            <Text style={styles.changeBtnText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* ACCOUNT ACTIONS & PRIVACY */}
        <Text style={styles.sectionTitle}>Account & Privacy (NDPR)</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingItem} onPress={handleLogOut}>
            <View style={[styles.settingIconCircle, { backgroundColor: 'rgba(150, 62, 20, 0.12)' }]}>
              <LogOut size={18} color={Colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={styles.settingTitle}>Log Out</Text>
              <Text style={styles.settingSub}>Ends session and returns to sign-up</Text>
            </View>
            <ChevronRight size={16} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]} onPress={handleResetData}>
            <View style={[styles.settingIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Trash2 size={18} color="#DC2626" />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: '#DC2626' }]}>
                Delete My Account & Data (NDPR)
              </Text>
              <Text style={styles.settingSub}>
                Wipes local profile, streak, and remote record
              </Text>
            </View>
            <ChevronRight size={16} color={Colors.textMuted} />
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
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
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
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  userPhone: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.xs,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.streakBadgeBg,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  streakBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.streakBadgeText,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  settingsGroup: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    marginTop: 2,
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
  reOnboardBtn: {
    alignSelf: 'center',
    paddingVertical: Spacing.md,
  },
  reOnboardBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
