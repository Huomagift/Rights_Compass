import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Bell, Mic, Camera, FileText, CheckCircle2 } from 'lucide-react-native';
import { BorderRadius, Spacing, Shadows, CONTENT_MAX_WIDTH } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export type PrePermissionType = 'notifications' | 'microphone' | 'camera' | 'files';

export interface PrePermissionModalProps {
  visible: boolean;
  type: PrePermissionType;
  onAllow: () => void;
  onNotNow: () => void;
}

const PERMISSION_CONFIG: Record<
  PrePermissionType,
  {
    title: string;
    subtitle: string;
    reasons: string[];
    allowText: string;
  }
> = {
  notifications: {
    title: 'Enable Notifications',
    subtitle: 'Stay on track with your constitutional learning journey and case alerts.',
    reasons: [
      'Daily Right of the Day bite-sized learning reminders',
      'Maintain your learning streak and lesson milestones',
      'Real-time updates when a verified lawyer reviews your request',
    ],
    allowText: 'Allow Notifications',
  },
  microphone: {
    title: 'Enable Microphone Access',
    subtitle: 'Speak directly with your constitutional AI Tutor in real time.',
    reasons: [
      'Voice consultation for hands-free guidance in urgent scenarios',
      'Audio answers explaining your legal rights in plain English',
      'No audio recordings are permanently stored or sold',
    ],
    allowText: 'Enable Microphone',
  },
  camera: {
    title: 'Enable Camera Access',
    subtitle: 'Quickly photograph identification and practice credentials.',
    reasons: [
      'Photograph Supreme Court Call to Bar certificate',
      'Capture valid government identification document',
      'Secure encryption applied to all uploaded legal credentials',
    ],
    allowText: 'Enable Camera',
  },
  files: {
    title: 'Access Documents & Files',
    subtitle: 'Attach contracts, notices, and legal evidence for case review.',
    reasons: [
      'Upload tenancy agreements, employment letters, or police documents',
      'Provide evidence for dispute resolution and mediation',
      'Documents are restricted strictly to you and your assigned lawyer',
    ],
    allowText: 'Grant File Access',
  },
};

export const PrePermissionModal: React.FC<PrePermissionModalProps> = ({
  visible,
  type,
  onAllow,
  onNotNow,
}) => {
  const { colors, typography } = useTheme();
  const config = PERMISSION_CONFIG[type] || PERMISSION_CONFIG.notifications;

  const renderIcon = () => {
    switch (type) {
      case 'microphone':
        return <Mic size={36} color={colors.primary} />;
      case 'camera':
        return <Camera size={36} color={colors.primary} />;
      case 'files':
        return <FileText size={36} color={colors.primary} />;
      case 'notifications':
      default:
        return <Bell size={36} color={colors.primary} />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onNotNow}
    >
      <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={onNotNow}>
        <Pressable
          style={[
            styles.modalCard,
            {
              backgroundColor: colors.surfaceContainerLowest || colors.cardWhite,
              borderColor: colors.outlineVariant || colors.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: colors.primaryContainer || colors.accentLight,
                borderColor: colors.outlineVariant || colors.border,
              },
            ]}
          >
            {renderIcon()}
          </View>

          <Text style={[styles.title, { color: colors.onSurface || colors.text, ...typography.titleLarge }]}>
            {config.title}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.onSurfaceVariant || colors.textMuted, ...typography.bodyMedium },
            ]}
          >
            {config.subtitle}
          </Text>

          <View style={styles.reasonsList}>
            {config.reasons.map((reason, index) => (
              <View key={index} style={styles.reasonRow}>
                <CheckCircle2 size={18} color={colors.primary} style={styles.checkIcon} />
                <Text
                  style={[
                    styles.reasonText,
                    { color: colors.onSurface || colors.text, ...typography.bodySmall },
                  ]}
                >
                  {reason}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.outlineVariant || colors.border }]}
              onPress={onNotNow}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  { color: colors.onSurfaceVariant || colors.textMuted },
                ]}
              >
                Not Now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={onAllow}
              activeOpacity={0.85}
            >
              <Text style={[styles.primaryButtonText, { color: colors.onPrimary || '#FFFFFF' }]}>
                {config.allowText}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    ...Shadows.lg,
  },
  iconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    alignSelf: 'center',
    borderWidth: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  reasonsList: {
    marginBottom: Spacing.xl,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm + 2,
  },
  checkIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
    flexShrink: 0,
  },
  reasonText: {
    flex: 1,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 2,
    ...Shadows.sm,
  },
  primaryButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingVertical: Spacing.sm,
  },
  secondaryButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
