import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Compass } from 'lucide-react-native';
import { BorderRadius, Spacing, Shadows, Fonts } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export interface BrandedAppSplashProps {
  message?: string;
  subMessage?: string;
}

/**
 * Initial App Load (Cold Start Splash)
 * Genuine branded initial load screen displayed before app routing is resolved.
 * Distinct from in-page content skeleton loaders.
 */
export const BrandedAppSplash: React.FC<BrandedAppSplashProps> = ({
  message = 'Initializing Legal Framework...',
  subMessage = 'Loading Constitution & Fundamental Rights',
}) => {
  const { colors, typography, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Brand Emblem */}
        <View
          style={[
            styles.emblemCircle,
            {
              backgroundColor: colors.surfaceContainerLow || colors.cardBackground,
              borderColor: colors.outlineVariant || colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconInner,
              {
                backgroundColor: colors.primaryContainer || colors.accentLight,
              },
            ]}
          >
            <Compass size={44} color={colors.primary} />
          </View>
        </View>

        {/* Brand Titles */}
        <Text
          style={[
            styles.brandTitle,
            { color: colors.onSurface || colors.text, ...typography.headlineLarge },
          ]}
        >
          Rights Compass
        </Text>
        <Text
          style={[
            styles.brandSubtitle,
            { color: colors.onSurfaceVariant || colors.textMuted, ...typography.bodySmall },
          ]}
        >
          FEDERAL REPUBLIC OF NIGERIA
        </Text>

        {/* Loading Spinner & Status */}
        <View style={styles.statusBox}>
          <ActivityIndicator size="small" color={colors.primary} style={styles.spinner} />
          <Text style={[styles.statusMessage, { color: colors.onSurface || colors.text }]}>
            {message}
          </Text>
          {subMessage && (
            <Text style={[styles.statusSubMessage, { color: colors.onSurfaceVariant || colors.textMuted }]}>
              {subMessage}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    maxWidth: 380,
  },
  emblemCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    ...Shadows.md,
  },
  iconInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  brandSubtitle: {
    letterSpacing: 2,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  statusBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: Spacing.sm,
  },
  statusMessage: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  statusSubMessage: {
    fontSize: 12,
    textAlign: 'center',
  },
});
