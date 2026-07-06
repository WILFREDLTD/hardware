'use client'
import { Card } from '@/components/ui/Card'
import { formatKES } from '@/lib/utils'
import { Sale } from './types'

interface SalesSidebarProps {
  setShowCalc: (value: boolean) => void
  displayedSales: Sale[]
  openSaleModal: (sale: Sale) => void
}

export default function SalesSidebar({ setShowCalc, displayedSales, openSaleModal }: SalesSidebarProps) {
  return (
    <div className="space-y-5">
      <button
        onClick={() => setShowCalc(true)}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-100 rounded-xl hover:border-gray-300 transition-all group"
      >
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-base" style={{ backgroundColor: '#1a6b45' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        </div>
        <div className="text-left flex-1">
          <div className="text-sm font-semibold text-gray-800">Calculator</div>
          <div className="text-xs text-gray-400">Quick calculations</div>
        </div>
        <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      <Card>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Recent Sales</div>
        {displayedSales.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-6">No sales recorded yet</div>
        ) : (
          <div className="space-y-3 max-h-[360px] overflow-y-auto">
            {displayedSales.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => openSaleModal(s)}
                className="w-full text-left flex items-center gap-3 py-3 px-3 rounded-2xl transition-all hover:bg-gray-50 border border-transparent hover:border-gray-100"
              >
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-sm flex-shrink-0">🧾</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-700 truncate">
                    {s.saleItems?.map((it) => it.product?.name).filter(Boolean).join(', ') || 'Sale'}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                    <span>{new Date(s.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s.paymentStatus}</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900 flex-shrink-0">KES {formatKES(s.totalAmount)}</div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
