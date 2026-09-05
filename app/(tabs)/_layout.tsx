import React from 'react';
import { StyleSheet, View, Platform, Text, useWindowDimensions } from 'react-native';
import { Tabs } from 'expo-router';
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

// Material 3 Nav Tab Item
function NavItem({
  icon,
  label,
  focused,
  showLabel,
  indicatorColor,
  labelColor,
}: {
  icon: React.ReactNode;
  label: string;
  focused: boolean;
  showLabel: boolean;
  indicatorColor: string;
  labelColor: string;
}) {
  return (
    <View style={navStyles.item}>
      {/* M3 Active Indicator Pill */}
      <View
        style={[
          navStyles.indicator,
          focused && { backgroundColor: indicatorColor },
        ]}
      >
        {icon}
      </View>
      {showLabel && (
        <Text
          style={[navStyles.label, { color: labelColor }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();
  const isWide = width > 600;

  // Symmetric inset from each edge, reactive to screen width
  const inset = Math.round(width * 0.08);
  const barHeight = isWide ? 68 : 52;

  const floatingTabBar = StyleSheet.flatten([
    styles.baseTabBar,
    {
      left: inset,
      right: inset,
      height: barHeight,
      backgroundColor: isDark ? 'rgba(28, 24, 20, 0.88)' : 'rgba(255, 252, 248, 0.88)',
      borderColor: colors.border,
    },
    Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(28px) saturate(2)',
          WebkitBackdropFilter: 'blur(28px) saturate(2)',
          background: isDark ? 'rgba(28, 24, 20, 0.85)' : 'rgba(255, 252, 248, 0.85)',
        } as any)
      : {},
  ]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: false,
        tabBarStyle: floatingTabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <NavItem
              icon={<Home size={21} color={focused ? colors.primary : colors.textMuted} />}
              label="Home"
              focused={focused}
              showLabel={isWide}
              indicatorColor={colors.accentLight}
              labelColor={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          tabBarIcon: ({ focused }) => (
            <NavItem
              icon={<BookOpen size={21} color={focused ? colors.primary : colors.textMuted} />}
              label="Library"
              focused={focused}
              showLabel={isWide}
              indicatorColor={colors.accentLight}
              labelColor={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          tabBarIcon: ({ focused }) => (
            <NavItem
              icon={<Store size={21} color={focused ? colors.primary : colors.textMuted} />}
              label="Market"
              focused={focused}
              showLabel={isWide}
              indicatorColor={colors.accentLight}
              labelColor={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <NavItem
              icon={<Settings size={21} color={focused ? colors.primary : colors.textMuted} />}
              label="Profile"
              focused={focused}
              showLabel={isWide}
              indicatorColor={colors.accentLight}
              labelColor={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  baseTabBar: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 40,
    // Transparent glass
    backgroundColor: 'rgba(255, 252, 248, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    // Depth shadow
    shadowColor: 'rgba(110, 60, 20, 0.20)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 12,
    paddingBottom: 0,
    paddingTop: 0,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    marginBottom: 0,
    height: '100%',
  },
});

const navStyles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  indicator: {
    width: 52,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: Colors.accentLight,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 3,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
