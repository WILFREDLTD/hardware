'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatKES } from '@/lib/utils';

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

const DEFAULT_CATEGORIES = [
  'Tools',
  'Electrical',
  'Plumbing',
  'Paint',
  'Lumber',
  'Hardware',
  'Safety',
];

const CATEGORY_ICONS: Record<string, string> = {
  'Tools': '🔧',
  'Electrical': '⚡',
  'Plumbing': '🚿',
  'Paint': '🎨',
  'Lumber': '🪵',
  'Hardware': '🔩',
  'Safety': '🦺',
}

function getCategoryIcon(cat: string) {
  return CATEGORY_ICONS[cat] || '📦'
}

function StockBar({ current, min, max }: { current: number, min: number, max: number }) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0
  const color = current === 0 ? '#ef4444' : current <= min ? '#f59e0b' : '#1a6b45'
  return (
    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out'>('all');
  const [pendingNewCategory, setPendingNewCategory] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '', category: '', sku: '',
    currentStock: 0, minStockLevel: 5, unitPrice: 0, purchasePrice: 0,
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/inventory');
      setProducts(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? '/api/inventory' : '/api/inventory';
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        currentStock: parseInt(formData.currentStock as any),
        minStockLevel: parseInt(formData.minStockLevel as any),
        unitPrice: parseFloat(formData.unitPrice as any),
        purchasePrice: parseFloat(formData.purchasePrice as any),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Only add new category to list if product was saved successfully and it's a new category
        if (pendingNewCategory && !categories.includes(pendingNewCategory)) {
          setCategories(prevCategories => [...prevCategories, pendingNewCategory]);
        }
        fetchProducts();
        handleCloseModal();
      }
    } catch (e) { console.error(e); }
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat = pendingNewCategory.trim();
    if (!newCat || categories.includes(newCat)) {
      return;
    }

    setFormData({ ...formData, category: newCat });
    setShowNewCategoryModal(false);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'NEW_CATEGORY') {
      setShowNewCategoryModal(true);
      return;
    }

    setFormData({ ...formData, category: e.target.value });
    setPendingNewCategory('');
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData({ id: '', name: '', category: '', sku: '', currentStock: 0, minStockLevel: 5, unitPrice: 0, purchasePrice: 0 });
    setShowModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setIsEditing(true);
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      sku: product.sku,
      currentStock: product.currentStock,
      minStockLevel: product.minStockLevel,
      unitPrice: product.unitPrice,
      purchasePrice: product.purchasePrice,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowNewCategoryModal(false);
    setIsEditing(false);
    setPendingNewCategory('');
    setFormData({ id: '', name: '', category: '', sku: '', currentStock: 0, minStockLevel: 5, unitPrice: 0, purchasePrice: 0 });
  };

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { variant: 'danger' as const, text: 'Out of Stock' };
    if (current <= min) return { variant: 'warning' as const, text: 'Low Stock' };
    return { variant: 'success' as const, text: 'In Stock' };
  };

  const filtered = products
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .filter(p => filterStatus === 'all' ? true : filterStatus === 'out' ? p.currentStock === 0 : p.currentStock <= p.minStockLevel);

  const outCount = products.filter(p => p.currentStock === 0).length;
  const lowCount = products.filter(p => p.currentStock > 0 && p.currentStock <= p.minStockLevel).length;
  const totalValue = products.reduce((s, p) => s + p.currentStock * p.purchasePrice, 0);

  return (
    <div className="space-y-6">
      <Header
        title="Inventory"
        subtitle="Manage your hardware store products"
        action={<Button onClick={handleOpenAddModal}>+ Add Product</Button>}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, icon: '📦', color: 'text-gray-900' },
          { label: 'Low Stock', value: lowCount, icon: '⚠️', color: 'text-amber-600' },
          { label: 'Out of Stock', value: outCount, icon: '🔴', color: 'text-red-500' },
          { label: 'Stock Value', value: `KES ${formatKES(totalValue)}`, icon: '💰', color: 'text-green-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{s.label}</div>
            <div className={`text-xl font-semibold ${s.color}`}>{s.icon} {s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.75 6.75a7.5 7.5 0 0 0 10.6 10.6z" /></svg>
          </div>
          <input
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products, SKU, category…"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'low', 'out'] as const).map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${filterStatus === f ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
              style={filterStatus === f ? { backgroundColor: '#1a6b45' } : {}}>
              {f === 'all' ? 'All' : f === 'low' ? `Low Stock (${lowCount})` : `Out (${outCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-gray-500 mb-4">{products.length === 0 ? 'No products yet' : 'No products match your filters'}</p>
            {products.length === 0 && <Button onClick={handleOpenAddModal}>Add Your First Product</Button>}
          </div>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Unit Price</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Purchase Price</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const status = getStockStatus(product.currentStock, product.minStockLevel);
                return (
                  <tr key={product.id} onClick={() => handleOpenEditModal(product)} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
                          {getCategoryIcon(product.category)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5 font-mono">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">{product.category}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold text-gray-900">{product.currentStock}</span>
                          <span className="text-xs text-gray-400">/ min {product.minStockLevel}</span>
                        </div>
                        <StockBar current={product.currentStock} min={product.minStockLevel} max={product.minStockLevel * 4} />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">KES {formatKES(product.unitPrice)}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">KES {formatKES(product.purchasePrice)}</td>
                    <td className="py-4 px-4">
                      <Badge variant={status.variant}>{status.text}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {showModal && (
        <Modal title={isEditing ? "Edit Product" : "Add New Product"} onClose={handleCloseModal} onSubmit={handleAddProduct}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Product Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="NEW_CATEGORY" className="font-semibold text-blue-600">+ New Category</option>
                </select>
              </div>
            </div>
            <Input label="SKU" required value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Unit Price (KES)" type="number" step="0.01" required value={formData.unitPrice} onChange={e => setFormData({ ...formData, unitPrice: e.target.value as any })} />
              <Input label="Purchase Price (KES)" type="number" step="0.01" required value={formData.purchasePrice} onChange={e => setFormData({ ...formData, purchasePrice: e.target.value as any })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Current Stock" type="number" required value={formData.currentStock} onChange={e => setFormData({ ...formData, currentStock: e.target.value as any })} />
              <Input label="Minimum Stock Level" type="number" required value={formData.minStockLevel} onChange={e => setFormData({ ...formData, minStockLevel: e.target.value as any })} />
            </div>
          </div>
        </Modal>
      )}

      {showNewCategoryModal && (
        <Modal title="Add New Category" onClose={() => {
            setShowNewCategoryModal(false);
            setPendingNewCategory('');
          }} onSubmit={handleAddNewCategory}>
          <div className="space-y-4">
            <Input 
              label="Category Name" 
              placeholder="e.g., Fasteners, Lighting, Plumbing Tools"
              required 
              value={pendingNewCategory} 
              onChange={e => setPendingNewCategory(e.target.value)} 
              autoFocus
            />
          </div>
        </Modal>
      )}
    </div>
  );
}