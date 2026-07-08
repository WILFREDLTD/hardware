'use client'
import { formatKES } from '@/lib/utils'

type DebtPayload = {
  debtAmount?: number
}

interface DebtModalProps {
  pendingSalePayload: DebtPayload | null
  showDebtModal: boolean
  onClose: () => void
  debtorNameInput: string
  setDebtorNameInput: (value: string) => void
  debtorPhoneInput: string
  setDebtorPhoneInput: (value: string) => void
  debtModalError: string
  submitDebt: () => Promise<void>
}

export default function DebtModal({
  pendingSalePayload,
  showDebtModal,
  onClose,
  debtorNameInput,
  setDebtorNameInput,
  debtorPhoneInput,
  setDebtorPhoneInput,
  debtModalError,
  submitDebt,
}: DebtModalProps) {
  if (!showDebtModal || !pendingSalePayload) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" />
      <div className="relative z-10 mx-auto w-full max-w-2xl rounded-3xl bg-white shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Record debtor details</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={async (e) => { e.preventDefault(); await submitDebt() }} className="space-y-4 text-sm text-gray-700">
          <div>
            <div className="font-medium text-gray-900">Remaining debt</div>
            <div className="text-lg font-semibold">KES {formatKES(pendingSalePayload.debtAmount || 0)}</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Debtor name</label>
            <input value={debtorNameInput} onChange={(e) => setDebtorNameInput(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Debtor phone</label>
            <input type="tel" value={debtorPhoneInput} onChange={(e) => setDebtorPhoneInput(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            {debtModalError && <p className="mt-2 text-xs text-red-600">{debtModalError}</p>}
          </div>

          <button type="submit" className="w-full px-4 py-3 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition">Record debt</button>
        </form>
      </div>
    </div>
  )
}
