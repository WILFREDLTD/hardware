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
  supplierName: string
  setSupplierName: (value: string) => void
  supplierNumber: string
  setSupplierNumber: (value: string) => void
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
  supplierName,
  setSupplierName,
  supplierNumber,
  setSupplierNumber,
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
        supplierName={supplierName}
        setSupplierName={setSupplierName}
        supplierNumber={supplierNumber}
        setSupplierNumber={setSupplierNumber}
      />
    </div>
  )
}
