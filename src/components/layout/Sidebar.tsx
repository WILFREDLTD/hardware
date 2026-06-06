'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  badge?: number | string;
}

interface NavSection {
  label: string | null;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { href: '/dashboard/products', label: 'Products' },
      { href: '/dashboard/inventory', label: 'Inventory' },
      { href: '/dashboard/sales', label: 'Sales' },
      { href: '/dashboard/debts', label: 'Debts' },
    ],
  },
  {
    label: null,
    items: [
      { href: '/dashboard/reports', label: 'Reports' },
    ],
  },
];

export const Sidebar: React.FC<{ pathname: string }> = ({ pathname }) => {
  const router = useRouter();
  const [inventoryCount, setInventoryCount] = useState<number | null>(null);
  const [debtsCount, setDebtsCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [inventoryRes, debtsRes] = await Promise.all([
          fetch('/api/inventory'),
          fetch('/api/debts'),
        ]);

        if (inventoryRes.ok) {
          const inventory = await inventoryRes.json();
          setInventoryCount(Array.isArray(inventory) ? inventory.length : 0);
        }

        if (debtsRes.ok) {
          const debts = await debtsRes.json();
          setDebtsCount(Array.isArray(debts) ? debts.length : 0);
        }
      } catch {
        setInventoryCount(0);
        setDebtsCount(0);
      }
    };

    fetchCounts();
  }, []);

  const handleLock = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.clear();
      window.localStorage.setItem('dashboardLocked', 'true');
    }
    router.push('/');
  };

  return (
    <aside
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="w-[260px] bg-emerald-950 border-r border-emerald-900 h-screen sticky top-0 flex flex-col text-slate-100"
    >
      <div
        style={{
          padding: '22px 18px 18px 16px',
          borderBottom: '1px solid #1a2e1f',
          borderLeft: '3px solid #22c55e',
          background: '#0f1a12',
        }}
      >
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '13px',
            fontWeight: 700,
            color: '#f0fdf4',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            lineHeight: 1,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          Hardware
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#22c55e',
              flexShrink: 0,
            }}
          />
          Stock
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '10px',
            fontWeight: 600,
            color: '#4ade80',
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            margin: '7px 0 0',
            opacity: 0.7,
          }}
        >
          Management System
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1" aria-label="Main navigation">
        {navigationSections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="text-[10px] uppercase tracking-[0.12em] text-emerald-200 font-semibold px-2 pt-2 pb-1.5" style={{ color: '#c3c36a' }}>
                {section.label}
              </p>
            )}
            {!section.label && si > 0 && (
              <div className="h-px bg-emerald-900 my-2 mx-3" />
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const badgeValue = item.href === '/dashboard/inventory'
                ? inventoryCount
                : item.href === '/dashboard/debts'
                  ? debtsCount
                  : item.badge;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex items-center px-4 py-3 rounded-[10px] transition-all duration-150 ${isActive ? 'bg-emerald-800 shadow-lg' : 'hover:bg-emerald-900/70'}`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-yellow-400 rounded-r-sm" />
                  )}

                  <span className={`text-[14px] flex-1 transition-colors duration-150 ${isActive ? 'font-semibold' : 'font-medium'}`} style={{ color: '#ffffff' }}>
                    {item.label}
                  </span>

                  {badgeValue != null && (
                    <span className="text-[11px] font-semibold bg-emerald-800 text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: 'AccentColor', color: '#ffffff' }}>
                      {badgeValue}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {pathname.startsWith('/dashboard') && (
        <div className="px-3 pb-3 pt-3 border-t border-emerald-900">
          <button
            type="button"
            onClick={handleLock}
            className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
            style={{ color: '#111827' }}
          >
            Lock
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 pb-4 pt-3 border-t border-emerald-900">
        <p className="text-center text-[9px] uppercase tracking-widest text-yellow-200/80 mt-2" style={{ fontSize: '9px', fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', color: '#c3c36a' }}>
          Vico Softwares
        </p>
      </div>
    </aside>
  );
};