'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

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
  createdAt: string;
  updatedAt: string;
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

const UNIT_OPTIONS = ['kg', 'g', 'liter', 'pcs', 'meter', 'bag', 'box'];

function getCategoryIcon(cat: string) {
  const icons: Record<string, string> = {
    Tools: '🔧',
    Electrical: '⚡',
    Plumbing: '🚿',
    Paint: '🎨',
    Lumber: '🪵',
    Hardware: '🔩',
    Safety: '🦺',
  };

  return icons[cat] || '📦';
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [baseUnits, setBaseUnits] = useState<string[]>(UNIT_OPTIONS);
  const [showModal, setShowModal] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [showNewUnitModal, setShowNewUnitModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingNewCategory, setPendingNewCategory] = useState('');
  const [pendingNewUnit, setPendingNewUnit] = useState('');
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    sku: '',
    baseUnit: 'kg',
    packageUnitLabel: '',
    packageSize: 0,
  });

  useEffect(() => {
    fetchProducts();
    loadBaseUnits();
  }, []);

  const loadBaseUnits = async () => {
    try {
      const res = await fetch('/api/base-units');
      if (res.ok) {
        const data = await res.json();
        setBaseUnits(Array.isArray(data) ? data : UNIT_OPTIONS);
      }
    } catch (error) {
      console.error('Failed to load base units:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData({
      id: '',
      name: '',
      category: '',
      sku: '',
      baseUnit: 'kg',
      packageUnitLabel: '',
      packageSize: 0,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setIsEditing(true);
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      sku: product.sku,
      baseUnit: product.baseUnit,
      packageUnitLabel: product.packageUnitLabel || '',
      packageSize: product.packageSize || 0,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowNewCategoryModal(false);
    setShowNewUnitModal(false);
    setIsEditing(false);
    setPendingNewCategory('');
    setPendingNewUnit('');
    setFormData({
      id: '',
      name: '',
      category: '',
      sku: '',
      baseUnit: 'kg',
      packageUnitLabel: '',
      packageSize: 0,
    });
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/inventory', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          packageSize: formData.packageSize ? parseInt(String(formData.packageSize), 10) : undefined,
        }),
      });

      if (res.ok) {
        if (pendingNewCategory && !categories.includes(pendingNewCategory)) {
          setCategories((prev) => [...prev, pendingNewCategory]);
        }
        fetchProducts();
        handleCloseModal();
      } else {
        const data = await res.json();
        console.error('Failed to save product', data);
      }
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsSaving(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'NEW_CATEGORY') {
      setShowNewCategoryModal(true);
      return;
    }
    setFormData({ ...formData, category: e.target.value });
    setPendingNewCategory('');
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat = pendingNewCategory.trim();
    if (!newCat || categories.includes(newCat)) return;
    setFormData({ ...formData, category: newCat });
    setShowNewCategoryModal(false);
  };

  const handleBaseUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'NEW_UNIT') {
      setShowNewUnitModal(true);
      return;
    }
    setFormData({ ...formData, baseUnit: e.target.value });
    setPendingNewUnit('');
  };

  const handleAddNewUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUnit = pendingNewUnit.trim().toLowerCase();
    if (!newUnit || baseUnits.includes(newUnit)) return;
    
    try {
      const res = await fetch('/api/base-units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unit: newUnit }),
      });
      
      if (res.ok) {
        setBaseUnits((prev) => [...prev, newUnit]);
        setFormData({ ...formData, baseUnit: newUnit });
        setShowNewUnitModal(false);
        setPendingNewUnit('');
      }
    } catch (error) {
      console.error('Failed to add unit:', error);
    }
  };

  const filtered = products.filter((product) =>
    !search ||
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  const packagedCount = products.filter((product) => product.packageSize).length;
  const uniqueBaseUnits = Array.from(new Set(products.map((product) => product.baseUnit))).length;

  return (
    <div className="space-y-6">
      <Header
        title="Products"
        subtitle="Define your products, base units, and package conversion rules."
        action={<Button onClick={handleOpenAddModal}>+ Add Product</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Products', value: products.length, icon: '📦', color: 'text-gray-900' },
          { label: 'Categories', value: categories.length, icon: '🗂️', color: 'text-emerald-700' },
          { label: 'Base Units', value: uniqueBaseUnits, icon: '📏', color: 'text-blue-700' },
          { label: 'Packaged Products', value: packagedCount, icon: '🧾', color: 'text-indigo-700' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{card.label}</div>
            <div className={`text-xl font-semibold ${card.color}`}>{card.icon} {card.value}</div>
          </div>
        ))}
      </div>

      <div className="relative">
        <input
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
          placeholder="Search products, SKU, category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
          🔍
        </div>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Base Unit</th>
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Package Rule</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              return (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer" onClick={() => handleOpenEditModal(product)}>
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
                  <td className="py-4 px-4 text-sm text-gray-700">{product.baseUnit}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {product.packageSize ? `1 ${product.packageUnitLabel || 'package'} = ${product.packageSize} ${product.baseUnit}` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {showModal && (
        <Modal title={isEditing ? 'Edit Product' : 'Add Product'} onClose={handleCloseModal} onSubmit={handleProductSubmit} submitDisabled={isSaving} submitLabel={isSaving ? 'Saving...' : undefined}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Product Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                <select
                  required
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="NEW_CATEGORY" className="font-semibold text-blue-600">+ New Category</option>
                </select>
              </div>
            </div>

            <Input label="SKU" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5">Base Unit</label>
                <select
                  value={formData.baseUnit}
                  onChange={handleBaseUnitChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                >
                  {baseUnits.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                  <option value="NEW_UNIT" className="font-semibold text-blue-600">+ New Unit</option>
                </select>
              </div>
              <Input label="Package Unit" placeholder="bag, box, bundle" value={formData.packageUnitLabel} onChange={(e) => setFormData({ ...formData, packageUnitLabel: e.target.value })} />
              <Input label="Package Size" type="number" min="0" value={formData.packageSize} onChange={(e) => setFormData({ ...formData, packageSize: parseInt(e.target.value || '0', 10) })} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.packageSize ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                  <p className="font-semibold text-gray-800">Package conversion</p>
                  <p className="mt-2">1 {formData.packageUnitLabel || 'package'} = {formData.packageSize} {formData.baseUnit}</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                  <p className="font-semibold text-gray-800">Package conversion</p>
                  <p className="mt-2">Set the package label and item amount per package above.</p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {showNewCategoryModal && (
        <Modal title="Add New Category" onClose={() => { setShowNewCategoryModal(false); setPendingNewCategory(''); }} onSubmit={handleAddNewCategory}>
          <div className="space-y-4">
            <Input
              label="Category Name"
              placeholder="e.g., Fasteners, Lighting, Plumbing Tools"
              required
              value={pendingNewCategory}
              onChange={(e) => setPendingNewCategory(e.target.value)}
              autoFocus
            />
          </div>
        </Modal>
      )}

      {showNewUnitModal && (
        <Modal title="Add New Base Unit" onClose={() => { setShowNewUnitModal(false); setPendingNewUnit(''); }} onSubmit={handleAddNewUnit}>
          <div className="space-y-4">
            <Input
              label="Unit Name"
              placeholder="e.g., kg, liter, meter, pcs"
              required
              value={pendingNewUnit}
              onChange={(e) => setPendingNewUnit(e.target.value)}
              autoFocus
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
