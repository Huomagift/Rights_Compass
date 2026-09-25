import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface PulseViewProps {
  style?: any;
  children?: React.ReactNode;
}

/**
 * Material 3 Animated Pulse Placeholder Box
 */
export const SkeletonPulse: React.FC<PulseViewProps> = ({ style, children }) => {
  const { isDark } = useTheme();
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 850,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  const defaultPulseColor = isDark ? '#2D323E' : '#E2E8F0';

  return (
    <Animated.View style={[{ opacity, backgroundColor: defaultPulseColor }, style]}>
      {children}
    </Animated.View>
  );
};

/**
 * Material 3 Circular Progress Loader with Contextual Status Text
 */
export const M3Loader: React.FC<{ message?: string; subMessage?: string }> = ({
  message = 'Loading Rights Compass...',
  subMessage,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.m3LoaderContainer}>
      <View
        style={[
          styles.m3LoaderCard,
          {
            backgroundColor: isDark ? '#1C1F28' : colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.m3LoaderMessage, { color: colors.text }]}>{message}</Text>
        {subMessage && (
          <Text style={[styles.m3LoaderSubMessage, { color: colors.textMuted }]}>
            {subMessage}
          </Text>
        )}
      </View>
    </View>
  );
};

/**
 * HOME SCREEN SKELETON: Matches the exact Rights Compass Home screen layout:
 * - Brand Logo & Header bar
 * - Greeting container
 * - Hero Dark Card (Today's Legal Lesson)
 * - Section header + Guide carousel cards
 * - Section header + 2x2 Quick Actions grid
 */
