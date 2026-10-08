import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Wrench, RefreshCw, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { BorderRadius, Spacing, Shadows, CONTENT_MAX_WIDTH } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function MaintenanceScreen() {
  const router = useRouter();
  const { colors, typography, isCompact } = useTheme();
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const handleCheckAgain = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setLastChecked(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1200);
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
            <Wrench size={44} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.onSurface || colors.text, ...typography.headlineMedium }]}>
            Scheduled Maintenance
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.onSurfaceVariant || colors.textMuted, ...typography.bodyLarge },
            ]}
          >
            Rights Compass is currently undergoing scheduled platform upgrades to improve service reliability and legal database indexing.
          </Text>

          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.surfaceContainerHighest || colors.cardWhite,
                borderColor: colors.outlineVariant || colors.border,
              },
            ]}
          >
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.onSurfaceVariant || colors.textMuted }]}>
                Expected Completion:
              </Text>
              <Text style={[styles.infoValue, { color: colors.primary }]}>
                Today at 11:30 PM WAT
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.reassuranceRow}>
              <ShieldCheck size={20} color={colors.primary} style={styles.reassuranceIcon} />
              <Text
                style={[
                  styles.reassuranceText,
                  { color: colors.onSurface || colors.text, ...typography.bodySmall },
                ]}
              >
                All downloaded constitution sections and bookmarks remain safely accessible on your device offline.
              </Text>
            </View>
          </View>

          {lastChecked && (
            <Text style={[styles.lastCheckedText, { color: colors.onSurfaceVariant || colors.textMuted }]}>
              Last checked: {lastChecked} (Maintenance still in progress)
            </Text>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={handleCheckAgain}
            disabled={checking}
            activeOpacity={0.85}
          >
            {checking ? (
              <ActivityIndicator size="small" color={colors.onPrimary || '#FFFFFF'} style={styles.buttonIcon} />
            ) : (
              <RefreshCw size={18} color={colors.onPrimary || '#FFFFFF'} style={styles.buttonIcon} />
            )}
            <Text style={[styles.primaryButtonText, { color: colors.onPrimary || '#FFFFFF' }]}>
              {checking ? 'Checking Status...' : 'Check Status Again'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.outlineVariant || colors.border }]}
            onPress={() => router.push('/(tabs)/library')}
            activeOpacity={0.8}
          >
            <BookOpen size={18} color={colors.primary} style={styles.buttonIcon} />
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              Read Offline Constitution
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
    maxWidth: 540,
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
  infoCard: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: Spacing.sm,
  },
  reassuranceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reassuranceIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
    flexShrink: 0,
  },
  reassuranceText: {
    flex: 1,
    lineHeight: 18,
  },
  lastCheckedText: {
    fontSize: 12,
    marginBottom: Spacing.md,
  },
  primaryButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  primaryButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
});
