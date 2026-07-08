import { Card } from '@/components/ui/Card';
import type { Product } from './types';
import { getCategoryIcon } from './types';

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
}

export function ProductTable({ products, onEdit }: Props) {
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Base Unit</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Supplier</th>
            <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Package Rule</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer" onClick={() => onEdit(product)}>
              <td className="py-4 px-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-base flex-shrink-0">{getCategoryIcon(product.category)}</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5 font-mono">Nickname: {product.nickname || product.name}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4"><span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">{product.category}</span></td>
              <td className="py-4 px-4 text-sm text-gray-700">{product.baseUnit}</td>
              <td className="py-4 px-4 text-sm text-gray-700">
                <div className="text-sm font-semibold text-gray-900">{product.supplierName || 'unknown'}</div>
                <div className="text-xs text-gray-400">{product.supplierNumber || 'unknown'}</div>
              </td>
              <td className="py-4 px-4 text-sm text-gray-700">{product.packageSize ? `1 ${product.packageUnitLabel || 'package'} = ${product.packageSize} ${product.baseUnit}` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
