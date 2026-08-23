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
  Flame,
  Home,
  Briefcase,
  ShoppingBag,
  Shield,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { updateDailyStreak, UserProfile } from '../../services/offlineStorage';
import { FEATURED_GUIDE as DEFAULT_FEATURED_GUIDE, RECENT_GUIDES as DEFAULT_RECENT_GUIDES, GuideItem } from '../../data/mockData';

const { width } = Dimensions.get('window');

const ALL_GUIDE_CANDIDATES: (GuideItem & { interestId: string })[] = [
  {
    id: 'police-stops',
    interestId: 'police',
    category: 'Police & Civil Rights',
    title: 'Police Stops & Phone Searches',
    subtitle: 'What to do when stopped at a road checkpoint. Search & arrest rules under s.35 & s.37.',
    badge: 'TAILORED FOR YOU',
    readTime: '4 min read',
    iconName: 'Shield',
    citation: 'Constitution 1999 s.35, s.37 & ACJA s.9',
    content: [
      'Officers cannot search your mobile phone unless there is a warrant or reasonable suspicion of a felony.',
      'Always stay calm, ask polite questions ("May I know why I am being stopped?"), and do not resist physically.'
    ]
  },
  {
    id: 'tenant-2024',
    interestId: 'tenancy',
    category: 'Housing & Property',
    title: 'Navigating Tenant Rights',
    subtitle: 'A comprehensive look at housing laws, quit notice requirements, and rent protection.',
    badge: 'TAILORED FOR YOU',
    readTime: '5 min read',
    iconName: 'Home',
    citation: 'Tenancy Law s.13-16 / Constitution s.37',
    content: [
      'Under Nigerian tenancy laws, a landlord cannot forcefully eject a tenant without serving valid legal notices.',
      'For a yearly tenancy, a tenant is legally entitled to a 6-month Notice to Quit.'
    ]
  },
  {
    id: 'emp-severance',
    interestId: 'employment',
    category: 'Employment Law',
    title: 'Understanding Severance & Termination',
    subtitle: 'Know your rights regarding wrongful termination and statutory redundancy benefits.',
    badge: 'TAILORED FOR YOU',
    readTime: '3 min read',
    iconName: 'Briefcase',
    citation: 'Labour Act Cap L1 s.11',
    content: [
      'Employers must provide written notice or payment in lieu of notice prior to termination.'
    ]
  },
  {
    id: 'consumer-sub',
    interestId: 'consumer',
    category: 'Consumer Protection',
    title: 'Digital Subscriptions & Refunds',
    subtitle: 'Fair transaction laws and protection against unauthorized billing.',
    badge: 'TAILORED FOR YOU',
    readTime: '2 min read',
    iconName: 'ShoppingBag',
    citation: 'FCCPA 2018 s.120',
    content: [
      'The Federal Competition and Consumer Protection Act guarantees clear disclosure of refund rights.'
    ]
  },
  {
    id: 's33',
    interestId: 'civil',
    category: 'Fundamental Civil Rights',
    title: 'Right to Life & Dignity',
    subtitle: 'Understanding constitutional protections for personal life, dignity, and fair hearing.',
    badge: 'TAILORED FOR YOU',
    readTime: '4 min read',
    iconName: 'Scale',
    citation: 'Constitution 1999 Chapter IV',
    content: [
      'Every person has a constitutional right to life and dignity under Chapter IV.'
    ]
  }
];

const renderGuideIcon = (iconName?: string, size = 24, color = Colors.primary) => {
  switch (iconName) {
    case 'Home':
      return <Home size={size} color={color} />;
    case 'Briefcase':
      return <Briefcase size={size} color={color} />;
    case 'ShoppingBag':
      return <ShoppingBag size={size} color={color} />;
    case 'Shield':
      return <Shield size={size} color={color} />;
    case 'Scale':
      return <Scale size={size} color={color} />;
    default:
      return <FileText size={size} color={color} />;
  }
};

const getTimeOfDayGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
};

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
    const p = await updateDailyStreak();
    setProfile(p);
  };

  // Dynamically select Featured Guide & Recent Guides based on user onboarding interests
  const { featuredGuide, recentGuides } = React.useMemo(() => {
    const userInterests = profile.interests || [];
    const primaryInterest = userInterests[0];

    const match = ALL_GUIDE_CANDIDATES.find((g) => g.interestId === primaryInterest);
    const featured: GuideItem = match || DEFAULT_FEATURED_GUIDE;

    // Remaining guides ordered by interests
    const remaining = ALL_GUIDE_CANDIDATES.filter((g) => g.id !== featured.id);
    remaining.sort((a, b) => {
      const idxA = userInterests.indexOf(a.interestId);
      const idxB = userInterests.indexOf(b.interestId);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

    return {
      featuredGuide: featured,
      recentGuides: remaining.length > 0 ? remaining : DEFAULT_RECENT_GUIDES,
    };
  }, [profile.interests]);

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
              {getTimeOfDayGreeting()}, {(profile.name || 'ALEX').toUpperCase()}
            </Text>
            <Text style={styles.headerTitle}>Ready to explore?</Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.streakBadge}>
              <Flame size={14} color={Colors.streakBadgeText} style={{ marginRight: 4 }} />
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
          <View style={styles.heroHeaderRow}>
            <View style={styles.newGuideBadge}>
              <Text style={styles.newGuideBadgeText}>
                {featuredGuide.badge || 'RECOMMENDED FOR YOU'}
              </Text>
            </View>
            {featuredGuide.readTime && (
              <View style={styles.readTimeBadge}>
                <Clock size={10} color={Colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.readTimeText}>{featuredGuide.readTime}</Text>
              </View>
            )}
          </View>

          <View style={styles.heroContentRow}>
            <View style={{ flex: 1, paddingRight: Spacing.sm }}>
              <Text style={styles.heroTitle}>{featuredGuide.title}</Text>
              <Text style={styles.heroSubtitle}>{featuredGuide.subtitle}</Text>
            </View>
            <View style={styles.heroIconCircle}>
              {renderGuideIcon(featuredGuide.iconName, 26, Colors.primary)}
            </View>
          </View>

          <TouchableOpacity
            style={styles.heroButton}
            activeOpacity={0.85}
            onPress={() => router.push(`/guide/${featuredGuide.id}` as any)}
          >
            <Text style={styles.heroButtonText}>Start Reading</Text>
            <ArrowRight size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* RECENT GUIDES CAROUSEL */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
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
          {recentGuides.map((guide) => (
            <TouchableOpacity
              key={guide.id}
              style={styles.guideCard}
              activeOpacity={0.8}
              onPress={() => router.push(`/guide/${guide.id}` as any)}
            >
              <View style={styles.guideImagePlaceholder}>
                <View style={styles.watermarkIconBox}>
                  {renderGuideIcon(guide.iconName, 72, 'rgba(150, 62, 20, 0.09)')}
                </View>

                {guide.readTime && (
                  <View style={styles.cardReadTimePill}>
                    <Text style={styles.cardReadTimeText}>{guide.readTime}</Text>
                  </View>
                )}

                <View style={styles.elevatedIconBadge}>
                  {renderGuideIcon(guide.iconName, 22, Colors.primary)}
                </View>
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
      <View style={styles.floatingContainer} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.speechBubble}
          activeOpacity={0.85}
          onPress={() => router.push('/tutor-chat' as any)}
        >
          <Text style={styles.speechBubbleText}>
            &quot;Have a legal question? I&apos;m here to help you navigate!&quot;
          </Text>
        </TouchableOpacity>

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
    paddingBottom: 150,
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
    ...Shadows.md,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  newGuideBadge: {
    backgroundColor: 'rgba(150, 62, 20, 0.12)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  newGuideBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  readTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 62, 20, 0.08)',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  readTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  heroContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  heroIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
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
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    marginTop: Spacing.xs,
    ...Shadows.sm,
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
    paddingBottom: Spacing.xs,
  },
  guideCard: {
    width: width * 0.54,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  guideImagePlaceholder: {
    height: 104,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkIconBox: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  cardReadTimePill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(229, 214, 200, 0.6)',
  },
  cardReadTimeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  elevatedIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
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
    marginTop: 2,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#EAE0D5',
    borderRadius: BorderRadius.pill,
    marginRight: Spacing.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(229, 214, 200, 0.7)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    backgroundImage: 'linear-gradient(90deg, #8A3C1B 0%, #D8602A 100%)' as any,
    borderRadius: BorderRadius.pill,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
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
    ...Shadows.sm,
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
    bottom: 20,
    right: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 99,
  },
  speechBubble: {
    flexShrink: 1,
    maxWidth: 240,
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
