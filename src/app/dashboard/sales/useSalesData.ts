'use client'
import { useEffect, useState } from 'react'
import { Product, Sale } from './types'

export function useSalesData() {
  const [products, setProducts] = useState<Product[]>([])
  const [income, setIncome] = useState(0)
  const [sales, setSales] = useState<Sale[]>([])

  useEffect(() => {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))

    fetch('/api/reports/stats')
      .then((res) => res.json())
      .then((stats) => setIncome(stats.totalRevenue || 0))

    fetch('/api/sales')
      .then((res) => res.json())
      .then((data) => setSales(Array.isArray(data) ? data : []))
  }, [])

  function refreshSales() {
    fetch('/api/sales')
      .then((res) => res.json())
      .then((data) => setSales(Array.isArray(data) ? data : []))
  }

  function refreshProducts() {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
  }

  return {
    products,
    setProducts,
    income,
    setIncome,
    sales,
    setSales,
    refreshSales,
    refreshProducts,
  }
}
