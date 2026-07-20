'use client';

import { useEffect, useState, useRef } from 'react';
import {
  BarChart3,
  Receipt,
  Package,
  CreditCard,
  TrendingUp,
  Download,
  FileSpreadsheet,
  ChevronDown,
} from 'lucide-react';
import { exportReportToPdf } from '../../../../actions/reports/pdf';
import type { ReportSectionKey } from '../../../../actions/reports/types';
import { OverviewSection } from './components/sections/OverviewSection';
import { SalesSection } from './components/sections/SalesSection';
import { InventorySection } from './components/sections/InventorySection';
import { DebtsSection } from './components/sections/DebtsSection';
import { ProfitSection } from './components/sections/ProfitSection';
import { Stats, Sale, Product, Debt } from './types';

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
  const [profile, setProfile] = useState<{ firstName?: string; lastName?: string; email?: string; storeName?: string; storeLocation?: string; storeDescription?: string; } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'inventory' | 'debts' | 'profit'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [showCSVDropdown, setShowCSVDropdown] = useState(false);
  const [showPDFDropdown, setShowPDFDropdown] = useState(false);
  const csvDropdownRef = useRef<HTMLDivElement>(null);
  const pdfDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/reports/stats').then(r => r.json()),
      fetch('/api/sales').then(r => r.json()),
      fetch('/api/inventory').then(r => r.json()),
      fetch('/api/debts').then(r => r.json()),
      fetch('/api/user/profile').then(r => r.json()),
    ]).then(([s, sa, p, d, u]) => {
      setStats(s);
      setSales(Array.isArray(sa) ? sa : []);
      setProducts(Array.isArray(p) ? p : []);
      setDebts(Array.isArray(d) ? d : []);
      setProfile(u && !u.error ? u : null);
    }).finally(() => setLoading(false));
  }, []);

  // ── Close dropdowns when clicking outside ──
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (csvDropdownRef.current && !csvDropdownRef.current.contains(event.target as Node)) {
        setShowCSVDropdown(false);
      }
      if (pdfDropdownRef.current && !pdfDropdownRef.current.contains(event.target as Node)) {
        setShowPDFDropdown(false);
      }
    };

    if (showCSVDropdown || showPDFDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCSVDropdown, showPDFDropdown]);

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

  // ── Debt breakdown ──
  const pendingDebts = debts.filter(d => d.status !== 'PAID');

  // ─── PDF export ───────────────────────────────────────────────────────────
  function handleExportPDF(section: ReportSectionKey) {
    exportReportToPdf(section, {
      section,
      title: 'Reports & Analytics',
      generatedAt: new Date().toLocaleString(),
      userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.email : undefined,
      storeName: profile?.storeName,
      storeLocation: profile?.storeLocation,
      storeDescription: profile?.storeDescription,
      dateRange: dateRange === 'all' ? 'All time' : dateRange === '7d' ? 'Last 7 days' : dateRange === '30d' ? 'Last 30 days' : 'Last 90 days',
      stats: stats ?? {},
      filteredSales,
      salesByDay,
      revenueByCategory,
      topProducts,
      lowStock,
      outOfStock,
      pendingDebtsCount: pendingDebts.length,
      products,
      debts,
      profitByDay,
    });
    setShowPDFDropdown(false);
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
    const rows = [['Name', 'Nickname', 'Category', 'Current Stock', 'Min Level', 'Unit Price (KES)', 'Purchase Price (KES)', 'Status']];
    products.forEach(p => rows.push([
      p.name, p.nickname || p.name, p.category,
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

  // ── Tabs: restrained brand palette — emerald is the only "active" color,
  //    amber is reserved for Debts (the one item that genuinely carries a
  //    warning connotation), everything else is neutral until selected. ──
  const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart3, accent: 'neutral' as const },
    { id: 'sales', label: 'Sales', icon: Receipt, accent: 'neutral' as const },
    { id: 'inventory', label: 'Inventory', icon: Package, accent: 'neutral' as const },
    { id: 'debts', label: 'Debts', icon: CreditCard, accent: 'amber' as const },
    { id: 'profit', label: 'Profit & loss', icon: TrendingUp, accent: 'neutral' as const },
  ] as const;

  const PDF_SECTION_OPTIONS: Array<{ label: string; value: ReportSectionKey }> = [
    { label: 'Overview', value: 'overview' },
    { label: 'Sales', value: 'sales' },
    { label: 'Inventory', value: 'inventory' },
    { label: 'Debts', value: 'debts' },
    { label: 'Profit & Loss', value: 'profit' },
    { label: 'All sections', value: 'all' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
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
          .no-print { display: none !important; }
          #print-report { position: static !important; width: 100% !important; }
          thead, thead tr { display: table-row-group !important; }
          thead th {
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color: #334155 !important;
            font-weight: 600 !important;
            padding-top: 6px !important;
            padding-bottom: 6px !important;
          }
          table { width: 100% !important; border-collapse: separate !important; }
          th, td { background: transparent !important; }
        }
      `}</style>

      <div id="print-report" className="space-y-6 w-full max-w-none">
        {/* Header */}
        <div className="space-y-4 no-print">
          <div className="rounded-3xl bg-white text-slate-900 p-5 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,.06)] border border-slate-100">

            {/* Title + controls row */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="grid gap-1">
                <h1 className="text-[clamp(0.95rem,5vw,1.75rem)] md:text-[28px] font-semibold text-slate-950 tracking-tight whitespace-nowrap overflow-hidden">
                  Reports &amp; analytics
                </h1>
                <p className="text-xs md:text-sm text-slate-500">Business insights across all dimensions</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-[minmax(180px,1fr)_minmax(220px,1fr)] md:flex md:items-center md:gap-2.5">
                {/* Date range */}
                <div>
                  <label className="block text-xs font-medium text-slate-500">Filter by time</label>
                  <select
                    value={dateRange}
                    onChange={e => setDateRange(e.target.value as typeof dateRange)}
                    className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="7d">7 days</option>
                    <option value="30d">30 days</option>
                    <option value="90d">90 days</option>
                    <option value="all">All time</option>
                  </select>
                </div>

                {/* Export controls */}
                <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowPDFDropdown(!showPDFDropdown)}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 active:scale-[0.98] whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" strokeWidth={2} />
                      Export
                      <ChevronDown className="w-3 h-3" strokeWidth={2} />
                    </button>
                    {showPDFDropdown && (
                      <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20 w-44">
                        {PDF_SECTION_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            onClick={() => handleExportPDF(option.value)}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setShowCSVDropdown(!showCSVDropdown)}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 active:scale-[0.98] whitespace-nowrap"
                    >
                      <FileSpreadsheet className="w-4 h-4" strokeWidth={2} />
                      CSV
                      <ChevronDown className="w-3 h-3" strokeWidth={2} />
                    </button>
                    {showCSVDropdown && (
                      <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20 w-44">
                        {[
                          { label: 'Sales CSV', fn: exportSalesCSV },
                          { label: 'Inventory CSV', fn: exportInventoryCSV },
                          { label: 'Debts CSV', fn: exportDebtsCSV },
                          { label: 'Profit & Loss CSV', fn: exportProfitCSV },
                        ].map(e => (
                          <button
                            key={e.label}
                            onClick={() => { e.fn(); setShowCSVDropdown(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                          >
                            {e.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs — divider separates them from the header controls above,
               so the whole card reads as one cohesive unit instead of two
               stacked components. */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              {/* Mobile: 2-column grid, last tab spans full width. Desktop: single row. */}
              <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
                {TABS.map((t, index) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  const isAmber = t.accent === 'amber';
                  const isLast = index === TABS.length - 1;

                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[11px] md:text-sm font-medium transition-colors md:flex-1 ${
                        isLast ? 'col-span-2 md:col-span-1' : 'col-span-1'
                      } ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : isAmber
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                      <span className="truncate">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Screen report content ── */}
          <div className="w-full max-w-none">
            {(activeTab === 'overview') && (
              <OverviewSection
                stats={stats}
                filteredSales={filteredSales}
                salesByDay={salesByDay}
                revenueByCategory={revenueByCategory}
                topProducts={topProducts}
                lowStock={lowStock}
                outOfStock={outOfStock}
                pendingDebtsCount={pendingDebts.length}
              />
            )}

            {(activeTab === 'sales') && (
              <SalesSection
                filteredSales={filteredSales}
                salesByDay={salesByDay}
                revenueByCategory={revenueByCategory}
                topProducts={topProducts}
                exportSalesCSV={exportSalesCSV}
              />
            )}

            {(activeTab === 'inventory') && (
              <InventorySection
                products={products}
                exportInventoryCSV={exportInventoryCSV}
              />
            )}

            {(activeTab === 'debts') && (
              <DebtsSection debts={debts} exportDebtsCSV={exportDebtsCSV} />
            )}

            {(activeTab === 'profit') && (
              <ProfitSection
                filteredSales={filteredSales}
                profitByDay={profitByDay}
                revenueByCategory={revenueByCategory}
                exportProfitCSV={exportProfitCSV}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}