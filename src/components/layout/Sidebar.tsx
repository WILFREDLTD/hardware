'use client';
import Link from 'next/link';

interface NavItem {
  href: string;
  label: string;
  icon: string;
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
      { href: '/dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { href: '/dashboard/inventory', label: 'Inventory', icon: 'ti-packages', badge: '12' },
      { href: '/dashboard/sales', label: 'Sales', icon: 'ti-receipt-2' },
      { href: '/dashboard/debts', label: 'Debts', icon: 'ti-credit-card', badge: '3' },
    ],
  },
  {
    label: null,
    items: [
      { href: '/dashboard/reports', label: 'Reports', icon: 'ti-chart-bar' },
    ],
  },
];

export const Sidebar: React.FC<{ pathname: string }> = ({ pathname }) => {
  return (
    <>

      <aside
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className="w-[260px] bg-[#0a0f1a] border-r border-white/5 text-white h-screen sticky top-0 flex flex-col"
      >
        {/* Header */}
        <div className="px-5 pt-6 pb-5 border-b border-white/5">
          <div className="flex items-center gap-2.5 mb-1">
            <span
              className="text-[15px] font-bold text-white tracking-tight"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Hardware<span className="text-emerald-400">Stock</span>
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-widest text-white">
            Management System
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5" aria-label="Main navigation">
          {navigationSections.map((section, si) => (
            <div key={si}>
              {section.label && (
                <p className="text-[10px] uppercase tracking-[0.12em] text-white font-medium px-2 pt-2 pb-1.5">
                  {section.label}
                </p>
              )}
              {!section.label && si > 0 && (
                <div className="h-px bg-white/5 my-2 mx-3" />
              )}
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`
                      relative flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] transition-all duration-150 group
                      ${isActive
                        ? 'bg-emerald-500/10 text-white'
                        : 'text-white hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-emerald-500 rounded-r-sm" />
                    )}

                    {/* Icon container */}
                    <span
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150
                        ${isActive
                          ? 'bg-emerald-500/20'
                          : 'bg-white/[0.08] group-hover:bg-white/[0.14]'
                        }
                      `}
                    >
                      <i
                        className={`ti ${item.icon} text-[16px] transition-colors duration-150 ${
                          isActive ? 'text-white' : 'text-white group-hover:text-white'
                        }`}
                        aria-hidden="true"
                      />
                    </span>

                    <span
                      className={`text-sm flex-1 transition-colors duration-150 ${
                        isActive ? 'font-semibold text-white' : 'font-medium text-white'
                      }`}
                    >
                      {item.label}
                    </span>

                    {item.badge && (
                      <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-200 px-1.5 py-0.5 rounded-full">
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
        <div className="px-3 pb-4 pt-3 border-t border-white/5">
          {/* Logout */}
          <button className="flex items-center gap-2 w-full px-3 py-2.5 bg-transparent border border-white/[0.12] rounded-[10px] text-white text-[13px] font-medium transition-all duration-150 hover:bg-white/10 hover:border-white/20 hover:text-white cursor-pointer">
            <i className="ti ti-logout text-[15px]" aria-hidden="true" />
            Sign out
          </button>

          <p className="text-center text-[10px] uppercase tracking-widest text-white mt-3 opacity-90">
            Powered by Vico Softwares
          </p>
        </div>
      </aside>
    </>
  );
};