import { jsPDF } from 'jspdf';
import type { ReportExportPayload, ReportSectionKey } from './types';

function safeText(value: unknown) {
  return String(value ?? '—');
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat('en-KE', {
    maximumFractionDigits: digits,
  }).format(value);
}

function renderFileName(section: ReportSectionKey) {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  return `report-${section}-${date}.pdf`;
}

const SECTION_LABELS: Record<ReportSectionKey, string> = {
  overview: 'Overview',
  sales: 'Sales',
  inventory: 'Inventory',
  debts: 'Debts',
  profit: 'Profit & Loss',
  all: 'All sections',
};

function ensurePage(doc: jsPDF, y: number, margin = 20) {
  if (y > 270) {
    doc.addPage();
    return margin;
  }
  return y;
}

function drawHeader(doc: jsPDF, payload: ReportExportPayload) {
  let y = 20;
  doc.setFontSize(22);
  doc.text(payload.title ?? 'Business report', 14, y);

  y += 10;
  doc.setFontSize(10);
  doc.setTextColor('#475569');
  doc.text(`Section: ${SECTION_LABELS[payload.section]}`, 14, y);
  doc.text(`Date range: ${safeText(payload.dateRange ?? 'All time')}`, 14, y + 5);
  doc.text(`Exported by: ${safeText(payload.userName ?? 'Unknown')}`, 14, y + 10);

  const rightX = 120;
  doc.text(`Store: ${safeText(payload.storeName ?? 'Not set')}`, rightX, y);
  doc.text(`Location: ${safeText(payload.storeLocation ?? 'Not set')}`, rightX, y + 5);
  doc.text(`Downloaded: ${safeText(payload.generatedAt ?? new Date().toLocaleString())}`, rightX, y + 10);

  if (payload.storeDescription) {
    y += 18;
    doc.setFontSize(10);
    doc.setTextColor('#475569');
    const lines = doc.splitTextToSize(`Store description: ${safeText(payload.storeDescription)}`, 180);
    doc.text(lines, 14, y);
    y += lines.length * 5;
  }

  doc.setTextColor('#111827');
  return y + 14;
}

function drawSectionTitle(doc: jsPDF, title: string, y: number) {
  y = ensurePage(doc, y);
  doc.setFontSize(14);
  doc.setTextColor('#111827');
  doc.text(title, 14, y);
  return y + 8;
}

