import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  WifiOff,
  ShieldAlert,
  Clock,
  Lock,
  ArrowRight,
  RefreshCw,
  SearchX,
  Inbox,
  Compass,
  Mic,
  Camera,
  Bell,
  FileText,
  Settings,
} from 'lucide-react-native';
import { BorderRadius, Spacing, Shadows, CONTENT_MAX_WIDTH } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { LoadingState } from './LoadingState';

export type ScreenStateType =
  | 'loading'
  | 'skeleton'
  | 'empty'
  | 'error'
  | 'offline'
  | 'session-expired'
  | 'permission-denied'
  | 'success';

export interface ScreenStateProps {
  state: ScreenStateType;
  children?: React.ReactNode;

  // Skeleton / Loading options (matches real screen layouts)
  skeletonType?:
    | 'home'
    | 'library'
    | 'marketplace'
    | 'profile'
    | 'detail'
    | 'form'
    | 'card'
    | 'list'
    | 'grid'
    | 'spinner';
  skeletonCount?: number;

  // Empty state options
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  emptyIcon?: 'search' | 'inbox' | 'compass' | React.ReactNode;

  // Error options
  errorTitle?: string;
  errorMessage?: string;
  errorDetails?: string | Error;
  onRetry?: () => void;
  retryLabel?: string;

  // Offline options
  offlineCachedNotice?: string;
  onOfflineRetry?: () => void;

  // Session Expired options
  onSessionExpiredAction?: () => void;
  sessionExpiredMessage?: string;

  // Permission Denied options
  permissionType?: 'notifications' | 'microphone' | 'camera' | 'files';
  onPermissionSettingsAction?: () => void;

