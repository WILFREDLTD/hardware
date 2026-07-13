'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';

export default function SettingsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [formData, setFormData] = useState({
    storeName: '',
    storeLocation: '',
    storeDescription: '',
    autoLockTimeoutMinutes: 1,
  });

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
        });
        setFormData({
          storeName: data.storeName || '',
          storeLocation: data.storeLocation || '',
          storeDescription: data.storeDescription || '',
          autoLockTimeoutMinutes: data.autoLockTimeoutMinutes ?? 1,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setShowSuccessToast(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Update your hardware store information</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2">
          <section className="space-y-6 rounded-3xl border border-gray-100 bg-slate-50 p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <Input
                  label="First Name"
                  value={userData.firstName}
                  placeholder="First name"
                  disabled
                />
                <Input
                  label="Last Name"
                  value={userData.lastName}
                  placeholder="Last name"
                  disabled
                />
                <Input
                  label="Email"
                  value={userData.email}
                  placeholder="Email address"
                  disabled
                />
                <Input
                  label="Phone"
                  value={userData.phone}
                  placeholder="Phone number"
                  disabled
                />
              </div>
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-gray-100 bg-slate-50 p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h2>
              <div className="space-y-4">
                <Input
                  label="Hardware Store Name"
                  required
                  value={formData.storeName}
                  onChange={(e) =>
                    setFormData({ ...formData, storeName: e.target.value })
                  }
                  placeholder="e.g., My Hardware Store"
                />
                <Input
                  label="Store Location"
                  required
                  value={formData.storeLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, storeLocation: e.target.value })
                  }
                  placeholder="e.g., 123 Main Street, Nairobi"
                />
                <Input
                  label="Auto-lock timeout (minutes)"
                  required
                  type="number"
                  min={1}
                  value={formData.autoLockTimeoutMinutes}
                  onChange={(e) =>
                    setFormData({ ...formData, autoLockTimeoutMinutes: Number(e.target.value) })
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                    rows={4}
                    value={formData.storeDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, storeDescription: e.target.value })
                    }
                    placeholder="Describe your hardware store, products, and services..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.storeDescription.length}/500 characters
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="md:col-span-2 flex flex-wrap gap-4 pt-6 justify-end border-t border-gray-200">
            <Button
              type="button"
              className="bg-gray-200 text-gray-900 hover:bg-gray-300"
              onClick={() => router.push('/dashboard')}
            >
              Dashboard
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>

      <Toast
        title="Settings Updated!"
        description="Your store information has been updated successfully."
        open={showSuccessToast}
        variant="success"
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
}
