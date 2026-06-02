'use client'
import React from 'react'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import { formatKES } from '@/lib/utils'

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
      <div className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden" style={{ fontFamily: 'var(--font-sans, system-ui)' }}>
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
                    h-14 rounded-xl text-base font-medium transition-all active:scale-95
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
  const [paymentMethod, setPaymentMethod] = React.useState<'CASH' | 'MPESA'>('CASH')
  const [cashPaid, setCashPaid] = React.useState('')
  const [mpesaNumber, setMpesaNumber] = React.useState('')
  const [mpesaStatus, setMpesaStatus] = React.useState<string | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const [selectedSale, setSelectedSale] = React.useState<any | null>(null)
  const [editedSaleItems, setEditedSaleItems] = React.useState<any[]>([])
  const [removedSaleItemIds, setRemovedSaleItemIds] = React.useState<string[]>([])
  const [statusOption, setStatusOption] = React.useState<'PAID' | 'DEBT'>('PAID')
  const [debtorName, setDebtorName] = React.useState('')
  const [debtorPhone, setDebtorPhone] = React.useState('')
  const [deleteReason, setDeleteReason] = React.useState('')
  const [showSaleModal, setShowSaleModal] = React.useState(false)
  const [showCalc, setShowCalc] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/inventory').then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : []))
    fetch('/api/reports/stats').then(r => r.json()).then(s => setIncome(s.totalRevenue || 0))
    fetch('/api/sales').then(r => r.json()).then(d => setSales(Array.isArray(d) ? d : []))
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

  async function submitSale(payload: any) {
    if (cart.length === 0) return
    setIsProcessing(true)
    try {
      const items = cart.map(c => ({ productId: c.productId, quantity: c.quantity, unitPrice: c.unitPrice }))
      const body = { items, paymentStatus: 'PAID', ...payload }
      const res = await fetch('/api/sales', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

      if (res.ok) {
        setToastOpen(true)
        setCart([])
        setCashPaid('')
        setMpesaNumber('')
        setMpesaStatus(null)
        fetch('/api/reports/stats').then(r => r.json()).then(s => setIncome(s.totalRevenue || 0))
        fetch('/api/inventory').then(r => r.json()).then(d => setProducts(d))
        refreshSales()
      } else {
        const e = await res.json()
        alert(e?.error || 'Failed to record sale')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  function refreshSales() {
    fetch('/api/sales').then(r => r.json()).then(d => setSales(Array.isArray(d) ? d : []))
  }

  async function handleCashSale() {
    const paid = parseFloat(cashPaid) || 0
    if (paid < total) {
      alert('Enter an amount paid that is equal or greater than the order total.')
      return
    }
    await submitSale({ paymentMethod: 'CASH', paidAmount: paid, notes: `Cash payment, paid amount KES ${paid.toFixed(2)}` })
  }

  async function handleMpesaSale() {
    if (!mpesaNumber.match(/^\d{10}$/)) {
      alert('Enter a valid 10-digit mobile number for M-Pesa.')
      return
    }
    if (total <= 0) return

    setIsProcessing(true)
    setMpesaStatus('Sending M-Pesa push...')

    try {
      const res = await fetch('https://payment-gateway.kimaniwilfred95.workers.dev/api/stk/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: mpesaNumber,
          amount: Math.round(total),
          accountReference: 'HardwareSale',
          transactionDesc: 'Hardware store sale',
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setMpesaStatus(`M-Pesa push failed: ${data?.error || res.statusText}`)
        return
      }

      setMpesaStatus('M-Pesa push initiated. Confirm payment on the customer phone.')
      await submitSale({
        paymentMethod: 'MPESA',
        mobileNumber: mpesaNumber,
        notes: `M-Pesa push to ${mpesaNumber}`,
      })
    } catch (error: any) {
      setMpesaStatus(`M-Pesa request failed: ${error?.message || 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  function openSaleModal(sale: any) {
    setSelectedSale(sale)
    setEditedSaleItems(sale.saleItems?.map((item: any) => ({ ...item })) || [])
    setRemovedSaleItemIds([])
    setStatusOption(sale.paymentStatus)
    setDebtorName(sale.debt?.debtorName || '')
    setDebtorPhone(sale.debt?.debtorPhone || '')
    setDeleteReason('')
    setConfirmDelete(false)
    setShowSaleModal(true)
  }

  function closeSaleModal() {
    setSelectedSale(null)
    setEditedSaleItems([])
    setRemovedSaleItemIds([])
    setShowSaleModal(false)
    setStatusOption('PAID')
    setDebtorName('')
    setDebtorPhone('')
    setDeleteReason('')
    setConfirmDelete(false)
  }

  async function updateSaleStatus(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSale) return
    setIsProcessing(true)
    try {
      const payload: any = { paymentStatus: statusOption }
      if (statusOption === 'DEBT' && selectedSale.paymentStatus !== 'DEBT') {
        payload.debtorName = debtorName
        payload.debtorPhone = debtorPhone
      }

      const editedItems = editedSaleItems.map((item) => ({ id: item.id, quantity: item.quantity }))
      const removedItems = removedSaleItemIds.map((id) => ({ id, remove: true }))
      if (editedItems.length > 0 || removedItems.length > 0) {
        payload.items = [...editedItems, ...removedItems]
      }

      const res = await fetch(`/api/sales/${selectedSale.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        refreshSales()
        closeSaleModal()
        setToastOpen(true)
      } else {
        const error = await res.json()
        alert(error?.error || 'Failed to update sale status')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  function updateModalItemQty(itemId: string, qty: number) {
    setEditedSaleItems((items) => items.map((item) => item.id === itemId ? { ...item, quantity: qty } : item))
  }

  function removeModalSaleItem(itemId: string) {
    setEditedSaleItems((items) => items.filter((item) => item.id !== itemId))
    setRemovedSaleItemIds((ids) => [...ids, itemId])
  }

  async function deleteSale() {
    if (!selectedSale) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch(`/api/sales/${selectedSale.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletionReason: deleteReason }),
      })

      if (res.ok) {
        refreshSales()
        closeSaleModal()
        setToastOpen(true)
      } else {
        const error = await res.json()
        alert(error?.error || 'Failed to archive sale')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const total = cart.reduce((s, it) => s + it.unitPrice * it.quantity, 0)
  const displayedSales = Array.isArray(sales) ? sales : []
  const editedSaleTotal = editedSaleItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const recentSales = displayedSales.slice(0, 10)

  return (
    <div className="space-y-6">
      {showCalc && <CalculatorModal onClose={() => setShowCalc(false)} />}

      <Header title="Sales" subtitle="Record and manage sales transactions" />

      {/* Top stat bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `KES ${formatKES(income)}`, icon: '💰' },
          { label: 'Cart Items', value: cart.reduce((s, i) => s + i.quantity, 0), icon: '🛒' },
          { label: 'Cart Total', value: `KES ${formatKES(total)}`, icon: '🧾' },
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
                          <div className="text-sm font-semibold text-gray-900">KES {formatKES(s.unitPrice)}</div>
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
                        <div className="text-xs text-gray-400 mt-0.5">KES {formatKES(it.unitPrice)} each</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(idx, Math.max(1, it.quantity - 1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">−</button>
                        <span className="w-8 text-center text-sm font-semibold">{it.quantity}</span>
                        <button onClick={() => updateQty(idx, Math.min(it.max, it.quantity + 1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">+</button>
                      </div>
                      <div className="text-sm font-bold text-gray-900 w-24 text-right">KES {formatKES(it.unitPrice * it.quantity)}</div>
                      <button onClick={() => removeFromCart(idx)} className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Payment method</div>
                    <div className="grid grid-cols-2 gap-2">
                      {(['CASH', 'MPESA'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-3 rounded-xl text-sm font-semibold transition ${paymentMethod === method ? 'bg-emerald-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === 'CASH' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Amount paid</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={cashPaid}
                          onChange={(e) => setCashPaid(e.target.value)}
                          placeholder="KES 0.00"
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Change</span>
                        <span className="font-semibold text-gray-900">KES {formatKES(Math.max(0, (parseFloat(cashPaid) || 0) - total))}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">M-Pesa mobile number</label>
                        <input
                          type="tel"
                          value={mpesaNumber}
                          onChange={(e) => setMpesaNumber(e.target.value)}
                          placeholder="07XXXXXXXX"
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                        />
                      </div>
                      {mpesaStatus && <div className="text-xs text-gray-500">{mpesaStatus}</div>}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-gray-400">Order Total</div>
                      <div className="text-2xl font-bold text-gray-900">KES {formatKES(total)}</div>
                    </div>
                    {paymentMethod === 'CASH' ? (
                      <button
                        onClick={handleCashSale}
                        disabled={cart.length === 0 || isProcessing}
                        className="px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ backgroundColor: '#1a6b45' }}
                      >
                        Record cash sale →
                      </button>
                    ) : (
                      <button
                        onClick={handleMpesaSale}
                        disabled={cart.length === 0 || isProcessing}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ backgroundColor: '#1a6b45' }}
                      >
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-white">M</span>
                        Pay with M-Pesa
                      </button>
                    )}
                  </div>
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
            {displayedSales.length === 0 ? (
              <div className="text-sm text-gray-400 text-center py-6">No sales recorded yet</div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto">
                {recentSales.map((s: any) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => openSaleModal(s)}
                    className="w-full text-left flex items-center gap-3 py-3 px-3 rounded-2xl transition-all hover:bg-gray-50 border border-transparent hover:border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-sm flex-shrink-0">🧾</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-700 truncate">
                        {s.saleItems?.map((it: any) => it.product?.name).filter(Boolean).join(', ') || 'Sale'}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                        <span>{new Date(s.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s.paymentStatus}</span>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900 flex-shrink-0">KES {formatKES(s.totalAmount)}</div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {showSaleModal && selectedSale && (
        <Modal
          title="Manage Sale"
          onClose={closeSaleModal}
          onSubmit={updateSaleStatus}
          submitDisabled={isProcessing || editedSaleItems.length === 0}
          submitLabel={editedSaleItems.length === 0 ? 'No items to save' : 'Save'}
          overlayClassName="fixed inset-0 z-40 bg-black/40"
          containerClassName="fixed inset-x-4 top-1/2 z-50 mx-auto w-full max-w-3xl -translate-y-1/2 transform rounded-3xl bg-white shadow-2xl p-8 overflow-y-auto max-h-[90vh]"
        >
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <div className="font-semibold text-gray-900 mb-1">Sale items</div>
              <div className="space-y-3 text-xs text-gray-500">
                {editedSaleItems.length === 0 ? (
                  <div className="text-sm text-gray-500">This sale has no editable items left.</div>
                ) : (
                  editedSaleItems.map((item: any) => {
                    const maxQty = item.quantity + (item.product?.currentStock || 0)
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">{item.product?.name || 'Item'}</div>
                          <div className="text-xs text-gray-500">KES {formatKES(item.unitPrice)} each</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateModalItemQty(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold"
                          >
                            −
                          </button>
                          <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateModalItemQty(item.id, Math.min(maxQty, item.quantity + 1))}
                            disabled={item.quantity >= maxQty}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeModalSaleItem(item.id)}
                          className="text-red-500 hover:text-red-600 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>
                <div className="font-medium text-gray-900">Amount</div>
                KES {formatKES(editedSaleTotal)}
              </div>
              <div>
                <div className="font-medium text-gray-900">Date</div>
                {new Date(selectedSale.saleDate).toLocaleString()}
              </div>
            </div>

            <div>
              <div className="font-medium text-gray-900 mb-2">Payment status</div>
              <div className="grid grid-cols-2 gap-2">
                {(['PAID', 'DEBT'] as const).map((status) => (
                  <button
                    type="button"
                    key={status}
                    onClick={() => setStatusOption(status)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${statusOption === status ? 'bg-emerald-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {statusOption === 'DEBT' && selectedSale.paymentStatus !== 'DEBT' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Debtor name</label>
                  <input
                    value={debtorName}
                    onChange={(e) => setDebtorName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Debtor phone</label>
                  <input
                    value={debtorPhone}
                    onChange={(e) => setDebtorPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="w-full px-4 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
              >
                Archive sale
              </button>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">Delete reason</label>
                  <textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="Optional note for why this sale is archived"
                    className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm min-h-[100px]"
                  />
                  <p className="text-xs text-gray-400">Deleted sales are archived for audit and excluded from revenue calculations.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={deleteSale}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isProcessing ? 'Archiving…' : 'Confirm archive'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      <Toast open={toastOpen} onClose={() => setToastOpen(false)} title="Sale recorded" description="Sale successfully recorded and stock updated." />
    </div>
  )
}