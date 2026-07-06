'use client'
import { useMemo, useState } from 'react'
import { CartItem, Product } from './types'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id)
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.currentStock) }
            : item,
        )
      }

      return [...current, { productId: product.id, name: product.name, unitPrice: product.unitPrice, quantity: 1, max: product.currentStock }]
    })
  }

  const removeFromCart = (idx: number) => {
    setCart((current) => current.filter((_, index) => index !== idx))
  }

  const updateQty = (index: number, qty: number) => {
    setCart((current) => current.map((item, idx) => (idx === index ? { ...item, quantity: qty } : item)))
  }

  const regularSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart],
  )

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQty,
    regularSubtotal,
  }
}
