'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: 'wilfred@example.com', password: '123456' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error || 'Invalid email or password');
      } else if (result?.ok) {
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('hardwareStoreSession', JSON.stringify({ lastActivity: Date.now() }));
          window.localStorage.setItem('dashboardLocked', 'false');
        }
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
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Hardware Store
        </h1>
        <p className="text-center text-gray-600 mb-8">Management System</p>

        {error && (
          <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700">
            {error}
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
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
