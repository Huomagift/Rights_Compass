/**
 * Root Stack Marketplace Redirect – app/marketplace/index.tsx
 * Always redirects into the tab screen (tabs)/marketplace so users retain
 * the fixed 4-tab bottom navigation bar at all times.
 */
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function MarketplaceRootStackRedirect() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    router.replace('/(tabs)/marketplace' as any);
  }, [router]);

  return <View style={{ flex: 1, backgroundColor: colors.background }} />;
}
