'use client'
import { useEffect, useState } from 'react'
import { formatKES } from '@/lib/utils'

type CartItem = {
  productId: string
  name: string
  unitPrice: number
  quantity: number
  max: number
}

interface CartItemsProps {
  cart: CartItem[]
  updateQty: (index: number, qty: number) => void
  removeFromCart: (idx: number) => void
  setCartValidity: (isValid: boolean) => void
}

export default function CartItems({ cart, updateQty, removeFromCart, setCartValidity }: CartItemsProps) {
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({})

  useEffect(() => {
    setQuantityInputs((current) => {
      const next: Record<string, string> = {}
      cart.forEach((item) => {
        next[item.productId] = current[item.productId] ?? String(item.quantity)
      })
      return next
    })
  }, [cart])

  useEffect(() => {
    const hasInvalid = cart.some((item) => {
      const value = quantityInputs[item.productId]
      if (!value || value.trim() === '') return false
      if (!/^\d+$/.test(value)) return true
      const parsed = parseInt(value, 10)
      return parsed < 1 || parsed > item.max
    })

    setCartValidity(!hasInvalid)
  }, [cart, quantityInputs, setCartValidity])

  const handleQuantityChange = (idx: number, item: CartItem, value: string) => {
    setQuantityInputs((current) => ({ ...current, [item.productId]: value }))
    if (value === '') {
      return
    }

    const parsed = parseInt(value, 10)
    if (Number.isNaN(parsed) || parsed < 1) {
      setCartValidity(false)
      return
    }

    setCartValidity(true)
    const normalized = Math.min(item.max, parsed)
    updateQty(idx, normalized)
    setQuantityInputs((current) => ({ ...current, [item.productId]: String(normalized) }))
  }

  const handleQuantityBlur = (item: CartItem) => {
    const currentValue = (quantityInputs[item.productId] ?? '').trim()
    const parsed = parseInt(currentValue, 10)

    if (!currentValue || Number.isNaN(parsed) || parsed < 1) {
      updateQty(cart.findIndex((cartItem) => cartItem.productId === item.productId), 1)
      setQuantityInputs((current) => ({ ...current, [item.productId]: '1' }))
      return
    }

    const normalized = Math.min(item.max, parsed)
    updateQty(cart.findIndex((cartItem) => cartItem.productId === item.productId), normalized)
    setQuantityInputs((current) => ({ ...current, [item.productId]: String(normalized) }))
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Cart</div>
      {cart.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <div className="text-4xl mb-3">🛒</div>
          <div className="text-sm">Search and add products above</div>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item, idx) => (
            <div key={item.productId} className="flex items-center gap-4 py-3 px-4 bg-gray-50 rounded-xl">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{item.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">KES {formatKES(item.unitPrice)} each</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(idx, Math.max(1, item.quantity - 1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">−</button>
                <input
                  type="number"
                  min="1"
                  max={item.max}
                  value={quantityInputs[item.productId] ?? String(item.quantity)}
                  onChange={(e) => handleQuantityChange(idx, item, e.target.value)}
                  onBlur={() => handleQuantityBlur(item)}
                  className="w-16 text-center text-sm font-semibold border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-100 [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                  style={{ appearance: 'textfield' }}
                />
                <button onClick={() => updateQty(idx, Math.min(item.max, item.quantity + 1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">+</button>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">KES {formatKES(item.unitPrice * item.quantity)}</div>
              </div>
              <button onClick={() => removeFromCart(idx)} className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
