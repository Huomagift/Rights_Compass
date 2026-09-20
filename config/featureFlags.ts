/**
 * Feature Flags – Rights Compass
 *
 * MARKETPLACE_ENABLED controls the entire lawyer marketplace and
 * lawyer onboarding path. Set to false for production until ready.
 *
 * To enable: change the constant below to `true`.
 * In the future this can be replaced with a remote config fetch
 * without changing any call-sites – just update useFeatureFlag().
 */

// ─── Flag values ─────────────────────────────────────────────────────────────

export const MARKETPLACE_ENABLED = false;

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * useFeatureFlag – returns the current value of a named flag.
 *
 * Usage:
 *   const marketplaceOn = useFeatureFlag('MARKETPLACE_ENABLED');
 *
 * To switch to remote config (e.g. Firebase Remote Config, LaunchDarkly):
 *   - Replace the lookup below with an async/hook-based remote fetch.
 *   - All call-sites remain unchanged.
 */
const FLAGS: Record<string, boolean> = {
  MARKETPLACE_ENABLED,
};

export type FlagName = keyof typeof FLAGS;

export function useFeatureFlag(flag: FlagName): boolean {
  return FLAGS[flag] ?? false;
}
