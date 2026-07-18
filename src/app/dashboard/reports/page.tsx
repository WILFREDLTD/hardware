'use client';

import { useEffect, useState, useRef } from 'react';
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

  const TABS = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'sales', label: 'Sales', icon: '🧾' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'debts', label: 'Debts', icon: '💳' },
    { id: 'profit', label: 'Profit & Loss', icon: '📈' },
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
          .no-print { display: none !important; }
          #print-report { position: static !important; width: 100% !important; }

          /* Ensure table headers are visible and maintain background color when printing */
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

          /* Make sure table cells are not overlapped and keep normal sizing */
          table { width: 100% !important; border-collapse: separate !important; }
          th, td { background: transparent !important; }
        }
      `}</style>

      <div id="print-report" className="space-y-6 w-full max-w-none">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 no-print">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Business insights across all dimensions</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {(['7d', '30d', '90d', 'all'] as const).map(r => (
                <button key={r} onClick={() => setDateRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dateRange === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {r === 'all' ? 'All time' : r === '7d' ? '7 days' : r === '30d' ? '30 days' : '90 days'}
                </button>
              ))}
            </div>
            <div className="relative" ref={pdfDropdownRef}>
              <button
                onClick={() => setShowPDFDropdown(!showPDFDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: '#1a6b45' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                Export PDF ▾
              </button>
              {showPDFDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20 w-44">
                  {PDF_SECTION_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleExportPDF(option.value)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" ref={csvDropdownRef}>
              <button 
                onClick={() => setShowCSVDropdown(!showCSVDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-gray-300 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export CSV ▾
              </button>
              {showCSVDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20 w-44">
                {[
                  { label: 'Sales CSV', fn: exportSalesCSV },
                  { label: 'Inventory CSV', fn: exportInventoryCSV },
                  { label: 'Debts CSV', fn: exportDebtsCSV },
                  { label: 'Profit & Loss CSV', fn: exportProfitCSV },
                ].map(e => (
                  <button key={e.label} onClick={() => { e.fn(); setShowCSVDropdown(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    {e.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-gray-100 rounded-xl p-1 no-print">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
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