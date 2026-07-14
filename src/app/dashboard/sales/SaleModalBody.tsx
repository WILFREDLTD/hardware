'use client'

import { useState, useMemo } from 'react'
import { formatKES } from '@/lib/utils'
import Toast from '@/components/ui/Toast'
import type { SaleModalProps } from './types'

type ToastState = {
  show: boolean
  title: string
  description: string
  variant: 'success' | 'error'
}

export default function SaleModalBody({
  selectedSale,
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
  if (!selectedSale) return null
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    description: '',
    variant: 'success',
  })

  const editedSaleTotal = editedSaleItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  const isPhoneValid = (phone: string) => {
    const cleanedPhone = phone.replace(/\D/g, '')
    return cleanedPhone.length === 10 || cleanedPhone.length === 12
  }

  const isDebtMode = statusOption === 'DEBT'
  const hasRequiredDebtorDetails = isDebtMode
    ? debtorName.trim() !== '' && debtorPhone.trim() !== '' && isPhoneValid(debtorPhone)
    : true

  const allQuantitiesValid = editedSaleItems.every((editedItem) => {
    if (editedItem.quantity <= 0) return false
    const originalItem = selectedSale.saleItems?.find((i) => i.id === editedItem.id)
    const originalQuantity = originalItem?.quantity || editedItem.quantity
    const maxQty = originalQuantity + (editedItem.product?.currentStock || 0)
    return editedItem.quantity <= maxQty
  })

  const hasChanges = useMemo(() => {
    const quantitiesChanged = editedSaleItems.some((editedItem) => {
      const originalItem = selectedSale.saleItems?.find((item) => item.id === editedItem.id)
      return originalItem && originalItem.quantity !== editedItem.quantity
    })
    const itemsRemoved = (selectedSale.saleItems?.length || 0) !== editedSaleItems.length
    const statusChanged = selectedSale.paymentStatus !== statusOption
    return quantitiesChanged || itemsRemoved || statusChanged
  }, [editedSaleItems, selectedSale, statusOption])

  const canSave = hasChanges && hasRequiredDebtorDetails && allQuantitiesValid

  const showToast = (title: string, description: string, variant: 'success' | 'error') => {
    setToast({ show: true, title, description, variant })
  }

  const handleSaveChanges = async () => {
    if (!hasChanges) return
    if (isDebtMode && !hasRequiredDebtorDetails) {
      if (!debtorName.trim()) showToast('Missing Name', 'Debtor name is required', 'error')
      else if (!debtorPhone.trim()) showToast('Missing Phone', 'Debtor phone is required', 'error')
      else showToast('Invalid Phone', 'Phone number must be 10 or 12 digits', 'error')
      return
    }

    if (!allQuantitiesValid) {
      showToast('Invalid Quantity', 'All items must have a quantity greater than 0', 'error')
      return
    }

    for (const editedItem of editedSaleItems) {
      const originalItem = selectedSale.saleItems?.find((i) => i.id === editedItem.id)
      const originalQuantity = originalItem?.quantity || editedItem.quantity
      const maxQty = originalQuantity + (editedItem.product?.currentStock || 0)
      if (editedItem.quantity > maxQty) {
        showToast('Quantity Exceeded', `${editedItem.product?.name || 'Item'}: maximum available is ${maxQty}`, 'error')
        return
      }
    }

    setIsSaving(true)
    try {
      const success = await updateSaleStatus()
      showToast(success ? 'Success' : 'Error', success ? 'Changes saved successfully' : 'Failed to save changes', success ? 'success' : 'error')
    } catch (error) {
      console.error('Error saving changes:', error)
      showToast('Error', 'An error occurred while saving changes', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-black/40" onClick={closeSaleModal} />

      <div className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90vh] sm:w-full sm:max-w-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-8 sm:py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Manage sale</h2>
            <p className="mt-0.5 text-xs text-gray-500">{new Date(selectedSale.saleDate).toLocaleString()}</p>
          </div>
          <button
            type="button"
            onClick={closeSaleModal}
            className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSaveChanges()
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Scrollable body */}
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 text-sm text-gray-700 sm:px-8 sm:py-6">
            {/* Sale items */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Sale items</span>
                <span className="text-xs text-gray-400">{editedSaleItems.length} item{editedSaleItems.length === 1 ? '' : 's'}</span>
              </div>
              <div className="space-y-2.5">
                {editedSaleItems.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                    This sale has no editable items left.
                  </div>
                ) : (
                  editedSaleItems.map((item) => {
                    const originalItem = selectedSale.saleItems?.find((i) => i.id === item.id)
                    const originalQuantity = originalItem?.quantity || item.quantity
                    const maxQty = originalQuantity + (item.product?.currentStock || 0)
                    const atLimit = item.quantity >= maxQty

                    return (
                      <div key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3">
                        <div className="flex items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-gray-900">{item.product?.name || 'Item'}</div>
                            <div className="text-xs text-gray-500">KES {formatKES(item.unitPrice)} each</div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateModalItemQty(item.id, Math.max(0, item.quantity - 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-600 transition hover:bg-gray-100"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="0"
                              max={maxQty}
                              value={item.quantity}
                              onChange={(e) => {
                                const inputValue = e.target.value
                                const newQty = inputValue === '' ? 0 : parseInt(inputValue, 10)
                                if (Number.isNaN(newQty)) return updateModalItemQty(item.id, 0)
                                if (newQty > maxQty) return
                                updateModalItemQty(item.id, newQty)
                              }}
                              className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <button
                              type="button"
                              onClick={() => updateModalItemQty(item.id, Math.min(maxQty, item.quantity + 1))}
                              disabled={atLimit}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeModalSaleItem(item.id)}
                            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                        <div className={`mt-1.5 px-0.5 text-xs ${atLimit ? 'text-amber-600' : 'text-gray-400'}`}>
                          Max available: {maxQty} ({originalQuantity} in sale + {item.product?.currentStock || 0} in stock)
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Amount / Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-emerald-700/70">Amount</div>
                <div className="mt-1 text-base font-bold text-emerald-900">KES {formatKES(editedSaleTotal)}</div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Date</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">{new Date(selectedSale.saleDate).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Payment status */}
            <div>
              <div className="mb-2 text-sm font-semibold text-gray-900">Payment status</div>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'PAID' as const, label: 'Paid' },
                  { value: 'DEBT' as const, label: 'On Debt' },
                ]).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatusOption(value)}
                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      statusOption === value
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {value === 'PAID' ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="9" strokeWidth={2} />
                      </svg>
                    )}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {statusOption === 'DEBT' && (
              <div className="grid grid-cols-1 gap-3 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Debtor name</label>
                  <input
                    value={debtorName}
                    onChange={(e) => setDebtorName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Debtor phone</label>
                  <input
                    value={debtorPhone}
                    onChange={(e) => setDebtorPhone(e.target.value)}
                    placeholder="10 or 12 digits"
                    className={`w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      debtorPhone.trim() && !isPhoneValid(debtorPhone) ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {debtorPhone.trim() && !isPhoneValid(debtorPhone) && (
                    <p className="mt-1 text-xs text-red-600">Phone must be 10 or 12 digits</p>
                  )}
                </div>
              </div>
            )}

            {confirmDelete && (
              <div className="space-y-2 rounded-2xl border border-red-100 bg-red-50/50 p-4">
                <label className="block text-xs font-medium text-gray-700">Delete reason</label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Optional note for why this sale is archived"
                  className="min-h-[90px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <p className="text-xs text-gray-500">Deleted sales are archived for audit and excluded from revenue calculations.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-gray-100 px-5 py-4 sm:px-8 sm:py-5">
            {!confirmDelete ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex-1 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Archive sale
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={!canSave || isSaving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={deleteSale}
                  disabled={isProcessing}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isProcessing ? 'Archiving…' : 'Confirm archive'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>

        <Toast open={toast.show} title={toast.title} description={toast.description} variant={toast.variant} onClose={() => setToast({ ...toast, show: false })} />
      </div>
    </div>
  )
}