'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { CategoryModal } from './components/CategoryModal';
import { ProductFormModal } from './components/ProductFormModal';
import { ProductSearchBar } from './components/ProductSearchBar';
import { ProductStats } from './components/ProductStats';
import { ProductTable } from './components/ProductTable';
import { UnitModal } from './components/UnitModal';
import { type Product } from './components/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [baseUnits, setBaseUnits] = useState<string[]>([]);
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
    nickname: '',
    baseUnit: '',
    packageUnitLabel: '',
    packageSize: 0,
    supplierName: '',
    supplierNumber: '',
  });

  useEffect(() => {
    fetchProducts();
    loadBaseUnits();

    // load persisted categories from server (if available)
    (async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCategories(data);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    })();
  }, []);

  const loadBaseUnits = async () => {
    try {
      const res = await fetch('/api/base-units');
      if (res.ok) {
        const data = await res.json();
        setBaseUnits(Array.isArray(data) ? data : []);
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
      nickname: '',
      baseUnit: baseUnits[0] ?? '',
      packageUnitLabel: '',
      packageSize: 0,
      supplierName: '',
      supplierNumber: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setIsEditing(true);
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      nickname: product.nickname || '',
      baseUnit: product.baseUnit,
      packageUnitLabel: product.packageUnitLabel || '',
      packageSize: product.packageSize || 0,
      supplierName: product.supplierName || '',
      supplierNumber: product.supplierNumber || '',
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
      nickname: '',
      baseUnit: baseUnits[0] ?? '',
      packageUnitLabel: '',
      packageSize: 0,
      supplierName: '',
      supplierNumber: '',
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
          nickname: formData.nickname.trim() || undefined,
          supplierName: formData.supplierName.trim() || 'unknown',
          supplierNumber: formData.supplierNumber.trim() || 'unknown',
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

  const handleAddNewCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCat = pendingNewCategory.trim();
    if (!newCat || categories.includes(newCat)) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCat }),
      });
      if (res.ok) {
        setCategories((prev) => (prev.includes(newCat) ? prev : [newCat, ...prev]));
        setFormData({ ...formData, category: newCat });
        setShowNewCategoryModal(false);
        setPendingNewCategory('');
      } else {
        console.error('Failed to persist category');
      }
    } catch (err) {
      console.error('Failed to persist category', err);
    }
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
    (product.nickname || '').toLowerCase().includes(search.toLowerCase()) ||
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

      <ProductStats
        products={products}
        categories={categories}
        packagedCount={packagedCount}
        uniqueBaseUnits={uniqueBaseUnits}
      />

      <ProductSearchBar search={search} onSearchChange={setSearch} />

      <ProductTable products={filtered} onEdit={handleOpenEditModal} />

      {showModal && (
        <ProductFormModal
          isEditing={isEditing}
          isSaving={isSaving}
          formData={formData}
          categories={categories}
          baseUnits={baseUnits}
          onClose={handleCloseModal}
          onSubmit={handleProductSubmit}
          onChange={(field, value) => setFormData({ ...formData, [field]: value })}
          onCategoryChange={handleCategoryChange}
          onBaseUnitChange={handleBaseUnitChange}
        />
      )}

      {showNewCategoryModal && (
        <CategoryModal
          pendingNewCategory={pendingNewCategory}
          onClose={() => { setShowNewCategoryModal(false); setPendingNewCategory(''); }}
          onSubmit={handleAddNewCategory}
          onPendingChange={setPendingNewCategory}
        />
      )}

      {showNewUnitModal && (
        <UnitModal
          pendingNewUnit={pendingNewUnit}
          onClose={() => { setShowNewUnitModal(false); setPendingNewUnit(''); }}
          onSubmit={handleAddNewUnit}
          onPendingChange={setPendingNewUnit}
        />
      )}
    </div>
  );
}
