'use client'
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
}

export default function CartItems({ cart, updateQty, removeFromCart }: CartItemsProps) {
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
                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
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