export const HomeScreenSkeleton: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isMobile && { paddingHorizontal: Spacing.sm + 2 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.webContainer}>
          {/* Header Top Bar */}
          <View style={[styles.headerTopBar, { borderBottomColor: colors.border }]}>
            <View style={styles.brandRow}>
              <SkeletonPulse style={styles.logoSkeleton} />
              <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                <SkeletonPulse style={{ width: 110, height: 16, borderRadius: 4, marginBottom: 4 }} />
                <SkeletonPulse style={{ width: 65, height: 9, borderRadius: 3 }} />
              </View>
            </View>
            <View style={styles.headerRightActions}>
              <SkeletonPulse style={styles.streakBadgeSkeleton} />
              <SkeletonPulse style={styles.roundIconSkeleton} />
              <SkeletonPulse style={styles.roundIconSkeleton} />
            </View>
          </View>

          {/* Greeting Container */}
          <View style={styles.greetingSection}>
            <SkeletonPulse style={{ width: 140, height: 12, borderRadius: 4, marginBottom: 8 }} />
            <SkeletonPulse style={{ width: '65%', height: 26, borderRadius: 6, marginBottom: 8 }} />
            <SkeletonPulse style={{ width: '85%', height: 14, borderRadius: 4 }} />
          </View>

          {/* Hero Dark Card (Today's Lesson) */}
          <View style={[styles.heroDarkCard, isDark ? { backgroundColor: '#161922' } : { backgroundColor: '#1E232F' }]}>
            <View style={styles.heroStatusRow}>
              <SkeletonPulse style={styles.heroLiveBadge} />
              <SkeletonPulse style={styles.heroCategoryBadge} />
            </View>
            <SkeletonPulse style={{ width: '85%', height: 22, borderRadius: 6, marginBottom: 10 }} />
            <SkeletonPulse style={{ width: '95%', height: 14, borderRadius: 4, marginBottom: 6 }} />
            <SkeletonPulse style={{ width: '70%', height: 14, borderRadius: 4, marginBottom: 16 }} />
            <View style={styles.heroCitationRow}>
              <SkeletonPulse style={{ width: 120, height: 22, borderRadius: BorderRadius.pill }} />
              <SkeletonPulse style={{ width: 140, height: 22, borderRadius: BorderRadius.pill }} />
            </View>
            <SkeletonPulse style={styles.heroActionButton} />
          </View>

          {/* Section Header: Recommended Guides */}
          <View style={styles.sectionHeaderRow}>
            <SkeletonPulse style={{ width: 180, height: 18, borderRadius: 4 }} />
            <SkeletonPulse style={{ width: 80, height: 14, borderRadius: 4 }} />
          </View>

          {/* Carousel Skeleton Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
          >
            {Array.from({ length: 3 }).map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.guideCardSkeleton,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    width: isMobile ? 220 : 250,
                  },
                ]}
              >
                <SkeletonPulse style={styles.guideImagePlaceholder} />
                <View style={{ padding: Spacing.md }}>
                  <SkeletonPulse style={{ width: 90, height: 11, borderRadius: 3, marginBottom: 6 }} />
                  <SkeletonPulse style={{ width: '90%', height: 15, borderRadius: 4, marginBottom: 10 }} />
                  <SkeletonPulse style={{ width: '100%', height: 7, borderRadius: 3 }} />
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Section Header: Quick Actions */}
          <View style={[styles.sectionHeaderRow, { marginTop: Spacing.md }]}>
            <SkeletonPulse style={{ width: 120, height: 18, borderRadius: 4 }} />
          </View>

          {/* Quick Actions 2x2 Grid */}
          <View style={styles.quickActionsGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.quickActionCard,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <SkeletonPulse style={styles.quickIconCircle} />
                <SkeletonPulse style={{ width: '70%', height: 14, borderRadius: 4, marginBottom: 4 }} />
                <SkeletonPulse style={{ width: '50%', height: 11, borderRadius: 3 }} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * LIBRARY SCREEN SKELETON: Matches the Legal Rights Library layout:
 * - Search anchor
 * - Filter chips horizontal row
 * - Quick topic hubs 2x2 grid
 * - Legal rights cards list
 */
export const LibraryScreenSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.webContainer}>
          {/* Top Title & Subtitle */}
          <View style={{ marginBottom: Spacing.md }}>
            <SkeletonPulse style={{ width: 220, height: 24, borderRadius: 6, marginBottom: 8 }} />
            <SkeletonPulse style={{ width: '85%', height: 13, borderRadius: 4 }} />
          </View>

          {/* Search Anchor Skeleton */}
          <View style={[styles.searchAnchorSkeleton, { borderColor: colors.border }]}>
            <SkeletonPulse style={{ width: 20, height: 20, borderRadius: 10, marginRight: 10 }} />
            <SkeletonPulse style={{ flex: 1, height: 16, borderRadius: 4 }} />
          </View>

          {/* Filter Chips Horizontal Row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.lg }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonPulse key={i} style={styles.filterChipSkeleton} />
            ))}
          </ScrollView>

          {/* Section Header */}
          <SkeletonPulse style={{ width: 150, height: 16, borderRadius: 4, marginBottom: Spacing.md }} />

          {/* Legal Rights Cards List */}
          {Array.from({ length: 3 }).map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.provisionCardSkeleton,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              <View style={styles.provisionHeaderRow}>
                <SkeletonPulse style={{ width: 90, height: 22, borderRadius: BorderRadius.pill }} />
                <SkeletonPulse style={{ width: 20, height: 20, borderRadius: 4 }} />
              </View>
              <SkeletonPulse style={{ width: '75%', height: 18, borderRadius: 4, marginBottom: 8 }} />
              <SkeletonPulse style={{ width: '100%', height: 13, borderRadius: 4, marginBottom: 6 }} />
              <SkeletonPulse style={{ width: '92%', height: 13, borderRadius: 4, marginBottom: 12 }} />
              <SkeletonPulse style={{ width: '100%', height: 38, borderRadius: BorderRadius.md, marginBottom: 10 }} />
              <SkeletonPulse style={{ width: 140, height: 14, borderRadius: 4 }} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * HYBRID LOADING STATE:
 * Displays real-app structural skeleton cards with a Material 3 contextual progress spinner
 */
export const HybridLoadingState: React.FC<{
  type?: 'home' | 'library';
  message?: string;
  showOverlaySpinner?: boolean;
}> = ({ type = 'home', message, showOverlaySpinner = false }) => {
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {type === 'home' ? <HomeScreenSkeleton /> : <LibraryScreenSkeleton />}
      {showOverlaySpinner && message && (
        <View style={styles.hybridOverlay}>
          <M3Loader message={message} />
        </View>
      )}
    </View>
  );
};

/**
 * Main Flexible LoadingState component:
 * Adheres to Material 3 UX standards by providing screen-matching skeletons for content
 * and progress loaders for asynchronous processing.
 */
