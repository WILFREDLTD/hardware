'use client';

export interface Stats {
  totalRevenue: number;
  itemsSold: number;
  totalDebts: number;
  debtsPending: number;
  debtsCollected: number;
  profit: number;
  lowStockItems: number;
  storeName?: string;
  storeLocation?: string;
  storeDescription?: string;
  hardwareCount?: number;
  hardwareValue?: number;
  hardwareItems?: Array<{
    id: string;
    name: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    purchasePrice: number;
    createdAt: string;
    updatedAt?: string;
    listName?: string | null;
    description?: string | null;
  }>;
}

export interface Sale {
  id: string;
  saleDate: string;
  totalAmount: number;
  paymentStatus: string;
  saleItems: { quantity: number; unitPrice: number; total?: number; discount?: number; product: { name: string; category: string; purchasePrice: number } }[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  nickname?: string | null;
  currentStock: number;
  minStockLevel: number;
  unitPrice: number;
  purchasePrice: number;
}

export interface Debt {
  id: string;
  debtorName: string;
  amount: number;
  amountPaid: number;
  status: string;
  date: string;
}
