'use client'
import { formatKES } from '@/lib/utils'

interface SalesStatsProps {
  income: number
  cartItems: number
  total: number
  salesToday: number
}

export default function SalesStats({ income, cartItems, total, salesToday }: SalesStatsProps) {
  const stats = [
    { label: 'Total Revenue', value: `KES ${formatKES(income)}`, icon: '💰' },
    { label: 'Cart Items', value: cartItems, icon: '🛒' },
    { label: 'Cart Total', value: `KES ${formatKES(total)}`, icon: '🧾' },
    { label: 'Sales Today', value: salesToday, icon: '📊' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{stat.label}</div>
          <div className="text-xl font-semibold text-gray-900">{stat.icon} {stat.value}</div>
        </div>
      ))}
    </div>
  )
}
