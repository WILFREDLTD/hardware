'use client'
import { formatKES } from '@/lib/utils'

interface CheckoutSummaryProps {
  regularSubtotal: number
  changeValue: number
  discountValue: number
  cashPaid: string
  setCashPaid: (value: string) => void
  handleCashSale: () => Promise<void>
  isCheckoutDisabled: boolean
  checkoutDisabledReason: string
  isProcessing: boolean
}

export default function CheckoutSummary({
  regularSubtotal,
  changeValue,
  discountValue,
  cashPaid,
  setCashPaid,
  handleCashSale,
  isCheckoutDisabled,
  checkoutDisabledReason,
  isProcessing,
}: CheckoutSummaryProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 bg-white p-3 rounded-2xl mt-3">
        <div className="flex items-center gap-2 rounded-2xl border border-gray-100 p-3">
          <div className="h-7 w-7 shrink-0 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 leading-tight">Original Amount</p>
            <p className="text-xs font-semibold text-slate-900 truncate">KES {formatKES(regularSubtotal)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-gray-100 p-3">
          <div className="h-7 w-7 shrink-0 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 12h4m-4 5h8" /></svg>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 leading-tight">Discount</p>
            <p className="text-xs font-semibold text-amber-600 truncate">KES {formatKES(discountValue)}</p>
          </div>
        </div>
{/* 
        <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-emerald-50 p-3">
          <div className="h-7 w-7 shrink-0 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" /></svg>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 leading-tight">Final Total</p>
            <p className="text-sm font-semibold text-emerald-700 truncate">KES {formatKES(total)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3">
          <div className="h-7 w-7 shrink-0 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-emerald-600 leading-tight">You save</p>
            <p className="text-xs font-semibold text-emerald-700 truncate">KES {formatKES(discountValue)}</p>
          </div>
        </div>*/}
      </div> 

      

      {/* Paid / Change section — drop-in replacement for the block you shared */}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 shrink-0 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v6m6-6a3 3 0 00-3-3m0 0V4m0 4h6" /></svg>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-900 leading-tight">Amount Paid</div>
              <div className="text-[10px] text-slate-400 leading-tight truncate">Actual cash received</div>
            </div>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">KES</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cashPaid}
              onChange={(e) => setCashPaid(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-gray-200 bg-slate-50 pl-10 pr-3 py-2 text-sm font-semibold text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
              style={{ appearance: 'textfield' }}
            />
          </div>
        </div>

        <div
          className={`rounded-2xl border p-3 flex flex-col justify-center ${changeValue < 0 ? 'border-rose-100 bg-rose-50' : 'border-emerald-100 bg-emerald-50'
            }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className={`h-7 w-7 shrink-0 rounded-xl flex items-center justify-center ${changeValue < 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'
                }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" /></svg>
            </div>
            <div
              className={`text-[10px] font-medium uppercase tracking-[0.14em] ${changeValue < 0 ? 'text-rose-400' : 'text-slate-400'
                }`}
            >
              {changeValue < 0 ? 'Balance Due' : 'Change'}
            </div>
          </div>
          <div className={`text-sm font-bold truncate pl-9 ${changeValue < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            KES {formatKES(Math.abs(changeValue))}
          </div>
        </div>
      </div>

      {changeValue < 0 && (
        <div className="mt-2 rounded-lg bg-red-50 border border-red-200 p-3">
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 shrink-0 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-700">Customer Owes Balance</p>
              <p className="text-xs text-red-600 mt-0.5">The customer still owes KES {formatKES(Math.abs(changeValue))}. Record this as a debt sale.</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-2">
        <button
          type="button"
          onClick={handleCashSale}
          disabled={isCheckoutDisabled || isProcessing}
          title={isCheckoutDisabled ? checkoutDisabledReason : undefined}
          className="w-full rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
          style={{
            backgroundColor: changeValue < 0 ? '#dc2626' : '#047857',
          }}
          onMouseEnter={(e) => {
            if (!isCheckoutDisabled && !isProcessing) {
              e.currentTarget.style.backgroundColor = changeValue < 0 ? '#b91c1c' : '#065f46';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = changeValue < 0 ? '#dc2626' : '#047857';
          }}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>{changeValue < 0 ? 'Record as Debt Sale →' : 'Record Cash Sale →'}</span>
          )}
        </button>
      </div>
    </>
  )
}