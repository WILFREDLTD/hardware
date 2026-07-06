'use client';

import React, { useEffect, useState, useRef } from 'react';
import { formatKES } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  totalRevenue: number;
  itemsSold: number;
  totalDebts: number;
  debtsPending: number;
  debtsCollected: number;
  profit: number;
  lowStockItems: number;
}
interface Sale {
  id: string;
  saleDate: string;
  totalAmount: number;
  paymentStatus: string;
  saleItems: { quantity: number; unitPrice: number; total?: number; discount?: number; product: { name: string; category: string; purchasePrice: number } }[];
}
interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minStockLevel: number;
  unitPrice: number;
  purchasePrice: number;
}
interface Debt {
  id: string;
  debtorName: string;
  amount: number;
  amountPaid: number;
  status: string;
  date: string;
}

// ─── Tiny bar chart (SVG) ────────────────────────────────────────────────────
function BarChart({ data, color = '#1a6b45' }: { data: { x: string; y: number }[]; color?: string; label?: string }) {
  if (!data.length) return <div className="text-sm text-gray-400 text-center py-8">No data</div>;
  const max = Math.max(...data.map(d => d.y), 1);
  const H = 140, W = 560, PAD = 40, BAR_W = Math.min(40, (W - PAD * 2) / data.length - 8);
  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full" style={{ maxHeight: 180 }}>
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = PAD + (1 - t) * (H - PAD);
        return (
          <g key={t}>
            <line x1={PAD} y1={y} x2={W - 10} y2={y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={PAD - 6} y={y + 4} fontSize="9" fill="#9ca3af" textAnchor="end">{Math.round(max * t)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = PAD + (i + 0.5) * ((W - PAD * 2) / data.length);
        const barH = Math.max(2, ((d.y / max) * (H - PAD)));
        const y = H - barH;
        return (
          <g key={i}>
            <rect x={x - BAR_W / 2} y={y} width={BAR_W} height={barH} rx="3" fill={color} opacity="0.85" />
            <text x={x} y={H + 16} fontSize="9" fill="#6b7280" textAnchor="middle">{d.x}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Tiny line chart (SVG) ───────────────────────────────────────────────────
function LineChart({ data, color = '#1a6b45' }: { data: { x: string; y: number }[]; color?: string }) {
  if (data.length < 2) return <div className="text-sm text-gray-400 text-center py-8">Not enough data</div>;
  const max = Math.max(...data.map(d => d.y), 1);
  const H = 120, W = 560, PAD = 36;
  const pts = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - d.y / max) * (H - PAD);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" style={{ maxHeight: 160 }}>
      {[0, 0.5, 1].map(t => {
        const y = PAD + (1 - t) * (H - PAD);
        return <line key={t} x1={PAD} y1={y} x2={W - 10} y2={y} stroke="#f3f4f6" strokeWidth="1" />;
      })}
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts.join(' ')} />
      {data.map((d, i) => {
        const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
        const y = PAD + (1 - d.y / max) * (H - PAD);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3.5" fill={color} />
            <text x={x} y={H + 16} fontSize="9" fill="#6b7280" textAnchor="middle">{d.x}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Donut chart ─────────────────────────────────────────────────────────────
function DonutChart({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  if (!total) return <div className="text-sm text-gray-400 text-center py-8">No data</div>;
  let angle = -Math.PI / 2;
  const R = 60, r = 36, cx = 80, cy = 80;
  const paths = slices.map(sl => {
    const sweep = (sl.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle), y2 = cy + R * Math.sin(angle);
    const xi1 = cx + r * Math.cos(angle - sweep), yi1 = cy + r * Math.sin(angle - sweep);
    const xi2 = cx + r * Math.cos(angle), yi2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return { path: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${r} ${r} 0 ${large} 0 ${xi1} ${yi1} Z`, color: sl.color, label: sl.label, value: sl.value };
  });
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="flex-shrink-0" style={{ width: 130 }}>
        {paths.map((p, i) => <path key={i} d={p.path} fill={p.color} stroke="white" strokeWidth="2" />)}
        <text x={cx} y={cy + 5} fontSize="12" fontWeight="600" fill="#374151" textAnchor="middle">{formatKES(total)}</text>
      </svg>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {slices.map(sl => (
          <div key={sl.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: sl.color }} />
            <span className="text-xs text-gray-600 flex-1 truncate">{sl.label}</span>
            <span className="text-xs font-semibold text-gray-900">{((sl.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KPICard({ label, value, sub, accent, icon }: { label: string; value: string | number; sub?: string; accent: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ backgroundColor: accent }} />
      <div className="pl-2">
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</div>
        <div className="text-2xl font-bold text-gray-900">{icon} {value}</div>
        {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-gray-800">{title}</div>
          {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Export helpers ──────────────────────────────────────────────────────────
function downloadCSV(rows: string[][], filename: string) {
  const content = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([content], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'inventory' | 'debts' | 'profit'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/reports/stats').then(r => r.json()),
      fetch('/api/sales').then(r => r.json()),
      fetch('/api/inventory').then(r => r.json()),
      fetch('/api/debts').then(r => r.json()),
    ]).then(([s, sa, p, d]) => {
      setStats(s);
      setSales(Array.isArray(sa) ? sa : []);
      setProducts(Array.isArray(p) ? p : []);
      setDebts(Array.isArray(d) ? d : []);
    }).finally(() => setLoading(false));
  }, []);

  // ── Date filtering ──
  const filteredSales = sales.filter(s => {
    if (dateRange === 'all') return true;
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    return new Date(s.saleDate) >= new Date(Date.now() - days * 86400000);
  });

  // ── Sales by day ──
  const salesByDay = (() => {
    const map: Record<string, number> = {};
    filteredSales.forEach(s => {
      const day = new Date(s.saleDate).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
      map[day] = (map[day] || 0) + s.totalAmount;
    });
    return Object.entries(map).slice(-14).map(([x, y]) => ({ x, y }));
  })();

  // ── Revenue by category ──
  const revenueByCategory = (() => {
    const map: Record<string, number> = {};
    filteredSales.forEach(s => s.saleItems?.forEach(it => {
      const cat = it.product?.category || 'Other';
      const lineTotal = it.total ?? it.quantity * it.unitPrice;
      map[cat] = (map[cat] || 0) + lineTotal;
    }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  })();

  // ── Top products ──
  const topProducts = (() => {
    const map: Record<string, { qty: number; rev: number }> = {};
    filteredSales.forEach(s => s.saleItems?.forEach(it => {
      const n = it.product?.name || 'Unknown';
      if (!map[n]) map[n] = { qty: 0, rev: 0 };
      map[n].qty += it.quantity;
      map[n].rev += it.total ?? it.quantity * it.unitPrice;
    }));
    return Object.entries(map).sort((a, b) => b[1].rev - a[1].rev).slice(0, 10);
  })();

  // ── Profit over time ──
  const profitByDay = (() => {
    const map: Record<string, { rev: number; cost: number }> = {};
    filteredSales.forEach(s => {
      const day = new Date(s.saleDate).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
      if (!map[day]) map[day] = { rev: 0, cost: 0 };
      map[day].rev += s.totalAmount;
      s.saleItems?.forEach(it => { map[day].cost += it.quantity * (it.product?.purchasePrice || 0); });
    });
    return Object.entries(map).slice(-14).map(([x, v]) => ({ x, y: Math.max(0, v.rev - v.cost) }));
  })();

  // ── Stock health ──
  const outOfStock = products.filter(p => p.currentStock === 0).length;
  const lowStock = products.filter(p => p.currentStock > 0 && p.currentStock <= p.minStockLevel).length;
  const healthy = products.length - outOfStock - lowStock;

  // ── Debt breakdown ──
  const pendingDebts = debts.filter(d => d.status !== 'PAID');
  const paidDebts = debts.filter(d => d.status === 'PAID');
  const partialDebts = debts.filter(d => d.status === 'PARTIAL');

  // ── Totals ──
  const totalRevenue = filteredSales.reduce((s, x) => s + x.totalAmount, 0);
  const totalCost = filteredSales.reduce((s, x) => s + (x.saleItems?.reduce((a, it) => a + it.quantity * (it.product?.purchasePrice || 0), 0) || 0), 0);
  const totalProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // ─── PDF export ───────────────────────────────────────────────────────────
  function handlePrintPDF() {
    window.print();
  }

  // ─── CSV exports ──────────────────────────────────────────────────────────
  function exportSalesCSV() {
    const rows = [['Date', 'Items', 'Total (KES)', 'Payment Status']];
    filteredSales.forEach(s => rows.push([
      new Date(s.saleDate).toLocaleString(),
      s.saleItems?.map(it => `${it.product?.name} x${it.quantity}`).join('; ') || '',
      s.totalAmount.toFixed(2),
      s.paymentStatus,
    ]));
    downloadCSV(rows, 'sales-report.csv');
  }

  function exportInventoryCSV() {
    const rows = [['Name', 'SKU', 'Category', 'Current Stock', 'Min Level', 'Unit Price (KES)', 'Purchase Price (KES)', 'Status']];
    products.forEach(p => rows.push([
      p.name, p.sku, p.category,
      String(p.currentStock), String(p.minStockLevel),
      p.unitPrice.toFixed(2), p.purchasePrice.toFixed(2),
      p.currentStock === 0 ? 'Out of Stock' : p.currentStock <= p.minStockLevel ? 'Low Stock' : 'In Stock',
    ]));
    downloadCSV(rows, 'inventory-report.csv');
  }

  function exportDebtsCSV() {
    const rows = [['Debtor', 'Total (KES)', 'Paid (KES)', 'Remaining (KES)', 'Status']];
    debts.forEach(d => rows.push([
      d.debtorName,
      d.amount.toFixed(2),
      d.amountPaid.toFixed(2),
      (d.amount - d.amountPaid).toFixed(2),
      d.status,
    ]));
    downloadCSV(rows, 'debts-report.csv');
  }

  function exportProfitCSV() {
    const rows = [['Date', 'Revenue (KES)', 'Cost (KES)', 'Profit (KES)', 'Margin %']];
    filteredSales.forEach(s => {
      const cost = s.saleItems?.reduce((a, it) => a + it.quantity * (it.product?.purchasePrice || 0), 0) || 0;
      const profit = s.totalAmount - cost;
      rows.push([
        new Date(s.saleDate).toLocaleDateString(),
        s.totalAmount.toFixed(2),
        cost.toFixed(2),
        profit.toFixed(2),
        s.totalAmount > 0 ? ((profit / s.totalAmount) * 100).toFixed(1) : '0',
      ]);
    });
    downloadCSV(rows, 'profit-report.csv');
  }

  const TABS = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'sales', label: 'Sales', icon: '🧾' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'debts', label: 'Debts', icon: '💳' },
    { id: 'profit', label: 'Profit & Loss', icon: '📈' },
  ] as const;

  const CATEGORY_COLORS = ['#1a6b45', '#2563eb', '#7c3aed', '#db2777', '#b45309', '#0891b2', '#16a34a'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading reports…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Print styles ── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-report, #print-report * { visibility: visible !important; }
          #print-report { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 no-print">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Business insights across all dimensions</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date range */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {(['7d', '30d', '90d', 'all'] as const).map(r => (
                <button key={r} onClick={() => setDateRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dateRange === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {r === 'all' ? 'All time' : r === '7d' ? '7 days' : r === '30d' ? '30 days' : '90 days'}
                </button>
              ))}
            </div>
            {/* Export buttons */}
            <button onClick={handlePrintPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#1a6b45' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
              Export PDF
            </button>
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-gray-300 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export CSV ▾
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20 hidden group-hover:block w-44">
                {[
                  { label: 'Sales CSV', fn: exportSalesCSV },
                  { label: 'Inventory CSV', fn: exportInventoryCSV },
                  { label: 'Debts CSV', fn: exportDebtsCSV },
                  { label: 'Profit & Loss CSV', fn: exportProfitCSV },
                ].map(e => (
                  <button key={e.label} onClick={e.fn} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit no-print">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* ── Printable report area ── */}
        <div id="print-report" ref={printRef}>
          {/* Print header */}
          <div className="hidden print:block mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Business Report — {new Date().toLocaleDateString('en-KE', { dateStyle: 'long' })}</h1>
            <p className="text-sm text-gray-500">Period: {dateRange === 'all' ? 'All time' : `Last ${dateRange}`}</p>
          </div>

          {/* ═══ OVERVIEW ════════════════════════════════════════════════════ */}
          {(activeTab === 'overview') && (
            <div className="space-y-6">
              {/* KPI row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard label="Revenue" value={`KES ${formatKES(totalRevenue)}`} sub={`${filteredSales.length} sales`} accent="#1a6b45" icon="💰" />
                <KPICard label="Net Profit" value={`KES ${formatKES(totalProfit)}`} sub={`${margin.toFixed(1)}% margin`} accent="#2563eb" icon="📈" />
                <KPICard label="Pending Debts" value={`KES ${formatKES(stats?.debtsPending || 0)}`} sub={`${pendingDebts.length} accounts`} accent="#ef4444" icon="💳" />
                <KPICard label="Low/Out Stock" value={lowStock + outOfStock} sub={`${outOfStock} out of stock`} accent="#f59e0b" icon="⚠️" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Section title="Revenue trend" subtitle="Daily sales revenue">
                  <LineChart data={salesByDay} color="#1a6b45" />
                </Section>
                <Section title="Revenue by category">
                  <DonutChart slices={revenueByCategory.slice(0, 7).map((([label, value], i) => ({ label, value, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] })))} />
                </Section>
              </div>

              <Section title="Top selling products" subtitle="By revenue in selected period">
                <div className="space-y-2">
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
          )}

          {/* ═══ SALES ═══════════════════════════════════════════════════════ */}
          {(activeTab === 'sales') && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard label="Total Sales" value={filteredSales.length} sub="transactions" accent="#1a6b45" icon="🧾" />
                <KPICard label="Revenue" value={`KES ${formatKES(totalRevenue)}`} sub="gross" accent="#2563eb" icon="💰" />
                <KPICard label="Avg. Order" value={`KES ${formatKES(filteredSales.length ? totalRevenue / filteredSales.length : 0)}`} accent="#7c3aed" icon="📊" />
                <KPICard label="Items Sold" value={filteredSales.reduce((s, x) => s + (x.saleItems?.reduce((a, it) => a + it.quantity, 0) || 0), 0)} accent="#db2777" icon="📦" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Section title="Daily revenue" subtitle="Sales volume over time">
                  <BarChart data={salesByDay} color="#1a6b45" />
                </Section>
                <Section title="Sales by category">
                  <DonutChart slices={revenueByCategory.slice(0, 6).map(([label, value], i) => ({ label, value, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))} />
                </Section>
              </div>

              <Section title="Top 10 products by revenue"
                action={<button onClick={exportSalesCSV} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-print">↓ CSV</button>}>
                <div className="overflow-x-auto">
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

              <Section title="Recent transactions"
                action={<button onClick={exportSalesCSV} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-print">↓ CSV</button>}>
                <div className="overflow-x-auto">
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
          )}

          {/* ═══ INVENTORY ═══════════════════════════════════════════════════ */}
          {(activeTab === 'inventory') && (
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
                  <BarChart data={(() => {
                    const m: Record<string, number> = {};
                    products.forEach(p => { m[p.category] = (m[p.category] || 0) + p.currentStock; });
                    return Object.entries(m).map(([x, y]) => ({ x, y }));
                  })()} color="#2563eb" />
                </Section>
              </div>

              <Section title="Full inventory"
                action={<button onClick={exportInventoryCSV} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-print">↓ CSV</button>}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Product', 'SKU', 'Category', 'Stock', 'Min', 'Unit Price', 'Stock Value', 'Status'].map(h => (
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
                            <td className="py-2.5 px-3 text-gray-400 font-mono text-xs">{p.sku}</td>
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
          )}

          {/* ═══ DEBTS ════════════════════════════════════════════════════════ */}
          {(activeTab === 'debts') && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard label="Total Issued" value={`KES ${formatKES(debts.reduce((s, d) => s + d.amount, 0))}`} sub={`${debts.length} accounts`} accent="#ef4444" icon="💳" />
                <KPICard label="Collected" value={`KES ${formatKES(debts.reduce((s, d) => s + d.amountPaid, 0))}`} accent="#1a6b45" icon="✅" />
                <KPICard label="Outstanding" value={`KES ${formatKES(debts.reduce((s, d) => s + (d.amount - d.amountPaid), 0))}`} sub={`${pendingDebts.length} open`} accent="#f59e0b" icon="⏳" />
                <KPICard label="Collection Rate" value={`${debts.reduce((s, d) => s + d.amount, 0) > 0 ? ((debts.reduce((s, d) => s + d.amountPaid, 0) / debts.reduce((s, d) => s + d.amount, 0)) * 100).toFixed(1) : 0}%`} accent="#2563eb" icon="📊" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Section title="Debt status breakdown">
                  <DonutChart slices={[
                    { label: 'Paid', value: paidDebts.length, color: '#1a6b45' },
                    { label: 'Partial', value: partialDebts.length, color: '#f59e0b' },
                    { label: 'Pending', value: debts.filter(d => d.status === 'PENDING').length, color: '#ef4444' },
                  ]} />
                </Section>
                <Section title="Top outstanding debts">
                  <div className="space-y-3">
                    {debts.filter(d => d.status !== 'PAID').sort((a, b) => (b.amount - b.amountPaid) - (a.amount - a.amountPaid)).slice(0, 6).map(d => (
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
                </Section>
              </div>

              <Section title="All debt accounts"
                action={<button onClick={exportDebtsCSV} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-print">↓ CSV</button>}>
                <div className="overflow-x-auto">
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
          )}

          {/* ═══ PROFIT & LOSS ═══════════════════════════════════════════════ */}
          {(activeTab === 'profit') && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard label="Gross Revenue" value={`KES ${formatKES(totalRevenue)}`} accent="#1a6b45" icon="💰" />
                <KPICard label="Total Cost" value={`KES ${formatKES(totalCost)}`} accent="#ef4444" icon="🏷️" />
                <KPICard label="Net Profit" value={`KES ${formatKES(totalProfit)}`} sub={totalProfit >= 0 ? 'profitable' : 'loss'} accent={totalProfit >= 0 ? '#1a6b45' : '#ef4444'} icon={totalProfit >= 0 ? '📈' : '📉'} />
                <KPICard label="Profit Margin" value={`${margin.toFixed(1)}%`} accent="#2563eb" icon="📊" />
              </div>

              {/* P&L summary card */}
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
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Margin</span>
                    <div className="flex items-center gap-3 flex-1 mx-4">
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
                  <BarChart
                    data={revenueByCategory.slice(0, 8).map(([x, y]) => ({ x, y }))}
                    color="#1a6b45"
                  />
                </Section>
              </div>

              <Section title="Per-sale profit breakdown"
                action={<button onClick={exportProfitCSV} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors no-print">↓ CSV</button>}>
                <div className="overflow-x-auto">
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
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${mg >= 20 ? 'bg-green-100 text-green-700' : mg >= 10 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                {mg.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Section>
            </div>
          )}
        </div>
      </div>
    </>
  );
}