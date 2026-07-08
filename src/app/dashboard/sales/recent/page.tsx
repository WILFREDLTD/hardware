'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { formatKES } from '@/lib/utils'
import DebtModal from '../DebtModal'
import SaleModal from '../SaleModal'
import Toast from '@/components/ui/Toast'
import { useSalesPage } from '../useSalesPage'

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
  } = useSalesPage()

  const recentSales = [...displayedSales].sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())

  return (
    <div className="space-y-6">
      <Header title="Recent Sales" subtitle="Review recent transactions and payment status" />

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sales history</h2>
            <p className="text-sm text-gray-500">Open any transaction to review details, update debt status, or archive it.</p>
          </div>
          <Link href="/dashboard/sales" className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
            Create new sale
          </Link>
        </div>

        {recentSales.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500">
            No recent sales recorded yet.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {recentSales.map((sale) => (
              <button
                key={sale.id}
                type="button"
                onClick={() => openSaleModal(sale)}
                className="flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-gray-900">
                    {sale.saleItems?.map((item) => item.product?.name).filter(Boolean).join(', ') || 'Sale'}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span>{new Date(sale.saleDate).toLocaleString()}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">{sale.paymentStatus}</span>
                    {sale.debt?.debtorName && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">{sale.debt.debtorName}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <div className="text-sm font-semibold text-gray-900">KES {formatKES(sale.totalAmount)}</div>
                  <span className="text-xs font-medium text-emerald-600">Open details</span>
                </div>
              </button>
            ))}
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
