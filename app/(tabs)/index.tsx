import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  User,
  ArrowRight,
  ChevronRight,
  FileText,
  Search,
  FileSearch,
  Scale,
  Clock,
  Sparkles,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import { getStoredProfile, UserProfile } from '../../services/offlineStorage';
import { FEATURED_GUIDE, RECENT_GUIDES } from '../../data/mockData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex',
    preferredTime: '08:00 AM',
    onboarded: true,
    streakCount: 12,
    lastOpenedDate: '',
    interests: [],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const p = await getStoredProfile();
    setProfile(p);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP HEADER */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerGreeting}>
              GOOD MORNING, {(profile.name || 'ALEX').toUpperCase()}
            </Text>
            <Text style={styles.headerTitle}>Ready to explore?</Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakIcon}>🏅</Text>
              <Text style={styles.streakText}>{profile.streakCount} Day Streak</Text>
            </View>

            <TouchableOpacity
              style={styles.profileAvatar}
              onPress={() => router.push('/(tabs)/profile' as any)}
            >
              <User size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.headerSubtitle}>
          Your compass is set. Let&apos;s find the legal clarity you need today.
        </Text>

        {/* HERO FEATURED GUIDE CARD */}
        <View style={styles.heroCard}>
          <View style={styles.newGuideBadge}>
            <Text style={styles.newGuideBadgeText}>
              {FEATURED_GUIDE.badge || 'NEW GUIDE'}
            </Text>
          </View>

          <Text style={styles.heroTitle}>{FEATURED_GUIDE.title}</Text>
          <Text style={styles.heroSubtitle}>{FEATURED_GUIDE.subtitle}</Text>

          <TouchableOpacity
            style={styles.heroButton}
            activeOpacity={0.85}
            onPress={() => router.push(`/guide/${FEATURED_GUIDE.id}` as any)}
          >
            <Text style={styles.heroButtonText}>Start Reading</Text>
            <ArrowRight size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* RECENT GUIDES CAROUSEL */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Guides</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/library' as any)}>
            <View style={styles.viewLibraryLink}>
              <Text style={styles.viewLibraryText}>View Library</Text>
              <ChevronRight size={14} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        >
          {RECENT_GUIDES.map((guide) => (
            <TouchableOpacity
              key={guide.id}
              style={styles.guideCard}
              activeOpacity={0.8}
              onPress={() => router.push(`/guide/${guide.id}` as any)}
            >
              <View style={styles.guideImagePlaceholder}>
                <FileText size={32} color={Colors.primary} />
              </View>

              <View style={styles.guideCardBody}>
                <Text style={styles.guideCategory}>{guide.category}</Text>
                <Text style={styles.guideTitle} numberOfLines={1}>
                  {guide.title}
                </Text>

                {guide.progressPercent !== undefined && (
                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${guide.progressPercent}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {guide.progressPercent}%
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* QUICK ACTIONS GRID */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(tabs)/library' as any)}
          >
            <View style={styles.quickIconCircle}>
              <Search size={20} color={Colors.primary} />
            </View>
            <Text style={styles.quickTitle}>Search Laws</Text>
            <Text style={styles.quickSub}>Instant lookup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/tutor-chat' as any)}
          >
            <View style={styles.quickIconCircle}>
              <FileSearch size={20} color={Colors.primary} />
            </View>
            <Text style={styles.quickTitle}>Scan Doc</Text>
            <Text style={styles.quickSub}>Analyze clauses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/(tabs)/marketplace' as any)}
          >
            <View style={styles.quickIconCircle}>
              <Scale size={20} color={Colors.primary} />
            </View>
            <Text style={styles.quickTitle}>Find Legal Aid</Text>
            <Text style={styles.quickSub}>Pro bono search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => router.push('/tutor-chat' as any)}
          >
            <View style={styles.quickIconCircle}>
              <Clock size={20} color={Colors.primary} />
            </View>
            <Text style={styles.quickTitle}>History</Text>
            <Text style={styles.quickSub}>Previous queries</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FLOATING AI MASCOT TUTOR WIDGET */}
      <View style={styles.floatingContainer}>
        <View style={styles.speechBubble}>
          <Text style={styles.speechBubbleText}>
            &quot;Have a legal question? I&apos;m here to help you navigate!&quot;
          </Text>
        </View>

        <TouchableOpacity
          style={styles.floatingMascotBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/tutor-chat' as any)}
        >
          <Image
            source={require('../../assets/images/mascot.png')}
            style={styles.floatingMascotImage}
            contentFit="cover"
          />
          <View style={styles.sparkleBadge}>
            <Sparkles size={14} color={Colors.white} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerGreeting: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.streakBadgeBg,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginBottom: Spacing.xs,
  },
  streakIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.streakBadgeText,
  },
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  heroCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  newGuideBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(150, 62, 20, 0.12)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
  },
  newGuideBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  heroButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginRight: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  viewLibraryLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewLibraryText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 2,
  },
  carouselContainer: {
    paddingRight: Spacing.md,
    marginBottom: Spacing.xl,
  },
  guideCard: {
    width: width * 0.52,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guideImagePlaceholder: {
    height: 100,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideCardBody: {
    padding: Spacing.md,
  },
  guideCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 2,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.pill,
    marginRight: Spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  quickSub: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 12,
    right: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  speechBubble: {
    flex: 1,
    backgroundColor: Colors.cardWhite,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  speechBubbleText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  floatingMascotBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
  },
  floatingMascotImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sparkleBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.cardWhite,
  },
});
