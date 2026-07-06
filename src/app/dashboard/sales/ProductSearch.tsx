'use client'
import { formatKES } from '@/lib/utils'

type Product = {
  id: string
  name: string
  sku: string
  currentStock: number
  unitPrice: number
}

interface ProductSearchProps {
  query: string
  suggestions: Product[]
  setQuery: (value: string) => void
  addToCart: (product: Product) => void
}

export default function ProductSearch({ query, suggestions, setQuery, addToCart }: ProductSearchProps) {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Add Products</div>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.75 6.75a7.5 7.5 0 0 0 10.6 10.6z" /></svg>
          </div>
          <input
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name or SKU…"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addToCart(product)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">KES {formatKES(product.unitPrice)}</div>
                      <div className={`text-xs mt-0.5 ${product.currentStock <= 5 ? 'text-amber-500' : 'text-green-600'}`}>{product.currentStock} in stock</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
