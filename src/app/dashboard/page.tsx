'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { StatCard, Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface DashboardStats {
  totalRevenue: number;
  itemsSold: number;
  totalDebts: number;
  debtsPending: number;
  debtsCollected: number;
  profit: number;
  lowStockItems: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/reports/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Welcome back to your hardware store"
        action={
          <Link href="/dashboard/sales">
            <Button>+ New Sale</Button>
          </Link>
        }
      />

      {error && (
        <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700">
          {error}
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Today Revenue"
          value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
          icon="💰"
          color="green"
        />
        <StatCard
          label="Items Sold"
          value={stats?.itemsSold || 0}
          icon="📦"
          color="blue"
        />
        <StatCard
          label="Pending Debts"
          value={`$${stats?.debtsPending?.toFixed(2) || '0.00'}`}
          icon="💳"
          color="red"
        />
        <StatCard
          label="Profit"
          value={`$${stats?.profit?.toFixed(2) || '0.00'}`}
          icon="📈"
          color="green"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-lg font-bold mb-4">Total Debts Collected</h2>
          <p className="text-3xl font-bold text-green-600">
            ${stats?.debtsCollected?.toFixed(2) || '0.00'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Out of ${stats?.totalDebts?.toFixed(2) || '0.00'} total
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-bold mb-4">Low Stock Alert</h2>
          <p className="text-3xl font-bold text-danger-600">
            {stats?.lowStockItems || 0}
          </p>
          <p className="text-sm text-gray-500 mt-2">Items below minimum level</p>
          <Link href="/dashboard/inventory">
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              View Inventory
            </Button>
          </Link>
        </Card>

        <Card>
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/dashboard/sales">
              <Button variant="secondary" size="sm" className="w-full">
                Record Sale
              </Button>
            </Link>
            <Link href="/dashboard/inventory">
              <Button variant="secondary" size="sm" className="w-full">
                Add Item
              </Button>
            </Link>
            <Link href="/dashboard/debts">
              <Button variant="secondary" size="sm" className="w-full">
                Record Payment
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
