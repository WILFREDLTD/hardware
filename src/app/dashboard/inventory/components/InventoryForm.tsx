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
    movementCategory: 'ADD' | 'REMOVE' | 'CORRECTION';
    correctionDirection: 'IN' | 'OUT';
    reason: string;
  };
  submitting: boolean;
  equivalentUnits: number;
  stockPreviewCurrent: number;
  stockPreviewDelta: number;
  stockPreviewNext: number;
  actionLabel: string;
  onFormChange: (field: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onRevertTransaction: (id: string) => void;
  isModal?: boolean;
}

export function InventoryForm({
  products,
  selectedProduct,
  selectedStatus,
  selectedProductBoxes,
  selectedProductRemainder,
  latestTransactions,
  formData,
  submitting,
  equivalentUnits,
  stockPreviewCurrent,
  stockPreviewDelta,
  stockPreviewNext,
  actionLabel,
  onFormChange,
  onSubmit,
  onCancel,
  onRevertTransaction,
  isModal,
}: Props) {
  const containerClass = isModal ? 'grid gap-4 grid-cols-1' : 'grid gap-6 lg:grid-cols-[1.4fr_0.8fr]'

  return (
    <div className={containerClass}>
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
              {selectedProduct.supplier ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><div className="text-[11px] text-slate-500">Supplier Name</div><div className="text-sm font-semibold text-slate-800">{selectedProduct.supplier.name}</div></div>
                  <div><div className="text-[11px] text-slate-500">Supplier Phone</div><div className="text-sm font-semibold text-slate-800">{selectedProduct.supplier.phone || 'No phone'}</div></div>
                </div>
              ) : (
                <div className="text-sm text-slate-600">No supplier assigned</div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 mb-1.5">Movement type</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" value={formData.movementCategory} onChange={(e) => onFormChange('movementCategory', e.target.value)}>
                <option value="ADD">Add Stock</option>
                <option value="REMOVE">Remove Stock</option>
                <option value="CORRECTION">Stock Correction</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 mb-1.5">Adjustment reason</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" value={formData.reason} onChange={(e) => onFormChange('reason', e.target.value)}>
                <option value="New Purchase">New Purchase</option>
                <option value="Damaged Goods">Damaged Goods</option>
                <option value="Stock Count">Stock Count</option>
                <option value="Returned Goods">Returned Goods</option>
                <option value="Manual Correction">Manual Correction</option>
              </select>
            </div>
          </div>

          {formData.movementCategory === 'CORRECTION' ? (
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 mb-1.5">Correction direction</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" value={formData.correctionDirection} onChange={(e) => onFormChange('correctionDirection', e.target.value)}>
                <option value="IN">Increase stock</option>
                <option value="OUT">Decrease stock</option>
              </select>
            </div>
          ) : null}

          <Input label={formData.adjustMode === 'packages' ? `Package quantity (${selectedProduct?.packageUnitLabel || 'package'})` : `Units (${selectedProduct?.baseUnit || 'units'})`} type="number" min="0" step="1" required value={formData.adjustQuantity} onChange={(e) => onFormChange('adjustQuantity', parseInt(e.target.value || '0', 10))} />

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            <span className="font-medium">Equivalent to {equivalentUnits} {selectedProduct?.baseUnit || 'units'}</span>
          </div>

          <div className="rounded-lg border border-green-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <div className="font-semibold">Stock preview</div>
            <div className="mt-2 grid grid-cols-3 gap-3 text-xs text-emerald-900">
              <div className="rounded-lg bg-white p-3">
                <div className="text-gray-500">Current</div>
                <div className="font-semibold">{stockPreviewCurrent} {selectedProduct?.baseUnit || 'units'}</div>
              </div>
              <div className="rounded-lg bg-white p-3">
                <div className="text-gray-500">{stockPreviewDelta >= 0 ? 'Add' : 'Remove'}</div>
                <div className="font-semibold">{stockPreviewDelta >= 0 ? '+' : ''}{stockPreviewDelta} {selectedProduct?.baseUnit || 'units'}</div>
              </div>
              <div className="rounded-lg bg-white p-3">
                <div className="text-gray-500">New total</div>
                <div className="font-semibold">{stockPreviewNext} {selectedProduct?.baseUnit || 'units'}</div>
              </div>
            </div>
          </div>

          {(() => {
            const priceUnit = selectedProduct?.packageSize && formData.adjustMode === 'packages'
              ? selectedProduct.packageSize
              : 1;
            const priceLabel = selectedProduct?.packageSize && formData.adjustMode === 'packages'
              ? `per ${selectedProduct.packageUnitLabel || 'package'}`
              : selectedProduct?.baseUnit
                ? `per ${selectedProduct.baseUnit}`
                : 'per unit';
            const sellingPrice = formData.unitPrice * priceUnit;
            const costPrice = formData.purchasePrice * priceUnit;
            const marginAmount = sellingPrice - costPrice;
            const marginPercent = costPrice > 0 ? ((marginAmount / costPrice) * 100).toFixed(1) : '0';

            const formatDisplayNumber = (value: number) => {
              const rounded = Number(value.toFixed(12));
              if (Number.isInteger(rounded)) return String(rounded);
              return rounded.toString().replace(/(?:\.\d*?)0+$/, '').replace(/\.$/, '');
            };

            return (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label={`Low stock threshold (${selectedProduct?.packageSize && formData.adjustMode === 'packages' ? selectedProduct.packageUnitLabel || 'packages' : selectedProduct?.baseUnit || 'units'})`}
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={selectedProduct?.packageSize && formData.adjustMode === 'packages'
                      ? Math.ceil(formData.minStockLevel / selectedProduct.packageSize)
                      : formData.minStockLevel}
                    onChange={(e) => {
                      const nextValue = parseInt(e.target.value || '0', 10);
                      onFormChange('minStockLevel', selectedProduct?.packageSize && formData.adjustMode === 'packages'
                        ? nextValue * selectedProduct.packageSize
                        : nextValue);
                    }}
                  />
                  <Input
                    label={`Selling price ${priceLabel} (KES)`}
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formatDisplayNumber(sellingPrice)}
                    onChange={(e) => onFormChange('unitPrice', parseFloat(e.target.value || '0') / priceUnit)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label={`Cost price ${priceLabel} (KES)`}
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formatDisplayNumber(costPrice)}
                    onChange={(e) => onFormChange('purchasePrice', parseFloat(e.target.value || '0') / priceUnit)}
                  />
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-700 mb-1.5">Margin</label>
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm">
                      <span className="text-lg font-semibold text-green-600">+KES {marginAmount.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">({marginPercent}%)</span>
                    </div>
                  </div>
                </div>
              </>
            )
          })()}

          <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:justify-end">
            <Button type="button" onClick={onCancel} className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 text-sm" disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting || !formData.productId} className="px-3 py-2 text-sm">
              {submitting ? 'Saving...' : actionLabel}
            </Button>
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
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 space-y-3">
              <div className="text-sm text-gray-700">Current stock</div>
              <div className="text-2xl font-semibold text-gray-900">{selectedProduct.currentStock} {selectedProduct.baseUnit}</div>
              {selectedProduct.packageSize ? <div className="text-sm text-gray-600">({selectedProductBoxes} {selectedProduct.packageUnitLabel || 'packages'} × {selectedProduct.packageSize} {selectedProduct.baseUnit} + {selectedProductRemainder} {selectedProduct.baseUnit})</div> : null}
              {selectedStatus ? <div className="text-sm">Status: <span className={`inline-flex rounded-full px-2 py-1 text-[0.65rem] font-semibold ${selectedStatus.color}`}>{selectedStatus.label}</span></div> : null}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
                <div className="rounded-lg bg-white p-3 border border-gray-200">
                  <div className="text-gray-500">Sale price</div>
                  <div className="font-semibold text-gray-900">KES {formatKES(selectedProduct.unitPrice)}</div>
                </div>
                <div className="rounded-lg bg-white p-3 border border-gray-200">
                  <div className="text-gray-500">Cost price</div>
                  <div className="font-semibold text-gray-900">KES {formatKES(selectedProduct.purchasePrice)}</div>
                </div>
              </div>
              <div className="rounded-lg bg-white p-3 border border-gray-200">
                <div className="text-gray-500">Profit</div>
                <div className="font-semibold text-gray-900">KES {(selectedProduct.unitPrice - selectedProduct.purchasePrice).toFixed(2)}</div>
                <div className="text-xs text-gray-500">Margin {selectedProduct.purchasePrice > 0 ? (((selectedProduct.unitPrice - selectedProduct.purchasePrice) / selectedProduct.purchasePrice) * 100).toFixed(1) : '0'}%</div>
              </div>
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
