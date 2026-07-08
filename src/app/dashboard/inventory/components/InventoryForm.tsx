import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatKES } from '@/lib/utils';
import type { Product } from './types';

interface Props {
  products: Product[];
  selectedProduct: Product | undefined;
  selectedStatus: { label: string; color: string } | null;
  selectedProductBoxes: number;
  selectedProductRemainder: number;
  latestTransactions: Array<{ id: string; type: 'IN' | 'OUT'; quantity: number; notes?: string; createdAt: string }>;
  formData: {
    productId: string;
    minStockLevel: number;
    unitPrice: number;
    purchasePrice: number;
    adjustMode: 'units' | 'packages';
    adjustQuantity: number;
  };
  submitting: boolean;
  equivalentUnits: number;
  onFormChange: (field: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onRevertTransaction: (id: string) => void;
}

export function InventoryForm({ products, selectedProduct, selectedStatus, selectedProductBoxes, selectedProductRemainder, latestTransactions, formData, submitting, equivalentUnits, onFormChange, onSubmit, onCancel, onRevertTransaction }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4 gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Inventory Details</h2>
            <p className="text-xs text-gray-500">Select a product definition, then update its stock, low-stock threshold, and pricing.</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 mb-1.5">Product</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" value={formData.productId} onChange={(e) => onFormChange('productId', e.target.value)} required>
                <option value="">Select product</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.nickname || product.name})</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 mb-1.5">Adjust by</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" value={formData.adjustMode} onChange={(e) => onFormChange('adjustMode', e.target.value)}>
                <option value="units">Units</option>
                <option value="packages">Packages</option>
              </select>
            </div>
          </div>

          {selectedProduct && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">Supplier Info</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><div className="text-[11px] text-slate-500">Supplier Name</div><div className="text-sm font-semibold text-slate-800">{selectedProduct.supplierName || 'unknown'}</div></div>
                <div><div className="text-[11px] text-slate-500">Supplier Number</div><div className="text-sm font-semibold text-slate-800">{selectedProduct.supplierNumber || 'unknown'}</div></div>
              </div>
            </div>
          )}

          <Input label={formData.adjustMode === 'packages' ? `Package quantity (${selectedProduct?.packageUnitLabel || 'package'})` : `Units (${selectedProduct?.baseUnit || 'units'})`} type="number" min="0" step="1" required value={formData.adjustQuantity} onChange={(e) => onFormChange('adjustQuantity', parseInt(e.target.value || '0', 10))} />

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            <span className="font-medium">Equivalent to {equivalentUnits} {selectedProduct?.baseUnit || 'units'}</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label={`Low stock threshold (${selectedProduct?.baseUnit || 'units'})`} type="number" min="0" step="1" required value={formData.minStockLevel} onChange={(e) => onFormChange('minStockLevel', parseInt(e.target.value || '0', 10))} />
            <Input label="Sale price per unit (KES)" type="number" min="0" step="0.01" required value={formData.unitPrice} onChange={(e) => onFormChange('unitPrice', parseFloat(e.target.value || '0'))} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Cost price per unit (KES)" type="number" min="0" step="0.01" required value={formData.purchasePrice} onChange={(e) => onFormChange('purchasePrice', parseFloat(e.target.value || '0'))} />
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 mb-1.5">Margin</label>
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm">
                <span className="text-lg font-semibold text-green-600">+KES {(formData.unitPrice - formData.purchasePrice).toFixed(2)}</span>
                <span className="text-sm text-gray-500">({formData.purchasePrice > 0 ? (((formData.unitPrice - formData.purchasePrice) / formData.purchasePrice * 100).toFixed(1)) : '0'}%)</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center pt-3">
            <Button type="button" onClick={onCancel} className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 text-sm" disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting || !formData.productId} className="px-3 py-2 text-sm">{submitting ? 'Saving...' : 'Update Inventory'}</Button>
          </div>
        </form>
      </Card>

      <Card className="space-y-4 p-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Selected product</h2>
          <p className="text-xs text-gray-500">Reference information for the current selection.</p>
        </div>
        {selectedProduct ? (
          <div className="space-y-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
              <div className="text-base font-semibold text-gray-900 leading-tight">{selectedProduct.name}</div>
              <div className="text-xs text-gray-500 mt-2">Nickname: {selectedProduct.nickname || selectedProduct.name}</div>
              <div className="text-xs text-gray-500">Base unit: {selectedProduct.baseUnit}</div>
              {selectedProduct.packageSize ? <div className="text-sm text-gray-500">1 {selectedProduct.packageUnitLabel || 'package'} = {selectedProduct.packageSize} {selectedProduct.baseUnit}</div> : null}
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 space-y-2">
              <div className="text-sm text-gray-700">Current stock: <span className="font-semibold text-gray-900">{selectedProduct.currentStock} {selectedProduct.baseUnit}</span></div>
              {selectedProduct.packageSize ? <div className="text-sm text-gray-700">{selectedProductBoxes} {selectedProduct.packageUnitLabel || 'boxes'} rem {selectedProductRemainder} {selectedProduct.baseUnit}</div> : null}
              {selectedStatus ? <div className="text-sm">Status: <span className={`inline-flex rounded-full px-2 py-1 text-[0.65rem] font-semibold ${selectedStatus.color}`}>{selectedStatus.label}</span></div> : null}
              <div className="text-sm text-gray-700">Pricing: <span className="font-semibold text-gray-900">KES {formatKES(selectedProduct.unitPrice)} / {selectedProduct.baseUnit}</span></div>
              <div className="text-xs text-gray-500">Cost: KES {formatKES(selectedProduct.purchasePrice)} / {selectedProduct.baseUnit}</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 space-y-3">
              <div className="font-semibold text-sm text-gray-900">Latest inventory updates</div>
              {latestTransactions.length > 0 ? <div className="space-y-2">{latestTransactions.map((transaction) => { const actionLabel = transaction.type === 'IN' ? 'Added' : 'Removed'; const sign = transaction.type === 'IN' ? '+' : '-'; const dateLabel = new Date(transaction.createdAt).toLocaleDateString(); return <div key={transaction.id} className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-white p-2"><div className="space-y-1 text-[0.72rem] leading-tight"><div className="font-semibold text-gray-900">{actionLabel} {sign}{transaction.quantity} {selectedProduct.baseUnit}</div><div className="text-gray-500">{dateLabel}</div>{transaction.notes ? <div className="text-gray-500">{transaction.notes}</div> : null}</div><button type="button" onClick={() => onRevertTransaction(transaction.id)} className="text-xs font-semibold text-red-600 hover:text-red-800" disabled={submitting}>Revert</button></div>; })}</div> : <div className="text-gray-500">No recent inventory updates.</div>}
            </div>
          </div>
        ) : <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">Pick a product to see its conversion and stock details.</div>}
      </Card>
    </div>
  );
}