function drawStatCards(doc: jsPDF, items: Array<{ label: string; value: string }>, y: number) {
  y = ensurePage(doc, y);
  let x = 14;
  const cardWidth = 82;
  items.forEach(item => {
    if (x + cardWidth > 190) {
      x = 14;
      y += 28;
      y = ensurePage(doc, y);
    }
    doc.setDrawColor('#e2e8f0');
    doc.setFillColor('#f8fafc');
    doc.roundedRect(x, y, cardWidth, 20, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setTextColor('#64748b');
    doc.text(item.label, x + 4, y + 6);
    doc.setFontSize(12);
    doc.setTextColor('#111827');
    doc.text(item.value, x + 4, y + 15);
    x += cardWidth + 8;
  });
  return y + 28;
}

function drawTable(doc: jsPDF, title: string, headers: string[], rows: string[][], yStart: number) {
  let y = ensurePage(doc, yStart);
  const normalizedHeaders = headers.map((header, index) => header?.trim() ? header : `Column ${index + 1}`);
  const colCount = normalizedHeaders.length;
  const pageWidth = 190;
  const colWidth = pageWidth / colCount;

  doc.setFontSize(10);
  doc.setTextColor('#0f172a');
  doc.text(title, 14, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFillColor('#f8fafc');
  normalizedHeaders.forEach((header, index) => {
    const x = 14 + index * colWidth;
    doc.rect(x, y, colWidth, 8, 'F');
    doc.setTextColor('#334155');
    doc.text(header, x + 2, y + 5);
  });

  y += 10;

  rows.forEach(row => {
    const rowHeight = Math.max(...row.map(cell => doc.splitTextToSize(cell, colWidth - 4).length)) * 5 + 6;
    if (y + rowHeight > 270) {
      doc.addPage();
      y = 20;
    }

    row.forEach((cell, index) => {
      const x = 14 + index * colWidth;
      doc.setFontSize(8);
      doc.setTextColor('#475569');
      const lines = doc.splitTextToSize(cell, colWidth - 4);
      doc.text(lines, x + 2, y + 5);
    });

    y += rowHeight;
  });

  return y + 10;
}

function topN<T>(items: T[], n: number) {
  return items.slice(0, n);
}

function addOverviewSection(doc: jsPDF, payload: ReportExportPayload, y: number) {
  const totalRevenue = payload.filteredSales.reduce((sum, sale: any) => sum + (sale.totalAmount || 0), 0);
  const totalProfit = totalRevenue - payload.filteredSales.reduce((sum, sale: any) => sum + (sale.saleItems?.reduce((a: number, it: any) => a + it.quantity * (it.product?.purchasePrice || 0), 0) || 0), 0);
  const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const categoryRows = payload.revenueByCategory.map(([category, value]) => [category, formatCurrency(value)]);
  const productRows = payload.topProducts.map(([name, data]) => [name, String(data.qty), formatCurrency(data.rev)]);
  const recentSales = payload.filteredSales.slice(0, 12).map((sale: any) => [
    new Date(sale.saleDate).toLocaleString(),
    sale.saleItems?.map((item: any) => `${item.product?.name || 'Item'} x${item.quantity}`).join(', ') || '—',
    formatCurrency(sale.totalAmount ?? 0),
    safeText(sale.paymentStatus || '—'),
  ]);

  y = drawSectionTitle(doc, 'Overview summary', y);
  y = drawStatCards(doc, [
    { label: 'Total revenue', value: formatCurrency(totalRevenue) },
    { label: 'Net profit', value: formatCurrency(totalProfit) },
    { label: 'Profit margin', value: `${formatNumber(margin, 1)}%` },
    { label: 'Pending debts', value: formatCurrency(payload.stats?.debtsPending ?? payload.pendingDebtsCount ?? 0) },
  ], y);

  y = drawSectionTitle(doc, 'Top revenue categories', y);
  y = drawTable(doc, 'Top revenue categories', ['Category', 'Revenue'], topN(categoryRows, 8), y);

  y = drawSectionTitle(doc, 'Top selling products', y);
  y = drawTable(doc, 'Top selling products', ['Product', 'Units sold', 'Revenue'], topN(productRows, 8), y);

  y = drawSectionTitle(doc, 'Recent transactions', y);
  y = drawTable(doc, 'Recent transactions', ['Date', 'Items', 'Amount', 'Status'], recentSales, y);

  return y;
}

function addSalesSection(doc: jsPDF, payload: ReportExportPayload, y: number) {
  const totalOrders = payload.filteredSales.length;
  const totalRevenue = payload.filteredSales.reduce((sum, sale: any) => sum + (sale.totalAmount || 0), 0);
  const itemsSold = payload.filteredSales.reduce((sum, sale: any) => sum + (sale.saleItems?.reduce((a: number, it: any) => a + it.quantity, 0) || 0), 0);
  const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;

  const salesCategoryRows = payload.revenueByCategory.map(([category, value]) => [category, formatCurrency(value)]);
  const topProductRows = payload.topProducts.map(([name, data]) => [name, String(data.qty), formatCurrency(data.rev)]);
  const recentSales = payload.filteredSales.slice(0, 12).map((sale: any) => [
    new Date(sale.saleDate).toLocaleString(),
    sale.saleItems?.map((item: any) => `${item.product?.name || 'Item'} x${item.quantity}`).join(', ') || '—',
    formatCurrency(sale.totalAmount ?? 0),
    safeText(sale.paymentStatus || '—'),
  ]);

  y = drawSectionTitle(doc, 'Sales summary', y);
  y = drawStatCards(doc, [
    { label: 'Total sales', value: String(totalOrders) },
    { label: 'Total revenue', value: formatCurrency(totalRevenue) },
    { label: 'Avg order', value: formatCurrency(avgOrder) },
    { label: 'Items sold', value: String(itemsSold) },
  ], y);

  y = drawSectionTitle(doc, 'Sales by category', y);
  y = drawTable(doc, 'Sales by category', ['Category', 'Revenue'], topN(salesCategoryRows, 8), y);

  y = drawSectionTitle(doc, 'Top products', y);
  y = drawTable(doc, 'Top products', ['Product', 'Units sold', 'Revenue'], topN(topProductRows, 10), y);

  y = drawSectionTitle(doc, 'Recent transactions', y);
  y = drawTable(doc, 'Recent transactions', ['Date', 'Items', 'Amount', 'Status'], recentSales, y);

  return y;
}

function addInventorySection(doc: jsPDF, payload: ReportExportPayload, y: number) {
  const stockValue = payload.products.reduce((sum, product: any) => sum + ((product.currentStock || 0) * (product.purchasePrice || 0)), 0);
  const stockByCategory = (() => {
    const map: Record<string, number> = {};
    payload.products.forEach((product: any) => {
      map[product.category || 'Other'] = (map[product.category || 'Other'] || 0) + (product.currentStock || 0);
    });
    return Object.entries(map).map(([category, value]) => [category, String(value)]);
  })();

  const productRows = payload.products.slice(0, 18).map((product: any) => [
    product.name || '—',
    product.category || '—',
    String(product.currentStock ?? 0),
    formatCurrency(product.unitPrice ?? 0),
    product.currentStock === 0 ? 'Out' : product.currentStock <= product.minStockLevel ? 'Low' : 'OK',
  ]);

  y = drawSectionTitle(doc, 'Inventory summary', y);
  y = drawStatCards(doc, [
    { label: 'Total products', value: String(payload.products.length) },
    { label: 'Stock value', value: formatCurrency(stockValue) },
    { label: 'Low stock', value: String(payload.lowStock) },
    { label: 'Out of stock', value: String(payload.outOfStock) },
  ], y);

  y = drawSectionTitle(doc, 'Stock by category', y);
  y = drawTable(doc, 'Stock by category', ['Category', 'Units in stock'], topN(stockByCategory, 8), y);

  y = drawSectionTitle(doc, 'Inventory details', y);
  y = drawTable(doc, 'Inventory details', ['Product', 'Category', 'Stock', 'Unit price', 'Status'], productRows, y);

  return y;
}

function addDebtsSection(doc: jsPDF, payload: ReportExportPayload, y: number) {
  const totalIssued = payload.debts.reduce((sum, debt: any) => sum + (debt.amount || 0), 0);
  const totalPaid = payload.debts.reduce((sum, debt: any) => sum + (debt.amountPaid || 0), 0);
  const outstanding = payload.debts.reduce((sum, debt: any) => sum + ((debt.amount || 0) - (debt.amountPaid || 0)), 0);
  const collectionRate = totalIssued > 0 ? (totalPaid / totalIssued) * 100 : 0;

  const statusRows = [
    ['Paid', String(payload.debts.filter((debt: any) => debt.status === 'PAID').length), `${formatNumber(payload.debts.filter((debt: any) => debt.status === 'PAID').length / Math.max(payload.debts.length, 1) * 100, 1)}%`],
    ['Partial', String(payload.debts.filter((debt: any) => debt.status === 'PARTIAL').length), `${formatNumber(payload.debts.filter((debt: any) => debt.status === 'PARTIAL').length / Math.max(payload.debts.length, 1) * 100, 1)}%`],
    ['Pending', String(payload.debts.filter((debt: any) => debt.status === 'PENDING').length), `${formatNumber(payload.debts.filter((debt: any) => debt.status === 'PENDING').length / Math.max(payload.debts.length, 1) * 100, 1)}%`],
  ];

  const topOutstanding = payload.debts
    .map((debt: any) => ({ ...debt, remaining: (debt.amount || 0) - (debt.amountPaid || 0) }))
    .sort((a: any, b: any) => b.remaining - a.remaining)
    .slice(0, 10)
    .map((debt: any) => [
      safeText(debt.debtorName),
      formatCurrency(debt.amount ?? 0),
      formatCurrency(debt.amountPaid ?? 0),
      formatCurrency(debt.remaining),
      safeText(debt.status),
    ]);

  const debtRows = payload.debts.slice(0, 18).map((debt: any) => [
    safeText(debt.debtorName),
    formatCurrency(debt.amount ?? 0),
    formatCurrency(debt.amountPaid ?? 0),
    formatCurrency((debt.amount ?? 0) - (debt.amountPaid ?? 0)),
    safeText(debt.status),
  ]);

  y = drawSectionTitle(doc, 'Debts summary', y);
  y = drawStatCards(doc, [
    { label: 'Total issued', value: formatCurrency(totalIssued) },
    { label: 'Collected', value: formatCurrency(totalPaid) },
    { label: 'Outstanding', value: formatCurrency(outstanding) },
    { label: 'Collection rate', value: `${formatNumber(collectionRate, 1)}%` },
  ], y);

  y = drawSectionTitle(doc, 'Status breakdown', y);
  y = drawTable(doc, 'Status breakdown', ['Status', 'Accounts', 'Share'], statusRows, y);

  y = drawSectionTitle(doc, 'Top outstanding debtors', y);
  y = drawTable(doc, 'Top outstanding debtors', ['Debtor', 'Total', 'Paid', 'Remaining', 'Status'], topOutstanding, y);

  y = drawSectionTitle(doc, 'All debt accounts', y);
  y = drawTable(doc, 'All debt accounts', ['Debtor', 'Total', 'Paid', 'Remaining', 'Status'], debtRows, y);

  return y;
}

function addProfitSection(doc: jsPDF, payload: ReportExportPayload, y: number) {
  const totalRevenue = payload.filteredSales.reduce((sum, sale: any) => sum + (sale.totalAmount || 0), 0);
  const totalCost = payload.filteredSales.reduce((sum, sale: any) => sum + (sale.saleItems?.reduce((a: number, item: any) => a + item.quantity * (item.product?.purchasePrice || 0), 0) || 0), 0);
  const totalProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const categoryRows = payload.revenueByCategory.map(([category, revenue]) => [category, formatCurrency(revenue)]);
  const profitRows = payload.filteredSales.slice(0, 12).map((sale: any) => {
    const cost = sale.saleItems?.reduce((a: number, item: any) => a + item.quantity * (item.product?.purchasePrice || 0), 0) || 0;
    const profit = (sale.totalAmount || 0) - cost;

    return [
      new Date(sale.saleDate).toLocaleDateString(),
      formatCurrency(sale.totalAmount || 0),
      formatCurrency(cost),
      formatCurrency(profit),
      `${formatNumber(sale.totalAmount ? (profit / sale.totalAmount) * 100 : 0, 1)}%`,
    ];
  });

  y = drawSectionTitle(doc, 'Profit summary', y);
  y = drawStatCards(doc, [
    { label: 'Gross revenue', value: formatCurrency(totalRevenue) },
    { label: 'Total cost', value: formatCurrency(totalCost) },
    { label: 'Net profit', value: formatCurrency(totalProfit) },
    { label: 'Profit margin', value: `${formatNumber(margin, 1)}%` },
  ], y);

  y = drawSectionTitle(doc, 'Revenue by category', y);
  y = drawTable(doc, 'Revenue by category', ['Category', 'Revenue'], topN(categoryRows, 10), y);

  y = drawSectionTitle(doc, 'Profit by transaction', y);
  y = drawTable(doc, 'Profit by transaction', ['Date', 'Revenue', 'Cost', 'Profit', 'Margin'], profitRows, y);

  return y;
}

export function exportReportToPdf(section: ReportSectionKey, payload: ReportExportPayload) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = drawHeader(doc, payload);

  if (section === 'overview') {
    addOverviewSection(doc, payload, y);
  } else if (section === 'sales') {
    addSalesSection(doc, payload, y);
  } else if (section === 'inventory') {
    addInventorySection(doc, payload, y);
  } else if (section === 'debts') {
    addDebtsSection(doc, payload, y);
  } else if (section === 'profit') {
    addProfitSection(doc, payload, y);
  } else {
    let nextY = addOverviewSection(doc, payload, y);
    nextY = addSalesSection(doc, payload, nextY);
    nextY = addInventorySection(doc, payload, nextY);
    nextY = addDebtsSection(doc, payload, nextY);
    addProfitSection(doc, payload, nextY);
  }

  doc.save(renderFileName(section));
}
