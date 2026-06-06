'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Toast from '@/components/ui/Toast';
import { formatKES } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minStockLevel: number;
  baseUnit: string;
  packageUnitLabel?: string;
  packageSize?: number;
  unitPrice: number;
  purchasePrice: number;
}

interface InventoryTransaction {
  id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  notes?: string;
  date: string;
  createdAt: string;
}

const STATUS_LABELS = {
  success: { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700' },
  warning: { label: 'Low Stock', color: 'bg-amber-100 text-amber-700' },
  danger: { label: 'Out of Stock', color: 'bg-red-100 text-red-700' },
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [showInventoryPanel, setShowInventoryPanel] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    title: '',
    description: '',
    variant: 'success' as 'success' | 'error',
  });
  const [formData, setFormData] = useState({
    productId: '',
    minStockLevel: 0,
    unitPrice: 0,
    purchasePrice: 0,
    adjustMode: 'units' as 'units' | 'packages',
    adjustQuantity: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find((product) => product.id === formData.productId);

  React.useEffect(() => {
    if (!selectedProduct) return;
    setFormData((current) => ({
      ...current,
      productId: selectedProduct.id,
      minStockLevel: selectedProduct.minStockLevel,
      unitPrice: selectedProduct.unitPrice,
      purchasePrice: selectedProduct.purchasePrice,
      adjustMode: selectedProduct.packageSize ? 'packages' : 'units',
      adjustQuantity: 0,
    }));
  }, [selectedProduct?.id]);

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return 'danger';
    if (current <= min) return 'warning';
    return 'success';
  };

  const selectedStatus = selectedProduct
    ? STATUS_LABELS[getStockStatus(selectedProduct.currentStock, selectedProduct.minStockLevel) as keyof typeof STATUS_LABELS]
    : null;

  const selectedProductBoxes = selectedProduct?.packageSize
    ? Math.floor(selectedProduct.currentStock / selectedProduct.packageSize)
    : 0;

  const [latestTransactions, setLatestTransactions] = useState<InventoryTransaction[]>([]);

  const fetchLatestTransactions = async (productId: string) => {
    try {
      const res = await fetch(`/api/inventory/stock?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setLatestTransactions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch latest inventory transactions:', error);
    }
  };

  const selectedProductRemainder = selectedProduct?.packageSize
    ? selectedProduct.currentStock % selectedProduct.packageSize
    : selectedProduct?.currentStock ?? 0;

  React.useEffect(() => {
    if (selectedProduct) {
      fetchLatestTransactions(selectedProduct.id);
    } else {
      setLatestTransactions([]);
    }
  }, [selectedProduct?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !selectedProduct) return;

    const adjustQty = Math.max(0, formData.adjustQuantity);
    const packageUnits = formData.adjustMode === 'packages' ? (selectedProduct.packageSize ?? 0) : 1;
    if (formData.adjustMode === 'packages' && !selectedProduct.packageSize) {
      setToast({ open: true, title: 'Update failed', description: 'This product has no package size set.', variant: 'error' });
      return;
    }

    const adjustUnits = adjustQty * packageUnits;
    const nextStock = selectedProduct.currentStock + adjustUnits;

    setSubmitting(true);
    try {
      const transactionRes = await fetch('/api/inventory/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: formData.productId,
          type: 'IN',
          quantity: formData.adjustMode === 'units' ? adjustQty : undefined,
          packageCount: formData.adjustMode === 'packages' ? adjustQty : undefined,
          notes: 'Inventory addition',
        }),
      });

      if (!transactionRes.ok) {
        const data = await transactionRes.json();
        setToast({
          open: true,
          title: 'Update failed',
          description: data?.error || 'Unable to record stock update.',
          variant: 'error',
        });
        return;
      }

      const updateRes = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.productId,
          minStockLevel: parseInt(String(formData.minStockLevel), 10),
          unitPrice: parseFloat(String(formData.unitPrice)),
          purchasePrice: parseFloat(String(formData.purchasePrice)),
        }),
      });

      if (!updateRes.ok) {
        const data = await updateRes.json();
        setToast({
          open: true,
          title: 'Update partially applied',
          description: data?.error || 'Stock change saved but metadata update failed.',
          variant: 'error',
        });
      } else {
        setToast({
          open: true,
          title: 'Inventory updated',
          description: `New stock is ${nextStock} ${selectedProduct.baseUnit}.`,
          variant: 'success',
        });
      }

      await fetchProducts();
      await fetchLatestTransactions(formData.productId);
      setFormData({
        ...formData,
        adjustQuantity: 0,
      });
    } catch (error) {
      setToast({
        open: true,
        title: 'Update failed',
        description: 'Unable to reach the server.',
        variant: 'error',
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevertTransaction = async (transactionId: string) => {
    if (!selectedProduct) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/inventory/stock?id=${transactionId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        setToast({
          open: true,
          title: 'Revert failed',
          description: data?.error || 'Unable to revert transaction.',
          variant: 'error',
        });
        return;
      }
      await fetchProducts();
      await fetchLatestTransactions(selectedProduct.id);
      setToast({
        open: true,
        title: 'Reverted update',
        description: 'The last transaction has been reverted.',
        variant: 'success',
      });
    } catch (error) {
      setToast({
        open: true,
        title: 'Revert failed',
        description: 'Unable to reach the server.',
        variant: 'error',
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter((product) =>
    !search ||
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  const equivalentUnits = selectedProduct
    ? formData.adjustMode === 'packages'
      ? formData.adjustQuantity * (selectedProduct.packageSize ?? 0)
      : formData.adjustQuantity
    : 0;

  const lowCount = products.filter((product) => product.currentStock > 0 && product.currentStock <= product.minStockLevel).length;
  const outCount = products.filter((product) => product.currentStock === 0).length;
  const totalStock = products.reduce((sum, product) => sum + product.currentStock, 0);

  return (
    <div className="space-y-6">
      <Header
        title="Inventory"
        subtitle="Use an existing product definition, then assign stock levels, low thresholds, and pricing."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Products', value: products.length, icon: '📦', color: 'text-gray-900' },
          { label: 'Total Stock', value: totalStock, icon: '📊', color: 'text-green-700' },
          { label: 'Low Stock', value: lowCount, icon: '⚠️', color: 'text-amber-600' },
          { label: 'Out of Stock', value: outCount, icon: '🔴', color: 'text-red-500' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{card.label}</div>
            <div className={`text-xl font-semibold ${card.color}`}>{card.icon} {card.value}</div>
          </div>
        ))}
      </div>

      {showInventoryPanel && (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

          <Card className="p-4">
            <div className="flex items-center justify-between mb-4 gap-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Inventory Details</h2>
                <p className="text-xs text-gray-500">Select a product definition, then update its stock, low-stock threshold, and pricing.</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1.5">Product</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                      value={formData.productId}
                      onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                      required
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>{product.name} ({product.sku})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1.5">Adjust by</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
                      value={formData.adjustMode}
                      onChange={(e) => setFormData({ ...formData, adjustMode: e.target.value as 'units' | 'packages', adjustQuantity: 0 })}
                    >
                      <option value="units">Units</option>
                      <option value="packages">Packages</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <Input
                  label={formData.adjustMode === 'packages' ? `Package quantity (${selectedProduct?.packageUnitLabel || 'package'})` : `Units (${selectedProduct?.baseUnit || 'units'})`}
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={formData.adjustQuantity}
                  onChange={(e) => setFormData({ ...formData, adjustQuantity: parseInt(e.target.value || '0', 10) })}
                />
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">
                  Equivalent to {equivalentUnits} {selectedProduct?.baseUnit || 'units'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label={`Low stock threshold (${selectedProduct?.baseUnit || 'units'})`}
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={formData.minStockLevel}
                  onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value || '0', 10) })}
                />
                <Input
                  label="Sale price per unit (KES)"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value || '0') })}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Cost price per unit (KES)"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value || '0') })}
                />
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-700 mb-1.5">Margin</label>
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm">
                    <span className="text-lg font-semibold text-green-600">
                      +KES {(formData.unitPrice - formData.purchasePrice).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({formData.purchasePrice > 0 ? (((formData.unitPrice - formData.purchasePrice) / formData.purchasePrice * 100).toFixed(1)) : '0'}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-3">
                <Button
                  type="button"
                  onClick={() => {
                    setShowInventoryPanel(false);
                    setFormData({
                      productId: '',
                      minStockLevel: 0,
                      unitPrice: 0,
                      purchasePrice: 0,
                      adjustMode: 'units',
                      adjustQuantity: 0,
                    });
                  }}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 text-sm"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !formData.productId} className="px-3 py-2 text-sm">
                  {submitting ? 'Saving...' : 'Update Inventory'}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="space-y-4 p-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Selected product</h2>
              <p className="text-xs text-gray-500">Reference information for the current selection.</p>
            </div>
            {selectedProduct ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                  <div className="text-base font-semibold text-gray-900 leading-tight">{selectedProduct.name}</div>
                  <div className="text-xs text-gray-500 mt-2">SKU: {selectedProduct.sku}</div>
                  <div className="text-xs text-gray-500">Base unit: {selectedProduct.baseUnit}</div>
                  {selectedProduct.packageSize ? (
                    <div className="text-sm text-gray-500">1 {selectedProduct.packageUnitLabel || 'package'} = {selectedProduct.packageSize} {selectedProduct.baseUnit}</div>
                  ) : null}
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 space-y-2">
                  <div className="text-sm text-gray-700">Current stock: <span className="font-semibold text-gray-900">{selectedProduct.currentStock} {selectedProduct.baseUnit}</span></div>
                  {selectedProduct.packageSize ? (
                    <div className="text-sm text-gray-700">{selectedProductBoxes} {selectedProduct.packageUnitLabel || 'boxes'} rem {selectedProductRemainder} {selectedProduct.baseUnit}</div>
                  ) : null}
                  {selectedStatus ? (
                    <div className="text-sm">Status: <span className={`inline-flex rounded-full px-2 py-1 text-[0.65rem] font-semibold ${selectedStatus.color}`}>{selectedStatus.label}</span></div>
                  ) : null}
                  <div className="text-sm text-gray-700">Pricing: <span className="font-semibold text-gray-900">KES {formatKES(selectedProduct.unitPrice)} / {selectedProduct.baseUnit}</span></div>
                  <div className="text-xs text-gray-500">Cost: KES {formatKES(selectedProduct.purchasePrice)} / {selectedProduct.baseUnit}</div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 space-y-3">
                  <div className="font-semibold text-sm text-gray-900">Latest inventory updates</div>
                  {latestTransactions.length > 0 ? (
                    <div className="space-y-2">
                      {latestTransactions.map((transaction) => {
                        const actionLabel = transaction.type === 'IN' ? 'Added' : 'Removed';
                        const sign = transaction.type === 'IN' ? '+' : '-';
                        const dateLabel = new Date(transaction.createdAt).toLocaleDateString();
                        return (
                          <div key={transaction.id} className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-white p-2">
                            <div className="space-y-1 text-[0.72rem] leading-tight">
                              <div className="font-semibold text-gray-900">{actionLabel} {sign}{transaction.quantity} {selectedProduct.baseUnit}</div>
                              <div className="text-gray-500">{dateLabel}</div>
                              {transaction.notes ? <div className="text-gray-500">{transaction.notes}</div> : null}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRevertTransaction(transaction.id)}
                              className="text-xs font-semibold text-red-600 hover:text-red-800"
                              disabled={submitting}
                            >
                              Revert
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-gray-500">No recent inventory updates.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">Pick a product to see its conversion and stock details.</div>
            )}
          </Card>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Input
          label="Search products"
          placeholder="Search by name, SKU, or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {!showInventoryPanel ? (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={() => setShowInventoryPanel(true)}
            >
              Add inventory
            </Button>
          </div>
        ) : null}
      </div>

      {loading ? (
        <Card>
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin" />
          </div>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Package Equiv.</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Min Level</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const statusKey = getStockStatus(product.currentStock, product.minStockLevel) as keyof typeof STATUS_LABELS;
                const status = STATUS_LABELS[statusKey];
                return (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{product.sku} · {product.category}</div>
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">{product.currentStock} {product.baseUnit}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {product.packageSize ? `${Math.floor(product.currentStock / product.packageSize)} ${product.packageUnitLabel || 'packages'}` : '—'}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{product.minStockLevel} {product.baseUnit}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
      <Toast
        open={toast.open}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
      />
    </div>
  );
}
