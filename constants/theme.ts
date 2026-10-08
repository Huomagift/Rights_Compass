import { TextStyle } from 'react-native';

/**
 * Material 3 Color Roles - Warm Earth Seed
 * Seed Color: #963E14 (Terracotta Earth)
 */
export const Colors = {
  // Legacy compatibility keys (preserved untouched for existing screens)
  background: '#FAF6F0',
  cardBackground: '#F5ECE3',
  cardWhite: '#FFFFFF',
  primary: '#963E14',
  primaryDark: '#6A2B0E',
  accent: '#7E3106',
  accentLight: '#F3E5D8',
  text: '#2C221E',
  textMuted: '#7D726A',
  border: '#E5D6C8',
  streakBadgeBg: '#F6E8DF',
  streakBadgeText: '#8A3C1B',
  success: '#2D7A46',
  warning: '#D97706',
  overlay: 'rgba(44, 34, 30, 0.4)',
  white: '#FFFFFF',
  shadowColor: 'rgba(110, 60, 20, 0.08)',

  // Material 3 Core Roles (Light)
  onPrimary: '#FFFFFF',
  primaryContainer: '#FFDBCF',
  onPrimaryContainer: '#380E00',

  secondary: '#77574E',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#FFDBCF',
  onSecondaryContainer: '#2C160F',

  tertiary: '#6C5D2F',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#F6E1A6',
  onTertiaryContainer: '#231B00',

  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',

  surface: '#FAF6F0',
  onSurface: '#201A17',
  surfaceVariant: '#F5DED5',
  onSurfaceVariant: '#53433D',

  outline: '#85736C',
  outlineVariant: '#D8C2BA',

  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F4ECE4',
  surfaceContainer: '#EEE6DE',
  surfaceContainerHigh: '#E8E0D8',
  surfaceContainerHighest: '#E2DBD2',

  inverseSurface: '#362F2B',
  inverseOnSurface: '#FAEEE8',
  inversePrimary: '#FFB596',
};

export const DarkColors = {
  // Legacy compatibility keys (rich, high-contrast M3 dark surfaces)
  background: '#110E0C',          // Rich near-black base surface
  cardBackground: '#1A1613',      // Level 1 tonal container
  cardWhite: '#241E1A',           // Level 2 elevated card
  primary: '#F58752',             // Luminous warm terracotta (high contrast against dark base)
  primaryDark: '#B84E1F',
  accent: '#FF9A68',
  accentLight: '#2C1910',         // Subdued warm terracotta wash
  text: '#FAF0EA',                // High-emphasis crisp readable text (15:1+ contrast)
  textMuted: '#B8A89E',           // Medium-emphasis warm readable text (WCAG AA compliant)
  border: '#322720',              // Crisp defined tonal border
  streakBadgeBg: '#301B11',
  streakBadgeText: '#FFA073',
  success: '#34D399',
  warning: '#FBBF24',
  overlay: 'rgba(0, 0, 0, 0.75)',
  white: '#FFFFFF',
  shadowColor: 'rgba(0, 0, 0, 0.6)',

  // Material 3 Core Roles (Dark)
  onPrimary: '#3A1000',
  primaryContainer: '#541C04',
  onPrimaryContainer: '#FFDBCF',

  secondary: '#E8BDB1',
  onSecondary: '#442A22',
  secondaryContainer: '#402921',
  onSecondaryContainer: '#FFDBCF',

  tertiary: '#E2CE96',
  onTertiary: '#3C3005',
  tertiaryContainer: '#44360D',
  onTertiaryContainer: '#FCE7AD',

  error: '#F87171',
  onError: '#450A0A',
  errorContainer: '#7F1D1D',
  onErrorContainer: '#FECACA',

  surface: '#110E0C',
  onSurface: '#FAF0EA',
  surfaceVariant: '#26201C',
  onSurfaceVariant: '#B8A89E',

  outline: '#5C4C42',
  outlineVariant: '#382D26',

  surfaceContainerLowest: '#0C0A09',
  surfaceContainerLow: '#161210',
  surfaceContainer: '#1C1814',
  surfaceContainerHigh: '#241E1A',
  surfaceContainerHighest: '#2E2620',

  inverseSurface: '#FAF0EA',
  inverseOnSurface: '#181310',
  inversePrimary: '#963E14',
};

export type ThemeColors = typeof Colors;

export const Fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
  pill: 999,
};

export const Shadows = {
  sm: {
    shadowColor: 'rgba(110, 60, 20, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: 'rgba(110, 60, 20, 0.10)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: 'rgba(110, 60, 20, 0.14)',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
  },
};

/**
 * Shared content container max-width used by every primary page
 * (Home, Library, Marketplace, Profile, Dashboard, My Requests).
 */
export const CONTENT_MAX_WIDTH = 860;

/**
 * Material 3 Window Size Classes
 * - Compact: < 600dp (standard mobile phone portrait)
 * - Medium: 600 - 839dp (foldables, tablets portrait)
 * - Expanded: >= 840dp (desktop web, tablet landscape)
 */
export type WindowSizeClass = 'compact' | 'medium' | 'expanded';

