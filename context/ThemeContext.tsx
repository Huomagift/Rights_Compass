import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Colors,
  DarkColors,
  ThemeColors,
  WindowSizeClass,
  TypographyScale,
  getWindowSizeClass,
  getTypographyScale,
} from '../constants/theme';

const THEME_STORAGE_KEY = '@rights_compass_theme';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  themePreference: ThemePreference;
  toggleTheme: () => void;
  setThemePreference: (pref: ThemePreference) => void;
  sizeClass: WindowSizeClass;
  isCompact: boolean;
  isMedium: boolean;
  isExpanded: boolean;
  typography: TypographyScale;
  windowWidth: number;
  windowHeight: number;
}

const defaultContextValue: ThemeContextValue = {
  colors: Colors,
  isDark: false,
  themePreference: 'system',
  toggleTheme: () => {},
  setThemePreference: () => {},
  sizeClass: 'compact',
  isCompact: true,
  isMedium: false,
  isExpanded: false,
  typography: getTypographyScale('compact'),
  windowWidth: 360,
  windowHeight: 640,
};

const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [loaded, setLoaded] = useState(false);

  // Load persisted theme preference
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((val) => {
        if (val === 'light' || val === 'dark' || val === 'system') {
          setThemePreferenceState(val as ThemePreference);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const setThemePreference = useCallback((pref: ThemePreference) => {
    setThemePreferenceState(pref);
    AsyncStorage.setItem(THEME_STORAGE_KEY, pref).catch(() => {});
  }, []);

  const isDark = useMemo(() => {
    if (themePreference === 'dark') return true;
    if (themePreference === 'light') return false;
    return systemScheme === 'dark';
  }, [themePreference, systemScheme]);

  const colors: ThemeColors = isDark ? DarkColors : Colors;

  const toggleTheme = useCallback(() => {
    const next: ThemePreference = isDark ? 'light' : 'dark';
    setThemePreference(next);
  }, [isDark, setThemePreference]);

  const sizeClass = useMemo(() => getWindowSizeClass(windowWidth), [windowWidth]);
  const isCompact = sizeClass === 'compact';
  const isMedium = sizeClass === 'medium';
  const isExpanded = sizeClass === 'expanded';

  const typography = useMemo(() => getTypographyScale(sizeClass), [sizeClass]);

  const value: ThemeContextValue = useMemo(
    () => ({
      colors,
      isDark,
      themePreference,
      toggleTheme,
      setThemePreference,
      sizeClass,
      isCompact,
      isMedium,
      isExpanded,
      typography,
      windowWidth,
      windowHeight,
    }),
    [
      colors,
      isDark,
      themePreference,
      toggleTheme,
      setThemePreference,
      sizeClass,
      isCompact,
      isMedium,
      isExpanded,
      typography,
      windowWidth,
      windowHeight,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

export function useWindowSizeClass(): {
  sizeClass: WindowSizeClass;
  isCompact: boolean;
  isMedium: boolean;
  isExpanded: boolean;
  windowWidth: number;
  windowHeight: number;
} {
  const { sizeClass, isCompact, isMedium, isExpanded, windowWidth, windowHeight } = useTheme();
  return { sizeClass, isCompact, isMedium, isExpanded, windowWidth, windowHeight };
}

export function useResponsiveType(): TypographyScale {
  const { typography } = useTheme();
  return typography;
}
