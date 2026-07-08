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
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CATEGORIES = [
  'Tools',
  'Electrical',
  'Plumbing',
  'Paint',
  'Lumber',
  'Hardware',
  'Safety',
];

export const UNIT_OPTIONS = ['kg', 'g', 'liter', 'pcs', 'meter', 'bag', 'box'];

export function getCategoryIcon(cat: string) {
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
