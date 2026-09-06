import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Compass, Home, Search } from 'lucide-react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export default function NotFoundScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found', headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.content,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={[styles.badge404, { backgroundColor: colors.streakBadgeBg }]}>
            <Text style={[styles.badge404Text, { color: colors.primary }]}>404 ERROR</Text>
          </View>

          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: colors.accentLight,
                borderColor: colors.border,
              },
            ]}
          >
            <Compass size={64} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Page Out of Direction</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>
            The legal guide, route, or resource you are looking for doesn&apos;t exist or has moved. Let&apos;s guide you back to clarity.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
              onPress={() => router.replace('/(tabs)' as any)}
            >
              <Home size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.primaryButtonText}>Return to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  backgroundColor: colors.cardWhite,
                  borderColor: colors.border,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => router.replace('/(tabs)/library' as any)}
            >
              <Search size={18} color={colors.text} style={{ marginRight: 8 }} />
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Browse Library</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.lg,
  },
  badge404: {
    backgroundColor: 'rgba(150, 62, 20, 0.12)',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginBottom: Spacing.md,
  },
  badge404Text: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  iconWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  buttonRow: {
    width: '100%',
    gap: Spacing.sm,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 4,
    ...Shadows.sm,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
});
