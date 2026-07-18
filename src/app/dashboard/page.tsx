'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';
import { formatKES } from '@/lib/utils';
import { AUTO_LOCK_TIMEOUT_STORAGE_KEY, resolveAutoLockTimeoutMinutes } from '@/lib/autoLock';

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
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️', color: '#2563eb', desc: 'Manage store and lock settings' },
  { label: 'Record Payment', href: '/dashboard/debts', icon: '💳', color: '#7c3aed', desc: 'Log debt repayment' },
]


export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAutoLockModal, setShowAutoLockModal] = useState(false);
  const [autoLockMinutes, setAutoLockMinutes] = useState('1');
  const { data: session } = useSession();
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = (session?.user as any)?.firstName || session?.user?.name || 'there';

  useEffect(() => {
    const loadAutoLockValue = async () => {
      if (typeof window !== 'undefined') {
        const minutes = await resolveAutoLockTimeoutMinutes(window.localStorage);
        setAutoLockMinutes(String(minutes));
      }
    };

    void loadAutoLockValue();

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
        title={`${greeting}, ${firstName}`}
        subtitle="Here's what's happening at your store today"
        action={
          <div className="grid grid-cols-2 gap-2 w-full">
            <Link href="/dashboard/settings">
              <Button className="bg-gray-200 text-gray-900 hover:bg-gray-300 w-full">⚙️ Settings</Button>
            </Link>
            <Link href="/dashboard/sales">
              <Button className="w-full">+ New Sale</Button>
            </Link>
          </div>
        }
      />

      {error && (
        <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Primary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-3 sm:px-4 py-3 sm:py-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ backgroundColor: s.accent }} />
            <div className="pl-2">
              <div className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">{s.label}</div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{s.icon} {s.value}</div>
              <div className="text-[10px] sm:text-xs text-gray-400">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Debt overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-4 sm:p-5 space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-xs sm:text-sm font-semibold text-gray-700">Debt Collection Overview</div>
            <Link href="/dashboard/debts" className="text-xs font-medium hover:underline w-fit" style={{ color: '#1a6b45' }}>View all →</Link>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Collection Rate</span>
              <span className="text-xs sm:text-sm font-bold" style={{ color: '#1a6b45' }}>{debtCollectionRate.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${debtCollectionRate}%`, backgroundColor: '#1a6b45' }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {[
              { label: 'Total Issued', value: `KES ${formatKES(stats?.totalDebts || 0)}`, color: 'text-gray-900', bg: 'bg-gray-50' },
              { label: 'Collected', value: `KES ${formatKES(stats?.debtsCollected || 0)}`, color: 'text-green-700', bg: 'bg-green-50' },
              { label: 'Outstanding', value: `KES ${formatKES(stats?.debtsPending || 0)}`, color: 'text-red-600', bg: 'bg-red-50' },
            ].map(d => (
              <div key={d.label} className={`${d.bg} rounded-xl px-2 sm:px-4 py-2 sm:py-3`}>
                <div className="text-[10px] sm:text-xs text-gray-500 mb-1">{d.label}</div>
                <div className={`text-[11px] sm:text-sm font-bold ${d.color}`}>{d.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Quick Actions</div>
          <div className="space-y-2 sm:space-y-3">
            {quickActions.map((a) => {
              const content = (
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm flex-shrink-0" style={{ backgroundColor: a.color }}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{a.label}</div>
                    <div className="text-[10px] sm:text-xs text-gray-400 line-clamp-1">{a.desc}</div>
                  </div>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-4 sm:space-y-3">
          <div className="flex items-start gap-4">
            <div className="text-2xl mt-1">⚠️</div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-amber-800">Low Stock Alert</div>
              <div className="text-sm text-amber-600 mt-1">{stats?.lowStockItems} product{stats?.lowStockItems !== 1 ? 's are' : ' is'} running below minimum stock levels.</div>
            </div>
          </div>
          <div>
            <Link href="/dashboard/inventory">
              <button className="w-full rounded-lg px-4 py-2 text-sm font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors">
                Review Inventory
              </button>
            </Link>
          </div>
        </div>
      )}
      {showAutoLockModal && (
        <Modal title="Configure Auto-lock" onClose={() => setShowAutoLockModal(false)} onSubmit={async (e) => {
          e.preventDefault();
          const minutes = parseInt(autoLockMinutes, 10);
          if (isNaN(minutes) || minutes < 1) {
            return;
          }

          const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ autoLockTimeoutMinutes: minutes }),
          });

          if (!response.ok) {
            return;
          }

          window.localStorage.setItem(AUTO_LOCK_TIMEOUT_STORAGE_KEY, String(minutes));
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