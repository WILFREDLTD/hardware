'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

    const handleLockActivated = () => {
      setLocked(true);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LOCK_KEY) {
        setLocked(event.newValue === 'true');
      }
    };

    if (checkSession()) {
      startInactivityTimer();
    }

    setReady(true);

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, handleActivity));
    window.addEventListener(SESSION_CREATED_EVENT, handleSessionCreated);
    window.addEventListener('dashboardLockActivated', handleLockActivated);
    window.addEventListener('storage', handleStorage);

    return () => {
      clearTimer();
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      window.removeEventListener(SESSION_CREATED_EVENT, handleSessionCreated);
      window.removeEventListener('dashboardLockActivated', handleLockActivated);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCK_KEY, 'false');
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ lastActivity: Date.now() }));
        window.dispatchEvent(new Event(SESSION_CREATED_EVENT));
      }
      setPasswordError('');
      setPassword('');
      setLocked(false);
      return;
    }
    setPasswordError('Incorrect password');
  };

  const handleUnlockCancel = () => {
    router.push('/');
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-gray-500">Checking access…</div>
      </div>
    );
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
              <p className="text-sm text-gray-600">The dashboard is locked. Enter the password to continue.</p>
              <Input
                label="Password"
                type="password"
                required
                placeholder="123456"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-sm text-gray-500">Password is <strong>123456</strong> for this demo test.</p>
              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}
