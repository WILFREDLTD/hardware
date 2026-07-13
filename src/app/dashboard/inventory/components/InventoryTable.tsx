import { Card } from '@/components/ui/Card';
import { STATUS_LABELS } from './types';
import type { Product } from './types';
import { formatKES } from '@/lib/utils';

interface Props {
  products: Product[];
  getStockStatus: (current: number, min: number) => keyof typeof STATUS_LABELS;
  onProductClick?: (productId: string) => void;
}

export function InventoryTable({ products, getStockStatus, onProductClick }: Props) {
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Package Equiv.</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Selling price (package)</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Selling price (unit)</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Min Level</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const statusKey = getStockStatus(product.currentStock, product.minStockLevel);
            const status = STATUS_LABELS[statusKey];
            return (
              <tr key={product.id} onClick={() => onProductClick?.(product.id)} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer">
                <td className="py-4 px-5">
                  <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{product.nickname || product.name} · {product.category}</div>
                </td>
                <td className="py-4 px-4 text-sm font-semibold text-gray-900">{product.currentStock} {product.baseUnit}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{product.packageSize ? `${Math.floor(product.currentStock / product.packageSize)} ${product.packageUnitLabel || 'packages'}` : '—'}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{product.packageSize ? `KES ${formatKES(product.unitPrice * product.packageSize)}` : '—'}</td>
                <td className="py-4 px-4 text-sm text-gray-900">KES {formatKES(product.unitPrice)}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{product.minStockLevel} {product.baseUnit}</td>
                <td className="py-4 px-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>{status.label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
