import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useFeatureFlag } from '../../config/featureFlags';
import { useTheme } from '../../context/ThemeContext';

export default function LawyerApplicationLayout() {
  const { colors } = useTheme();
  const marketplaceEnabled = useFeatureFlag('MARKETPLACE_ENABLED');
  const router = useRouter();

  useEffect(() => {
    if (!marketplaceEnabled) {
      router.replace('/(tabs)/marketplace' as any);
    }
  }, [marketplaceEnabled, router]);

  if (!marketplaceEnabled) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="credentials" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="review" />
      <Stack.Screen name="status" />
    </Stack>
  );
}
