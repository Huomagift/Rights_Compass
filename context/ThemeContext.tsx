import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, DarkColors, ThemeColors } from '../constants/theme';

const THEME_STORAGE_KEY = '@rights_compass_theme';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: Colors,
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  // null = follow system, 'light' | 'dark' = user override
  const [userPreference, setUserPreference] = useState<'light' | 'dark' | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load persisted preference
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((val) => {
        if (val === 'light' || val === 'dark') {
          setUserPreference(val);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const effectiveScheme =
    userPreference ?? (systemScheme === 'dark' ? 'dark' : 'light');
  const isDark = effectiveScheme === 'dark';
  const colors: ThemeColors = isDark ? DarkColors : Colors;

  const toggleTheme = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    setUserPreference(next);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => {});
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
