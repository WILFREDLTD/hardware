'use client';

import { Section } from '../Section';
import { KPICard } from '../KPICard';
import { BarChart } from '../charts/BarChart';
import { DonutChart } from '../charts/DonutChart';
import { formatKES } from '@/lib/utils';
import { Sale } from '../../types';

interface SalesSectionProps {
  filteredSales: Sale[];
  salesByDay: { x: string; y: number }[];
  revenueByCategory: [string, number][];
  topProducts: [string, { qty: number; rev: number }][];
  exportSalesCSV: () => void;
}

const CATEGORY_COLORS = ['#1a6b45', '#2563eb', '#7c3aed', '#db2777', '#b45309', '#0891b2', '#16a34a'];

export function SalesSection({ filteredSales, salesByDay, revenueByCategory, topProducts, exportSalesCSV }: SalesSectionProps) {
  const totalRevenue = filteredSales.reduce((s, x) => s + x.totalAmount, 0);
  const totalOrders = filteredSales.length;
  const itemsSold = filteredSales.reduce((s, x) => s + (x.saleItems?.reduce((a, it) => a + it.quantity, 0) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Sales" value={totalOrders} sub="transactions" accent="#1a6b45" icon="🧾" />
        <KPICard label="Revenue" value={`KES ${formatKES(totalRevenue)}`} sub="gross" accent="#2563eb" icon="💰" />
        <KPICard label="Avg. Order" value={`KES ${formatKES(totalOrders ? totalRevenue / totalOrders : 0)}`} accent="#7c3aed" icon="📊" />
        <KPICard label="Items Sold" value={itemsSold} accent="#db2777" icon="📦" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Daily revenue" subtitle="Sales volume over time">
          <BarChart data={salesByDay} color="#1a6b45" />
        </Section>
        <Section title="Sales by category">
          <DonutChart slices={revenueByCategory.slice(0, 6).map(([label, value], i) => ({ label, value, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))} />
        </Section>
      </div>

      <Section title="Top 10 products by revenue" action={<button onClick={exportSalesCSV} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-print">↓ CSV</button>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {topProducts.slice(0, 10).map(([name, data]) => (
            <div key={name} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{name}</div>
                  <div className="text-xs text-gray-500 mt-1">Units sold: {data.qty}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{formatKES(data.rev)}</div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['#', 'Product', 'Units Sold', 'Revenue (KES)'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topProducts.map(([name, data], i) => (
                <tr key={name} className="border-b border-gray-50 hover:bg-gray-50/70">
                  <td className="py-2.5 px-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="py-2.5 px-3 font-medium text-gray-900">{name}</td>
                  <td className="py-2.5 px-3 text-gray-600">{data.qty}</td>
                  <td className="py-2.5 px-3 font-semibold text-gray-900">{formatKES(data.rev)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Recent transactions" action={<button onClick={exportSalesCSV} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-print">↓ CSV</button>}>
        <div className="space-y-3 md:hidden">
          {filteredSales.slice(0, 20).map(s => (
            <div key={s.id} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">{new Date(s.saleDate).toLocaleString('en-KE')}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{s.saleItems?.map(it => `${it.product?.name} ×${it.quantity}`).join(', ')}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{s.paymentStatus}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Total</span>
                <span className="text-sm font-semibold text-gray-900">{formatKES(s.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Date & Time', 'Items', 'Amount (KES)', 'Status'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSales.slice(0, 20).map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/70">
                  <td className="py-2.5 px-3 text-gray-600 text-xs">{new Date(s.saleDate).toLocaleString('en-KE')}</td>
                  <td className="py-2.5 px-3 text-gray-700 max-w-xs truncate">{s.saleItems?.map(it => `${it.product?.name} ×${it.quantity}`).join(', ')}</td>
                  <td className="py-2.5 px-3 font-semibold text-gray-900">{formatKES(s.totalAmount)}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{s.paymentStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
