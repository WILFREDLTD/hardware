export const AUTO_LOCK_TIMEOUT_STORAGE_KEY = 'autoLockUptimeMinutes';
// Fallback timeout (30 minutes) - only used if database cannot be reached
// This should be a reasonable duration that doesn't lock aggressively
const FALLBACK_TIMEOUT_MINUTES = 30;

/**
 * Get the auto-lock timeout from localStorage (cached database value)
 * This is only used as a fallback when the database cannot be reached
 * Respects any configured value from the database, including large values like 1000 minutes
 */
export function getStoredAutoLockTimeoutMinutes(storage?: Storage | null): number {
  if (typeof window === 'undefined') {
    return FALLBACK_TIMEOUT_MINUTES;
  }

  const targetStorage = storage || window.localStorage;
  const saved = targetStorage.getItem(AUTO_LOCK_TIMEOUT_STORAGE_KEY);
  if (!saved) {
    return FALLBACK_TIMEOUT_MINUTES;
  }

  // Parse the stored value - allow any positive integer (1, 30, 1000, etc.)
  const minutes = Number.parseInt(saved, 10);
  return Number.isFinite(minutes) && minutes > 0 ? minutes : FALLBACK_TIMEOUT_MINUTES;
}

/**
 * Fetch the auto-lock timeout configuration from the database via API
 * Always prioritizes the database value configured in settings
 * Falls back to localStorage cache if API is unavailable
 */
export async function resolveAutoLockTimeoutMinutes(storage?: Storage | null): Promise<number> {
  if (typeof window === 'undefined') {
    return FALLBACK_TIMEOUT_MINUTES;
  }

  const targetStorage = storage || window.localStorage;

  try {
    // Always fetch from database first to get the configured value
    const response = await fetch('/api/user/profile');
    if (response.ok) {
      const data = await response.json();
      const minutes = Number(data?.autoLockTimeoutMinutes);
      if (Number.isFinite(minutes) && minutes >= 1) {
        // Cache the database value in localStorage
        targetStorage.setItem(AUTO_LOCK_TIMEOUT_STORAGE_KEY, String(minutes));
        return minutes;
      }
    }
  } catch {
    // Database unreachable - use cached value
  }

  // Fall back to cached value from localStorage
  return getStoredAutoLockTimeoutMinutes(targetStorage);
}

export function getAutoLockTimeoutSeconds(minutes: number): number {
  return minutes * 60;
}

export function getAutoLockTimeoutMs(minutes: number): number {
  const seconds = getAutoLockTimeoutSeconds(minutes);
  return seconds * 1000;
}
