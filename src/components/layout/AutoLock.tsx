'use client';

import { useEffect, useState } from 'react';
import {
  getAutoLockTimeoutMs,
  getStoredAutoLockTimeoutMinutes,
  resolveAutoLockTimeoutMinutes,
} from '@/lib/autoLock';

const SESSION_KEY = 'hardwareStoreSession';
const LOCK_KEY = 'dashboardLocked';

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
  const [timeoutMinutes, setTimeoutMinutes] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname;
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

    const getCurrentTimeoutMs = () => {
      const minutes = timeoutMinutes ?? getStoredAutoLockTimeoutMinutes(window.localStorage);
      return getAutoLockTimeoutMs(minutes);
    };

    const checkSession = () => {
      const session = getSession();
      if (isLocked()) {
        return false;
      }
      if (!session) {
        return false;
      }
      if (Date.now() - session.lastActivity > getCurrentTimeoutMs()) {
        lockApp();
        return false;
      }
      setSessionLastActivity();
      return true;
    };

    const startInactivityTimer = () => {
      clearTimer();
      timeoutId = window.setTimeout(lockApp, getCurrentTimeoutMs());
    };

    const handleActivity = () => {
      if (checkSession()) {
        startInactivityTimer();
      }
    };

    const handleConfigChange = async () => {
      const minutes = await resolveAutoLockTimeoutMinutes(window.localStorage);
      setTimeoutMinutes(minutes);
      if (checkSession()) {
        startInactivityTimer();
      }
    };

    const init = async () => {
      const minutes = await resolveAutoLockTimeoutMinutes(window.localStorage);
      setTimeoutMinutes(minutes);
      if (checkSession()) {
        startInactivityTimer();
      }
    };

    void init();

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, handleActivity));
    window.addEventListener('autoLockConfigChanged', handleConfigChange);

    return () => {
      clearTimer();
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      window.removeEventListener('autoLockConfigChanged', handleConfigChange);
    };
  }, [timeoutMinutes]);

  return <>{children}</>;
}
