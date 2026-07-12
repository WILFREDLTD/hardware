'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { formatKES } from '@/lib/utils'

type CartItem = {
  productId: string
  name: string
  unitPrice: number
  quantity: number
  max: number
}

interface SalesCartProps {
  cart: CartItem[]
  regularSubtotal: number
  finalAmountInput: string
  setFinalAmountInput: (value: string) => void
  cashPaid: string
  setCashPaid: (value: string) => void
  paidValue: number
  changeValue: number
  total: number
  discountValue: number
  isProcessing: boolean
  showCalc: boolean
  setShowCalc: (value: boolean) => void
  updateQty: (index: number, qty: number) => void
  removeFromCart: (idx: number) => void
  handleCashSale: () => Promise<void>
}

export default function SalesCart({
  cart,
  regularSubtotal,
  finalAmountInput,
  setFinalAmountInput,
  cashPaid,
  setCashPaid,
  paidValue,
  changeValue,
  total,
  discountValue,
  isProcessing,
  setShowCalc,
  updateQty,
  removeFromCart,
  handleCashSale,
}: SalesCartProps) {
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({})

  useEffect(() => {
    setQuantityInputs((current) => {
      const next: Record<string, string> = {}
      cart.forEach((item) => {
        next[item.productId] = current[item.productId] ?? String(item.quantity)
      })
      return next
    })
  }, [cart])

  const handleQuantityChange = (idx: number, item: CartItem, value: string) => {
    setQuantityInputs((current) => ({ ...current, [item.productId]: value }))
    if (value === '') {
      return
    }
    const parsed = parseInt(value, 10)
    if (Number.isNaN(parsed)) {
      return
    }
    const normalized = Math.max(1, Math.min(item.max, parsed))
    updateQty(idx, normalized)
    setQuantityInputs((current) => ({ ...current, [item.productId]: String(normalized) }))
  }

  const handleQuantityBlur = (item: CartItem) => {
    const currentValue = quantityInputs[item.productId]
    if (!currentValue || currentValue === '') {
      setQuantityInputs((current) => ({ ...current, [item.productId]: String(item.quantity) }))
      return
    }
    const parsed = parseInt(currentValue, 10)
    if (Number.isNaN(parsed) || parsed < 1) {
      setQuantityInputs((current) => ({ ...current, [item.productId]: String(item.quantity) }))
      return
    }
    const normalized = Math.max(1, Math.min(item.max, parsed))
    updateQty(cart.findIndex((cartItem) => cartItem.productId === item.productId), normalized)
    setQuantityInputs((current) => ({ ...current, [item.productId]: String(normalized) }))
  }

  return (
    <Card>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Cart</div>
      {cart.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <div className="text-4xl mb-3">🛒</div>
          <div className="text-sm">Search and add products above</div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map((it, idx) => (
              <div key={it.productId} className="flex items-center gap-4 py-3 px-4 bg-gray-50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{it.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">KES {formatKES(it.unitPrice)} each</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(idx, Math.max(1, it.quantity - 1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">−</button>
                  <input
                    type="number"
                    min="1"
                    max={it.max}
                    value={quantityInputs[it.productId] ?? String(it.quantity)}
                    onChange={(e) => handleQuantityChange(idx, it, e.target.value)}
                    onBlur={() => handleQuantityBlur(it)}
                    className="w-16 text-center text-sm font-semibold border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-100 [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                    style={{ appearance: 'textfield' }}
                  />
                  <button onClick={() => updateQty(idx, Math.min(it.max, it.quantity + 1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">+</button>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">KES {formatKES(it.unitPrice * it.quantity)}</div>
                </div>
                <button onClick={() => removeFromCart(idx)} className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="flex items-start justify-between gap-4 px-5 py-4 bg-emerald-50">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-700">Final Amount to Pay</div>
                  <div className="mt-2 text-xs text-slate-500">Enter the amount the customer will pay.</div>
                </div>
              </div>

              <div className="px-5 py-5 bg-emerald-50">
                <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8m-4-4v8m6 0a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12z" /></svg>
                    </div>
                    <div className="text-sm text-slate-500">Final Amount</div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={finalAmountInput}
                    onChange={(e) => setFinalAmountInput(e.target.value)}
                    placeholder={`KES ${formatKES(regularSubtotal)}`}
                    className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-4 text-right text-3xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCalc(true)}
                    className="self-end h-12 w-12 rounded-3xl bg-emerald-700 text-white flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4h8M8 20h8M12 4v16M4 8h16M4 16h16" /></svg>
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-3 bg-white">
                <div className="flex items-center justify-between gap-3 rounded-3xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-3xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Original Subtotal</p>
                      <p className="text-xs text-slate-400">Original total before discount</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">KES {formatKES(regularSubtotal)}</div>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-3xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 12h4m-4 5h8" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Discount</p>
                      <p className="text-xs text-slate-400">Amount reduced from subtotal</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-amber-600">KES {formatKES(discountValue)}</div>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-3xl border border-gray-100 bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-3xl bg-emerald-700 text-white flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Final Total</p>
                      <p className="text-xs text-slate-400">Amount customer will pay</p>
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-emerald-700">KES {formatKES(total)}</div>
                </div>

                <div className="rounded-3xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>You are saving</span>
                  </div>
                  <div className="mt-2 text-lg">KES {formatKES(discountValue)}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-100 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-3xl bg-slate-100 text-slate-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v6m6-6a3 3 0 00-3-3m0 0V4m0 4h6" /></svg>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Amount Paid</div>
                    <div className="text-sm font-semibold text-slate-900">KES {formatKES(paidValue)}</div>
                  </div>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cashPaid}
                  onChange={(e) => setCashPaid(e.target.value)}
                  placeholder="KES 0.00"
                  className="mt-4 w-full rounded-3xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>

              <div className="rounded-3xl border border-gray-100 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" /></svg>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Change</div>
                    <div className="text-xl font-semibold text-emerald-700">KES {formatKES(changeValue)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-emerald-700 px-4 py-4 text-center text-white shadow-sm">
              <button
                onClick={handleCashSale}
                disabled={cart.length === 0 || isProcessing}
                className="w-full rounded-3xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Record Cash Sale →
              </button>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
