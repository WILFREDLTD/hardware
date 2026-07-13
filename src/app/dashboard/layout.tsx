'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  getAutoLockTimeoutMs,
  getStoredAutoLockTimeoutMinutes,
  resolveAutoLockTimeoutMinutes,
} from '@/lib/autoLock';

const SESSION_KEY = 'hardwareStoreSession';
const LOCK_KEY = 'dashboardLocked';
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

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, data: session } = useSession();
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [password, setPassword] = useState('');
  const timeoutMinutesRef = useRef<number | null>(null);
  const [passwordError, setPasswordError] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [showUnlockError, setShowUnlockError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setLocked(window.localStorage.getItem(LOCK_KEY) === 'true');

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
      const minutes = timeoutMinutesRef.current ?? getStoredAutoLockTimeoutMinutes(window.localStorage);
      return getAutoLockTimeoutMs(minutes);
    };

    const checkSession = () => {
      const session = getSession();
      if (isLocked()) {
        lockApp();
        return false;
      }
      if (!session) {
        lockApp();
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

    const handleSessionCreated = () => {
      if (checkSession()) {
        startInactivityTimer();
      }
    };

    const handleConfigChange = async () => {
      const minutes = await resolveAutoLockTimeoutMinutes(window.localStorage);
      timeoutMinutesRef.current = minutes;
      if (!isLocked()) {
        startInactivityTimer();
      }
    };

    const handleLockActivated = () => {
      setLocked(true);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LOCK_KEY) {
        setLocked(event.newValue === 'true');
      }
    };

    void (async () => {
      const minutes = await resolveAutoLockTimeoutMinutes(window.localStorage);
      timeoutMinutesRef.current = minutes;
      if (checkSession()) {
        startInactivityTimer();
      }
    })();

    setReady(true);

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, handleActivity));
    window.addEventListener(SESSION_CREATED_EVENT, handleSessionCreated);
    window.addEventListener('autoLockConfigChanged', handleConfigChange);
    window.addEventListener('dashboardLockActivated', handleLockActivated);
    window.addEventListener('storage', handleStorage);

    return () => {
      clearTimer();
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      window.removeEventListener(SESSION_CREATED_EVENT, handleSessionCreated);
      window.removeEventListener('autoLockConfigChanged', handleConfigChange);
      window.removeEventListener('dashboardLockActivated', handleLockActivated);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlocking(true);
    setPasswordError('');

    try {
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(LOCK_KEY, 'false');
          window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ lastActivity: Date.now() }));
          window.dispatchEvent(new Event(SESSION_CREATED_EVENT));
        }
        setPassword('');
        setLocked(false);
      } else {
        setPasswordError('Incorrect password');
        setShowUnlockError(true);
        setTimeout(() => setShowUnlockError(false), 4000);
      }
    } catch (error) {
      setPasswordError('An error occurred. Please try again.');
      setShowUnlockError(true);
      setTimeout(() => setShowUnlockError(false), 4000);
    } finally {
      setUnlocking(false);
    }
  };

  const handleUnlockCancel = () => {
    router.push('/login');
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (!ready || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-gray-500">Checking access…</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="relative h-screen bg-gray-50">
      <div className={locked ? 'pointer-events-none select-none opacity-50' : ''}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar pathname={pathname} />
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </div>

      {locked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <Modal title="Unlock Dashboard" onClose={handleUnlockCancel} onSubmit={handleUnlockSubmit} submitLabel="Unlock">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Welcome back, <span className="font-semibold">{(session?.user as any)?.firstName || session?.user?.email}</span>! Enter your password to continue.
              </p>
              <Input
                label="Password"
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={unlocking}
              />
              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            </div>
          </Modal>

          <Toast
            title="Unlock Failed"
            description={passwordError}
            open={showUnlockError}
            variant="error"
            onClose={() => setShowUnlockError(false)}
          />
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchInterval={0}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SessionProvider>
  );
}
