'use client'

import { Header } from '@/components/layout/Header'
import CalculatorModal from './CalculatorModal'
import ProductSearch from './ProductSearch'
import CartItems from './CartItems'
import CheckoutPanel from './CheckoutPanel'
import SaleModal from './SaleModal'
import DebtModal from './DebtModal'
import SalesStats from './SalesStats'
import Toast from '@/components/ui/Toast'
import { SalesPageProps } from './useSalesPage'

export default function SalesPageView(props: SalesPageProps) {
  const {
    showCalc,
    setShowCalc,
    query,
    suggestions,
    setQuery,
    addToCart,
    cart,
    regularSubtotal,
    finalAmountInput,
    setFinalAmountInput,
    cashPaid,
    setCashPaid,
    changeValue,
    total,
    discountValue,
    isProcessing,
    showSaleModal,
    selectedSale,
    editedSaleItems,
    closeSaleModal,
    updateQty,
    removeFromCart,
    handleCashSale,
    setStatusOption,
    statusOption,
    debtorName,
    setDebtorName,
    debtorPhone,
    setDebtorPhone,
    confirmDelete,
    setConfirmDelete,
    updateSaleStatus,
    updateModalItemQty,
    removeModalSaleItem,
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
    setHasInvalidCartQuantity,
    isCheckoutDisabled,
    checkoutDisabledReason,
    income,
    sales,
  } = props

  return (
    <div className="space-y-6">
      {showCalc && <CalculatorModal onClose={() => setShowCalc(false)} />}
      <Header title="Sales" subtitle="Record and manage sales transactions" />

      <SalesStats
        income={income}
        cartItems={cart.reduce((sum, item) => sum + item.quantity, 0)}
        total={total}
        salesToday={sales.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <ProductSearch query={query} suggestions={suggestions} setQuery={setQuery} addToCart={addToCart} />
          <CartItems cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} setCartValidity={setHasInvalidCartQuantity} />
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
        </div>

        <div className="space-y-5">
          <CheckoutPanel
            regularSubtotal={regularSubtotal}
            finalAmountInput={finalAmountInput}
            setFinalAmountInput={setFinalAmountInput}
            cashPaid={cashPaid}
            setCashPaid={setCashPaid}
            changeValue={changeValue}
            discountValue={discountValue}
            handleCashSale={handleCashSale}
            isCheckoutDisabled={isCheckoutDisabled}
            checkoutDisabledReason={checkoutDisabledReason}
          />
        </div>
      </div>

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
