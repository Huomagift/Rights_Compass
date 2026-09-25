import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  Lock,
  Flame,
  Shield,
  Home,
  Briefcase,
  Scale,
  Sparkles,
  Sun,
  Moon,
  BookOpen,
  Star,
} from 'lucide-react-native';
import { BorderRadius, Colors, Shadows, Spacing } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { getLegalLevelsWithProgress } from '../../data/lessonStore';
import { getStoredProfile, UserProfile } from '../../services/offlineStorage';

// Horizontal offsets creating the Duolingo S-curve winding snake path
const S_CURVE_OFFSETS = [0, -42, -65, -30, 0, 35, 65, 30];

export default function LearningPathScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const p = await getStoredProfile();
    setProfile(p);
  };

  const isWide = width > 768;
  const levelsWithProgress = profile ? getLegalLevelsWithProgress(profile) : [];

  const renderIcon = (iconName: string, size = 26, color = '#FFFFFF') => {
    switch (iconName) {
      case 'Home':
        return <Home size={size} color={color} />;
      case 'Briefcase':
        return <Briefcase size={size} color={color} />;
      case 'Scale':
        return <Scale size={size} color={color} />;
      default:
        return <Shield size={size} color={color} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* DUOLINGO TOP BAR */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={() => router.back()}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={18} color={colors.text} />
        </TouchableOpacity>

        {/* STREAK & LEVEL STATS */}
        <View style={styles.topStatsRow}>
          <View style={[styles.streakPill, { backgroundColor: colors.streakBadgeBg }]}>
            <Flame size={16} color="#D97706" style={{ marginRight: 4 }} />
            <Text style={[styles.streakPillText, { color: colors.streakBadgeText }]}>
              {profile?.streakCount || 1}
            </Text>
          </View>

          <View style={[styles.xpPill, { backgroundColor: colors.accentLight }]}>
            <Sparkles size={14} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.xpPillText, { color: colors.primary }]}>
              {levelsWithProgress.filter((l) => l.isCompleted).length * 50 + 10} PTS
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          onPress={toggleTheme}
          accessibilityLabel="Toggle Theme"
        >
          {isDark ? <Sun size={17} color={colors.text} /> : <Moon size={17} color={colors.text} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isWide && styles.wideScrollContent,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================ */}
        {/* UNIT 1 DUOLINGO BANNER                                       */}
        {/* ============================================================ */}
        <View style={[styles.unitBanner, { backgroundColor: colors.primary }]}>
          <View style={styles.unitBannerTopRow}>
            <Text style={styles.unitHeaderLabel}>SECTION 1, UNIT 1</Text>
            <TouchableOpacity
              style={styles.guidebookBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/library' as any)}
            >
              <BookOpen size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.guidebookBtnText}>GUIDEBOOK</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.unitTitleText}>Police Stops & Personal Liberty</Text>
          <Text style={styles.unitSubtitleText}>
            Know your rights under Section 35 & Section 37
          </Text>
        </View>

        {/* ============================================================ */}
        {/* WINDING S-CURVE NODES PATH (DUOLINGO STYLE)                  */}
        {/* ============================================================ */}
        <View style={styles.pathTreeContainer}>
          {levelsWithProgress.map((level, idx) => {
            const offset = S_CURVE_OFFSETS[idx % S_CURVE_OFFSETS.length];
            const isCompleted = level.isCompleted;
            const isActive = level.isActive;
            const isUnlocked = level.isUnlocked;

            return (
              <View key={level.id} style={styles.nodeStepWrapper}>
                {/* CONNECTING STEPPING DOTS */}
                {idx > 0 && (
                  <View style={styles.steppingDotsConnector}>
                    <View style={[styles.steppingDot, { backgroundColor: isUnlocked ? colors.primary : colors.border }]} />
                    <View style={[styles.steppingDot, { backgroundColor: isUnlocked ? colors.primary : colors.border }]} />
                    <View style={[styles.steppingDot, { backgroundColor: isUnlocked ? colors.primary : colors.border }]} />
                  </View>
                )}

                {/* HORIZONTALLY SHIFTED CIRCULAR NODE */}
                <View
                  style={[
                    styles.nodeAligner,
                    { transform: [{ translateX: offset }] },
                  ]}
                >
                  {/* FLOATING ACTIVE TOOLTIP ("START!") */}
                  {isActive && (
                    <View style={styles.floatingTooltipWrapper}>
                      <View style={[styles.floatingTooltipBox, { backgroundColor: colors.primaryDark }]}>
                        <Text style={styles.floatingTooltipText}>START!</Text>
                      </View>
                      <View style={[styles.floatingTooltipArrow, { borderTopColor: colors.primaryDark }]} />
                    </View>
                  )}

                  {/* 3D CHUNKY CIRCULAR BUTTON */}
                  <TouchableOpacity
                    style={[
                      styles.duoCircularButton,
                      isCompleted
                        ? { backgroundColor: colors.success, borderColor: '#16A34A' }
                        : isActive
                        ? { backgroundColor: colors.primary, borderColor: colors.primaryDark }
                        : { backgroundColor: isDark ? '#2A2A2E' : '#E5E7EB', borderColor: isDark ? '#1C1C1F' : '#D1D5DB' },
                      isActive && styles.activePulsingButton,
                    ]}
                    activeOpacity={isUnlocked ? 0.85 : 1}
                    disabled={!isUnlocked}
                    onPress={() => router.push('/lesson/today' as any)}
                  >
                    {isCompleted ? (
                      <Check size={32} color="#FFFFFF" strokeWidth={3.5} />
                    ) : isUnlocked ? (
                      renderIcon(level.iconName, 30, '#FFFFFF')
                    ) : (
                      <Lock size={26} color={isDark ? '#6B7280' : '#9CA3AF'} />
                    )}

                    {/* GLOSS HIGHLIGHT RING */}
                    {isUnlocked && <View style={styles.circularGlint} />}
                  </TouchableOpacity>

                  {/* 3 STARS FOR COMPLETED NODES */}
                  {isCompleted && (
                    <View style={styles.starsRow}>
                      <Star size={13} color="#F59E0B" fill="#F59E0B" />
                      <Star size={15} color="#F59E0B" fill="#F59E0B" style={{ marginHorizontal: 2 }} />
                      <Star size={13} color="#F59E0B" fill="#F59E0B" />
                    </View>
                  )}

                  {/* NODE LABEL */}
                  <Text
                    style={[
                      styles.nodeTitleLabel,
                      { color: isUnlocked ? colors.text : colors.textMuted },
                    ]}
                  >
                    {level.title.split(':')[1]?.trim() || level.title}
                  </Text>
                </View>

                {/* MASCOT CHEERING ALONGSIDE THE PATH */}
                {idx === 1 && (
                  <View style={styles.mascotSideWidget}>
                    <Image
                      source={require('../../assets/images/mascot.png')}
                      style={styles.mascotSmallImg}
                      contentFit="contain"
                    />
                    <View style={[styles.mascotSideBubble, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}>
                      <View style={[styles.sideBubbleTail, { borderLeftColor: colors.cardWhite }]} />
                      <Text style={[styles.mascotSideQuote, { color: colors.text }]}>
                        &quot;Consistency wins! Just 1 lesson keeps your streak alive!&quot;
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* BOTTOM UNIT 2 TEASER */}
        <View style={[styles.lockedUnitBanner, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', borderColor: colors.border }]}>
          <Lock size={20} color={colors.textMuted} style={{ marginBottom: 6 }} />
          <Text style={[styles.lockedUnitTitle, { color: colors.text }]}>
            SECTION 1, UNIT 2
          </Text>
          <Text style={[styles.lockedUnitSub, { color: colors.textMuted }]}>
            Complete previous lessons to unlock Workplace & Tenancy Law
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  topStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  xpPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 80,
  },
  wideScrollContent: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  unitBanner: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md + 4,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  unitBannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  unitHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.8,
  },
  guidebookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  guidebookBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  unitTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  unitSubtitleText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  pathTreeContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  nodeStepWrapper: {
    alignItems: 'center',
    marginVertical: 14,
    width: '100%',
  },
  steppingDotsConnector: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  steppingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nodeAligner: {
    alignItems: 'center',
  },
  floatingTooltipWrapper: {
    alignItems: 'center',
    marginBottom: 6,
  },
  floatingTooltipBox: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    ...Shadows.sm,
  },
  floatingTooltipText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  floatingTooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderTopWidth: 6,
  },
  duoCircularButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 7,
    position: 'relative',
    ...Shadows.md,
  },
  activePulsingButton: {
    transform: [{ scale: 1.05 }],
  },
  circularGlint: {
    position: 'absolute',
    top: 6,
    left: 14,
    right: 14,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  nodeTitleLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 160,
  },
  mascotSideWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: Spacing.md,
    paddingLeft: 10,
    gap: 8,
  },
  mascotSmallImg: {
    width: 52,
    height: 52,
  },
  mascotSideBubble: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    maxWidth: 200,
    position: 'relative',
  },
  sideBubbleTail: {
    position: 'absolute',
    left: -8,
    top: 14,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderTopColor: 'transparent',
    borderBottomWidth: 6,
    borderBottomColor: 'transparent',
    borderLeftWidth: 8,
  },
  mascotSideQuote: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
  },
  lockedUnitBanner: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: Spacing.xl,
  },
  lockedUnitTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  lockedUnitSub: {
    fontSize: 12,
    textAlign: 'center',
  },
});
