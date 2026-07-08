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
  isProcessing: boolean
  cartLength: number
  setShowCalc: (value: boolean) => void
  handleCashSale: () => Promise<void>
  
}

export default function CheckoutPanel({
  regularSubtotal,
  finalAmountInput,
  setFinalAmountInput,
  cashPaid,
  setCashPaid,
  changeValue,
  discountValue,
  isProcessing,
  cartLength,
  handleCashSale,
  
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
        isProcessing={isProcessing}
        cartLength={cartLength}
        cashPaid={cashPaid}
        setCashPaid={setCashPaid}
        handleCashSale={handleCashSale}
      />
    </div>
  )
}
