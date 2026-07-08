export interface Product {
  id: string;
  name: string;
  category: string;
  nickname?: string | null;
  currentStock: number;
  minStockLevel: number;
  baseUnit: string;
  packageUnitLabel?: string;
  packageSize?: number;
  supplierName?: string;
  supplierNumber?: string;
  unitPrice: number;
  purchasePrice: number;
}

export interface InventoryTransaction {
  id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  notes?: string;
  date: string;
  createdAt: string;
}

export const STATUS_LABELS = {
  success: { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700' },
  warning: { label: 'Low Stock', color: 'bg-amber-100 text-amber-700' },
  danger: { label: 'Out of Stock', color: 'bg-red-100 text-red-700' },
};
