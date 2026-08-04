'use client';

import { Section } from '../Section';
import { formatKES } from '@/lib/utils';

interface ExpenseOverviewProps {
  categorySummary: [string, number][];
  paymentSummary: [string, number][];
}

export function ExpenseOverview({ categorySummary, paymentSummary }: ExpenseOverviewProps) {
  return (
    <Section title="Expense overview" subtitle="Track how cost categories and payment sources compare">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Top expense categories</div>
              <p className="text-xs text-slate-500 mt-1">See where spending is concentrated.</p>
            </div>
            <span className="rounded-2xl bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Summary</span>
          </div>
          <div className="mt-5 border-t border-slate-200 pt-5 space-y-4">
            {categorySummary.slice(0, 4).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between gap-3 text-sm text-slate-700">
                <span className="truncate font-medium text-slate-900">{category}</span>
                <span className="font-semibold text-slate-900">KES {formatKES(amount)}</span>
              </div>
            ))}
            {categorySummary.length === 0 && <div className="text-sm text-slate-500">No expenses recorded yet.</div>}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Payment method breakdown</div>
              <p className="text-xs text-slate-500 mt-1">Understand how payments are made.</p>
            </div>
            <span className="rounded-2xl bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Methods</span>
          </div>
          <div className="mt-5 border-t border-slate-200 pt-5 space-y-4">
            {paymentSummary.slice(0, 4).map(([paymentMethod, amount]) => (
              <div key={paymentMethod} className="flex items-center justify-between gap-3 text-sm text-slate-700">
                <span className="truncate font-medium text-slate-900">{paymentMethod}</span>
                <span className="font-semibold text-slate-900">KES {formatKES(amount)}</span>
              </div>
            ))}
            {paymentSummary.length === 0 && <div className="text-sm text-slate-500">No expenses recorded yet.</div>}
          </div>
        </div>
      </div>
    </Section>
  );
}
