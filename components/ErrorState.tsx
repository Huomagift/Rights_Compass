import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ShieldAlert, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  errorDetails?: string | Error;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message = 'We encountered an unexpected error while loading legal resources.',
  errorDetails,
  onRetry,
  fullScreen = false,
}) => {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const { colors, isDark } = useTheme();

  const errorString =
    typeof errorDetails === 'string'
      ? errorDetails
      : errorDetails?.message || errorDetails?.toString();

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: isDark ? 'rgba(239, 68, 68, 0.4)' : '#FECACA',
        },
        fullScreen && styles.fullScreenCard,
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
            borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5',
          },
        ]}
      >
        <ShieldAlert size={42} color="#EF4444" />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>

      {errorString && (
        <View style={styles.detailsContainer}>
          <TouchableOpacity
            style={styles.detailsToggle}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={[styles.detailsToggleText, { color: colors.textMuted }]}>
              {showDetails ? 'Hide technical details' : 'Show technical details'}
            </Text>
            {showDetails ? (
              <ChevronUp size={16} color={colors.textMuted} />
            ) : (
              <ChevronDown size={16} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          {showDetails && (
            <ScrollView
              style={[
                styles.detailsBox,
                { backgroundColor: isDark ? '#0F172A' : '#1E293B' },
              ]}
              nestedScrollEnabled
            >
              <Text style={styles.detailsText}>{errorString}</Text>
            </ScrollView>
          )}
        </View>
      )}

      <View style={styles.actionRow}>
        {onRetry && (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
            onPress={onRetry}
          >
            <RefreshCw size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            {
              backgroundColor: colors.cardWhite,
              borderColor: colors.border,
            },
          ]}
          activeOpacity={0.85}
          onPress={() => {
            try {
              router.replace('/(tabs)' as any);
            } catch {
              if (typeof window !== 'undefined') {
                window.location.href = '/';
              }
            }
          }}
        >
          <Home size={16} color={colors.text} style={{ marginRight: 6 }} />
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Return Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (fullScreen) {
    return (
      <View style={[styles.fullScreenWrapper, { backgroundColor: colors.background }]}>
        {content}
      </View>
    );
  }

  return content;
};

// React Error Boundary Class Component that catches component render crashes
interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface ErrorBoundaryWrapperState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundaryWrapper extends React.Component<
  ErrorBoundaryWrapperProps,
  ErrorBoundaryWrapperState
> {
  constructor(props: ErrorBoundaryWrapperProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryWrapperState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('[RightsCompass ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          fullScreen
          title={this.props.fallbackTitle || 'Application Error'}
          message={
            this.props.fallbackMessage ||
            'Rights Compass encountered an unexpected error. Please try reloading.'
          }
          errorDetails={this.state.error || undefined}
          onRetry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fullScreenWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    ...Shadows.md,
  },
  fullScreenCard: {
    marginVertical: 0,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
  },
  detailsToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginRight: 4,
  },
  detailsBox: {
    maxHeight: 120,
    backgroundColor: '#1E293B',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.xs,
  },
  detailsText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#F87171',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    flex: 1,
    maxWidth: 160,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: Colors.cardWhite,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
});
