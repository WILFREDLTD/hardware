export type ReportSectionKey = 'overview' | 'sales' | 'inventory' | 'debts' | 'profit' | 'all';

export interface ReportExportPayload {
  section: ReportSectionKey;
  title?: string;
  generatedAt?: string;
  userName?: string;
  storeName?: string;
  storeLocation?: string;
  storeDescription?: string;
  dateRange?: string;
  stats: any;
  filteredSales: any[];
  salesByDay: Array<{ x: string; y: number }>;
  revenueByCategory: Array<[string, number]>;
  topProducts: Array<[string, { qty: number; rev: number }]>;
  lowStock: number;
  outOfStock: number;
  pendingDebtsCount: number;
  products: any[];
  debts: any[];
  profitByDay: Array<{ x: string; y: number }>;
}
