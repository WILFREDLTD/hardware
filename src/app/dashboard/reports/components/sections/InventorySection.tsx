'use client';

import { Section } from '../Section';
import { KPICard } from '../KPICard';
import { BarChart } from '../charts/BarChart';
import { DonutChart } from '../charts/DonutChart';
import { formatKES } from '@/lib/utils';
import { Product } from '../../types';

interface InventorySectionProps {
  products: Product[];
  exportInventoryCSV: () => void;
}

export function InventorySection({ products, exportInventoryCSV }: InventorySectionProps) {
  const outOfStock = products.filter(p => p.currentStock === 0).length;
  const lowStock = products.filter(p => p.currentStock > 0 && p.currentStock <= p.minStockLevel).length;
  const healthy = products.length - outOfStock - lowStock;

  const stockByCategory = (() => {
    const map: Record<string, number> = {};
    products.forEach(p => { map[p.category] = (map[p.category] || 0) + p.currentStock; });
    return Object.entries(map).map(([x, y]) => ({ x, y }));
  })();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Products" value={products.length} accent="#1a6b45" icon="📦" />
        <KPICard label="Stock Value" value={`KES ${formatKES(products.reduce((s, p) => s + p.currentStock * p.purchasePrice, 0))}`} sub="at cost" accent="#2563eb" icon="💰" />
        <KPICard label="Low Stock" value={lowStock} sub="items" accent="#f59e0b" icon="⚠️" />
        <KPICard label="Out of Stock" value={outOfStock} sub="need reorder" accent="#ef4444" icon="🔴" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Stock health">
          <DonutChart slices={[
            { label: 'In Stock', value: healthy, color: '#1a6b45' },
            { label: 'Low Stock', value: lowStock, color: '#f59e0b' },
            { label: 'Out of Stock', value: outOfStock, color: '#ef4444' },
          ]} />
        </Section>
        <Section title="Stock by category">
          <BarChart data={stockByCategory} color="#2563eb" />
        </Section>
      </div>

      <Section title="Full inventory" action={<button onClick={exportInventoryCSV} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-print">↓ CSV</button>}>
        <div className="space-y-3 md:hidden">
          {products.map(p => {
            const st = p.currentStock === 0 ? { text: 'Out', cls: 'bg-red-100 text-red-700' } : p.currentStock <= p.minStockLevel ? { text: 'Low', cls: 'bg-amber-100 text-amber-700' } : { text: 'OK', cls: 'bg-green-100 text-green-700' };
            return (
              <div key={p.id} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-gray-900">{p.name}</div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${st.cls}`}>{st.text}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="col-span-2">Nickname: <span className="font-medium text-gray-900">{p.nickname || p.name}</span></div>
                  <div className="col-span-2">Category: <span className="font-medium text-gray-900">{p.category}</span></div>
                  <div>Stock: <span className="font-medium text-gray-900">{p.currentStock}</span></div>
                  <div>Min Level: <span className="font-medium text-gray-900">{p.minStockLevel}</span></div>
                  <div className="col-span-2">Unit Price: <span className="font-medium text-gray-900">KES {formatKES(p.unitPrice)}</span></div>
                  <div className="col-span-2">Stock Value: <span className="font-medium text-gray-900">KES {formatKES(p.currentStock * p.purchasePrice)}</span></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Product', 'Nickname', 'Category', 'Stock', 'Min', 'Unit Price', 'Stock Value', 'Status'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const st = p.currentStock === 0 ? { text: 'Out', cls: 'bg-red-100 text-red-700' } : p.currentStock <= p.minStockLevel ? { text: 'Low', cls: 'bg-amber-100 text-amber-700' } : { text: 'OK', cls: 'bg-green-100 text-green-700' };
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/70">
                    <td className="py-2.5 px-3 font-medium text-gray-900">{p.name}</td>
                    <td className="py-2.5 px-3 text-gray-400 font-mono text-xs">{p.nickname || p.name}</td>
                    <td className="py-2.5 px-3 text-gray-600">{p.category}</td>
                    <td className="py-2.5 px-3 font-bold text-gray-900">{p.currentStock}</td>
                    <td className="py-2.5 px-3 text-gray-400">{p.minStockLevel}</td>
                    <td className="py-2.5 px-3 text-gray-700">KES {formatKES(p.unitPrice)}</td>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">KES {formatKES(p.currentStock * p.purchasePrice)}</td>
                    <td className="py-2.5 px-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.cls}`}>{st.text}</span></td>
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