  // Layout options
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ScreenState: React.FC<ScreenStateProps> = ({
  state,
  children,
  skeletonType = 'card',
  skeletonCount = 3,
  emptyTitle = 'No Items Found',
  emptyMessage = 'There is currently no content available in this section.',
  emptyActionLabel,
  onEmptyAction,
  emptyIcon = 'compass',
  errorTitle = 'Unable to Load Content',
  errorMessage = 'An error occurred while communicating with the system. Please try again.',
  errorDetails,
  onRetry,
  retryLabel = 'Try Again',
  offlineCachedNotice = 'You are currently offline. Cached constitution sections and downloaded guides remain accessible.',
  onOfflineRetry,
  onSessionExpiredAction,
  sessionExpiredMessage = 'Your current authentication session has timed out. Please sign in to verify your account.',
  permissionType = 'notifications',
  onPermissionSettingsAction,
  fullScreen = false,
  style,
}) => {
  const { colors, typography, isCompact } = useTheme();
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  if (state === 'success') {
    return <>{children}</>;
  }

  // ─── 1. Loading / Skeleton ──────────────────────────────────────────────────
  if (state === 'loading' || state === 'skeleton') {
    const loadingMode =
      skeletonType === 'grid' ? 'home' : (skeletonType || 'home');

    return (
      <View
        style={[
          styles.container,
          fullScreen && styles.fullScreenContainer,
          { backgroundColor: colors.background },
          style,
        ]}
      >
        <LoadingState mode={loadingMode} />
      </View>
    );
  }

  // ─── 2. Empty State ────────────────────────────────────────────────────────
  if (state === 'empty') {
    const renderEmptyIcon = () => {
      if (typeof emptyIcon !== 'string') return emptyIcon;
      switch (emptyIcon) {
        case 'search':
          return <SearchX size={38} color={colors.primary} />;
        case 'inbox':
          return <Inbox size={38} color={colors.primary} />;
        case 'compass':
        default:
          return <Compass size={38} color={colors.primary} />;
      }
    };

    return (
      <View
        style={[
          styles.container,
          fullScreen && styles.fullScreenContainer,
          { backgroundColor: fullScreen ? colors.background : 'transparent' },
          style,
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceContainerLow || colors.cardBackground,
              borderColor: colors.outlineVariant || colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: colors.primaryContainer || colors.accentLight,
                borderColor: colors.outlineVariant || colors.border,
              },
            ]}
          >
            {renderEmptyIcon()}
          </View>

          <Text style={[styles.title, { color: colors.onSurface || colors.text, ...typography.titleMedium }]}>
            {emptyTitle}
          </Text>
          <Text
            style={[
              styles.message,
              { color: colors.onSurfaceVariant || colors.textMuted, ...typography.bodyMedium },
            ]}
          >
            {emptyMessage}
          </Text>

          {emptyActionLabel && onEmptyAction && (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
              onPress={onEmptyAction}
            >
              <Text style={[styles.primaryButtonText, { color: colors.onPrimary || '#FFFFFF' }]}>
                {emptyActionLabel}
              </Text>
              <ArrowRight size={16} color={colors.onPrimary || '#FFFFFF'} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // ─── 3. Error State ─────────────────────────────────────────────────────────
  if (state === 'error') {
    const errorString =
      typeof errorDetails === 'string'
        ? errorDetails
        : errorDetails?.message || errorDetails?.toString();

    return (
      <View
        style={[
          styles.container,
          fullScreen && styles.fullScreenContainer,
          { backgroundColor: fullScreen ? colors.background : 'transparent' },
          style,
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceContainerLow || colors.cardBackground,
              borderColor: colors.error,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: colors.errorContainer,
                borderColor: colors.error,
              },
            ]}
          >
            <ShieldAlert size={38} color={colors.error} />
          </View>

          <Text style={[styles.title, { color: colors.onSurface || colors.text, ...typography.titleMedium }]}>
            {errorTitle}
          </Text>
          <Text
            style={[
              styles.message,
              { color: colors.onSurfaceVariant || colors.textMuted, ...typography.bodyMedium },
            ]}
          >
            {errorMessage}
          </Text>

          {errorString && (
            <View style={styles.detailsBox}>
              <TouchableOpacity
                onPress={() => setShowErrorDetails((v) => !v)}
                style={styles.detailsToggle}
              >
                <Text style={[styles.detailsToggleText, { color: colors.error }]}>
                  {showErrorDetails ? 'Hide Technical Details' : 'Show Technical Details'}
                </Text>
              </TouchableOpacity>
              {showErrorDetails && (
                <Text style={[styles.detailsContent, { color: colors.onSurfaceVariant || colors.textMuted }]}>
                  {errorString}
                </Text>
              )}
            </View>
          )}

          {onRetry && (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
              onPress={onRetry}
            >
              <RefreshCw size={16} color={colors.onPrimary || '#FFFFFF'} style={styles.buttonIconLeft} />
              <Text style={[styles.primaryButtonText, { color: colors.onPrimary || '#FFFFFF' }]}>
                {retryLabel}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // ─── 4. Offline State ───────────────────────────────────────────────────────
  if (state === 'offline') {
    return (
      <View
        style={[
          styles.container,
          fullScreen && styles.fullScreenContainer,
          { backgroundColor: fullScreen ? colors.background : 'transparent' },
          style,
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceContainerLow || colors.cardBackground,
              borderColor: colors.outlineVariant || colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: colors.surfaceVariant || colors.cardBackground,
                borderColor: colors.outlineVariant || colors.border,
              },
            ]}
          >
            <WifiOff size={38} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.onSurface || colors.text, ...typography.titleMedium }]}>
            You Are Offline
          </Text>
          <Text
            style={[
              styles.message,
              { color: colors.onSurfaceVariant || colors.textMuted, ...typography.bodyMedium },
            ]}
          >
            {offlineCachedNotice}
          </Text>

          <View style={[styles.badge, { backgroundColor: colors.primaryContainer || colors.accentLight }]}>
            <Text style={[styles.badgeText, { color: colors.onPrimaryContainer || colors.primaryDark }]}>
              Offline Protection Active
            </Text>
          </View>

          {onOfflineRetry && (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary, marginTop: Spacing.md }]}
              activeOpacity={0.85}
              onPress={onOfflineRetry}
            >
              <RefreshCw size={16} color={colors.onPrimary || '#FFFFFF'} style={styles.buttonIconLeft} />
              <Text style={[styles.primaryButtonText, { color: colors.onPrimary || '#FFFFFF' }]}>
                Check Connection
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // ─── 5. Session Expired State ───────────────────────────────────────────────
  if (state === 'session-expired') {
    return (
      <View
        style={[
          styles.container,
          fullScreen && styles.fullScreenContainer,
          { backgroundColor: fullScreen ? colors.background : 'transparent' },
          style,
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceContainerLow || colors.cardBackground,
              borderColor: colors.outlineVariant || colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: colors.primaryContainer || colors.accentLight,
                borderColor: colors.outlineVariant || colors.border,
              },
            ]}
          >
            <Clock size={38} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.onSurface || colors.text, ...typography.titleMedium }]}>
            Session Expired
          </Text>
          <Text
            style={[
              styles.message,
              { color: colors.onSurfaceVariant || colors.textMuted, ...typography.bodyMedium },
            ]}
          >
            {sessionExpiredMessage}
          </Text>

          {onSessionExpiredAction && (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
              onPress={onSessionExpiredAction}
            >
              <Text style={[styles.primaryButtonText, { color: colors.onPrimary || '#FFFFFF' }]}>
                Sign In Again
              </Text>
              <ArrowRight size={16} color={colors.onPrimary || '#FFFFFF'} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // ─── 6. Permission Denied State ─────────────────────────────────────────────
  if (state === 'permission-denied') {
    const getPermissionIcon = () => {
      switch (permissionType) {
        case 'microphone':
          return <Mic size={38} color={colors.primary} />;
        case 'camera':
          return <Camera size={38} color={colors.primary} />;
        case 'files':
          return <FileText size={38} color={colors.primary} />;
        case 'notifications':
        default:
          return <Bell size={38} color={colors.primary} />;
      }
    };

    const getPermissionLabel = () => {
      switch (permissionType) {
        case 'microphone':
          return 'Microphone Access Required';
        case 'camera':
          return 'Camera Access Required';
        case 'files':
          return 'Storage & Documents Access Required';
        case 'notifications':
        default:
          return 'Notification Permission Needed';
      }
    };

    return (
      <View
        style={[
          styles.container,
          fullScreen && styles.fullScreenContainer,
          { backgroundColor: fullScreen ? colors.background : 'transparent' },
          style,
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceContainerLow || colors.cardBackground,
              borderColor: colors.outlineVariant || colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: colors.primaryContainer || colors.accentLight,
                borderColor: colors.outlineVariant || colors.border,
              },
            ]}
          >
            {getPermissionIcon()}
          </View>

          <Text style={[styles.title, { color: colors.onSurface || colors.text, ...typography.titleMedium }]}>
            {getPermissionLabel()}
          </Text>
          <Text
            style={[
              styles.message,
              { color: colors.onSurfaceVariant || colors.textMuted, ...typography.bodyMedium },
            ]}
          >
            To use this feature, please enable {permissionType} permissions in your device settings.
          </Text>

          {onPermissionSettingsAction && (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
              onPress={onPermissionSettingsAction}
            >
              <Settings size={16} color={colors.onPrimary || '#FFFFFF'} style={styles.buttonIconLeft} />
              <Text style={[styles.primaryButtonText, { color: colors.onPrimary || '#FFFFFF' }]}>
                Open System Settings
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  fullScreenContainer: {
    flex: 1,
    minHeight: 480,
    paddingHorizontal: Spacing.md,
  },
  card: {
    width: '100%',
    maxWidth: Math.min(CONTENT_MAX_WIDTH, 540),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    ...Shadows.sm,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  message: {
    textAlign: 'center',
    maxWidth: 400,
    marginBottom: Spacing.lg,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    marginBottom: Spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    ...Shadows.sm,
  },
  primaryButtonText: {
    fontWeight: '700',
    marginRight: Spacing.xs,
  },
  buttonIconLeft: {
    marginRight: Spacing.xs + 2,
  },
  detailsBox: {
    width: '100%',
    marginVertical: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  detailsToggle: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  detailsToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContent: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: Spacing.xs,
  },
});
