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
    </div>
  )
}
