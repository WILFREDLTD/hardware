'use client'
import { formatKES } from '@/lib/utils'

type SaleItem = {
  id: string
  quantity: number
  unitPrice: number
  product?: {
    name?: string
    currentStock?: number
  }
}

type Sale = {
  id: string
  saleItems?: SaleItem[]
  paymentStatus: string
  saleDate: string
}

interface SaleModalProps {
  selectedSale: Sale | null
  showSaleModal: boolean
  closeSaleModal: () => void
  updateSaleStatus: (e: React.FormEvent) => Promise<void>
  isProcessing: boolean
  editedSaleItems: SaleItem[]
  updateModalItemQty: (itemId: string, qty: number) => void
  removeModalSaleItem: (itemId: string) => void
  statusOption: 'PAID' | 'DEBT'
  setStatusOption: (value: 'PAID' | 'DEBT') => void
  debtorName: string
  setDebtorName: (value: string) => void
  debtorPhone: string
  setDebtorPhone: (value: string) => void
  confirmDelete: boolean
  setConfirmDelete: (value: boolean) => void
  deleteSale: () => Promise<void>
  deleteReason: string
  setDeleteReason: (value: string) => void
}

export default function SaleModal({
  selectedSale,
  showSaleModal,
  closeSaleModal,
  updateSaleStatus,
  isProcessing,
  editedSaleItems,
  updateModalItemQty,
  removeModalSaleItem,
  statusOption,
  setStatusOption,
  debtorName,
  setDebtorName,
  debtorPhone,
  setDebtorPhone,
  confirmDelete,
  setConfirmDelete,
  deleteSale,
  deleteReason,
  setDeleteReason,
}: SaleModalProps) {
  if (!showSaleModal || !selectedSale) return null

  const editedSaleTotal = editedSaleItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" />
      <div className="relative z-10 mx-auto w-full max-w-3xl rounded-3xl bg-white shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Manage Sale</h2>
          <button type="button" onClick={closeSaleModal} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={updateSaleStatus} className="space-y-4 text-sm text-gray-700">
          <div>
            <div className="font-semibold text-gray-900 mb-1">Sale items</div>
            <div className="space-y-3 text-xs text-gray-500">
              {editedSaleItems.length === 0 ? (
                <div className="text-sm text-gray-500">This sale has no editable items left.</div>
              ) : (
                editedSaleItems.map((item) => {
                  const maxQty = item.quantity + (item.product?.currentStock || 0)
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{item.product?.name || 'Item'}</div>
                        <div className="text-xs text-gray-500">KES {formatKES(item.unitPrice)} each</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => updateModalItemQty(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">−</button>
                        <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                        <button type="button" onClick={() => updateModalItemQty(item.id, Math.min(maxQty, item.quantity + 1))} disabled={item.quantity >= maxQty} className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50">+</button>
                      </div>
                      <button type="button" onClick={() => removeModalSaleItem(item.id)} className="text-red-500 hover:text-red-600 text-sm font-semibold">Remove</button>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>
              <div className="font-medium text-gray-900">Amount</div>
              KES {formatKES(editedSaleTotal)}
            </div>
            <div>
              <div className="font-medium text-gray-900">Date</div>
              {new Date(selectedSale.saleDate).toLocaleString()}
            </div>
          </div>

          <div>
            <div className="font-medium text-gray-900 mb-2">Payment status</div>
            <div className="grid grid-cols-2 gap-2">
              {(['PAID', 'DEBT'] as const).map((status) => (
                <button key={status} type="button" onClick={() => setStatusOption(status)} className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${statusOption === status ? 'bg-emerald-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {status}
                </button>
              ))}
            </div>
          </div>

          {statusOption === 'DEBT' && selectedSale.paymentStatus !== 'DEBT' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Debtor name</label>
                <input value={debtorName} onChange={(e) => setDebtorName(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Debtor phone</label>
                <input value={debtorPhone} onChange={(e) => setDebtorPhone(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
              </div>
            </div>
          )}

          {!confirmDelete ? (
            <button type="button" onClick={() => setConfirmDelete(true)} className="w-full px-4 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">Archive sale</button>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">Delete reason</label>
                <textarea value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder="Optional note for why this sale is archived" className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm min-h-[100px]" />
                <p className="text-xs text-gray-400">Deleted sales are archived for audit and excluded from revenue calculations.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={deleteSale} disabled={isProcessing} className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:cursor-not-allowed disabled:opacity-70">{isProcessing ? 'Archiving…' : 'Confirm archive'}</button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
