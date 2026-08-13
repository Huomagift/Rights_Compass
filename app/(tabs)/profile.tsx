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
import { Clock, Bell, CheckCircle2, Trash2, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import { getStoredProfile, resetStoredProfile, UserProfile } from '../../services/offlineStorage';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const p = await getStoredProfile();
    setProfile(p);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Local Data',
      'Under NDPR guidelines, this will delete all locally saved profile settings and streak counts. Are you sure?',
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
              <Text style={styles.streakBadgeText}>🔥 {profile.streakCount} Day Streak Active</Text>
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
              <Text style={styles.settingTitle}>Offline Mode Status</Text>
              <Text style={styles.settingSub}>
                1999 Constitution database cached on device
              </Text>
            </View>
            <CheckCircle2 size={20} color={Colors.success} />
          </View>
        </View>

        {/* PRIVACY & NDPR COMPLIANCE */}
        <Text style={styles.sectionTitle}>Privacy & Data Protection (NDPR)</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingItem} onPress={handleResetData}>
            <View style={[styles.settingIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Trash2 size={18} color="#DC2626" />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={[styles.settingTitle, { color: '#DC2626' }]}>
                Delete My Local Data (NDPR Request)
              </Text>
              <Text style={styles.settingSub}>
                Wipes stored profile and streak history
              </Text>
            </View>
            <ChevronRight size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.reOnboardBtn}
          onPress={() => router.push('/onboarding' as any)}
        >
          <Text style={styles.reOnboardBtnText}>Re-run Onboarding Setup</Text>
        </TouchableOpacity>
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
