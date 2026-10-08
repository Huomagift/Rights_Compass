import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { BrandedAppSplash } from '../components/BrandedAppSplash';
import { checkOnboardingStatus } from '../services/onboardingService';
import { marketplaceService, rehydrateMockService } from '../services/marketplaceProvider';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function checkRoute() {
      try {
        await rehydrateMockService();
        const [status, app] = await Promise.all([
          checkOnboardingStatus(),
          marketplaceService.getMyApplication().catch(() => null),
        ]);
        const hasLawyerApp = app != null && app.status !== 'draft';

        if (status.onboarded || hasLawyerApp) {
          router.replace('/(tabs)' as any);
        } else {
          router.replace('/onboarding' as any);
        }
      } catch {
        router.replace('/(tabs)' as any);
      }
    }

    checkRoute();
  }, [router]);

  return <BrandedAppSplash />;
}
// For app.json web:
//"backgroundImage": "./assets/images/rights_compass_logo.png",
//"monochromeImage": "./assets/images/rights_compass_logo.png"