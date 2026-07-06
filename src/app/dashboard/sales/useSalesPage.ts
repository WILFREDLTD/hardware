'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useCart } from './useCart'
import { useDebtModal } from './useDebtModal'
import { useSaleModal } from './useSaleModal'
import { useSalesData } from './useSalesData'
import { Product } from './types'

export function useSalesPage() {
  const {
    products,
    setProducts,
    income,
    setIncome,
    sales,
    refreshSales,
    refreshProducts,
  } = useSalesData()

  const { cart, addToCart, removeFromCart, updateQty, regularSubtotal, setCart } = useCart()

  const {
    showSaleModal,
    selectedSale,
    editedSaleItems,
    statusOption,
    setStatusOption,
    debtorName,
    setDebtorName,
    debtorPhone,
    setDebtorPhone,
    deleteReason,
    setDeleteReason,
    confirmDelete,
    setConfirmDelete,
    openSaleModal,
    closeSaleModal,
    updateModalItemQty,
    removeModalSaleItem,
  } = useSaleModal()

  const {
    showDebtModal,
    debtorNameInput,
    setDebtorNameInput,
    debtorPhoneInput,
    setDebtorPhoneInput,
    pendingSalePayload,
    debtModalError,
    setDebtModalError,
    openDebtModal,
    closeDebtModal,
  } = useDebtModal()

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [toastOpen, setToastOpen] = useState(false)
  const [cashPaid, setCashPaid] = useState('')
  const [finalAmountInput, setFinalAmountInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCalc, setShowCalc] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!query) return setSuggestions([])
      const lowered = query.toLowerCase()
      setSuggestions(
        products
          .filter((product) =>
            product.name.toLowerCase().includes(lowered) || product.sku.toLowerCase().includes(lowered),
          )
          .slice(0, 8),
      )
    }, 300)

    return () => clearTimeout(timeout)
  }, [query, products])

  const parsedFinalAmount = parseFloat(finalAmountInput)
  const finalAmount = Number.isFinite(parsedFinalAmount)
    ? Math.min(Math.max(parsedFinalAmount, 0), regularSubtotal)
    : regularSubtotal
  const discountValue = Math.max(0, regularSubtotal - finalAmount)
  const total = finalAmount
  const paidValue = parseFloat(cashPaid) || 0
  const changeValue = paidValue - total
  const displayedSales = Array.isArray(sales) ? sales : []

  async function submitSale(payload: any) {
    if (cart.length === 0) return
    setIsProcessing(true)

    try {
      const effectiveNotes = [
        payload?.notes,
        discountValue > 0
          ? `Final amount: KES ${finalAmount.toFixed(2)} (discount KES ${discountValue.toFixed(2)})`
          : undefined,
      ]
        .filter(Boolean)
        .join(' | ') || undefined

      const items = cart.map((item) => {
        const lineSubtotal = item.unitPrice * item.quantity
        const lineDiscount = regularSubtotal > 0 ? (lineSubtotal / regularSubtotal) * discountValue : 0
        const lineTotal = Math.max(0, lineSubtotal - lineDiscount)

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: lineDiscount,
          total: lineTotal,
        }
      })

      const body = {
        items,
        paymentStatus: payload?.paymentStatus || 'PAID',
        ...payload,
        subtotalAmount: regularSubtotal,
        discountAmount: discountValue,
        finalAmount,
        notes: effectiveNotes,
      }

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error?.error || 'Failed to record sale')
        return
      }

      const data = await response.json()
      setToastOpen(true)
      setCashPaid('')
      setFinalAmountInput('')
      closeDebtModal()
      refreshSales()
      refreshProducts()
      fetch('/api/reports/stats')
        .then((res) => res.json())
        .then((stats) => setIncome(stats.totalRevenue || 0))

      if (body.paymentStatus === 'DEBT' || data?.debt) {
        window.dispatchEvent(new Event('debtsUpdated'))
      }
      setCart([])
      return data
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleCashSale() {
    const paid = parseFloat(cashPaid) || 0
    if (cart.length === 0) return

    if (paid >= total) {
      await submitSale({ paymentMethod: 'CASH', paidAmount: paid, notes: `Cash payment, paid amount KES ${paid.toFixed(2)}` })
      return
    }

    const remaining = parseFloat((total - paid).toFixed(2))

    openDebtModal({
      paymentMethod: 'CASH',
      paidAmount: paid,
      debtAmount: remaining,
      paymentStatus: 'DEBT',
      notes: `Partial payment KES ${paid.toFixed(2)}. Remaining KES ${remaining.toFixed(2)} recorded as debt.`,
    })
  }

  async function pendingSalePayloadDebtSubmit() {
    if (!pendingSalePayload) return
    if (!debtorNameInput.trim()) {
      setDebtModalError('Debtor name is required.')
      return
    }
    if (!/^[0-9]{10}$/.test(debtorPhoneInput.trim())) {
      setDebtModalError('Debtor phone must be exactly 10 digits.')
      return
    }

    const payload = {
      ...pendingSalePayload,
      debtorName: debtorNameInput.trim(),
      debtorPhone: debtorPhoneInput.trim(),
    }

    setDebtModalError('')
    setDebtorNameInput('')
    setDebtorPhoneInput('')
    await submitSale(payload)
  }

  async function updateSaleStatus(e: FormEvent) {
    e.preventDefault()
    if (!selectedSale) return
    setIsProcessing(true)

    try {
      const payload: any = { paymentStatus: statusOption }
      if (statusOption === 'DEBT' && selectedSale.paymentStatus !== 'DEBT') {
        if (!debtorName.trim()) {
          alert('Debtor name is required to mark this sale as debt.')
          return
        }
        if (!/^[0-9]{10}$/.test(debtorPhone.trim())) {
          alert('Debtor phone must be exactly 10 digits.')
          return
        }
        payload.debtorName = debtorName.trim()
        payload.debtorPhone = debtorPhone.trim()
      }

      const editedItems = editedSaleItems.map((item) => ({ id: item.id, quantity: item.quantity }))
      const response = await fetch(`/api/sales/${selectedSale.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, items: editedItems }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error?.error || 'Failed to update sale status')
        return
      }

      refreshSales()
      closeSaleModal()
      setToastOpen(true)
    } finally {
      setIsProcessing(false)
    }
  }

  async function deleteSale() {
    if (!selectedSale) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/sales/${selectedSale.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletionReason: deleteReason }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error?.error || 'Failed to archive sale')
        return
      }

      refreshSales()
      closeSaleModal()
      setToastOpen(true)
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    products,
    setProducts,
    query,
    setQuery,
    suggestions,
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
    showCalc,
    setShowCalc,
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
    setDebtModalError,
    pendingSalePayloadDebtSubmit,
    closeDebtModal,
    income,
    sales,
  }
}

type SalesPageProps = ReturnType<typeof useSalesPage>
export type { SalesPageProps }
