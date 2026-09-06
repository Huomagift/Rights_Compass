import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Switch,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Flame,
  Sun,
  Moon,
  Bell,
  User,
  ChevronRight,
  X,
  ShieldCheck,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, Spacing, Shadows } from '../constants/theme';
import { UserProfile } from '../services/offlineStorage';

interface HeaderMenuModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile;
  onOpenNotifications: () => void;
}

export function HeaderMenuModal({
  visible,
  onClose,
  profile,
  onOpenNotifications,
}: HeaderMenuModalProps) {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheetCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* MODAL HEADER */}
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <View style={styles.headerLeft}>
                  <ShieldCheck size={18} color={colors.primary} style={{ marginRight: 6 }} />
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Quick Menu</Text>
                </View>
                <TouchableOpacity
                  style={[styles.closeBtn, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}
                  activeOpacity={0.8}
                  onPress={onClose}
                >
                  <X size={16} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* ITEM 1: DAILY STREAK CARD */}
              <View
                style={[
                  styles.streakCard,
                  {
                    backgroundColor: colors.streakBadgeBg,
                    borderColor: 'rgba(217, 119, 6, 0.25)',
                  },
                ]}
              >
                <View style={styles.streakIconCircle}>
                  <Flame size={20} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.streakTitle, { color: colors.streakBadgeText }]}>
                    {profile.streakCount} Day Streak Active
                  </Text>
                  <Text style={[styles.streakSubtitle, { color: colors.textMuted }]}>
                    Checked in today • Keep your momentum
                  </Text>
                </View>
              </View>

              {/* ITEM 2: APPEARANCE / DARK MODE */}
              <View
                style={[
                  styles.menuItem,
                  {
                    backgroundColor: colors.cardWhite,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.menuIconCircle,
                    { backgroundColor: colors.accentLight },
                  ]}
                >
                  {isDark ? (
                    <Sun size={18} color={colors.primary} />
                  ) : (
                    <Moon size={18} color={colors.primary} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                    Dark Mode
                  </Text>
                  <Text style={[styles.menuItemSub, { color: colors.textMuted }]}>
                    {isDark ? 'Dark theme active' : 'Light theme active'}
                  </Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* ITEM 3: NOTIFICATIONS */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  {
                    backgroundColor: colors.cardWhite,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  onOpenNotifications();
                }}
              >
                <View
                  style={[
                    styles.menuIconCircle,
                    { backgroundColor: colors.accentLight },
                  ]}
                >
                  <Bell size={18} color={colors.primary} />
                  <View
                    style={[
                      styles.notifDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                    Notifications
                  </Text>
                  <Text style={[styles.menuItemSub, { color: colors.textMuted }]}>
                    Daily legal habit alerts & updates
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>

              {/* ITEM 4: PROFILE & SETTINGS */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  {
                    backgroundColor: colors.cardWhite,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  router.push('/(tabs)/profile' as any);
                }}
              >
                <View
                  style={[
                    styles.menuIconCircle,
                    { backgroundColor: colors.primaryDark },
                  ]}
                >
                  <User size={18} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                    Profile & Settings
                  </Text>
                  <Text style={[styles.menuItemSub, { color: colors.textMuted }]}>
                    {profile.name || 'Alex'} • {profile.preferredTime || '08:00 AM'}
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 60 : 54,
    paddingRight: 16,
  },
  sheetCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    ...Shadows.lg,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm + 2,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  streakIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  streakTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  streakSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm + 2,
    marginBottom: Spacing.xs + 2,
    borderWidth: 1,
  },
  menuIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  menuItemSub: {
    fontSize: 11,
    marginTop: 1,
  },
});
