export const AUTO_LOCK_TIMEOUT_STORAGE_KEY = 'autoLockUptimeMinutes';
export const DEFAULT_AUTO_LOCK_TIMEOUT_MINUTES = 1;

export function getStoredAutoLockTimeoutMinutes(storage?: Storage | null): number {
  if (typeof window === 'undefined') {
    return DEFAULT_AUTO_LOCK_TIMEOUT_MINUTES;
  }

  const targetStorage = storage || window.localStorage;
  const saved = targetStorage.getItem(AUTO_LOCK_TIMEOUT_STORAGE_KEY);
  if (!saved) {
    return DEFAULT_AUTO_LOCK_TIMEOUT_MINUTES;
  }

  const minutes = Number.parseInt(saved, 10);
  return Number.isFinite(minutes) && minutes >= 1 ? minutes : DEFAULT_AUTO_LOCK_TIMEOUT_MINUTES;
}

export async function resolveAutoLockTimeoutMinutes(storage?: Storage | null): Promise<number> {
  if (typeof window === 'undefined') {
    return DEFAULT_AUTO_LOCK_TIMEOUT_MINUTES;
  }

  const targetStorage = storage || window.localStorage;

  try {
    const response = await fetch('/api/user/profile');
    if (response.ok) {
      const data = await response.json();
      const minutes = Number(data?.autoLockTimeoutMinutes);
      if (Number.isFinite(minutes) && minutes >= 1) {
        targetStorage.setItem(AUTO_LOCK_TIMEOUT_STORAGE_KEY, String(minutes));
        return minutes;
      }
    }
  } catch {
    // fall back to local storage below
  }

  return getStoredAutoLockTimeoutMinutes(targetStorage);
}

export function getAutoLockTimeoutMs(minutes: number): number {
  return minutes * 60 * 1000;
}