export const Breakpoints = {
  compactMax: 599,
  mediumMax: 839,
} as const;

export function getWindowSizeClass(width: number): WindowSizeClass {
  if (width < 600) return 'compact';
  if (width < 840) return 'medium';
  return 'expanded';
}

/**
 * Material 3 Type Style structure
 */
export interface TypeStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
  letterSpacing?: number;
}

export interface TypographyScale {
  displayLarge: TypeStyle;
  displayMedium: TypeStyle;
  displaySmall: TypeStyle;
  headlineLarge: TypeStyle;
  headlineMedium: TypeStyle;
  headlineSmall: TypeStyle;
  titleLarge: TypeStyle;
  titleMedium: TypeStyle;
  titleSmall: TypeStyle;
  bodyLarge: TypeStyle;
  bodyMedium: TypeStyle;
  bodySmall: TypeStyle;
  labelLarge: TypeStyle;
  labelMedium: TypeStyle;
  labelSmall: TypeStyle;
}

/**
 * Compact Viewport Typography Scale (Mobile Phone)
 * display <= 36, headline 24-28, title 18-20, body 14-16, label 12-14
 */
export const CompactTypography: TypographyScale = {
  displayLarge: { fontSize: 36, lineHeight: 44, fontWeight: '700', letterSpacing: -0.25 },
  displayMedium: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  displaySmall: { fontSize: 28, lineHeight: 36, fontWeight: '600' },

  headlineLarge: { fontSize: 28, lineHeight: 34, fontWeight: '600' },
  headlineMedium: { fontSize: 26, lineHeight: 32, fontWeight: '600' },
  headlineSmall: { fontSize: 24, lineHeight: 30, fontWeight: '600' },

  titleLarge: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  titleMedium: { fontSize: 18, lineHeight: 24, fontWeight: '500', letterSpacing: 0.15 },
  titleSmall: { fontSize: 16, lineHeight: 22, fontWeight: '500', letterSpacing: 0.1 },

  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400', letterSpacing: 0.5 },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400', letterSpacing: 0.25 },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400', letterSpacing: 0.4 },

  labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: '600', letterSpacing: 0.1 },
  labelMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.5 },
  labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: '500', letterSpacing: 0.5 },
};

/**
 * Medium Viewport Typography Scale (Tablets)
 */
export const MediumTypography: TypographyScale = {
  displayLarge: { fontSize: 44, lineHeight: 52, fontWeight: '700', letterSpacing: -0.25 },
  displayMedium: { fontSize: 36, lineHeight: 44, fontWeight: '700' },
  displaySmall: { fontSize: 32, lineHeight: 40, fontWeight: '600' },

  headlineLarge: { fontSize: 30, lineHeight: 38, fontWeight: '600' },
  headlineMedium: { fontSize: 27, lineHeight: 34, fontWeight: '600' },
  headlineSmall: { fontSize: 24, lineHeight: 30, fontWeight: '600' },

  titleLarge: { fontSize: 21, lineHeight: 28, fontWeight: '600' },
  titleMedium: { fontSize: 18, lineHeight: 24, fontWeight: '500', letterSpacing: 0.15 },
  titleSmall: { fontSize: 16, lineHeight: 22, fontWeight: '500', letterSpacing: 0.1 },

  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400', letterSpacing: 0.5 },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400', letterSpacing: 0.25 },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400', letterSpacing: 0.4 },

  labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: '600', letterSpacing: 0.1 },
  labelMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.5 },
  labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: '500', letterSpacing: 0.5 },
};

/**
 * Expanded Viewport Typography Scale (Desktop Web)
 * Full Material 3 spec type scale
 */
export const ExpandedTypography: TypographyScale = {
  displayLarge: { fontSize: 57, lineHeight: 64, fontWeight: '700', letterSpacing: -0.25 },
  displayMedium: { fontSize: 45, lineHeight: 52, fontWeight: '700' },
  displaySmall: { fontSize: 36, lineHeight: 44, fontWeight: '600' },

  headlineLarge: { fontSize: 32, lineHeight: 40, fontWeight: '600' },
  headlineMedium: { fontSize: 28, lineHeight: 36, fontWeight: '600' },
  headlineSmall: { fontSize: 24, lineHeight: 32, fontWeight: '600' },

  titleLarge: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
  titleMedium: { fontSize: 18, lineHeight: 24, fontWeight: '500', letterSpacing: 0.15 },
  titleSmall: { fontSize: 16, lineHeight: 22, fontWeight: '500', letterSpacing: 0.1 },

  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400', letterSpacing: 0.5 },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400', letterSpacing: 0.25 },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400', letterSpacing: 0.4 },

  labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: '600', letterSpacing: 0.1 },
  labelMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.5 },
  labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: '500', letterSpacing: 0.5 },
};

export function getTypographyScale(sizeClass: WindowSizeClass): TypographyScale {
  switch (sizeClass) {
    case 'expanded':
      return ExpandedTypography;
    case 'medium':
      return MediumTypography;
    case 'compact':
    default:
      return CompactTypography;
  }
}
