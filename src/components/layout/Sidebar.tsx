'use client';
import Link from 'next/link';

interface NavItem {
  href: string;
  label: string;
  badge?: string;
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
      { href: '/dashboard/inventory', label: 'Inventory', badge: '12' },
      { href: '/dashboard/sales', label: 'Sales' },
      { href: '/dashboard/debts', label: 'Debts', badge: '3' },
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
  return (
    <aside
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="w-[260px] bg-emerald-950 border-r border-emerald-900 h-screen sticky top-0 flex flex-col text-slate-100"
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-5 border-b border-emerald-900">
        <div className="mb-1">
          <span
            className="text-[15px] font-bold text-white tracking-tight"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Hardware<span className="text-emerald-300">Stock</span>
          </span>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-emerald-200">
          Management System
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1" aria-label="Main navigation">
        {navigationSections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="text-[10px] uppercase tracking-[0.12em] text-emerald-200 font-semibold px-2 pt-2 pb-1.5">
                {section.label}
              </p>
            )}
            {!section.label && si > 0 && (
              <div className="h-px bg-emerald-900 my-2 mx-3" />
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex items-center px-4 py-3 rounded-[10px] transition-all duration-150 ${
                    isActive ? 'bg-emerald-800 shadow-lg text-white' : 'hover:bg-emerald-900/70 text-slate-100'
                  }`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-yellow-400 rounded-r-sm" />
                  )}

                  <span className={`text-[14px] flex-1 transition-colors duration-150 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="text-[11px] font-semibold bg-emerald-800 text-white px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-3 border-t border-emerald-900">
        <button className="w-full px-3 py-2.5 bg-emerald-800 border border-emerald-950 rounded-[10px] text-white text-[13px] font-medium transition-all duration-150 hover:bg-emerald-700 hover:border-emerald-900 cursor-pointer">
          Sign out
        </button>

        <p className="text-center text-[9px] uppercase tracking-widest text-yellow-200/80 mt-2">
          Vico Softwares
        </p>
      </div>
    </aside>
  );
};