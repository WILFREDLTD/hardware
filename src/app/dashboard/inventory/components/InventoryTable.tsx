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
    <>
      <div className="space-y-4 md:hidden">
        {products.map((product) => {
          const statusKey = getStockStatus(product.currentStock, product.minStockLevel);
          const status = STATUS_LABELS[statusKey];
          return (
            <Card
              key={product.id}
              className="border-gray-200 p-5 cursor-pointer hover:border-gray-300 hover:shadow-lg transition-shadow"
              onClick={() => onProductClick?.(product.id)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 mb-2">Product</div>
                    <div className="text-lg font-bold text-slate-900 truncate">{product.name}</div>
                    <p className="text-sm text-slate-500 mt-1 truncate">Nickname: {product.nickname || product.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{product.category}</div>
                    <span className={`rounded-2xl px-3 py-2 text-sm font-semibold text-white ${status.color === 'bg-emerald-100 text-emerald-700' ? 'bg-emerald-600' : status.color}`}>{status.label}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Stock level</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">{product.currentStock} {product.baseUnit}</p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-3">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-amber-500">Min level</p>
                    <p className="mt-1 text-base font-semibold text-amber-700">{product.packageSize ? `${Math.floor(product.minStockLevel / product.packageSize)} ${product.packageUnitLabel || 'packages'} = ${product.minStockLevel} ${product.baseUnit}` : `${product.minStockLevel} ${product.baseUnit}`}</p>
                  </div>
                  <div className="rounded-2xl bg-sky-50 p-3">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-sky-500">Unit price</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">KES {formatKES(product.unitPrice)}</p>
                  </div>
                  <div className="rounded-2xl bg-violet-50 p-3">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-violet-500">Package equiv.</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">{product.packageSize ? `${Math.floor(product.currentStock / product.packageSize)} ${product.packageUnitLabel || 'packages'}` : '—'}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Selling price (package)</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">{product.packageSize ? `KES ${formatKES(product.unitPrice * product.packageSize)}` : '—'}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="overflow-x-auto p-0 hidden md:block">
        <table className="w-full min-w-[720px] table-auto">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3.5 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
              <th className="hidden md:table-cell text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Package Equiv.</th>
              <th className="hidden lg:table-cell text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Selling price (package)</th>
              <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Selling price (unit)</th>
              <th className="hidden md:table-cell text-left py-3.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Min Level</th>
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
                  <td className="hidden md:table-cell py-4 px-4 text-sm text-gray-600">{product.packageSize ? `${Math.floor(product.currentStock / product.packageSize)} ${product.packageUnitLabel || 'packages'}` : '—'}</td>
                  <td className="hidden lg:table-cell py-4 px-4 text-sm text-gray-900">{product.packageSize ? `KES ${formatKES(product.unitPrice * product.packageSize)}` : '—'}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">KES {formatKES(product.unitPrice)}</td>
                  <td className="hidden md:table-cell py-4 px-4 text-sm text-gray-600">{product.packageSize ? `${Math.floor(product.minStockLevel / product.packageSize)} ${product.packageUnitLabel || 'packages'}=${product.minStockLevel} ${product.baseUnit}` : `${product.minStockLevel} ${product.baseUnit}`}</td>
                  <td className="py-4 px-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>{status.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}
