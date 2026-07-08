'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';
import { formatKES } from '@/lib/utils';

interface DashboardStats {
  totalRevenue: number;
  itemsSold: number;
  totalDebts: number;
  debtsPending: number;
  debtsCollected: number;
  profit: number;
  lowStockItems: number;
}

const quickActions = [
  { label: 'Configure Auto-lock', action: 'configureAutoLock', icon: '⏱️', color: '#1a6b45', desc: 'Set idle timeout before lock' },
  { label: 'Add Product', href: '/dashboard/inventory', icon: '📦', color: '#2563eb', desc: 'Update your stock' },
  { label: 'Record Payment', href: '/dashboard/debts', icon: '💳', color: '#7c3aed', desc: 'Log debt repayment' },
]


export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAutoLockModal, setShowAutoLockModal] = useState(false);
  const [autoLockMinutes, setAutoLockMinutes] = useState('1');
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    const current = typeof window !== 'undefined' ? window.localStorage.getItem('autoLockUptimeMinutes') : null;
    if (current && /^[0-9]+$/.test(current)) {
      setAutoLockMinutes(current);
    }

    (async () => {
      try {
        const res = await fetch('/api/reports/stats')
        if (!res.ok) throw new Error('Failed to fetch stats')
        setStats(await res.json())
      } catch (e: any) { setError(e.message) }
      finally { setLoading(false) }
    })()
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  const profitMargin = stats?.totalRevenue ? ((stats.profit / stats.totalRevenue) * 100) : 0
  const debtCollectionRate = stats?.totalDebts ? ((stats.debtsCollected / stats.totalDebts) * 100) : 0

  return (
    <div className="space-y-6">
      <Header
        title={`${greeting} `}
        subtitle="Here's what's happening at your store today"
        action={
          <Link href="/dashboard/sales">
            <Button>+ New Sale</Button>
          </Link>
        }
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Primary KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Revenue Today', value: `KES ${formatKES(stats?.totalRevenue || 0)}`,
            sub: `${stats?.itemsSold || 0} items sold`, icon: '💰', accent: '#1a6b45',
          },
          {
            label: 'Net Profit', value: `KES ${formatKES(stats?.profit || 0)}`,
            sub: `${profitMargin.toFixed(1)}% margin`, icon: '📈', accent: '#2563eb',
          },
          {
            label: 'Pending Debts', value: `KES ${formatKES(stats?.debtsPending || 0)}`,
            sub: 'to be collected', icon: '💳', accent: '#ef4444',
          },
          {
            label: 'Low Stock', value: stats?.lowStockItems || 0,
            sub: 'items need restock', icon: '⚠️', accent: '#f59e0b',
          },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ backgroundColor: s.accent }} />
            <div className="pl-2">
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">{s.label}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{s.icon} {s.value}</div>
              <div className="text-xs text-gray-400">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Debt overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-700">Debt Collection Overview</div>
            <Link href="/dashboard/debts" className="text-xs font-medium hover:underline" style={{ color: '#1a6b45' }}>View all →</Link>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Collection Rate</span>
              <span className="text-sm font-bold" style={{ color: '#1a6b45' }}>{debtCollectionRate.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${debtCollectionRate}%`, backgroundColor: '#1a6b45' }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Issued', value: `KES ${formatKES(stats?.totalDebts || 0)}`, color: 'text-gray-900', bg: 'bg-gray-50' },
              { label: 'Collected', value: `KES ${formatKES(stats?.debtsCollected || 0)}`, color: 'text-green-700', bg: 'bg-green-50' },
              { label: 'Outstanding', value: `KES ${formatKES(stats?.debtsPending || 0)}`, color: 'text-red-600', bg: 'bg-red-50' },
            ].map(d => (
              <div key={d.label} className={`${d.bg} rounded-xl px-4 py-3`}>
                <div className="text-xs text-gray-500 mb-1">{d.label}</div>
                <div className={`text-sm font-bold ${d.color}`}>{d.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</div>
          <div className="space-y-3">
            {quickActions.map((a) => {
              const content = (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0" style={{ backgroundColor: a.color }}>
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">{a.label}</div>
                    <div className="text-xs text-gray-400">{a.desc}</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              );

              if (a.action === 'configureAutoLock') {
                return (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => setShowAutoLockModal(true)}
                    className="w-full text-left"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link key={a.label} href={a.href || '#'}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Low stock alert */}
      {(stats?.lowStockItems || 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
          <div className="text-2xl">⚠️</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-amber-800">Low Stock Alert</div>
            <div className="text-sm text-amber-600">{stats?.lowStockItems} product{stats?.lowStockItems !== 1 ? 's are' : ' is'} running below minimum stock levels.</div>
          </div>
          <Link href="/dashboard/inventory">
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors flex-shrink-0">
              Review Inventory
            </button>
          </Link>
        </div>
      )}
      {showAutoLockModal && (
        <Modal title="Configure Auto-lock" onClose={() => setShowAutoLockModal(false)} onSubmit={(e) => {
          e.preventDefault();
          const minutes = parseInt(autoLockMinutes, 10);
          if (isNaN(minutes) || minutes < 1) {
            return;
          }
          window.localStorage.setItem('autoLockUptimeMinutes', String(minutes));
          window.dispatchEvent(new Event('autoLockConfigChanged'));
          setShowAutoLockModal(false);
        }} submitLabel="Save">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Set how long the app can stay idle before the dashboard auto-locks.</p>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Auto-lock timeout (minutes)</label>
              <input
                type="number"
                min="1"
                value={autoLockMinutes}
                onChange={(e) => setAutoLockMinutes(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}