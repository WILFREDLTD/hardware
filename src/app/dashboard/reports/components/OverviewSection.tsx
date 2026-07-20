'use client';

import { LineChart } from './charts/LineChart';
import { DonutChart } from './charts/DonutChart';
import { Section } from './Section';
import { KPICard } from './KPICard';
import { Sale, Stats } from '../types';
import { formatKES } from '@/lib/utils';

interface OverviewSectionProps {
  stats: Stats | null;
  filteredSales: Sale[];
  salesByDay: { x: string; y: number }[];
  revenueByCategory: [string, number][];
  topProducts: [string, { qty: number; rev: number }][];
}

const CATEGORY_COLORS = ['#1a6b45', '#2563eb', '#7c3aed', '#db2777', '#b45309', '#0891b2', '#16a34a'];

export function OverviewSection({ stats, filteredSales, salesByDay, revenueByCategory, topProducts }: OverviewSectionProps) {
  const totalRevenue = filteredSales.reduce((s, x) => s + x.totalAmount, 0);
  const totalProfit = totalRevenue - filteredSales.reduce((s, x) => s + (x.saleItems?.reduce((a, it) => a + it.quantity * (it.product?.purchasePrice || 0), 0) || 0), 0);
  const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const lowStock = 0;
  const outOfStock = 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Revenue" value={`KES ${formatKES(totalRevenue)}`} sub={`${filteredSales.length} sales`} accent="#1a6b45" icon="💰" />
        <KPICard label="Net Profit" value={`KES ${formatKES(totalProfit)}`} sub={`${margin.toFixed(1)}% margin`} accent="#2563eb" icon="📈" />
        <KPICard label="Pending Debts" value={`KES ${formatKES(stats?.debtsPending || 0)}`} sub={`${0} accounts`} accent="#ef4444" icon="💳" />
        <KPICard label="Low/Out Stock" value={lowStock + outOfStock} sub={`${outOfStock} out of stock`} accent="#f59e0b" icon="⚠️" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Section title="Revenue trend" subtitle="Daily sales revenue">
          <LineChart data={salesByDay} color="#1a6b45" />
        </Section>
        <Section title="Revenue by category">
          <DonutChart slices={revenueByCategory.slice(0, 7).map(([label, value], i) => ({ label, value, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))} />
        </Section>
      </div>

      <Section title="Top selling products" subtitle="By revenue in selected period">
        <div className="space-y-3 md:hidden">
          {topProducts.slice(0, 5).map(([name, data]) => (
            <div key={name} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-gray-800 truncate">{name}</div>
                <div className="text-sm font-semibold text-gray-900">KES {formatKES(data.rev)}</div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{data.qty} sold</span>
                <span className="font-semibold text-gray-700">{Math.round((data.rev / (topProducts[0]?.[1].rev || 1)) * 100)}%</span>
              </div>
              <div className="mt-2 h-2 bg-white rounded-full overflow-hidden border border-gray-200">
                <div className="h-full rounded-full bg-green-500" style={{ width: `${(data.rev / (topProducts[0]?.[1].rev || 1)) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:block space-y-2">
          {topProducts.slice(0, 5).map(([name, data], i) => (
            <div key={name} className="flex items-center gap-4">
              <div className="w-5 text-xs font-bold text-gray-400 text-right">{i + 1}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-800">{name}</span>
                  <span className="text-sm font-bold text-gray-900">KES {formatKES(data.rev)}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(data.rev / (topProducts[0]?.[1].rev || 1)) * 100}%`, backgroundColor: CATEGORY_COLORS[i] }} />
                </div>
              </div>
              <div className="text-xs text-gray-400 w-14 text-right">{data.qty} sold</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
