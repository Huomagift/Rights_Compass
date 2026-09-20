import React from 'react';
import { Stack } from 'expo-router';
import { useFeatureFlag } from '../../config/featureFlags';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

function RouteGuard({ children }: { children: React.ReactNode }) {
  const marketplaceEnabled = useFeatureFlag('MARKETPLACE_ENABLED');
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    if (!marketplaceEnabled) {
      // Redirect to the (tabs) marketplace which shows the waitlist
      router.replace('/(tabs)/marketplace' as any);
    }
  }, [marketplaceEnabled, router]);

  if (!marketplaceEnabled) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }
  return <>{children}</>;
}

export default function MarketplaceLayout() {
  const { colors } = useTheme();
  return (
    <RouteGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="request" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="my-requests" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="dashboard" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </RouteGuard>
  );
}
