/**
 * Marketplace Provider – single import point for all screens.
 *
 * To swap from mock to real backend:
 *   1. Create services/supabaseMarketplaceService.ts implementing IMarketplaceService
 *   2. Change the import below from mockMarketplaceService to supabaseMarketplaceService
 *   3. Remove or keep __devSetApplicationStatus as needed
 *
 * All screens import from HERE, never from the mock/supabase file directly.
 */

import { mockMarketplaceService, rehydrateMockService } from './mockMarketplaceService';
import type { IMarketplaceService } from './marketplaceService';

export const marketplaceService: IMarketplaceService = mockMarketplaceService;

// Call once at app boot (inside MarketplaceContext provider)
export { rehydrateMockService };
