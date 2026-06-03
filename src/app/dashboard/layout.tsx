'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const SESSION_KEY = 'hardwareStoreSession';
const LOCK_KEY = 'dashboardLocked';
const INACTIVITY_TIMEOUT = 60 * 1000;
const SESSION_CREATED_EVENT = 'hardwareStoreSessionCreated';

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

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
      if (Date.now() - session.lastActivity > INACTIVITY_TIMEOUT) {
        lockApp();
        return false;
      }
      setSessionLastActivity();
      return true;
    };

    const startInactivityTimer = () => {
      clearTimer();
      timeoutId = window.setTimeout(lockApp, INACTIVITY_TIMEOUT);
    };

    const handleActivity = () => {
      if (checkSession()) {
        startInactivityTimer();
      }
    };

    const handleSessionCreated = () => {
      if (checkSession()) {
        startInactivityTimer();
      }
    };

    if (checkSession()) {
      startInactivityTimer();
    }

    setReady(true);

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, handleActivity));
    window.addEventListener(SESSION_CREATED_EVENT, handleSessionCreated);

    return () => {
      clearTimer();
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      window.removeEventListener(SESSION_CREATED_EVENT, handleSessionCreated);
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-gray-500">Checking access…</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar pathname={pathname} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
