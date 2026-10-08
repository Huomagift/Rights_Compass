import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { ArrowUpCircle, Sparkles, Shield, ExternalLink, RefreshCw } from 'lucide-react-native';
import { BorderRadius, Spacing, Shadows, CONTENT_MAX_WIDTH } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function ForceUpdateScreen() {
  const { colors, typography, isCompact } = useTheme();

  const handleUpdate = () => {
    if (Platform.OS === 'web') {
      window.location.reload();
    } else {
      // Platform store link
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.container,
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
            <ArrowUpCircle size={48} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.onSurface || colors.text, ...typography.headlineMedium }]}>
            Update Required
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.onSurfaceVariant || colors.textMuted, ...typography.bodyLarge },
            ]}
          >
            A critical version update is required to continue using Rights Compass. This release contains important legal updates, verified attorney escrow protocols, and security enhancements.
          </Text>

          <View
            style={[
              styles.versionCard,
              {
                backgroundColor: colors.surfaceContainerHighest || colors.cardWhite,
                borderColor: colors.outlineVariant || colors.border,
              },
            ]}
          >
            <View style={styles.versionRow}>
              <Text style={[styles.versionLabel, { color: colors.onSurfaceVariant || colors.textMuted }]}>
                Installed Version:
              </Text>
              <Text style={[styles.versionValue, { color: colors.onSurfaceVariant || colors.textMuted }]}>
                v0.9.4
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.versionRow}>
              <Text style={[styles.versionLabel, { color: colors.onSurface || colors.text }]}>
                Minimum Required:
              </Text>
              <Text style={[styles.versionValueRequired, { color: colors.primary }]}>
                v1.0.0 (Mandatory)
              </Text>
            </View>
          </View>

          <View style={styles.highlightsContainer}>
            <View style={styles.highlightRow}>
              <Shield size={18} color={colors.primary} style={styles.highlightIcon} />
              <Text style={[styles.highlightText, { color: colors.onSurface || colors.text }]}>
                Constitutional database sync & amendments
              </Text>
            </View>
            <View style={styles.highlightRow}>
              <Sparkles size={18} color={colors.primary} style={styles.highlightIcon} />
              <Text style={[styles.highlightText, { color: colors.onSurface || colors.text }]}>
                Verified lawyer escrow protection protocol
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={handleUpdate}
            activeOpacity={0.85}
          >
            {Platform.OS === 'web' ? (
              <RefreshCw size={18} color={colors.onPrimary || '#FFFFFF'} style={styles.buttonIcon} />
            ) : (
              <ExternalLink size={18} color={colors.onPrimary || '#FFFFFF'} style={styles.buttonIcon} />
            )}
            <Text style={[styles.primaryButtonText, { color: colors.onPrimary || '#FFFFFF' }]}>
              {Platform.OS === 'web' ? 'Refresh App Now' : 'Update from App Store'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 520,
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    ...Shadows.md,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 420,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  versionCard: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  versionValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  versionValueRequired: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: Spacing.sm,
  },
  highlightsContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  highlightIcon: {
    marginRight: Spacing.sm,
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '500',
  },
  primaryButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  primaryButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
});
