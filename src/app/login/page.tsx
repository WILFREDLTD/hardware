'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: 'wilfred@example.com', password: '123456' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.clear();
        window.localStorage.removeItem('dashboardLocked');
      }
      await signOut({ redirect: false });

      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        setError('Wrong credentials');
      } else if (result?.url) {
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('hardwareStoreSession', JSON.stringify({ lastActivity: Date.now() }));
          window.localStorage.setItem('dashboardLocked', 'false');
        }
        setShowSuccessToast(true);
        router.push(result.url);
      } else if (result?.ok) {
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('hardwareStoreSession', JSON.stringify({ lastActivity: Date.now() }));
          window.localStorage.setItem('dashboardLocked', 'false');
        }
        setShowSuccessToast(true);
        router.push('/dashboard');
      } else {
        setError('Unable to sign in, please try again.');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Branding panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-green-600 lg:flex lg:w-[42%] lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 opacity-[0.15]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white">HardwareStock</span>
          </div>

          <h1 className="mt-14 text-3xl font-bold leading-tight text-white">
            Welcome back to your store.
          </h1>
          <p className="mt-3 text-sm text-green-100/90">
            Sign in to manage inventory, sales, and customer credit in one place.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              'Track stock levels in real time',
              'Accept M-Pesa and card payments',
              'Manage debtors and credit sales with ease',
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm text-green-50">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-green-100/60">
          Trusted by hardware store owners across Kenya
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 lg:px-16">
        <div className="relative w-full max-w-md">
          <button
            type="button"
            onClick={() => router.push('/')}
            aria-label="Close"
            className="absolute -right-2 -top-2 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 sm:right-0 sm:top-0"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Sign in</h1>
            <p className="mt-1.5 text-sm text-gray-500">Enter your details to access your dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              required
              value={formData.email || 'wilfred@example.com'}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              label="Password"
              type="password"
              required
              placeholder="123456"
              value={formData.password || '123456'}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-green-600 hover:text-green-700">
              Register
            </Link>
          </p>
        </div>
      </div>

      <Toast
        title="Welcome Back!"
        description="You have been signed in successfully. Redirecting to dashboard..."
        open={showSuccessToast}
        variant="success"
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
}