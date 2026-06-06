'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const SESSION_KEY = 'hardwareStoreSession';
const LOCK_KEY = 'dashboardLocked';
const DEFAULT_INACTIVITY_TIMEOUT = 60 * 1000;

function getAutoLockTimeout() {
  if (typeof window === 'undefined') return DEFAULT_INACTIVITY_TIMEOUT;
  const saved = window.localStorage.getItem('autoLockUptimeMinutes');
  if (!saved) return DEFAULT_INACTIVITY_TIMEOUT;
  const minutes = parseInt(saved, 10);
  if (Number.isNaN(minutes) || minutes < 1) return DEFAULT_INACTIVITY_TIMEOUT;
  return minutes * 60 * 1000;
}

function getSession() {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { lastActivity: number };
  } catch {
    return null;
  }
}

function setSessionLastActivity() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ lastActivity: Date.now() }));
}

export default function AutoLock({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathname === '/') return;

    let timeoutId: number | null = null;

    const clearTimer = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const lockApp = () => {
      window.sessionStorage.clear();
      window.localStorage.setItem(LOCK_KEY, 'true');
      window.dispatchEvent(new Event('dashboardLockActivated'));
      clearTimer();
    };

    const isLocked = () => window.localStorage.getItem(LOCK_KEY) === 'true';

    const checkSession = () => {
      const session = getSession();
      if (isLocked()) {
        return false;
      }
      if (!session) {
        return false;
      }
      if (Date.now() - session.lastActivity > getAutoLockTimeout()) {
        lockApp();
        return false;
      }
      setSessionLastActivity();
      return true;
    };

    const startInactivityTimer = () => {
      clearTimer();
      timeoutId = window.setTimeout(lockApp, getAutoLockTimeout());
    };

    const handleActivity = () => {
      if (checkSession()) {
        startInactivityTimer();
      }
    };

    const handleConfigChange = () => {
      if (checkSession()) {
        startInactivityTimer();
      }
    };

    if (checkSession()) {
      startInactivityTimer();
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, handleActivity));
    window.addEventListener('autoLockConfigChanged', handleConfigChange);

    return () => {
      clearTimer();
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      window.removeEventListener('autoLockConfigChanged', handleConfigChange);
    };
  }, [pathname]);

  return <>{children}</>;
}
