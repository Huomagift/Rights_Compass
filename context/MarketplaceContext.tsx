/**
 * MarketplaceContext
 *
 * Provides:
 * - lawyerApplicationStatus  (the current user's lawyer application, null if none)
 * - isVerifiedLawyer         (true only when status === 'verified')
 * - currentLawyerId          (set after verification; used for dashboard calls)
 * - refreshApplication       (re-fetch application state)
 * - setDevStatus             (DEV only – for testing status screen states)
 *
 * Wrap the app tree once, at the root layout level.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { LawyerApplication, LawyerApplicationStatus } from '../types/marketplace';
import {
  marketplaceService,
  rehydrateMockService,
} from '../services/marketplaceProvider';

interface MarketplaceContextValue {
  application: LawyerApplication | null;
  isVerifiedLawyer: boolean;
  hasAppliedAsLawyer: boolean;
  isPendingVerification: boolean;
  currentLawyerId: string | null;
  isLoadingApplication: boolean;
  refreshApplication: () => Promise<void>;
  /** DEV only — cycles the mock status for testing */
  __devSetStatus: (status: LawyerApplicationStatus) => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextValue>({
  application: null,
  isVerifiedLawyer: false,
  hasAppliedAsLawyer: false,
  isPendingVerification: false,
  currentLawyerId: null,
  isLoadingApplication: false,
  refreshApplication: async () => {},
  __devSetStatus: async () => {},
});

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [application, setApplication] = useState<LawyerApplication | null>(null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(true);

  const fetchApplication = useCallback(async () => {
    setIsLoadingApplication(true);
    try {
      const app = await marketplaceService.getMyApplication();
      setApplication(app);
    } catch {
      setApplication(null);
    } finally {
      setIsLoadingApplication(false);
    }
  }, []);

  useEffect(() => {
    // Rehydrate mock service from AsyncStorage, then fetch
    rehydrateMockService().then(fetchApplication);
  }, [fetchApplication]);

  const __devSetStatus = useCallback(
    async (status: LawyerApplicationStatus) => {
      await marketplaceService.__devSetApplicationStatus?.(status);
      await fetchApplication();
    },
    [fetchApplication]
  );

  const isVerifiedLawyer = application?.status === 'verified';
  const hasAppliedAsLawyer = application != null && application.status !== 'draft';
  const isPendingVerification = application?.status === 'submitted' || application?.status === 'under_review';
  // In the mock, provide lawyer_001 for dashboard preview for any registered lawyer
  const currentLawyerId = (isVerifiedLawyer || hasAppliedAsLawyer) ? 'lawyer_001' : null;

  return (
    <MarketplaceContext.Provider
      value={{
        application,
        isVerifiedLawyer,
        hasAppliedAsLawyer,
        isPendingVerification,
        currentLawyerId,
        isLoadingApplication,
        refreshApplication: fetchApplication,
        __devSetStatus,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace(): MarketplaceContextValue {
  return useContext(MarketplaceContext);
}
