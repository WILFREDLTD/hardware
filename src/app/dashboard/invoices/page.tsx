'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import {
  buildInvoiceNumber,
  calculateInvoiceSummary,
  downloadInvoicePdf,
  type InvoiceItemInput,
  type InvoicePdfPayload,
} from '../../../../actions/invoices';

function createEmptyItem(): InvoiceItemInput {
  return {
    description: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
  };
}

export default function InvoicesPage() {
  const [storeName, setStoreName] = useState('HardwareStocks');
  const [storeLocation, setStoreLocation] = useState('Nairobi');
  const [storePhone, setStorePhone] = useState('+254 700 000 000');
  const [storeEmail, setStoreEmail] = useState('hello@hardwarestocks.co.ke');
  const [invoiceNumber, setInvoiceNumber] = useState(() => buildInvoiceNumber());
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [items, setItems] = useState<InvoiceItemInput[]>([createEmptyItem()]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) return;
        const profile = await response.json();
        setStoreName(profile.storeName || 'HardwareStocks');
        setStoreLocation(profile.storeLocation || 'Nairobi');
        setStorePhone(profile.phone || '+254 700 000 000');
        setStoreEmail(profile.email || 'hello@hardwarestocks.co.ke');
      } catch {
        // keep defaults
      }
    };

    loadProfile();
  }, []);

  const summary = useMemo(
    () => calculateInvoiceSummary(items, discountAmount, taxRate, paidAmount),
    [discountAmount, items, paidAmount, taxRate],
  );

  const updateItem = (index: number, field: keyof InvoiceItemInput, value: string) => {
    setItems((current) => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      if (field === 'description') {
        return { ...item, description: value };
      }
      const parsed = value === '' ? 0 : Number(value);
      return { ...item, [field]: parsed };
    }));
  };

  const addItem = () => setItems((current) => [...current, createEmptyItem()]);
  const removeItem = (index: number) => {
    setItems((current) => (current.length > 1 ? current.filter((_, itemIndex) => itemIndex !== index) : [createEmptyItem()]));
  };

  const handleGenerate = () => {
    const payload: InvoicePdfPayload = {
      invoiceNumber,
      invoiceDate,
      customerName,
      customerPhone,
      notes,
      storeName,
      storeLocation,
      storePhone,
      storeEmail,
      items,
      discountAmount,
      taxRate,
      paidAmount,
    };

    setIsGenerating(true);
    try {
      downloadInvoicePdf(payload, `${invoiceNumber}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Create invoice</p>
          <h1 className="text-2xl font-semibold text-slate-900">Write and download a professional invoice</h1>
          <p className="mt-1 text-sm text-slate-600">The invoice layout, numbering, totals, and PDF export are handled in the actions layer.</p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full md:w-auto">
          <FileDown className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generating…' : 'Generate PDF'}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Invoice number" value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} />
            <Input label="Invoice date" type="date" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} />
            <Input label="Customer name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Jane Doe" />
            <Input label="Customer phone" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="0712 345 678" />
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Invoice items</h2>
              <Button variant="secondary" size="sm" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add item
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              {items.map((item, index) => (
                <div key={`${item.description}-${index}`} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-[2fr_0.7fr_1fr_0.8fr_auto]">
                  <Input
                    label="Description"
                    value={item.description}
                    onChange={(event) => updateItem(index, 'description', event.target.value)}
                    placeholder="Hammer"
                  />
                  <Input
                    label="Qty"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                  />
                  <Input
                    label="Unit price"
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(event) => updateItem(index, 'unitPrice', event.target.value)}
                  />
                  <Input
                    label="Discount"
                    type="number"
                    min="0"
                    value={item.discount ?? 0}
                    onChange={(event) => updateItem(index, 'discount', event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-6 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-300 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Input label="Discount amount" type="number" min="0" value={discountAmount} onChange={(event) => setDiscountAmount(Number(event.target.value))} />
            <Input label="Tax rate (%)" type="number" min="0" value={taxRate} onChange={(event) => setTaxRate(Number(event.target.value))} />
            <Input label="Paid amount" type="number" min="0" value={paidAmount} onChange={(event) => setPaidAmount(Number(event.target.value))} />
            <div className="md:col-span-2">
              <Textarea label="Notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Thanks for your business" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Preview</p>
              <h2 className="text-xl font-semibold text-slate-900">{storeName}</h2>
              <p className="text-sm text-slate-600">{storeLocation}</p>
            </div>
            <div className="rounded-lg bg-white px-3 py-2 text-right shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Invoice</p>
              <p className="text-sm font-semibold text-slate-900">{invoiceNumber}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-xl border border-emerald-100 bg-white p-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Customer</span>
              <span className="font-semibold text-slate-900">{customerName || 'Unspecified'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Date</span>
              <span className="font-semibold text-slate-900">{invoiceDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span className="font-semibold text-slate-900">{summary.discount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <span className="font-semibold text-slate-900">{summary.tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-semibold text-slate-900">KES {summary.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Balance</span>
              <span className="font-semibold text-emerald-600">KES {summary.balance.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-emerald-100 bg-white p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Items</p>
            <div className="mt-3 space-y-2">
              {items.map((item, index) => (
                <div key={`${item.description}-${index}`} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{item.description || `Item ${index + 1}`}</p>
                    <p className="text-xs text-slate-500">{item.quantity} × KES {item.unitPrice.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold text-slate-900">KES {(item.quantity * item.unitPrice).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
