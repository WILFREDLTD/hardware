'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';
import { validatePasswordRequirements, isPasswordValid } from '@/lib/passwordValidator';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [storeName, setStoreName] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [passwordFieldFocused, setPasswordFieldFocused] = useState(false);
  const [showAttemptedSubmit, setShowAttemptedSubmit] = useState(false);

  const passwordRequirements = useMemo(
    () => validatePasswordRequirements(formData.password),
    [formData.password]
  );

  const isPasswordValid_ = useMemo(
    () => isPasswordValid(passwordRequirements),
    [passwordRequirements]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowAttemptedSubmit(true);

    if (!isPasswordValid_) {
      setError('Password does not meet all requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Ensure store info is provided
    if (!storeName.trim() || !storeLocation.trim() || !storeDescription.trim()) {
      setError('Store name, location and description are required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            storeName,
            storeLocation,
            storeDescription,
          }),
      });

      if (response.ok) {
        setShowSuccessToast(true);

        if (typeof window !== 'undefined') {
          window.sessionStorage.clear();
          window.localStorage.removeItem('dashboardLocked');
        }
        await signOut({ redirect: false });

        const signInResult = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (signInResult?.ok) {
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('hardwareStoreSession', JSON.stringify({ lastActivity: Date.now() }));
            window.localStorage.setItem('dashboardLocked', 'false');
          }
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          setTimeout(() => {
            router.push('/login');
          }, 1500);
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirementItems = [
    { label: 'At least 6 characters', met: passwordRequirements.minLength },
    { label: 'One uppercase letter', met: passwordRequirements.hasUppercase },
    { label: 'One number', met: passwordRequirements.hasNumber },
    { label: 'One punctuation mark (!@#$%^&* etc.)', met: passwordRequirements.hasPunctuation },
  ];

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
            Run your hardware store with confidence.
          </h1>
          <p className="mt-3 text-sm text-green-100/90">
            Inventory, sales, and credit management built for East African hardware retailers.
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
      <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-8 lg:px-16">
        <div className="relative mx-auto w-full ">
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
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Create your account</h1>
            <p className="mt-1.5 text-sm text-gray-500">Set up your store on HardwareStock in a few minutes.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal details */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Your details</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="First Name"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
                <Input
                  label="Last Name"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Store info */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Store details</p>
              <div className="rounded-2xl border border-green-100 bg-green-50/50 p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input required label="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                  <Input required label="Store Location" value={storeLocation} onChange={(e) => setStoreLocation(e.target.value)} />
                </div>
                <div className="mt-3">
                  <Textarea
                    required
                    label="Store Description"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    maxLength={500}
                    rows={4}
                  />
                  <p className="mt-1 text-right text-xs text-gray-400">{storeDescription.length}/500</p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Security</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  onFocus={() => setPasswordFieldFocused(true)}
                  onBlur={() => setPasswordFieldFocused(false)}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />
              </div>

              {/* Password Requirements - show when focused or after attempted submit */}
              {(passwordFieldFocused || showAttemptedSubmit) && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="mb-3 text-xs font-semibold text-gray-600">Password requirements</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {passwordRequirementItems.map((requirement) => {
                      const state = requirement.met ? 'met' : showAttemptedSubmit ? 'unmet' : 'idle';
                      return (
                        <div key={requirement.label} className="flex items-center gap-2">
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                              state === 'met'
                                ? 'bg-emerald-100 text-emerald-600'
                                : state === 'unmet'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-200 text-gray-400'
                            }`}
                          >
                            {state === 'unmet' ? (
                              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            ) : (
                              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          <span
                            className={`text-xs ${
                              state === 'met'
                                ? 'font-medium text-emerald-700'
                                : state === 'unmet'
                                ? 'font-medium text-red-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {requirement.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !isPasswordValid_ || formData.password !== formData.confirmPassword}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <Toast
        title="Account Created!"
        description="Your account has been created successfully. Redirecting to dashboard..."
        open={showSuccessToast}
        variant="success"
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
}