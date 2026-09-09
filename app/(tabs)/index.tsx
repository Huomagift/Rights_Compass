import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
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
  Sparkles,
  Flame,
  Home,
  Briefcase,
  ShoppingBag,
  Shield,
  Bell,
  Moon,
  Sun,
  Menu,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { updateDailyStreak, UserProfile } from '../../services/offlineStorage';
import { FEATURED_GUIDE as DEFAULT_FEATURED_GUIDE, RECENT_GUIDES as DEFAULT_RECENT_GUIDES, GuideItem } from '../../data/constitutionStore';
import { NotificationModal } from '../../components/NotificationModal';
import { HeaderMenuModal } from '../../components/HeaderMenuModal';
import { FloatingAIBot } from '../../components/FloatingAIBot';
import { ErrorState } from '../../components/ErrorState';

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <ErrorState
      fullScreen
      title="Dashboard Error"
      message="We encountered an issue loading your legal compass. Please try again."
      errorDetails={error}
      onRetry={retry}
    />
  );
}

const CATEGORY_IMAGES: Record<string, any> = {
  'Police & Civil Rights': require('../../assets/images/guide_police.jpg'),
  'Housing & Property': require('../../assets/images/guide_housing.jpg'),
  'Employment Law': require('../../assets/images/guide_employment.jpg'),
  'Consumer Protection': require('../../assets/images/guide_housing.jpg'),
  'Fundamental Civil Rights': require('../../assets/images/guide_civil_rights.jpg'),
};

