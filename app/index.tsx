import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { getStoredProfile } from '../services/offlineStorage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const profile = await getStoredProfile();
        if (profile.onboarded) {
          router.replace('/(tabs)' as any);
        } else {
          router.replace('/onboarding' as any);
        }
      } catch {
        router.replace('/onboarding' as any);
      }
    }

    checkOnboarding();
  }, [router]);

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
