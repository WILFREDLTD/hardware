'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Nav() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    setLoading(path);
    router.push(path);
  };

  return (
    <nav className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-[#e2e8f0] bg-white/95 px-4 backdrop-blur-md sm:px-6 md:px-12">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#065f46] to-[#059669]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          </svg>
        </div>
        <div className="min-w-0">
          <p className="m-0 text-[15px] font-bold leading-tight tracking-[-0.01em] text-[#0f172a]">VYQOR LABS</p>
          <p className="m-0 block text-[6px] sm:text-[11px] font-medium tracking-[0.04em] text-[#64748b] truncate max-w-[150px] sm:max-w-none">Hardware Stocks</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        {['Features', 'FAQ'].map(link => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(' ', '-')}`}
            className="hidden text-sm font-medium text-[#475569] no-underline transition-colors hover:text-[#0f172a] sm:block"
          >
            {link}
          </a>
        ))}
        <button
          onClick={() => handleNavigation('/login')}
          disabled={loading !== null}
          className="rounded-full border border-[#cbd5e1] bg-transparent px-3.5 py-2 text-xs font-semibold text-[#065f46] transition-colors hover:bg-[#f8fafc] hover:text-[#064e3b] disabled:opacity-70 sm:px-[22px] sm:py-2.5 sm:text-sm"
        >
          {loading === '/login' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading...
            </span>
          ) : (
            'Login'
          )}
        </button>
        <button
          onClick={() => handleNavigation('/register')}
          disabled={loading !== null}
          className="rounded-full border-none bg-[#065f46] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#047857] disabled:opacity-70 sm:px-[22px] sm:py-2.5 sm:text-sm"
        >
          {loading === '/register' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading...
            </span>
          ) : (
            'Register'
          )}
        </button>
      </div>
    </nav>
  );
}
