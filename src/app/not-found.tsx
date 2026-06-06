import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-200">
              🔧
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">HardwareHub</p>
              <p className="text-base font-semibold text-slate-900">Hardware Store Management</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">This route is unavailable. Return to the dashboard to continue.</p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
              Page not found
            </div>

            <div className="mt-8 max-w-2xl space-y-8">
              <div className="space-y-4">
                <p className="text-6xl font-black tracking-tight text-slate-900 sm:text-7xl">404</p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  This aisle is out of stock.
                </h1>
              </div>

              <p className="max-w-xl text-base leading-8 text-slate-600">
                The page you are looking for does not exist in the HardwareHub system. Use the dashboard links below to manage inventory, sales, and customer debts from the main control panel.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/dashboard">
                  <Button className="inline-flex items-center gap-2" type="button">
                    Open dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <span className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                    Back to home
                  </span>
                </Link>
              </div>
            </div>
          </section>

          <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
            <div className="rounded-3xl bg-emerald-500/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">System status</p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">Store systems online</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                All core features are available — only this route is missing. Use the dashboard links below to continue.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: '📦', title: 'Inventory', desc: 'View stock levels and product catalog', href: '/dashboard/inventory' },
                { icon: '🧾', title: 'Sales', desc: 'Review transactions and receipts', href: '/dashboard/sales' },
                { icon: '💳', title: 'Debts', desc: 'Manage outstanding customer balances', href: '/dashboard/debts' },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-4 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-lg">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-slate-400 transition group-hover:text-emerald-600">→</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
