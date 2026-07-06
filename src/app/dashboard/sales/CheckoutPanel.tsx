'use client'
import FinalAmountInput from './FinalAmountInput'
import CheckoutSummary from './CheckoutSummary'

interface CheckoutPanelProps {
  regularSubtotal: number
  finalAmountInput: string
  setFinalAmountInput: (value: string) => void
  cashPaid: string
  setCashPaid: (value: string) => void
  paidValue: number
  changeValue: number
  total: number
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
  paidValue,
  changeValue,
  total,
  discountValue,
  isProcessing,
  cartLength,
//   setShowCalc,
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
        paidValue={paidValue}
        changeValue={changeValue}
        total={total}
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
