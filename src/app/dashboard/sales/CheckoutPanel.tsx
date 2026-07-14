'use client'
import FinalAmountInput from './FinalAmountInput'
import CheckoutSummary from './CheckoutSummary'

interface CheckoutPanelProps {
  regularSubtotal: number
  finalAmountInput: string
  setFinalAmountInput: (value: string) => void
  cashPaid: string
  setCashPaid: (value: string) => void
  changeValue: number
  discountValue: number
  isCheckoutDisabled: boolean
  checkoutDisabledReason: string
  handleCashSale: () => Promise<void>
  isProcessing: boolean
}

export default function CheckoutPanel({
  regularSubtotal,
  finalAmountInput,
  setFinalAmountInput,
  cashPaid,
  setCashPaid,
  changeValue,
  discountValue,
  handleCashSale,
  isCheckoutDisabled,
  checkoutDisabledReason,
  isProcessing,
}: CheckoutPanelProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
      <FinalAmountInput
        regularSubtotal={regularSubtotal}
        finalAmountInput={finalAmountInput}
        setFinalAmountInput={setFinalAmountInput}
        // setShowCalc={setShowCalc}
      />
      <CheckoutSummary
        regularSubtotal={regularSubtotal}
        changeValue={changeValue}
        discountValue={discountValue}
        cashPaid={cashPaid}
        setCashPaid={setCashPaid}
        handleCashSale={handleCashSale}
        isCheckoutDisabled={isCheckoutDisabled}
        checkoutDisabledReason={checkoutDisabledReason}
        isProcessing={isProcessing}
      />
    </div>
  )
}
