import React from 'react';
import { StyleSheet, View, Platform, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, BookOpen, Store, Settings } from 'lucide-react-native';
import { Colors } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { ErrorState } from '../../components/ErrorState';

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <ErrorState
      fullScreen
      title="Section Error"
      message="We encountered an issue loading this section. Please try again."
      errorDetails={error}
      onRetry={retry}
    />
  );
}

const TAB_CONFIG: Record<string, { label: string; icon: (color: string) => React.ReactNode }> = {
  index: {
    label: 'Home',
    icon: (color) => <Home size={22} color={color} />,
  },
  library: {
    label: 'Library',
    icon: (color) => <BookOpen size={22} color={color} />,
  },
  marketplace: {
    label: 'Market',
    icon: (color) => <Store size={22} color={color} />,
  },
  profile: {
    label: 'Profile',
    icon: (color) => <Settings size={22} color={color} />,
  },
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();

  // On Web Desktop: expands up to 720px wide so tabs have ample breathing room
  const isWide = width > 640;
  const maxBarWidth = isWide ? Math.min(width * 0.75, 720) : width - 32;
  const leftPosition = isWide ? (width - maxBarWidth) / 2 : 16;
  const barHeight = 68;

  const activePillBg = isDark ? 'rgba(255, 255, 255, 0.20)' : colors.accentLight;
  const activeText = isDark ? '#FFFFFF' : colors.primary;
  const inactiveText = isDark ? 'rgba(255, 255, 255, 0.70)' : colors.textMuted;
  const activeIconColor = isDark ? '#FFFFFF' : colors.primary;
  const inactiveIconColor = isDark ? 'rgba(255, 255, 255, 0.70)' : colors.textMuted;

  return (
    <View
      style={[
        styles.baseTabBar,
        {
          left: leftPosition,
          width: maxBarWidth,
          height: barHeight,
          backgroundColor: isDark ? 'rgba(18, 20, 24, 0.1)' : 'rgba(255, 252, 248, 0.10)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.20)' : 'rgba(229, 214, 200, 0.75)',
        },
        Platform.OS === 'web'
          ? ({
              backdropFilter: 'blur(24px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
              background: isDark ? 'rgba(18, 20, 24, 0.50)' : 'rgba(255, 252, 248, 0.65)',
              position: 'fixed',
              bottom: '20px',
              zIndex: 1000,
            } as any)
          : {},
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = TAB_CONFIG[route.name] || {
          label: route.name,
          icon: (color: string) => <Home size={22} color={color} />,
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.75}
            style={styles.tabItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            {/* Pill Indicator Backdrop */}
            <View
              style={[
                navStyles.indicator,
                isFocused && { backgroundColor: activePillBg },
              ]}
            >
              {config.icon(isFocused ? activeIconColor : inactiveIconColor)}
            </View>

            {/* Label Text - Unclipped and fully visible */}
            <Text
              style={[
                navStyles.label,
                { color: isFocused ? activeText : inactiveText },
                isFocused && navStyles.labelActive,
              ]}
              numberOfLines={1}
            >
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="library" />
      <Tabs.Screen name="marketplace" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  baseTabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    borderRadius: 34,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 4,
  },
});

const navStyles = StyleSheet.create({
  indicator: {
    width: 60,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  labelActive: {
    fontWeight: '700',
  },
});
