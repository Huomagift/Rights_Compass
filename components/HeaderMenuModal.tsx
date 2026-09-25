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
  Gavel,
  Sun,
  Moon,
  Bell,
  User,
  ChevronRight,
  X,
  ShieldCheck,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { BorderRadius, Spacing, Shadows } from '../constants/theme';
import { UserProfile } from '../services/offlineStorage';

interface HeaderMenuModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile;
  onOpenNotifications: () => void;
  isVerifiedLawyer?: boolean;
}

export function HeaderMenuModal({
  visible,
  onClose,
  profile,
  onOpenNotifications,
  isVerifiedLawyer: isVerifiedProp,
}: HeaderMenuModalProps) {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { isVerifiedLawyer: isVerifiedContext, isPendingVerification, hasAppliedAsLawyer, application } = useMarketplace();
  const isVerified = isVerifiedProp ?? isVerifiedContext;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.drawer,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Top Drawer Handle / Close Bar */}
              <View style={styles.topRow}>
                <View style={styles.appNameRow}>
                  <ShieldCheck size={20} color={colors.primary} />
                  <Text style={[styles.appNameText, { color: colors.text }]}>
                    Rights Compass
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.closeBtn, { backgroundColor: colors.cardWhite }]}
                  onPress={onClose}
                >
                  <X size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* User Quick Identity Pill */}
              <View
                style={[
                  styles.profilePill,
                  {
                    backgroundColor: colors.cardWhite,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.avatarCircle,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.avatarInitials}>
                    {profile.name ? profile.name[0].toUpperCase() : 'U'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.profileName, { color: colors.text }]}>
                    {profile.name || 'Citizen Scholar'}
                  </Text>
                  <Text style={[styles.profileRole, { color: colors.textMuted }]}>
                    {profile.state} Jurisdiction • Free Citizen Tier
                  </Text>
                </View>
              </View>

              {/* Section Divider */}
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />

              {/* ITEM 1: DAILY STREAK STATUS */}
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
                    { backgroundColor: '#D97706' },
                  ]}
                >
                  <Flame size={18} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                      Daily Civic Streak
                    </Text>
                    <View
                      style={[
                        styles.streakBadge,
                        { backgroundColor: '#FEF3C7' },
                      ]}
                    >
                      <Text style={styles.streakBadgeText}>
                        {profile.streakCount || 1} DAYS
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.menuItemSub, { color: colors.textMuted }]}>
                    Complete today&apos;s constitutional insight
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>

              {/* ITEM 2: NOTIFICATIONS */}
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
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Bell size={18} color="#FFFFFF" />
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

              {/* ITEM — LAWYER DASHBOARD (for all registered lawyers) */}
              {hasAppliedAsLawyer && (
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
                    router.push('/marketplace/dashboard' as any);
                  }}
                >
                  <View
                    style={[
                      styles.menuIconCircle,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Gavel size={18} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                        Lawyer Dashboard
                      </Text>
                      <View
                        style={{
                          backgroundColor: isVerified ? '#10B98120' : '#F59E0B20',
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 9,
                            fontWeight: '800',
                            color: isVerified ? '#10B981' : '#D97706',
                          }}
                        >
                          {isVerified ? 'VERIFIED' : 'UNDER REVIEW'}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.menuItemSub, { color: colors.textMuted }]}>
                      {isVerified
                        ? 'Manage requests & practitioner profile'
                        : 'Verification status, requests & credentials'}
                    </Text>
                  </View>
                  <ChevronRight size={16} color={colors.textMuted} />
                </TouchableOpacity>
              )}

              {/* ITEM 3: PROFILE & SETTINGS */}
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
                    { backgroundColor: colors.cardBackground },
                  ]}
                >
                  <User size={18} color={colors.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                    Profile & Settings
                  </Text>
                  <Text style={[styles.menuItemSub, { color: colors.textMuted }]}>
                    Language, state jurisdiction & reset
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>

              {/* ITEM 4: THEME TOGGLE */}
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
                    { backgroundColor: colors.cardBackground },
                  ]}
                >
                  {isDark ? (
                    <Sun size={18} color={colors.text} />
                  ) : (
                    <Moon size={18} color={colors.text} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                    Dark Appearance
                  </Text>
                  <Text style={[styles.menuItemSub, { color: colors.textMuted }]}>
                    {isDark ? 'OLED warm brown active' : 'Warm parchment light theme'}
                  </Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
                />
              </View>

              {/* Footer Note */}
              <View style={styles.drawerFooter}>
                <Text style={[styles.footerVersionText, { color: colors.textMuted }]}>
                  Rights Compass v1.4.2 • Material 3 Civic OS
                </Text>
                <Text style={[styles.footerLegalText, { color: colors.textMuted }]}>
                  All constitutional data is stored 100% offline on your device.
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  drawer: {
    width: '84%',
    maxWidth: 360,
    height: '100%',
    paddingTop: 54,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    borderLeftWidth: 1,
    ...Shadows.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appNameText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  profileName: {
    fontSize: 14,
    fontWeight: '800',
  },
  profileRole: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: 12,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  menuItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  menuItemSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  streakBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    marginLeft: 8,
  },
  streakBadgeText: {
    color: '#B45309',
    fontSize: 9.5,
    fontWeight: '800',
  },
  drawerFooter: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: Spacing.md,
    gap: 4,
  },
  footerVersionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  footerLegalText: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
});
