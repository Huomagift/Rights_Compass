import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { clearAllLocalStorage } from '../services/offlineStorage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function resetAndStartFresh() {
      try {
        // Clear local storage for fresh onboarding testing
        await clearAllLocalStorage();
        router.replace('/onboarding' as any);
      } catch {
        router.replace('/onboarding' as any);
      }
    }

    resetAndStartFresh();
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
