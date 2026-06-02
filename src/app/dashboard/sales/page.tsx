'use client'
import React from 'react'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import Toast from '@/components/ui/Toast'

type Product = {
  id: string
  name: string
  sku: string
  currentStock: number
  unitPrice: number
}

function CalculatorModal({ onClose }: { onClose: () => void }) {
  const [calc, setCalc] = React.useState('0')
  const [expression, setExpression] = React.useState('')

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ]

  function handle(t: string) {
    if (t === 'C') { setCalc('0'); setExpression(''); return }
    if (t === '±') { setCalc(c => c.startsWith('-') ? c.slice(1) : '-' + c); return }
    if (t === '%') { setCalc(c => String(parseFloat(c) / 100)); return }
    if (t === '=') {
      try {
        const expr = expression + calc
        // eslint-disable-next-line no-eval
        const val = eval(expr.replace('×', '*').replace('÷', '/').replace('−', '-'))
        setExpression('')
        setCalc(String(parseFloat(val.toFixed(10))))
      } catch { setCalc('Error'); setExpression('') }
      return
    }
    if (['+', '−', '×', '÷'].includes(t)) {
      setExpression(expression + calc + t)
      setCalc('0')
      return
    }
    if (t === '.') {
      if (!calc.includes('.')) setCalc(c => c + '.')
      return
    }
    setCalc(c => c === '0' ? t : c + t)
  }

  const isOp = (t: string) => ['+', '−', '×', '÷'].includes(t)
  const isEqual = (t: string) => t === '='

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden" style={{ fontFamily: 'var(--font-sans, system-ui)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700 tracking-wide uppercase" style={{ letterSpacing: '0.06em' }}>Calculator</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-lg">✕</button>
        </div>

        {/* Display */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
          <div className="text-xs text-gray-400 text-right min-h-5 mb-1 font-mono">{expression || ' '}</div>
          <div className="text-3xl font-light text-right text-gray-900 font-mono tracking-tight truncate">{calc}</div>
        </div>

        {/* Buttons */}
        <div className="p-4 grid gap-2">
          {buttons.map((row, ri) => (
            <div key={ri} className="grid gap-2" style={{ gridTemplateColumns: ri === 4 ? '2fr 1fr 1fr' : 'repeat(4, 1fr)' }}>
              {row.map((t) => (
                <button
                  key={t}
                  onClick={() => handle(t)}
                  className={`
                    h-12 rounded-xl text-base font-medium transition-all active:scale-95
                    ${t === 'C' || t === '±' || t === '%' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : ''}
                    ${isOp(t) ? 'text-white hover:opacity-90' : ''}
                    ${isEqual(t) ? 'text-white hover:opacity-90' : ''}
                    ${!isOp(t) && !isEqual(t) && t !== 'C' && t !== '±' && t !== '%' ? 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50' : ''}
                  `}
                  style={{
                    ...(isOp(t) || isEqual(t) ? { backgroundColor: '#1a6b45' } : {}),
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SalesPage() {
  const [products, setProducts] = React.useState<Product[]>([])
  const [query, setQuery] = React.useState('')
  const [suggestions, setSuggestions] = React.useState<Product[]>([])
  const [cart, setCart] = React.useState<any[]>([])
  const [toastOpen, setToastOpen] = React.useState(false)
  const [income, setIncome] = React.useState(0)
  const [sales, setSales] = React.useState<any[]>([])
  const [showCalc, setShowCalc] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/inventory').then(r => r.json()).then(d => setProducts(d || []))
    fetch('/api/reports/stats').then(r => r.json()).then(s => setIncome(s.totalRevenue || 0))
    fetch('/api/sales').then(r => r.json()).then(d => setSales(d || []))
  }, [])

  React.useEffect(() => {
    const t = setTimeout(() => {
      if (!query) return setSuggestions([])
      const q = query.toLowerCase()
      setSuggestions(products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)).slice(0, 8))
    }, 300)
    return () => clearTimeout(t)
  }, [query, products])

  function addToCart(product: Product) {
    setCart(c => {
      const exists = c.find((x: any) => x.productId === product.id)
      if (exists) return c.map(x => x.productId === product.id ? { ...x, quantity: Math.min(x.quantity + 1, product.currentStock) } : x)
      return [...c, { productId: product.id, name: product.name, unitPrice: product.unitPrice, quantity: 1, max: product.currentStock }]
    })
    setQuery('')
    setSuggestions([])
  }

  function removeFromCart(idx: number) {
    setCart(c => c.filter((_, i) => i !== idx))
  }

  function updateQty(index: number, qty: number) {
    setCart(c => c.map((it, i) => i === index ? { ...it, quantity: qty } : it))
  }

  async function submitSale() {
    if (cart.length === 0) return
    const items = cart.map(c => ({ productId: c.productId, quantity: c.quantity, unitPrice: c.unitPrice }))
    const res = await fetch('/api/sales', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, paymentStatus: 'PAID' }) })
    if (res.ok) {
      setToastOpen(true)
      setCart([])
      fetch('/api/reports/stats').then(r => r.json()).then(s => setIncome(s.totalRevenue || 0))
      fetch('/api/inventory').then(r => r.json()).then(d => setProducts(d))
      fetch('/api/sales').then(r => r.json()).then(d => setSales(d || []))
    } else {
      const e = await res.json()
      alert(e?.error || 'Failed to record sale')
    }
  }

  const total = cart.reduce((s, it) => s + it.unitPrice * it.quantity, 0)

  return (
    <div className="space-y-6">
      {showCalc && <CalculatorModal onClose={() => setShowCalc(false)} />}

      <Header title="Sales" subtitle="Record and manage sales transactions" />

      {/* Top stat bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `KES ${income.toFixed(2)}`, icon: '💰' },
          { label: 'Cart Items', value: cart.reduce((s, i) => s + i.quantity, 0), icon: '🛒' },
          { label: 'Cart Total', value: `KES ${total.toFixed(2)}`, icon: '🧾' },
          { label: 'Sales Today', value: sales.length, icon: '📊' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{s.label}</div>
            <div className="text-xl font-semibold text-gray-900">{s.icon} {s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main sales area */}
        <div className="lg:col-span-2 space-y-5">
          {/* Product search */}
          <Card>
            <div className="mb-1">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Add Products</div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.75 6.75a7.5 7.5 0 0 0 10.6 10.6z" /></svg>
                </div>
                <input
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                  value={query}
                  onChange={(e: any) => setQuery(e.target.value)}
                  placeholder="Search by product name or SKU…"
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {suggestions.map(s => (
                      <div key={s.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0" onClick={() => addToCart(s)}>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{s.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">SKU: {s.sku}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">KES {s.unitPrice.toFixed(2)}</div>
                          <div className={`text-xs mt-0.5 ${s.currentStock <= 5 ? 'text-amber-500' : 'text-green-600'}`}>{s.currentStock} in stock</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Cart */}
          <Card>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Cart</div>
            {cart.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <div className="text-4xl mb-3">🛒</div>
                <div className="text-sm">Search and add products above</div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((it, idx) => (
                    <div key={it.productId} className="flex items-center gap-4 py-3 px-4 bg-gray-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{it.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">KES {it.unitPrice.toFixed(2)} each</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(idx, Math.max(1, it.quantity - 1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">−</button>
                        <span className="w-8 text-center text-sm font-semibold">{it.quantity}</span>
                        <button onClick={() => updateQty(idx, Math.min(it.max, it.quantity + 1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">+</button>
                      </div>
                      <div className="text-sm font-bold text-gray-900 w-24 text-right">KES {(it.unitPrice * it.quantity).toFixed(2)}</div>
                      <button onClick={() => removeFromCart(idx)} className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">Order Total</div>
                    <div className="text-2xl font-bold text-gray-900">KES {total.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={submitSale}
                    className="px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: '#1a6b45' }}
                  >
                    Record Sale →
                  </button>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Calculator trigger */}
          <button
            onClick={() => setShowCalc(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-100 rounded-xl hover:border-gray-300 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-base" style={{ backgroundColor: '#1a6b45' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <div className="text-left flex-1">
              <div className="text-sm font-semibold text-gray-800">Calculator</div>
              <div className="text-xs text-gray-400">Quick calculations</div>
            </div>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Recent sales */}
          <Card>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Recent Sales</div>
            {sales.length === 0 ? (
              <div className="text-sm text-gray-400 text-center py-6">No sales recorded yet</div>
            ) : (
              <div className="space-y-3">
                {sales.slice(0, 8).map((s: any) => (
                  <div key={s.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-sm flex-shrink-0">🧾</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-700 truncate">
                        {s.saleItems?.map((it: any) => it.product?.name).filter(Boolean).join(', ') || 'Sale'}
                      </div>
                      <div className="text-xs text-gray-400">{new Date(s.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div className="text-sm font-bold text-gray-900 flex-shrink-0">KES {s.totalAmount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Toast open={toastOpen} onClose={() => setToastOpen(false)} title="Sale recorded" description="Sale successfully recorded and stock updated." />
    </div>
  )
}