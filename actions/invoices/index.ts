import { jsPDF } from 'jspdf';

export interface InvoiceItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface InvoicePdfPayload {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerPhone: string;
  notes: string;
  storeName: string;
  storeLocation: string;
  storePhone: string;
  storeEmail: string;
  items: InvoiceItemInput[];
  discountAmount: number;
  taxRate: number;
  paidAmount: number;
}

export interface InvoiceSummary {
  subtotal: number;
  discount: number;
  taxableAmount: number;
  tax: number;
  total: number;
  paidAmount: number;
  balance: number;
}

function safeText(value: string | undefined | null) {
  return value && value.trim() ? value.trim() : '—';
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildInvoiceNumber(date = new Date()) {
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = String(Math.floor(Math.random() * 9000) + 1000);
  return `INV-${stamp}-${suffix}`;
}

export function calculateInvoiceSummary(
  items: InvoiceItemInput[],
  discountAmount = 0,
  taxRate = 0,
  paidAmount = 0,
): InvoiceSummary {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discount = Math.max(0, discountAmount);
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * (taxRate / 100);
  const total = taxableAmount + tax;
  const balance = Math.max(0, total - paidAmount);

  return {
    subtotal,
    discount,
    taxableAmount,
    tax,
    total,
    paidAmount,
    balance,
  };
}

export function createInvoicePdf(payload: InvoicePdfPayload): Blob {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const summary = calculateInvoiceSummary(payload.items, payload.discountAmount, payload.taxRate, payload.paidAmount);

  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 90, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(safeText(payload.storeName || 'HardwareStocks'), margin, 34);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(safeText(payload.storeLocation), margin, 54);
  doc.text(`${safeText(payload.storePhone)} • ${safeText(payload.storeEmail)}`, margin, 70);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('INVOICE', pageWidth - margin - 70, 34);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice No: ${safeText(payload.invoiceNumber)}`, pageWidth - margin - 120, 56);
  doc.text(`Date: ${safeText(payload.invoiceDate)}`, pageWidth - margin - 120, 72);

  let y = 118;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Bill To', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(safeText(payload.customerName), margin, y + 16);
  doc.text(`Phone: ${safeText(payload.customerPhone)}`, margin, y + 32);

  y += 56;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Description', margin, y + 16);
  doc.text('Qty', 300, y + 16);
  doc.text('Price', 372, y + 16);
  doc.text('Total', 450, y + 16);
  doc.line(margin, y + 22, pageWidth - margin, y + 22);

  y += 28;
  doc.setFont('helvetica', 'normal');
  payload.items.length > 0 ? payload.items.forEach((item) => {
    const lineTotal = item.quantity * item.unitPrice;
    const description = safeText(item.description);
    const lines = doc.splitTextToSize(description, 220);
    const lineHeight = 12;
    const blockHeight = Math.max(lines.length * lineHeight, 12);

    doc.text(lines, margin, y + 2);
    doc.text(String(item.quantity), 300, y + 2);
    doc.text(formatCurrency(item.unitPrice), 372, y + 2);
    doc.text(formatCurrency(lineTotal), 450, y + 2);
    y += blockHeight + 4;
  }) : (
    doc.text('No items added yet.', margin, y + 4)
  );

  if (y > 460) {
    doc.addPage();
    y = 70;
  }

  doc.line(margin, y + 8, pageWidth - margin, y + 8);
  y += 24;

  doc.setFont('helvetica', 'bold');
  doc.text('Summary', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Subtotal: ${formatCurrency(summary.subtotal)}`, 350, y);
  doc.text(`Discount: ${formatCurrency(summary.discount)}`, 350, y + 16);
  doc.text(`Tax: ${formatCurrency(summary.tax)}`, 350, y + 32);
  doc.text(`Total: ${formatCurrency(summary.total)}`, 350, y + 48);
  doc.text(`Paid: ${formatCurrency(summary.paidAmount)}`, 350, y + 64);
  doc.text(`Balance: ${formatCurrency(summary.balance)}`, 350, y + 80);

  y += 92;
  if (payload.notes) {
    doc.setFont('helvetica', 'bold');
    doc.text('Notes', margin, y);
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(safeText(payload.notes), 500);
    doc.text(noteLines, margin, y + 16);
    y += noteLines.length * 12 + 10;
  }

  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Thank you for shopping with us.', margin, pageHeight - 56);
  doc.text('Generated by HardwareStocks', margin, pageHeight - 40);

  return doc.output('blob');
}

export function downloadInvoicePdf(payload: InvoicePdfPayload, filename?: string) {
  const blob = createInvoicePdf(payload);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${payload.invoiceNumber}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 600);
}
