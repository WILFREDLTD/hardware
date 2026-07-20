import { Card } from '@/components/ui/Card';
import type { Product } from './types';
import { getCategoryIcon } from './types';

function getCategoryColor(category: string) {
  const slug = category?.toLowerCase?.() || '';
  if (slug.includes('electrical')) return 'border-emerald-100 bg-emerald-50 text-emerald-700';
  if (slug.includes('plumbing')) return 'border-sky-100 bg-sky-50 text-sky-700';
  if (slug.includes('hardware')) return 'border-orange-100 bg-orange-50 text-orange-700';
  if (slug.includes('tools')) return 'border-violet-100 bg-violet-50 text-violet-700';
  return 'border-amber-100 bg-amber-50 text-amber-700';
}

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
}

export function ProductTable({ products, onEdit }: Props) {
  return (
    <>
      <div className="space-y-4 md:hidden">
        {products.map((product) => (
          <Card
            key={product.id}
            className="border-gray-200 p-4 cursor-pointer hover:border-gray-300 hover:shadow-md transition-shadow"
            onClick={() => onEdit(product)}
          >
            <div className="grid gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-11 h-11 rounded-2xl border ${getCategoryColor(product.category)} flex items-center justify-center text-xl flex-shrink-0`}>
                  {getCategoryIcon(product.category)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 truncate">{product.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">Nickname: {product.nickname || product.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Category</p>
                  <p className="font-semibold text-slate-900 mt-1">{product.category}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-600">Base Unit</p>
                  <p className="font-semibold text-slate-900 mt-1">{product.baseUnit}</p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-sky-600">Supplier</p>
                  <p className="font-semibold text-slate-900 mt-1">{product.supplier?.name || product.supplierName || 'No supplier'}</p>
                  {product.supplier?.phone || product.supplierNumber ? (
                    <p className="text-xs text-slate-500 mt-1">{product.supplier?.phone || product.supplierNumber}</p>
                  ) : null}
                </div>
                <div className="rounded-2xl bg-amber-50 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-amber-700">Package Rule</p>
                  <p className="font-semibold text-slate-900 mt-1">{product.packageSize ? `1 ${product.packageUnitLabel || 'package'} = ${product.packageSize} ${product.baseUnit}` : 'Not configured'}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-x-auto p-0 hidden md:block">
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
                  {product.supplier ? (
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{product.supplier.name}</div>
                      <div className="text-xs text-gray-400">{product.supplier.phone || 'No phone'}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">No supplier</span>
                  )}
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">{product.packageSize ? `1 ${product.packageUnitLabel || 'package'} = ${product.packageSize} ${product.baseUnit}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
