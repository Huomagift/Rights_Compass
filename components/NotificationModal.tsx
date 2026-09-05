import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Bell, X, Check, Flame, Shield, Sparkles } from 'lucide-react-native';
import { BorderRadius, Spacing, Shadows } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { EmptyState } from './EmptyState';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'streak' | 'guide' | 'ai';
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: '🔥 12-Day Streak Achieved!',
    message: 'Awesome work staying consistent! You earned the Constitutional Scholar badge.',
    time: '2h ago',
    read: false,
    type: 'streak',
  },
  {
    id: 'n2',
    title: '🛡️ New Guide: Police Checkpoints',
    message: 'Updated legal rights under ACJA s.9 and Constitution 1999 s.37.',
    time: '1d ago',
    read: false,
    type: 'guide',
  },
  {
    id: 'n3',
    title: '✨ AI Tutor Ready',
    message: 'Ask Aegis any question about Nigerian Tenancy Law or Labour Act.',
    time: '2d ago',
    read: true,
    type: 'ai',
  },
];

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'streak':
        return <Flame size={18} color="#D97706" />;
      case 'guide':
        return <Shield size={18} color={colors.primary} />;
      case 'ai':
        return <Sparkles size={18} color="#8B5CF6" />;
      default:
        return <Bell size={18} color={colors.primary} />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.cardWhite,
              borderColor: colors.border,
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.titleRow}>
              <Bell size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Action Row */}
          {notifications.length > 0 && (
            <View style={styles.actionRow}>
              {unreadCount > 0 && (
                <TouchableOpacity style={styles.actionTextBtn} onPress={markAllRead}>
                  <Check size={14} color={colors.primary} style={{ marginRight: 4 }} />
                  <Text style={[styles.actionText, { color: colors.primary }]}>Mark all as read</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.actionTextBtn} onPress={clearAll}>
                <Text style={[styles.actionText, { color: colors.textMuted }]}>
                  Clear all
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* List or Empty State */}
          <ScrollView style={styles.listContainer}>
            {notifications.length === 0 ? (
              <EmptyState
                compact
                icon="inbox"
                title="No Notifications"
                description="You're all caught up! Updates about your streak and new legal guides will appear here."
              />
            ) : (
              notifications.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.notificationCard,
                    {
                      backgroundColor: item.read ? colors.cardBackground : colors.accentLight,
                      borderColor: item.read ? colors.border : colors.primary,
                    },
                  ]}
                >
                  <View style={[styles.iconCircle, { backgroundColor: colors.cardWhite }]}>
                    {renderIcon(item.type)}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.itemTitleRow}>
                      <Text style={[styles.itemTitle, { color: colors.text }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.itemTime, { color: colors.textMuted }]}>
                        {item.time}
                      </Text>
                    </View>
                    <Text style={[styles.itemMessage, { color: colors.textMuted }]}>
                      {item.message}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: Spacing.md,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    ...Shadows.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  unreadBadge: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeBtn: {
    padding: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs + 2,
  },
  actionTextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    maxHeight: 380,
    marginTop: Spacing.xs,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    ...Shadows.sm,
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  itemTime: {
    fontSize: 11,
    marginLeft: 8,
  },
  itemMessage: {
    fontSize: 12,
    lineHeight: 17,
  },
});
