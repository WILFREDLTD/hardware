'use client'

import { Header } from '@/components/layout/Header'
import CalculatorModal from './CalculatorModal'
import ProductSearch from './ProductSearch'
import CartItems from './CartItems'
import CheckoutPanel from './CheckoutPanel'
import SalesSidebar from './SalesSidebar'
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
    paidValue,
    changeValue,
    total,
    discountValue,
    isProcessing,
    showSaleModal,
    selectedSale,
    editedSaleItems,
    openSaleModal,
    closeSaleModal,
    updateQty,
    removeFromCart,
    handleCashSale,
    displayedSales,
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <ProductSearch query={query} suggestions={suggestions} setQuery={setQuery} addToCart={addToCart} />
          <CartItems cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} />
          <CheckoutPanel
            regularSubtotal={regularSubtotal}
            finalAmountInput={finalAmountInput}
            setFinalAmountInput={setFinalAmountInput}
            cashPaid={cashPaid}
            setCashPaid={setCashPaid}
            paidValue={paidValue}
            changeValue={changeValue}
            total={total}
            discountValue={discountValue}
            isProcessing={isProcessing}
            cartLength={cart.length}
            setShowCalc={setShowCalc}
            handleCashSale={handleCashSale}
          />
        </div>

        <div className="space-y-5">
          <SalesSidebar setShowCalc={setShowCalc} displayedSales={displayedSales} openSaleModal={openSaleModal} />
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
