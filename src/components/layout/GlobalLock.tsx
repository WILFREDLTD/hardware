'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';

const SESSION_KEY = 'hardwareStoreSession';
const LOCK_KEY = 'appLocked';
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

function lockApp() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.clear();
  window.localStorage.setItem(LOCK_KEY, 'true');
}

function isLocked() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(LOCK_KEY) === 'true';
}

export default function GlobalLock({ children }: { children: React.ReactNode }) {
  const [locked, setLocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: number | null = null;

    const clearTimer = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const startInactivityTimer = () => {
      clearTimer();
      timeoutId = window.setTimeout(() => {
        lockApp();
        setLocked(true);
      }, INACTIVITY_TIMEOUT);
    };

    const checkSession = () => {
      const session = getSession();
      if (isLocked()) {
        setLocked(true);
        return false;
      }
      if (!session) {
        setLocked(false);
        return false;
      }
      if (Date.now() - session.lastActivity > INACTIVITY_TIMEOUT) {
        lockApp();
        setLocked(true);
        return false;
      }
      setSessionLastActivity();
      return true;
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

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCK_KEY, 'false');
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ lastActivity: Date.now() }));
        window.dispatchEvent(new Event(SESSION_CREATED_EVENT));
      }
      setPassword('');
      setPasswordError('');
      setLocked(false);
      return;
    }

    setPasswordError('Incorrect password');
  };

  return (
    <>
      {children}
      {ready && locked && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">System locked</h2>
            <p className="text-sm text-gray-600 mb-6">The system has been locked due to inactivity. Enter the password to continue.</p>
            <form onSubmit={handleUnlock} className="space-y-4">
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
              <button
                type="submit"
                disabled={!password.trim()}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Unlock
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
