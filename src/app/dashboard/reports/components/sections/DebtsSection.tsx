'use client';

import { Section } from '../Section';
import { KPICard } from '../KPICard';
import { DonutChart } from '../charts/DonutChart';
import { formatKES } from '@/lib/utils';
import { Debt } from '../../types';

interface DebtsSectionProps {
  debts: Debt[];
  exportDebtsCSV: () => void;
}

export function DebtsSection({ debts, exportDebtsCSV }: DebtsSectionProps) {
  const totalIssued = debts.reduce((s, d) => s + d.amount, 0);
  const totalPaid = debts.reduce((s, d) => s + d.amountPaid, 0);
  const outstanding = debts.reduce((s, d) => s + (d.amount - d.amountPaid), 0);
  const paidDebts = debts.filter(d => d.status === 'PAID');
  const partialDebts = debts.filter(d => d.status === 'PARTIAL');
  const pendingDebts = debts.filter(d => d.status === 'PENDING');
  const collectionRate = totalIssued > 0 ? ((totalPaid / totalIssued) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Issued" value={`KES ${formatKES(totalIssued)}`} sub={`${debts.length} accounts`} accent="#ef4444" icon="💳" />
        <KPICard label="Collected" value={`KES ${formatKES(totalPaid)}`} accent="#1a6b45" icon="✅" />
        <KPICard label="Outstanding" value={`KES ${formatKES(outstanding)}`} sub={`${pendingDebts.length} open`} accent="#f59e0b" icon="⏳" />
        <KPICard label="Collection Rate" value={`${collectionRate}%`} accent="#2563eb" icon="📊" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Debt status breakdown">
          <DonutChart slices={[
            { label: 'Paid', value: paidDebts.length, color: '#1a6b45' },
            { label: 'Partial', value: partialDebts.length, color: '#f59e0b' },
            { label: 'Pending', value: pendingDebts.length, color: '#ef4444' },
          ]} />
        </Section>
        <Section title="Top outstanding debts">
          {pendingDebts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
              No outstanding debts found.
              <div className="mt-2 text-xs text-gray-400">All accounts are up to date.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDebts.sort((a, b) => (b.amount - b.amountPaid) - (a.amount - a.amountPaid)).slice(0, 6).map(d => (
                <div key={d.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-xs font-bold text-red-600 flex-shrink-0">
                    {d.debtorName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-medium text-gray-800 truncate">{d.debtorName}</span>
                      <span className="text-xs font-bold text-red-600 ml-2">KES {formatKES(d.amount - d.amountPaid)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full rounded-full bg-green-500" style={{ width: `${(d.amountPaid / d.amount) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <Section title="All debt accounts" action={<button onClick={exportDebtsCSV} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-print">↓ CSV</button>}>
        <div className="space-y-3 md:hidden">
          {debts.map(d => {
            const pct = (d.amountPaid / d.amount) * 100;
            const st = d.status === 'PAID' ? 'bg-green-100 text-green-700' : d.status === 'PARTIAL' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
            return (
              <div key={d.id} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-gray-900">{d.debtorName}</div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${st}`}>{d.status}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>Total: <span className="font-semibold text-gray-900">{formatKES(d.amount)}</span></div>
                  <div>Paid: <span className="font-semibold text-gray-900">{formatKES(d.amountPaid)}</span></div>
                  <div>Remaining: <span className="font-semibold text-gray-900">{formatKES(d.amount - d.amountPaid)}</span></div>
                  <div>% Paid: <span className="font-semibold text-gray-900">{pct.toFixed(0)}%</span></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Debtor', 'Total (KES)', 'Paid (KES)', 'Remaining (KES)', '% Paid', 'Status'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {debts.map(d => {
                const pct = (d.amountPaid / d.amount) * 100;
                const st = d.status === 'PAID' ? 'bg-green-100 text-green-700' : d.status === 'PARTIAL' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
                return (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/70">
                    <td className="py-2.5 px-3 font-medium text-gray-900">{d.debtorName}</td>
                    <td className="py-2.5 px-3 text-gray-700">{formatKES(d.amount)}</td>
                    <td className="py-2.5 px-3 text-green-700 font-medium">{formatKES(d.amountPaid)}</td>
                    <td className="py-2.5 px-3 text-red-600 font-medium">{formatKES(d.amount - d.amountPaid)}</td>
                    <td className="py-2.5 px-3 text-gray-600">{pct.toFixed(0)}%</td>
                    <td className="py-2.5 px-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st}`}>{d.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
