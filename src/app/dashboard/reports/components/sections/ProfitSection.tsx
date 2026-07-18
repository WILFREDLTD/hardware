'use client';

import { Section } from '../Section';
import { KPICard } from '../KPICard';
import { LineChart } from '../charts/LineChart';
import { BarChart } from '../charts/BarChart';
import { formatKES } from '@/lib/utils';
import { Sale } from '../../types';

interface ProfitSectionProps {
  filteredSales: Sale[];
  profitByDay: { x: string; y: number }[];
  revenueByCategory: [string, number][];
  exportProfitCSV: () => void;
}

export function ProfitSection({ filteredSales, profitByDay, revenueByCategory, exportProfitCSV }: ProfitSectionProps) {
  const totalRevenue = filteredSales.reduce((s, x) => s + x.totalAmount, 0);
  const totalCost = filteredSales.reduce((s, x) => s + (x.saleItems?.reduce((a, it) => a + it.quantity * (it.product?.purchasePrice || 0), 0) || 0), 0);
  const totalProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Gross Revenue" value={`KES ${formatKES(totalRevenue)}`} accent="#1a6b45" icon="💰" />
        <KPICard label="Total Cost" value={`KES ${formatKES(totalCost)}`} accent="#ef4444" icon="🏷️" />
        <KPICard label="Net Profit" value={`KES ${formatKES(totalProfit)}`} sub={totalProfit >= 0 ? 'profitable' : 'loss'} accent={totalProfit >= 0 ? '#1a6b45' : '#ef4444'} icon={totalProfit >= 0 ? '📈' : '📉'} />
        <KPICard label="Profit Margin" value={`${margin.toFixed(1)}%`} accent="#2563eb" icon="📊" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="text-sm font-semibold text-gray-800 mb-4">Profit & Loss Summary</div>
        <div className="space-y-3">
          {[
            { label: 'Gross Revenue', value: totalRevenue, sign: '+', color: 'text-gray-900' },
            { label: 'Cost of Goods Sold', value: totalCost, sign: '−', color: 'text-red-600' },
            null,
            { label: 'Gross Profit', value: totalProfit, sign: totalProfit >= 0 ? '+' : '−', color: totalProfit >= 0 ? 'text-green-700' : 'text-red-600', bold: true },
          ].map((row, i) => {
            if (!row) return <div key={i} className="border-t border-gray-200 my-2" />;
            return (
              <div key={i} className={`flex items-center justify-between py-1 ${row.bold ? 'font-bold text-base' : 'text-sm'}`}>
                <span className="text-gray-700">{row.label}</span>
                <span className={row.color}>{row.sign} KES {formatKES(Math.abs(row.value))}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 gap-4">
            <span>Margin</span>
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, margin))}%`, backgroundColor: margin >= 20 ? '#1a6b45' : margin >= 10 ? '#f59e0b' : '#ef4444' }} />
              </div>
            </div>
            <span className="font-semibold text-gray-900">{margin.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Daily profit trend">
          <LineChart data={profitByDay} color="#1a6b45" />
        </Section>
        <Section title="Revenue vs Cost by category">
          <BarChart data={revenueByCategory.slice(0, 8).map(([x, y]) => ({ x, y }))} color="#1a6b45" />
        </Section>
      </div>

      <Section title="Per-sale profit breakdown" action={<button onClick={exportProfitCSV} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-print">↓ CSV</button>}>
        <div className="space-y-3 md:hidden">
          {filteredSales.slice(0, 20).map(s => {
            const cost = s.saleItems?.reduce((a, it) => a + it.quantity * (it.product?.purchasePrice || 0), 0) || 0;
            const profit = s.totalAmount - cost;
            const mg = s.totalAmount > 0 ? (profit / s.totalAmount) * 100 : 0;
            return (
              <div key={s.id} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-gray-900">{new Date(s.saleDate).toLocaleDateString('en-KE')}</div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${mg >= 20 ? 'bg-green-100 text-green-700' : mg >= 10 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{mg.toFixed(1)}%</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>Revenue: <span className="font-semibold text-gray-900">{formatKES(s.totalAmount)}</span></div>
                  <div>Cost: <span className="font-semibold text-gray-900">{formatKES(cost)}</span></div>
                  <div>Profit: <span className={`font-semibold ${profit >= 0 ? 'text-green-700' : 'text-red-600'}`}>{formatKES(profit)}</span></div>
                  <div className="text-gray-600">&nbsp;</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Date', 'Revenue (KES)', 'Cost (KES)', 'Profit (KES)', 'Margin'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSales.slice(0, 20).map(s => {
                const cost = s.saleItems?.reduce((a, it) => a + it.quantity * (it.product?.purchasePrice || 0), 0) || 0;
                const profit = s.totalAmount - cost;
                const mg = s.totalAmount > 0 ? (profit / s.totalAmount) * 100 : 0;
                return (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/70">
                    <td className="py-2.5 px-3 text-gray-500 text-xs">{new Date(s.saleDate).toLocaleDateString('en-KE')}</td>
                    <td className="py-2.5 px-3 text-gray-900 font-medium">{formatKES(s.totalAmount)}</td>
                    <td className="py-2.5 px-3 text-red-600">{formatKES(cost)}</td>
                    <td className={`py-2.5 px-3 font-semibold ${profit >= 0 ? 'text-green-700' : 'text-red-600'}`}>{formatKES(profit)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${mg >= 20 ? 'bg-green-100 text-green-700' : mg >= 10 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{mg.toFixed(1)}%</span>
                    </td>
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