export const LoadingState: React.FC<{
  mode?: 'home' | 'library' | 'spinner' | 'hybrid';
  message?: string;
  subMessage?: string;
}> = ({ mode = 'home', message = 'Loading Legal Content...', subMessage }) => {
  switch (mode) {
    case 'home':
      return <HomeScreenSkeleton />;
    case 'library':
      return <LibraryScreenSkeleton />;
    case 'hybrid':
      return <HybridLoadingState type="home" message={message} showOverlaySpinner />;
    case 'spinner':
    default:
      return (
        <SafeAreaView style={styles.fullScreenLoading}>
          <M3Loader message={message} subMessage={subMessage} />
        </SafeAreaView>
      );
  }
};

export const SkeletonHero: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <View style={[styles.heroDarkCard, { backgroundColor: isDark ? '#161B26' : '#2A221E' }]}>
      <View style={styles.heroStatusRow}>
        <SkeletonPulse style={styles.heroLiveBadge} />
        <SkeletonPulse style={styles.heroCategoryBadge} />
      </View>
      <SkeletonPulse style={{ width: '85%', height: 26, borderRadius: 6, marginBottom: 10 }} />
      <SkeletonPulse style={{ width: '95%', height: 14, borderRadius: 4, marginBottom: 6 }} />
      <SkeletonPulse style={{ width: '70%', height: 14, borderRadius: 4, marginBottom: 16 }} />
      <SkeletonPulse style={styles.heroActionButton} />
    </View>
  );
};

export const SkeletonCard: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.guideCardSkeleton, { backgroundColor: colors.cardBackground, borderColor: colors.border, width: 220 }]}>
      <SkeletonPulse style={styles.guideImagePlaceholder} />
      <View style={{ padding: Spacing.md }}>
        <SkeletonPulse style={{ width: 80, height: 14, borderRadius: 4, marginBottom: 8 }} />
        <SkeletonPulse style={{ width: '90%', height: 16, borderRadius: 4, marginBottom: 8 }} />
        <SkeletonPulse style={{ width: '60%', height: 12, borderRadius: 4 }} />
      </View>
    </View>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  const { colors } = useTheme();
  return (
    <View style={{ width: '100%' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <View key={idx} style={[styles.provisionCardSkeleton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.provisionHeaderRow}>
            <SkeletonPulse style={{ width: 90, height: 14, borderRadius: 4 }} />
            <SkeletonPulse style={{ width: 20, height: 20, borderRadius: 4 }} />
          </View>
          <SkeletonPulse style={{ width: '75%', height: 18, borderRadius: 6, marginBottom: 8 }} />
          <SkeletonPulse style={{ width: '100%', height: 14, borderRadius: 4, marginBottom: 4 }} />
          <SkeletonPulse style={{ width: '65%', height: 14, borderRadius: 4 }} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 95,
  },
  webContainer: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
  },
  fullScreenLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  m3LoaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  m3LoaderCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    minWidth: 220,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  m3LoaderMessage: {
    marginTop: Spacing.md,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  m3LoaderSubMessage: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  hybridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },

  // Home Screen Skeleton Styles
  headerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    minHeight: 48,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSkeleton: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadgeSkeleton: {
    width: 90,
    height: 28,
    borderRadius: BorderRadius.pill,
  },
  roundIconSkeleton: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  greetingSection: {
    marginBottom: Spacing.lg,
  },
  heroDarkCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: '#2A2F3D',
  },
  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  heroLiveBadge: {
    width: 130,
    height: 20,
    borderRadius: BorderRadius.pill,
  },
  heroCategoryBadge: {
    width: 80,
    height: 20,
    borderRadius: BorderRadius.sm,
  },
  heroCitationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  heroActionButton: {
    width: '100%',
    height: 44,
    borderRadius: BorderRadius.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  carouselContainer: {
    paddingRight: Spacing.md,
    marginBottom: Spacing.xl,
    gap: 12,
  },
  guideCardSkeleton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  guideImagePlaceholder: {
    height: 110,
    width: '100%',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  quickActionCard: {
    width: '48%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  quickIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: Spacing.xs,
  },

  // Library Skeleton Styles
  searchAnchorSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  filterChipSkeleton: {
    width: 95,
    height: 34,
    borderRadius: BorderRadius.pill,
    marginRight: 8,
  },
  provisionCardSkeleton: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  provisionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
});