const ALL_GUIDE_CANDIDATES: (GuideItem & { interestId: string })[] = [
  {
    id: 'police-stops',
    interestId: 'police',
    category: 'Police & Civil Rights',
    title: 'Police Stops & Phone Searches',
    subtitle: 'What to do when stopped at a road checkpoint. Search & arrest rules under s.35 & s.37.',
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
  const { colors, isDark, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex',
    preferredTime: '08:00 AM',
    onboarded: true,
    streakCount: 12,
    lastOpenedDate: '',
    interests: [],
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

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

  const isMobile = width < 600;
  const isSmall = width < 380;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isMobile && { paddingHorizontal: Spacing.sm + 2 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* WEB & MOBILE MAX-WIDTH CONTAINER */}
        <View style={styles.webContainer}>
          {/* HEADER TOP BAR: LOGO, NOTIFICATION & STREAK */}
          <View style={[styles.headerTopBar, { borderBottomColor: colors.border }]}>
            <View style={styles.brandLogoRow}>
              <Image
                source={require('../../assets/images/rights_compass_logo.png')}
                style={[
                  styles.logoImage,
                  isMobile && { width: 34, height: 34, marginRight: 6 },
                ]}
                contentFit="contain"
              />
              <View style={{ justifyContent: 'center', flexShrink: 1 }}>
                <Text
                  style={[
                    styles.brandTitleText,
                    { color: colors.text },
                    isMobile && { fontSize: isSmall ? 13 : 15, letterSpacing: -0.2 },
                  ]}
                  numberOfLines={1}
                >
                  Rights Compass
                </Text>
                {!isSmall && (
                  <Text
                    style={[
                      styles.brandSubtitleText,
                      { color: colors.primary },
                      isMobile && { fontSize: 8, letterSpacing: 0.6 },
                    ]}
                    numberOfLines={1}
                  >
                    LEGAL CLARITY
                  </Text>
                )}
              </View>
            </View>

            {isMobile ? (
              <View style={styles.headerRightGroup}>
                {/* SANDWICH (HAMBURGER) MENU ON MOBILE */}
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setShowMenuModal(true)}
                  accessibilityLabel="Open Menu"
                >
                  <Menu size={20} color={colors.text} />
                  <View
                    style={[
                      styles.notificationDot,
                      { backgroundColor: colors.primary, top: 8, right: 8 },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.headerRightGroup}>
                {/* DESKTOP / WIDE: EXPANDED TOP BAR CONTROLS */}
                {/* STREAK BADGE */}
                <TouchableOpacity
                  style={[
                    styles.streakBadge,
                    { backgroundColor: colors.streakBadgeBg },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setShowMenuModal(true)}
                >
                  <Flame size={16} color="#D97706" style={{ marginRight: 4 }} />
                  <Text style={[styles.streakText, { color: colors.streakBadgeText }]}>
                    {profile.streakCount} Day Streak
                  </Text>
                </TouchableOpacity>

                {/* DARK MODE TOGGLE */}
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.cardBackground, borderColor: colors.border },
                  ]}
                  activeOpacity={0.8}
                  onPress={toggleTheme}
                >
                  {isDark
                    ? <Sun size={18} color={colors.text} />
                    : <Moon size={18} color={colors.text} />}
                </TouchableOpacity>

                {/* NOTIFICATION BUTTON */}
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.cardBackground, borderColor: colors.border },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setShowNotifications(true)}
                >
                  <Bell size={19} color={colors.text} />
                  <View style={[styles.notificationDot, { backgroundColor: colors.primary }]} />
                </TouchableOpacity>

                {/* PROFILE AVATAR */}
                <TouchableOpacity
                  style={[
                    styles.profileAvatar,
                    { backgroundColor: colors.primaryDark },
                  ]}
                  onPress={() => router.push('/(tabs)/profile' as any)}
                >
                  <User size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* GREETING & READY TO EXPLORE SUBHEADER */}
          <View style={[styles.greetingContainer, isMobile && { marginBottom: Spacing.md }]}>
            <Text
              style={[
                styles.headerGreeting,
                { color: colors.textMuted },
                isMobile && { fontSize: 10, letterSpacing: 0.8 },
              ]}
            >
              {getTimeOfDayGreeting()}, {(profile.name || 'ALEX').toUpperCase()} 👋
            </Text>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.text },
                isMobile && { fontSize: isSmall ? 20 : 23, marginBottom: 2 },
              ]}
            >
              Ready to explore?
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.textMuted },
                isMobile && { fontSize: 13, lineHeight: 18 },
              ]}
            >
              Your compass is set. Let&apos;s find the legal clarity you need today.
            </Text>
          </View>

          {/* HERO FEATURED SECTION (RESPONSIVE: STREAMLINED MOBILE & EXPANDED DESKTOP) */}
          <View style={[styles.heroDarkCard, isMobile && styles.heroDarkCardMobile]}>
            {isMobile ? (
              <>
                {/* Top Status Bar for mobile */}
                <View style={styles.heroStatusRow}>
                  <View style={styles.liveStatusPill}>
                    <View style={styles.statusDotGreen} />
                    <Text style={styles.liveStatusText}>ACTIVE LEGAL GUIDE</Text>
                  </View>
                  <View style={styles.categoryTagPill}>
                    <Text style={styles.categoryTagText} numberOfLines={1}>
                      {featuredGuide.category.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* STREAMLINED, UNCLUTTERED & PERFECTLY ALIGNED MOBILE VIEW */}
                <View style={styles.heroMobileBody}>
                  {/* Middle Content Row: Left Title & Info, Right Glassmorphic Icon Badge */}
                  <View style={styles.heroMobileContentRow}>
                    <View style={styles.heroMobileTextCol}>
                      <Text style={styles.heroMobileTitle} numberOfLines={2}>
                        {featuredGuide.title}
                      </Text>
                      <Text style={styles.heroMobileSubtitle} numberOfLines={2}>
                        {featuredGuide.subtitle}
                      </Text>

                      {/* Clean Citation Pill */}
                      <View style={styles.heroMobileCitationPill}>
                        <Scale size={11} color={colors.primary} style={{ marginRight: 5 }} />
                        <Text style={styles.heroMobileCitationText} numberOfLines={1}>
                          {featuredGuide.citation || 'Constitution 1999'}
                        </Text>
                      </View>
                    </View>

                    {/* Right Icon Badge, aligned vertically with the card */}
                    <View style={styles.heroMobileIconBadge}>
                      {renderGuideIcon(featuredGuide.iconName, 24, colors.primary)}
                    </View>
                  </View>

                  {/* Bottom Full-Width CTA Button - Perfectly aligned with the card margins */}
                  <TouchableOpacity
                    style={[styles.heroMobileFullBtn, { backgroundColor: colors.primary }]}
                    activeOpacity={0.88}
                    onPress={() => router.push(`/guide/${featuredGuide.id}` as any)}
                  >
                    <Text style={styles.heroMobileFullBtnText}>Start Reading Guide</Text>
                    <ArrowRight size={15} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* EXPANDED DESKTOP / WEB VIEW */
              <View style={styles.heroContentGrid}>
                <View style={styles.heroInfoCol}>
                  {/* Top Status Pill on the left above the title */}
                  <View style={styles.heroDesktopStatusRow}>
                    <View style={styles.liveStatusPill}>
                      <View style={styles.statusDotGreen} />
                      <Text style={styles.liveStatusText}>ACTIVE LEGAL GUIDE</Text>
                    </View>
                  </View>

                  <Text style={styles.heroTitleText}>{featuredGuide.title}</Text>
                  <Text style={styles.heroSubtitleText}>{featuredGuide.subtitle}</Text>

                  {/* Refined Metadata Tags */}
                  <View style={styles.heroTagsContainer}>
                    <View style={styles.metaPill}>
                      <Scale size={12} color={colors.primary} style={{ marginRight: 4 }} />
                      <Text style={styles.metaPillText}>{featuredGuide.citation || 'Constitution 1999'}</Text>
                    </View>
                    <View style={styles.metaPill}>
                      <Sparkles size={12} color="#D97706" style={{ marginRight: 4 }} />
                      <Text style={styles.metaPillText}>Interactive Quiz Included</Text>
                    </View>
                  </View>
                </View>

                {/* Right Action Column: "POLICE AND CIVIL RIGHTS", Shield, and "Start reading" all sharing the exact same axis */}
                <View style={styles.heroActionCol}>
                  <View style={styles.categoryTagPill}>
                    <Text style={styles.categoryTagText} numberOfLines={1}>
                      {featuredGuide.category.toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.heroIconBadge}>
                    {renderGuideIcon(featuredGuide.iconName, 32, colors.primary)}
                  </View>

                  <TouchableOpacity
                    style={[styles.heroPrimaryBtn, { backgroundColor: colors.primary }]}
                    activeOpacity={0.85}
                    onPress={() => router.push(`/guide/${featuredGuide.id}` as any)}
                  >
                    <Text style={styles.heroPrimaryBtnText}>Start Reading</Text>
                    <ArrowRight size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* RECENT GUIDES CAROUSEL WITH ACTUAL BACKGROUND IMAGES */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended For You</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/library' as any)}>
              <View style={styles.viewLibraryLink}>
                <Text style={[styles.viewLibraryText, { color: colors.primary }]}>View Library</Text>
                <ChevronRight size={14} color={colors.primary} />
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
                style={[
                  styles.guideCard,
                  {
                    width: width > 600 ? 260 : Math.round(width * 0.54),
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => router.push(`/guide/${guide.id}` as any)}
              >
                <View style={styles.guideImagePlaceholder}>
                  <Image
                    source={CATEGORY_IMAGES[guide.category] || require('../../assets/images/guide_housing.jpg')}
                    style={StyleSheet.absoluteFillObject}
                    contentFit="cover"
                  />
                  <View style={styles.darkImageOverlay} />
                  <View style={[styles.elevatedIconBadge, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}>
                    {renderGuideIcon(guide.iconName, 20, colors.primary)}
                  </View>
                </View>

                <View style={styles.guideCardBody}>
                  <Text style={[styles.guideCategory, { color: colors.primary }]}>{guide.category}</Text>
                  <Text style={[styles.guideTitle, { color: colors.text }]} numberOfLines={1}>
                    {guide.title}
                  </Text>

                  {guide.progressPercent !== undefined && (
                    <View style={styles.progressRow}>
                      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                        <View style={[styles.progressFill, { width: `${guide.progressPercent}%`, backgroundColor: colors.primary }]} />
                      </View>
                      <Text style={[styles.progressText, { color: colors.primary }]}>
                        {guide.progressPercent}%
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* QUICK ACTIONS GRID */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            <TouchableOpacity
              style={[styles.quickCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => router.push('/(tabs)/library' as any)}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: colors.accentLight }]}>
                <Search size={20} color={colors.primary} />
              </View>
              <Text style={[styles.quickTitle, { color: colors.text }]}>Search Laws</Text>
              <Text style={[styles.quickSub, { color: colors.textMuted }]}>Instant lookup</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => router.push('/tutor-chat' as any)}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: colors.accentLight }]}>
                <FileSearch size={20} color={colors.primary} />
              </View>
              <Text style={[styles.quickTitle, { color: colors.text }]}>Scan Doc</Text>
              <Text style={[styles.quickSub, { color: colors.textMuted }]}>Analyze clauses</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => router.push('/(tabs)/marketplace' as any)}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: colors.accentLight }]}>
                <Scale size={20} color={colors.primary} />
              </View>
              <Text style={[styles.quickTitle, { color: colors.text }]}>Find Legal Aid</Text>
              <Text style={[styles.quickSub, { color: colors.textMuted }]}>Pro bono search</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => router.push('/tutor-chat' as any)}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: colors.accentLight }]}>
                <Sparkles size={20} color={colors.primary} />
              </View>
              <Text style={[styles.quickTitle, { color: colors.text }]}>Ask AI Tutor</Text>
              <Text style={[styles.quickSub, { color: colors.textMuted }]}>24/7 AI Legal Help</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* DRAGGABLE FLOATING AI BOT */}
      <FloatingAIBot />

      {/* INTERACTIVE NOTIFICATION MODAL */}
      <NotificationModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* SANDWICH MENU MODAL (STREAK, THEME, NOTIFICATIONS, PROFILE) */}
      <HeaderMenuModal
        visible={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        profile={profile}
        onOpenNotifications={() => setShowNotifications(true)}
      />
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
    paddingBottom: 95,
  },
  webContainer: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
  },
  headerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 48,
    flexWrap: 'nowrap',
    gap: 6,
  },
  brandLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    minWidth: 0,
  },
  logoImage: {
    width: 42,
    height: 42,
    marginRight: 10,
  },
  brandTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  brandSubtitleText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.streakBadgeBg,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.2)',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.streakBadgeText,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingContainer: {
    marginBottom: Spacing.lg,
  },
  headerGreeting: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textMuted,
  },
  heroDarkCard: {
    backgroundColor: '#161922',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: '#2A2F3D',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  heroDarkCardMobile: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm + 2,
    gap: 8,
  },
  liveStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  statusDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  liveStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#22C55E',
    letterSpacing: 0.8,
  },
  categoryTagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexShrink: 1,
  },
  categoryTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E2E8F0',
    letterSpacing: 0.6,
  },
  heroMobileBody: {
    width: '100%',
  },
  heroMobileContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm + 4,
  },
  heroMobileTextCol: {
    flex: 1,
    marginRight: Spacing.sm + 2,
  },
  heroMobileTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 4,
  },
  heroMobileSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#94A3B8',
    marginBottom: Spacing.xs + 2,
  },
  heroMobileCitationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxWidth: '100%',
  },
  heroMobileCitationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  heroMobileIconBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(150, 62, 20, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(150, 62, 20, 0.45)',
    flexShrink: 0,
  },
  heroMobileFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    ...Shadows.sm,
  },
  heroMobileFullBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  heroContentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  heroDesktopStatusRow: {
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  heroInfoCol: {
    flex: 1,
    minWidth: 260,
  },
  heroTitleText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
    lineHeight: 30,
  },
  heroSubtitleText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#94A3B8',
    marginBottom: Spacing.md,
  },
  heroTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  heroActionCol: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: Spacing.md,
  },
  heroIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(150, 62, 20, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(150, 62, 20, 0.45)',
    alignSelf: 'center',
  },
  heroPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
    minWidth: 160,
    ...Shadows.md,
  },
  heroPrimaryBtnText: {
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
    width: 240,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  guideImagePlaceholder: {
    height: 114,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  darkImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28, 16, 10, 0.35)',
  },
  elevatedIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
    zIndex: 2,
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
    gap: Spacing.xs,
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
    bottom: 95,
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
