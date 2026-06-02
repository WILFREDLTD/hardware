'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

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

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    currentStock: 0,
    minStockLevel: 5,
    unitPrice: 0,
    purchasePrice: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/inventory');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          currentStock: parseInt(formData.currentStock as any),
          minStockLevel: parseInt(formData.minStockLevel as any),
          unitPrice: parseFloat(formData.unitPrice as any),
          purchasePrice: parseFloat(formData.purchasePrice as any),
        }),
      });

      if (response.ok) {
        fetchProducts();
        setShowModal(false);
        setFormData({
          name: '',
          category: '',
          sku: '',
          currentStock: 0,
          minStockLevel: 5,
          unitPrice: 0,
          purchasePrice: 0,
        });
      }
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { badge: 'danger', text: 'Out of Stock' };
    if (current <= min) return { badge: 'warning', text: 'Low Stock' };
    return { badge: 'success', text: 'In Stock' };
  };

  return (
    <div>
      <Header
        title="Inventory Management"
        subtitle="Manage your hardware store products"
        action={
          <Button onClick={() => setShowModal(true)}>+ Add Product</Button>
        }
      />

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products yet</p>
            <Button onClick={() => setShowModal(true)}>Add Your First Product</Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = getStockStatus(product.currentStock, product.minStockLevel);
                return (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{product.category}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">
                        {product.currentStock}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        (min: {product.minStockLevel})
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      ${product.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          status.badge as
                            | 'success'
                            | 'warning'
                            | 'danger'
                            | 'info'
                            | 'neutral'
                        }
                      >
                        {status.text}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {showModal && (
        <Modal
          title="Add New Product"
          onClose={() => setShowModal(false)}
          onSubmit={handleAddProduct}
        >
          <div className="space-y-4">
            <Input
              label="Product Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              label="Category"
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
            <Input
              label="SKU"
              required
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
            />
            <Input
              label="Unit Price"
              type="number"
              step="0.01"
              required
              value={formData.unitPrice}
              onChange={(e) =>
                setFormData({ ...formData, unitPrice: e.target.value as any })
              }
            />
            <Input
              label="Purchase Price"
              type="number"
              step="0.01"
              required
              value={formData.purchasePrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  purchasePrice: e.target.value as any,
                })
              }
            />
            <Input
              label="Current Stock"
              type="number"
              required
              value={formData.currentStock}
              onChange={(e) =>
                setFormData({ ...formData, currentStock: e.target.value as any })
              }
            />
            <Input
              label="Minimum Stock Level"
              type="number"
              required
              value={formData.minStockLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minStockLevel: e.target.value as any,
                })
              }
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
