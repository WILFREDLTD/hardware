'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { formatKES } from '@/lib/utils'
import DebtModal from '../DebtModal'
import SaleModal from '../SaleModal'
import Toast from '@/components/ui/Toast'
import { useSalesPage } from '../useSalesPage'

/**
 * Maps a payment status string to a badge color + dot color.
 * Falls back to a neutral slate style for unrecognized statuses.
 */
function getStatusStyles(status?: string) {
  const key = (status || '').toLowerCase()

  if (key.includes('paid')) {
    return { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500', bar: 'bg-emerald-500' }
  }
  if (key.includes('debt') || key.includes('pending')) {
    return { badge: 'bg-amber-50 text-amber-700 ring-amber-600/20', dot: 'bg-amber-500', bar: 'bg-amber-500' }
  }
  if (key.includes('overdue') || key.includes('fail')) {
    return { badge: 'bg-rose-50 text-rose-700 ring-rose-600/20', dot: 'bg-rose-500', bar: 'bg-rose-500' }
  }
  return { badge: 'bg-slate-100 text-slate-600 ring-slate-500/20', dot: 'bg-slate-400', bar: 'bg-slate-300' }
}

export default function RecentSalesPage() {
  const {
    displayedSales,
    openSaleModal,
    showSaleModal,
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
    toastOpen,
    setToastOpen,
    showDebtModal,
    pendingSalePayload,
    debtorNameInput,
    setDebtorNameInput,
    debtorPhoneInput,
    setDebtorPhoneInput,
    debtModalError,
    pendingSalePayloadDebtSubmit,
    closeDebtModal,
    isLoading,
  } = useSalesPage()

  const recentSales = [...displayedSales].sort(
    (a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
  )

  const totalValue = recentSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const outstandingSales = recentSales.filter((sale) => Boolean(sale.debt))
  const outstandingValue = outstandingSales.reduce((sum, sale) => sum + sale.totalAmount, 0)

  return (
    <div className="space-y-6">
      <Header title="Recent Sales" subtitle="Review recent transactions and payment status" />

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700/70">Total revenue</p>
              <p className="mt-1.5 text-xl font-bold text-emerald-900">KES {formatKES(totalValue)}</p>
              <p className="mt-0.5 text-xs text-emerald-700/60">{recentSales.length} transaction{recentSales.length === 1 ? '' : 's'}</p>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-sky-700/70">Transactions</p>
              <p className="mt-1.5 text-xl font-bold text-sky-900">{recentSales.length}</p>
              <p className="mt-0.5 text-xs text-sky-700/60">Recorded to date</p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-amber-700/70">Outstanding debt</p>
              <p className="mt-1.5 text-xl font-bold text-amber-900">KES {formatKES(outstandingValue)}</p>
              <p className="mt-0.5 text-xs text-amber-700/60">{outstandingSales.length} sale{outstandingSales.length === 1 ? '' : 's'} on credit</p>
            </div>
          </>
        )}
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sales history</h2>
            <p className="text-sm text-gray-500">Open any transaction to review details, update debt status, or archive it.</p>
          </div>
          <Link
            href="/dashboard/sales"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 active:bg-emerald-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create new sale
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-6 space-y-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl border border-gray-200 bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : recentSales.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
            No recent sales recorded yet.
          </div>
        ) : (
          <div className="mt-6 space-y-2.5">
            {recentSales.map((sale) => {
              const effectiveStatus = sale.debt?.status === 'PAID' ? 'PAID' : sale.paymentStatus
              const status = getStatusStyles(effectiveStatus)
              const itemsLabel =
                sale.saleItems?.map((item) => item.product?.name).filter(Boolean).join(', ') || 'Sale'
              const wasDebtPaid = Boolean(sale.debt) && sale.debt?.status === 'PAID'

              return (
                <button
                  key={sale.id}
                  type="button"
                  onClick={() => openSaleModal(sale)}
                  className="group relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 pl-5 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Status accent bar */}
                  <span className={`absolute inset-y-0 left-0 w-1 ${status.bar}`} aria-hidden="true" />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-gray-900">{itemsLabel}</div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>{new Date(sale.saleDate).toLocaleString()}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ring-1 ring-inset ${status.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {effectiveStatus}
                      </span>
                      {wasDebtPaid && (
                        <span className="ml-2 text-xs text-gray-400">Previously recorded as debt</span>
                      )}
                      {sale.debt?.debtorName && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 ring-1 ring-inset ring-amber-600/20">
                          {sale.debt.debtorName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
                    <div className="text-base font-bold text-gray-900 sm:text-sm">KES {formatKES(sale.totalAmount)}</div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 transition group-hover:gap-1.5">
                      Open details
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </Card>

      {showSaleModal && selectedSale && (
        <SaleModal
          selectedSale={selectedSale}
          showSaleModal={showSaleModal}
          closeSaleModal={closeSaleModal}
          updateSaleStatus={updateSaleStatus}
          isProcessing={isProcessing}
          editedSaleItems={editedSaleItems}
          updateModalItemQty={updateModalItemQty}
          removeModalSaleItem={removeModalSaleItem}
          statusOption={statusOption}
          setStatusOption={setStatusOption}
          debtorName={debtorName}
          setDebtorName={setDebtorName}
          debtorPhone={debtorPhone}
          setDebtorPhone={setDebtorPhone}
          confirmDelete={confirmDelete}
          setConfirmDelete={setConfirmDelete}
          deleteSale={deleteSale}
          deleteReason={deleteReason}
          setDeleteReason={setDeleteReason}
        />
      )}

      <Toast open={toastOpen} onClose={() => setToastOpen(false)} title="Sale recorded" description="Sale successfully recorded and stock updated." />

      <DebtModal
        showDebtModal={showDebtModal}
        pendingSalePayload={pendingSalePayload}
        onClose={closeDebtModal}
        debtorNameInput={debtorNameInput}
        setDebtorNameInput={setDebtorNameInput}
        debtorPhoneInput={debtorPhoneInput}
        setDebtorPhoneInput={setDebtorPhoneInput}
        debtModalError={debtModalError}
        submitDebt={pendingSalePayloadDebtSubmit}
      />
    </div>
  )
}