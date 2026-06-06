// Type definitions

export interface Product {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  saleDate: Date;
  totalAmount: number;
  paymentStatus: "PAID" | "DEBT";
  notes?: string;
  deletedAt?: Date;
  deletionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  discount: number;
}

export interface Debt {
  id: string;
  saleId?: string;
  debtorName: string;
  debtorPhone: string;
  amount: number;
  amountPaid: number;
  date: Date;
  dueDate?: Date;
  status: "PENDING" | "PARTIAL" | "PAID";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: Date;
  notes?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  itemsSold: number;
  totalDebts: number;
  pendingDebts: number;
  debtsCollected: number;
  lowStockItems: Product[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}
