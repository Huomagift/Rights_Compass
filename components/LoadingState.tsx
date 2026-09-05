import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, ActivityIndicator } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface PulseViewProps {
  style?: any;
  children?: React.ReactNode;
}

export const SkeletonPulse: React.FC<PulseViewProps> = ({ style, children }) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View style={[{ opacity, backgroundColor: colors.border }, style]}>
      {children}
    </Animated.View>
  );
};

export const SkeletonHero: React.FC = () => {
  return (
    <View style={styles.heroSkeletonCard}>
      <View style={styles.badgeRow}>
        <SkeletonPulse style={styles.pillBadge} />
        <SkeletonPulse style={styles.smallPill} />
      </View>
      <SkeletonPulse style={styles.titleBar} />
      <SkeletonPulse style={styles.subtitleBar} />
      <SkeletonPulse style={styles.subtitleBarShort} />
      <SkeletonPulse style={styles.buttonSkeleton} />
    </View>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <View style={styles.cardSkeleton}>
      <SkeletonPulse style={styles.cardImageArea} />
      <View style={styles.cardContent}>
        <SkeletonPulse style={styles.categoryPill} />
        <SkeletonPulse style={styles.cardTitle} />
        <SkeletonPulse style={styles.progressTrack} />
      </View>
    </View>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <View style={styles.listSkeletonContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.listItemSkeleton}>
          <SkeletonPulse style={styles.iconCircle} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <SkeletonPulse style={{ height: 14, width: '60%', borderRadius: 4, marginBottom: 6 }} />
            <SkeletonPulse style={{ height: 11, width: '40%', borderRadius: 4 }} />
          </View>
          <SkeletonPulse style={{ height: 20, width: 20, borderRadius: 10 }} />
        </View>
      ))}
    </View>
  );
};

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading Rights Compass...',
}) => {
  return (
    <View style={styles.fullScreenLoading}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenLoading: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    minHeight: 300,
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  heroSkeletonCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  pillBadge: {
    width: 100,
    height: 18,
    borderRadius: BorderRadius.sm,
  },
  smallPill: {
    width: 70,
    height: 18,
    borderRadius: BorderRadius.pill,
  },
  titleBar: {
    width: '80%',
    height: 24,
    borderRadius: BorderRadius.sm,
    marginBottom: 10,
  },
  subtitleBar: {
    width: '95%',
    height: 14,
    borderRadius: 4,
    marginBottom: 6,
  },
  subtitleBarShort: {
    width: '60%',
    height: 14,
    borderRadius: 4,
    marginBottom: Spacing.md,
  },
  buttonSkeleton: {
    width: 140,
    height: 40,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  cardSkeleton: {
    width: 220,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardImageArea: {
    height: 104,
    width: '100%',
  },
  cardContent: {
    padding: Spacing.md,
  },
  categoryPill: {
    width: 80,
    height: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  cardTitle: {
    width: '90%',
    height: 16,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: BorderRadius.pill,
  },
  listSkeletonContainer: {
    width: '100%',
  },
  listItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
});
