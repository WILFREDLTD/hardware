'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { InventoryStats } from './components/InventoryStats';
import { InventorySearchBar } from './components/InventorySearchBar';
import { InventoryTable } from './components/InventoryTable';
import { InventoryForm } from './components/InventoryForm';
import type { InventoryTransaction, Product } from './components/types';
import { STATUS_LABELS } from './components/types';

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
  const [latestTransactions, setLatestTransactions] = useState<InventoryTransaction[]>([]);

  useEffect(() => {
    void fetchProducts();
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

  useEffect(() => {
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

  useEffect(() => {
    if (selectedProduct) {
      void fetchLatestTransactions(selectedProduct.id);
    } else {
      setLatestTransactions([]);
    }
  }, [selectedProduct?.id]);

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

  const selectedProductRemainder = selectedProduct?.packageSize
    ? selectedProduct.currentStock % selectedProduct.packageSize
    : selectedProduct?.currentStock ?? 0;

  const handleFormChange = (field: string, value: string | number) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !selectedProduct) return;

    const adjustQty = Math.max(0, Number(formData.adjustQuantity));
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
        setToast({ open: true, title: 'Update failed', description: data?.error || 'Unable to record stock update.', variant: 'error' });
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
        setToast({ open: true, title: 'Update partially applied', description: data?.error || 'Stock change saved but metadata update failed.', variant: 'error' });
      } else {
        setToast({ open: true, title: 'Inventory updated', description: `New stock is ${nextStock} ${selectedProduct.baseUnit}.`, variant: 'success' });
      }

      await fetchProducts();
      await fetchLatestTransactions(formData.productId);
      setFormData((current) => ({ ...current, adjustQuantity: 0 }));
    } catch (error) {
      setToast({ open: true, title: 'Update failed', description: 'Unable to reach the server.', variant: 'error' });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevertTransaction = async (transactionId: string) => {
    if (!selectedProduct) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/inventory/stock?id=${transactionId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setToast({ open: true, title: 'Revert failed', description: data?.error || 'Unable to revert transaction.', variant: 'error' });
        return;
      }
      await fetchProducts();
      await fetchLatestTransactions(selectedProduct.id);
      setToast({ open: true, title: 'Reverted update', description: 'The last transaction has been reverted.', variant: 'success' });
    } catch (error) {
      setToast({ open: true, title: 'Revert failed', description: 'Unable to reach the server.', variant: 'error' });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter((product) =>
    !search ||
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    (product.nickname || '').toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  const equivalentUnits = selectedProduct
    ? formData.adjustMode === 'packages'
      ? Number(formData.adjustQuantity) * (selectedProduct.packageSize ?? 0)
      : Number(formData.adjustQuantity)
    : 0;

  return (
    <div className="space-y-6">
      <Header title="Inventory" subtitle="Use an existing product definition, then assign stock levels, low thresholds, and pricing." />
      <InventoryStats products={products} />

      {showInventoryPanel && (
        <InventoryForm
          products={products}
          selectedProduct={selectedProduct}
          selectedStatus={selectedStatus}
          selectedProductBoxes={selectedProductBoxes}
          selectedProductRemainder={selectedProductRemainder}
          latestTransactions={latestTransactions}
          formData={formData}
          submitting={submitting}
          equivalentUnits={equivalentUnits}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={() => {
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
          onRevertTransaction={handleRevertTransaction}
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <InventorySearchBar search={search} onSearchChange={setSearch} />
        {!showInventoryPanel ? (
          <div className="flex justify-end">
            <Button type="button" variant="primary" onClick={() => setShowInventoryPanel(true)}>Add inventory</Button>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">Loading inventory…</div>
      ) : (
        <InventoryTable products={filtered} getStockStatus={getStockStatus} />
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
