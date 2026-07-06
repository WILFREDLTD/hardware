'use client'
import { formatKES } from '@/lib/utils'

interface CheckoutSummaryProps {
  regularSubtotal: number
  paidValue: number
  changeValue: number
  total: number
  discountValue: number
  isProcessing: boolean
  cartLength: number
  cashPaid: string
  setCashPaid: (value: string) => void
  handleCashSale: () => Promise<void>
}

export default function CheckoutSummary({
  regularSubtotal,
  paidValue,
  changeValue,
  total,
  discountValue,
  isProcessing,
  cartLength,
  cashPaid,
  setCashPaid,
  handleCashSale,
}: CheckoutSummaryProps) {
  return (
    <>
      <div className="space-y-3 bg-white p-5 rounded-3xl mt-5">
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
          type="button"
          onClick={handleCashSale}
          disabled={cartLength === 0 || isProcessing}
          className="w-full rounded-3xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Record Cash Sale →
        </button>
      </div>
    </>
  )
}
