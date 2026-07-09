'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Hardware Store
        </h1>
        <p className="text-center text-gray-600 mb-8">Create Your Account</p>

        {error && (
          <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          
          {/* Password Requirements - Only show when focused */}
          {passwordFieldFocused && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Password Requirements:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${
                    passwordRequirements.minLength 
                      ? 'text-green-600' 
                      : showAttemptedSubmit ? 'text-red-600' : 'text-gray-300'
                  }`}>
                    ✓
                  </span>
                  <span className={
                    passwordRequirements.minLength 
                      ? 'text-green-600 font-medium' 
                      : showAttemptedSubmit ? 'text-red-600 font-medium' : 'text-gray-500'
                  }>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${
                    passwordRequirements.hasUppercase 
                      ? 'text-green-600' 
                      : showAttemptedSubmit ? 'text-red-600' : 'text-gray-300'
                  }`}>
                    ✓
                  </span>
                  <span className={
                    passwordRequirements.hasUppercase 
                      ? 'text-green-600 font-medium' 
                      : showAttemptedSubmit ? 'text-red-600 font-medium' : 'text-gray-500'
                  }>
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${
                    passwordRequirements.hasNumber 
                      ? 'text-green-600' 
                      : showAttemptedSubmit ? 'text-red-600' : 'text-gray-300'
                  }`}>
                    ✓
                  </span>
                  <span className={
                    passwordRequirements.hasNumber 
                      ? 'text-green-600 font-medium' 
                      : showAttemptedSubmit ? 'text-red-600 font-medium' : 'text-gray-500'
                  }>
                    One number
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${
                    passwordRequirements.hasPunctuation 
                      ? 'text-green-600' 
                      : showAttemptedSubmit ? 'text-red-600' : 'text-gray-300'
                  }`}>
                    ✓
                  </span>
                  <span className={
                    passwordRequirements.hasPunctuation 
                      ? 'text-green-600 font-medium' 
                      : showAttemptedSubmit ? 'text-red-600 font-medium' : 'text-gray-500'
                  }>
                    One punctuation mark (!@#$%^&*etc.)
                  </span>
                </div>
              </div>
            </div>
          )}

          <Input
            label="Confirm Password"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />

          <Button
            type="submit"
            disabled={loading || !isPasswordValid_ || formData.password !== formData.confirmPassword}
            className="w-full"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
            Sign In
          </Link>
        </p>
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
