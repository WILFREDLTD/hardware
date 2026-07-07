'use client'
import { formatKES } from '@/lib/utils'

interface FinalAmountInputProps {
  regularSubtotal: number
  finalAmountInput: string
  setFinalAmountInput: (value: string) => void
//   setShowCalc: (value: boolean) => void
}

export default function FinalAmountInput({
  regularSubtotal,
  finalAmountInput,
  setFinalAmountInput,
//   setShowCalc,
}: FinalAmountInputProps) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 shrink-0 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8m-4-4v8m6 0a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12z" /></svg>
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-700 leading-tight">Agreed Selling Price</div>
          <div className="text-[10px] text-slate-400 leading-tight truncate">Negotiated/desired amount to pay</div>
        </div>
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">KES</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={finalAmountInput}
          onChange={(e) => setFinalAmountInput(e.target.value)}
          placeholder={formatKES(regularSubtotal)}
          className="w-full rounded-xl border border-gray-200 bg-slate-50 pl-10 pr-3 py-2 text-right text-base font-semibold text-slate-900 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
          style={{ appearance: 'textfield' }}
        />
      </div>
    </div>
  )
}