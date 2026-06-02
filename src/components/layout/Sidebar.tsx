'use client';

import React from 'react';
import Link from 'next/link';

const navigationItems = [
  { href: '/dashboard', label: '📊 Dashboard', icon: '📊' },
  { href: '/dashboard/inventory', label: '📦 Inventory', icon: '📦' },
  { href: '/dashboard/sales', label: '💰 Sales', icon: '💰' },
  { href: '/dashboard/debts', label: '💳 Debts', icon: '💳' },
  { href: '/dashboard/reports', label: '📈 Reports', icon: '📈' },
];

export const Sidebar: React.FC<{ pathname: string }> = ({ pathname }) => {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen sticky top-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-green-500">HardwareStock</h1>
        <p className="text-sm text-gray-400 mt-1">Management System</p>
      </div>

      <nav className="p-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  block px-4 py-3 rounded-lg transition duration-200
                  ${
                    pathname === item.href
                      ? 'bg-green-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label.split(' ')[1]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-6 left-6 right-6 border-t border-gray-800 pt-6">
        <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white transition">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};
