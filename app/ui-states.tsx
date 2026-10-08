import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  ArrowLeft,
  AlertCircle,
  Loader,
  Compass,
  FileSearch,
  WifiOff,
  Clock,
  Lock,
  Bell,
  Mic,
  Camera,
  FileText,
  Wrench,
  ArrowUpCircle,
  Sun,
  Moon,
  Layers,
} from 'lucide-react-native';
import { BorderRadius, Spacing, Shadows, CONTENT_MAX_WIDTH } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { ScreenState, ScreenStateType } from '../components/ScreenState';
import { PrePermissionModal, PrePermissionType } from '../components/PrePermissionModal';
import { BrandedAppSplash } from '../components/BrandedAppSplash';

export default function UIStatesShowcaseScreen() {
  const router = useRouter();
  const {
    colors,
    isDark,
    toggleTheme,
    sizeClass,
    windowWidth,
    typography,
  } = useTheme();

  const [activeCategory, setActiveCategory] = useState<'screen-state' | 'pre-permission' | 'system-screens' | 'type-tokens'>('screen-state');
  const [selectedScreenState, setSelectedScreenState] = useState<ScreenStateType>('skeleton');
  const [skeletonShape, setSkeletonShape] = useState<'home' | 'library' | 'marketplace' | 'profile' | 'detail' | 'form'>('home');
  const [showSplashPreview, setShowSplashPreview] = useState(false);
  const [permissionModalType, setPermissionModalType] = useState<PrePermissionType | null>(null);
  const [retryCounter, setRetryCounter] = useState(0);

  return (
    <>
      <Stack.Screen options={{ title: 'UI States & M3 Tokens', headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Navigation Header */}
        <View
          style={[
            styles.topHeader,
            {
              backgroundColor: colors.surfaceContainerLow || colors.cardBackground,
              borderColor: colors.outlineVariant || colors.border,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={[styles.backBtn, { borderColor: colors.outlineVariant || colors.border }]}
              onPress={() => router.replace('/(tabs)' as any)}
            >
              <ArrowLeft size={18} color={colors.onSurface || colors.text} />
            </TouchableOpacity>
            <View style={{ marginLeft: 10 }}>
              <Text style={[styles.topTitle, { color: colors.onSurface || colors.text, ...typography.titleMedium }]}>
                Foundation Test Bench
              </Text>
              <Text style={[styles.topSubtitle, { color: colors.onSurfaceVariant || colors.textMuted, ...typography.bodySmall }]}>
                {sizeClass.toUpperCase()} • {Math.round(windowWidth)}px • {isDark ? 'Dark Theme' : 'Light Theme'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.themeToggleBtn, { backgroundColor: colors.primaryContainer || colors.accentLight }]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            {isDark ? <Sun size={18} color={colors.primary} /> : <Moon size={18} color={colors.primary} />}
            <Text style={[styles.themeToggleText, { color: colors.primary }]}>
              {isDark ? 'Light' : 'Dark'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Switcher */}
        <View style={styles.categoryBar}>
          <TouchableOpacity
            style={[
              styles.categoryTab,
              activeCategory === 'screen-state' && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setActiveCategory('screen-state')}
          >
            <Layers
              size={15}
              color={activeCategory === 'screen-state' ? (colors.onPrimary || '#FFF') : colors.textMuted}
            />
            <Text
              style={[
                styles.categoryTabText,
                { color: activeCategory === 'screen-state' ? (colors.onPrimary || '#FFF') : colors.textMuted },
              ]}
            >
              ScreenState
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryTab,
              activeCategory === 'pre-permission' && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setActiveCategory('pre-permission')}
          >
            <Lock
              size={15}
              color={activeCategory === 'pre-permission' ? (colors.onPrimary || '#FFF') : colors.textMuted}
            />
            <Text
              style={[
                styles.categoryTabText,
                { color: activeCategory === 'pre-permission' ? (colors.onPrimary || '#FFF') : colors.textMuted },
              ]}
            >
              Permissions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryTab,
              activeCategory === 'system-screens' && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setActiveCategory('system-screens')}
          >
            <Wrench
              size={15}
              color={activeCategory === 'system-screens' ? (colors.onPrimary || '#FFF') : colors.textMuted}
            />
            <Text
              style={[
                styles.categoryTabText,
                { color: activeCategory === 'system-screens' ? (colors.onPrimary || '#FFF') : colors.textMuted },
              ]}
            >
              System Routes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryTab,
              activeCategory === 'type-tokens' && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setActiveCategory('type-tokens')}
          >
            <Compass
              size={15}
              color={activeCategory === 'type-tokens' ? (colors.onPrimary || '#FFF') : colors.textMuted}
            />
            <Text
              style={[
                styles.categoryTabText,
                { color: activeCategory === 'type-tokens' ? (colors.onPrimary || '#FFF') : colors.textMuted },
              ]}
            >
              Type & Tokens
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 1. ScreenState Tab */}
          {activeCategory === 'screen-state' && (
            <View style={styles.cardSection}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface || colors.text, ...typography.titleSmall }]}>
                Select ScreenState Mode:
              </Text>
              <View style={styles.pillsRow}>
                {(['skeleton', 'empty', 'error', 'offline', 'session-expired', 'permission-denied'] as ScreenStateType[]).map((st) => (
                  <TouchableOpacity
                    key={st}
                    style={[
                      styles.pill,
                      {
                        backgroundColor:
                          selectedScreenState === st
                            ? colors.primary
                            : (colors.surfaceContainerLowest || colors.cardWhite),
                        borderColor:
                          selectedScreenState === st ? colors.primary : (colors.outlineVariant || colors.border),
                      },
                    ]}
                    onPress={() => setSelectedScreenState(st)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        {
                          color:
                            selectedScreenState === st
                              ? (colors.onPrimary || '#FFFFFF')
                              : (colors.onSurface || colors.text),
                        },
                      ]}
                    >
                      {st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Skeleton Shape Selector (when skeleton mode is active) */}
              {selectedScreenState === 'skeleton' && (
                <View style={{ marginBottom: Spacing.md }}>
                  <Text style={[styles.sectionSubtitle, { color: colors.onSurfaceVariant || colors.textMuted, marginBottom: 6 }]}>
                    Page-Specific Content Skeletons (matches real screen layout):
                  </Text>
                  <View style={styles.pillsRow}>
                    {(['home', 'library', 'marketplace', 'profile', 'detail', 'form'] as const).map((shape) => (
                      <TouchableOpacity
                        key={shape}
                        style={[
                          styles.pill,
                          {
                            backgroundColor:
                              skeletonShape === shape
                                ? (colors.primaryContainer || colors.accentLight)
                                : (colors.surfaceContainerLowest || colors.cardWhite),
                            borderColor:
                              skeletonShape === shape ? colors.primary : (colors.outlineVariant || colors.border),
                          },
                        ]}
                        onPress={() => setSkeletonShape(shape)}
                      >
                        <Text
                          style={[
                            styles.pillText,
                            {
                              color:
                                skeletonShape === shape
                                  ? (colors.onPrimaryContainer || colors.primary)
                                  : (colors.onSurface || colors.text),
                            },
                          ]}
                        >
                          {shape} screen
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Render Selected ScreenState */}
              <View
                style={[
                  styles.previewBox,
                  {
                    backgroundColor: colors.surfaceContainerLow || colors.cardBackground,
                    borderColor: colors.outlineVariant || colors.border,
                  },
                ]}
              >
                <ScreenState
                  state={selectedScreenState}
                  skeletonType={skeletonShape}
                  emptyTitle="No Saved Constitution Articles"
                  emptyMessage="Bookmarks let you quickly reference important constitutional sections even when offline."
                  emptyActionLabel="Browse Constitution"
                  onEmptyAction={() => router.push('/(tabs)/library')}
                  errorTitle="Legal Citation Service Unavailable"
                  errorMessage="Unable to load court decisions and legal interpretations from database."
                  errorDetails={
                    retryCounter > 0
                      ? `HTTP 503 Service Unavailable: Endpoint /rest/v1/citations timed out after 3 retries (count: ${retryCounter})`
                      : undefined
                  }
                  onRetry={() => setRetryCounter((c) => c + 1)}
                  offlineCachedNotice="All downloaded Fundamental Rights sections remain fully accessible offline."
                  onOfflineRetry={() => alert('Connection re-check initiated')}
                  sessionExpiredMessage="Your legal consultation token has expired. Please verify your phone number."
                  onSessionExpiredAction={() => router.push('/onboarding')}
                  permissionType="microphone"
                  onPermissionSettingsAction={() => alert('Opening Device Settings...')}
                />
              </View>
            </View>
          )}

          {/* 2. Pre-Permission Tab */}
          {activeCategory === 'pre-permission' && (
            <View style={styles.cardSection}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface || colors.text, ...typography.titleSmall }]}>
                Pre-Permission Rationale Modals (Spec 1.9):
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.onSurfaceVariant || colors.textMuted }]}>
                Rationale dialogs shown before triggering native OS permission prompts.
              </Text>

              <View style={styles.buttonList}>
                <TouchableOpacity
                  style={[styles.actionRow, { backgroundColor: colors.surfaceContainerLowest || colors.cardWhite, borderColor: colors.outlineVariant || colors.border }]}
                  onPress={() => setPermissionModalType('notifications')}
                >
                  <Bell size={20} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.actionRowTitle, { color: colors.onSurface || colors.text }]}>Notifications Permission</Text>
                    <Text style={[styles.actionRowSub, { color: colors.onSurfaceVariant || colors.textMuted }]}>Right of Day & Case Alerts</Text>
                  </View>
                  <Text style={[styles.actionRowBtnText, { color: colors.primary }]}>Test →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionRow, { backgroundColor: colors.surfaceContainerLowest || colors.cardWhite, borderColor: colors.outlineVariant || colors.border }]}
                  onPress={() => setPermissionModalType('microphone')}
                >
                  <Mic size={20} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.actionRowTitle, { color: colors.onSurface || colors.text }]}>Microphone Permission</Text>
                    <Text style={[styles.actionRowSub, { color: colors.onSurfaceVariant || colors.textMuted }]}>Voice AI Legal Guidance</Text>
                  </View>
                  <Text style={[styles.actionRowBtnText, { color: colors.primary }]}>Test →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionRow, { backgroundColor: colors.surfaceContainerLowest || colors.cardWhite, borderColor: colors.outlineVariant || colors.border }]}
                  onPress={() => setPermissionModalType('camera')}
                >
                  <Camera size={20} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.actionRowTitle, { color: colors.onSurface || colors.text }]}>Camera Permission</Text>
                    <Text style={[styles.actionRowSub, { color: colors.onSurfaceVariant || colors.textMuted }]}>Call to Bar & ID Photography</Text>
                  </View>
                  <Text style={[styles.actionRowBtnText, { color: colors.primary }]}>Test →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionRow, { backgroundColor: colors.surfaceContainerLowest || colors.cardWhite, borderColor: colors.outlineVariant || colors.border }]}
                  onPress={() => setPermissionModalType('files')}
                >
                  <FileText size={20} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.actionRowTitle, { color: colors.onSurface || colors.text }]}>Documents / Files Permission</Text>
                    <Text style={[styles.actionRowSub, { color: colors.onSurfaceVariant || colors.textMuted }]}>Case Evidence & Agreements</Text>
                  </View>
                  <Text style={[styles.actionRowBtnText, { color: colors.primary }]}>Test →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 3. System Screens Tab */}
          {activeCategory === 'system-screens' && (
            <View style={styles.cardSection}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface || colors.text, ...typography.titleSmall }]}>
                Dedicated System Routes:
              </Text>

              <View style={styles.buttonList}>
                <TouchableOpacity
                  style={[styles.actionRow, { backgroundColor: colors.surfaceContainerLowest || colors.cardWhite, borderColor: colors.outlineVariant || colors.border }]}
                  onPress={() => router.push('/maintenance')}
                >
                  <Wrench size={20} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.actionRowTitle, { color: colors.onSurface || colors.text }]}>Maintenance Screen (Spec 1.5)</Text>
                    <Text style={[styles.actionRowSub, { color: colors.onSurfaceVariant || colors.textMuted }]}>Scheduled maintenance fallback barrier</Text>
                  </View>
                  <Text style={[styles.actionRowBtnText, { color: colors.primary }]}>Open →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionRow, { backgroundColor: colors.surfaceContainerLowest || colors.cardWhite, borderColor: colors.outlineVariant || colors.border }]}
                  onPress={() => router.push('/force-update')}
                >
                  <ArrowUpCircle size={20} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.actionRowTitle, { color: colors.onSurface || colors.text }]}>Force-Update Screen (Spec 1.6)</Text>
                    <Text style={[styles.actionRowSub, { color: colors.onSurfaceVariant || colors.textMuted }]}>Mandatory app version check barrier</Text>
                  </View>
                  <Text style={[styles.actionRowBtnText, { color: colors.primary }]}>Open →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionRow, { backgroundColor: colors.surfaceContainerLowest || colors.cardWhite, borderColor: colors.outlineVariant || colors.border }]}
                  onPress={() => router.push('/error')}
                >
                  <AlertCircle size={20} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.actionRowTitle, { color: colors.onSurface || colors.text }]}>Global Error Screen (Spec 1.4)</Text>
                    <Text style={[styles.actionRowSub, { color: colors.onSurfaceVariant || colors.textMuted }]}>Global crash & exception fallback</Text>
                  </View>
                  <Text style={[styles.actionRowBtnText, { color: colors.primary }]}>Open →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionRow, { backgroundColor: colors.surfaceContainerLowest || colors.cardWhite, borderColor: colors.outlineVariant || colors.border }]}
                  onPress={() => router.push('/not-found')}
                >
                  <Compass size={20} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.actionRowTitle, { color: colors.onSurface || colors.text }]}>404 Not Found Screen</Text>
                    <Text style={[styles.actionRowSub, { color: colors.onSurfaceVariant || colors.textMuted }]}>Missing route handler with recovery options</Text>
                  </View>
                  <Text style={[styles.actionRowBtnText, { color: colors.primary }]}>Open →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionRow, { backgroundColor: colors.surfaceContainerLowest || colors.cardWhite, borderColor: colors.outlineVariant || colors.border }]}
                  onPress={() => setShowSplashPreview(true)}
                >
                  <Compass size={20} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.actionRowTitle, { color: colors.onSurface || colors.text }]}>Cold Start App Splash (Spec 1.1)</Text>
                    <Text style={[styles.actionRowSub, { color: colors.onSurfaceVariant || colors.textMuted }]}>Branded initial load state (distinct from in-page skeletons)</Text>
                  </View>
                  <Text style={[styles.actionRowBtnText, { color: colors.primary }]}>Preview →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 4. Type & Tokens Tab */}
          {activeCategory === 'type-tokens' && (
            <View style={styles.cardSection}>
              <Text style={[styles.sectionTitle, { color: colors.onSurface || colors.text, ...typography.titleSmall }]}>
                Material 3 Responsive Type Scale ({sizeClass.toUpperCase()} Window):
              </Text>

              <View
                style={[
                  styles.typeBox,
                  {
                    backgroundColor: colors.surfaceContainerLowest || colors.cardWhite,
                    borderColor: colors.outlineVariant || colors.border,
                  },
                ]}
              >
                <Text style={[{ color: colors.onSurface || colors.text }, typography.displaySmall]}>
                  Display Small ({typography.displaySmall.fontSize}px)
                </Text>
                <Text style={[{ color: colors.onSurface || colors.text, marginTop: 6 }, typography.headlineMedium]}>
                  Headline Medium ({typography.headlineMedium.fontSize}px)
                </Text>
                <Text style={[{ color: colors.onSurface || colors.text, marginTop: 6 }, typography.titleLarge]}>
                  Title Large ({typography.titleLarge.fontSize}px)
                </Text>
                <Text style={[{ color: colors.onSurface || colors.text, marginTop: 6 }, typography.bodyMedium]}>
                  Body Medium ({typography.bodyMedium.fontSize}px) - Fundamental Human Rights under Chapter IV of the Constitution of Nigeria.
                </Text>
                <Text style={[{ color: colors.onSurfaceVariant || colors.textMuted, marginTop: 6 }, typography.labelMedium]}>
                  LABEL MEDIUM ({typography.labelMedium.fontSize}px) - SECTION 35 CITATION
                </Text>
              </View>

              <Text style={[styles.sectionTitle, { color: colors.onSurface || colors.text, ...typography.titleSmall, marginTop: Spacing.lg }]}>
                Material 3 Semantic Color Tokens:
              </Text>
              <View style={styles.tokenGrid}>
                {[
                  { name: 'primary', val: colors.primary },
                  { name: 'primaryContainer', val: colors.primaryContainer },
                  { name: 'surface', val: colors.surface },
                  { name: 'surfaceVariant', val: colors.surfaceVariant },
                  { name: 'outline', val: colors.outline },
                  { name: 'error', val: colors.error },
                ].map((token) => (
                  <View
                    key={token.name}
                    style={[
                      styles.tokenSwatch,
                      {
                        backgroundColor: colors.surfaceContainerLowest || colors.cardWhite,
                        borderColor: colors.outlineVariant || colors.border,
                      },
                    ]}
                  >
                    <View style={[styles.colorSquare, { backgroundColor: token.val }]} />
                    <Text style={[styles.tokenName, { color: colors.onSurface || colors.text }]}>{token.name}</Text>
                    <Text style={[styles.tokenVal, { color: colors.onSurfaceVariant || colors.textMuted }]}>{token.val}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Pre-Permission Modal Dialog */}
        {permissionModalType && (
          <PrePermissionModal
            visible={true}
            type={permissionModalType}
            onAllow={() => {
              alert(`Granted mock ${permissionModalType} permission!`);
              setPermissionModalType(null);
            }}
            onNotNow={() => setPermissionModalType(null)}
          />
        )}

        {/* Cold Start Splash Preview Modal */}
        <Modal
          visible={showSplashPreview}
          transparent={false}
          animationType="fade"
          onRequestClose={() => setShowSplashPreview(false)}
        >
          <View style={{ flex: 1, position: 'relative' }}>
            <BrandedAppSplash />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 40,
                right: 20,
                backgroundColor: colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: BorderRadius.pill,
                zIndex: 9999,
              }}
              onPress={() => setShowSplashPreview(false)}
            >
              <Text style={{ color: colors.onPrimary || '#FFFFFF', fontWeight: '700' }}>Close Preview ✕</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  topTitle: {
    fontWeight: '700',
  },
  topSubtitle: {
    marginTop: 1,
  },
  themeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    overflow: 'scroll',
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 4,
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.md,
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    width: '100%',
  },
  cardSection: {
    width: '100%',
  },
  sectionTitle: {
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: Spacing.md,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  pill: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  previewBox: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonList: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    ...Shadows.sm,
  },
  actionRowTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionRowSub: {
    fontSize: 12,
    marginTop: 2,
  },
  actionRowBtnText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
  typeBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  tokenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tokenSwatch: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    minWidth: 160,
  },
  colorSquare: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  tokenName: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  tokenVal: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
});
