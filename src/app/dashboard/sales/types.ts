'use client'

export type Product = {
  id: string
  name: string
  sku: string
  currentStock: number
  unitPrice: number
}

export type CartItem = {
  productId: string
  name: string
  unitPrice: number
  quantity: number
  max: number
}

export type SaleItem = {
  id: string
  quantity: number
  unitPrice: number
  product?: {
    name?: string
    currentStock?: number
  }
}

export type Sale = {
  id: string
  saleItems?: SaleItem[]
  paymentStatus: string
  saleDate: string
  totalAmount: number
  debt?: {
    debtorName?: string
    debtorPhone?: string
  }
}

export type PendingSalePayload = {
  paymentMethod: string
  paidAmount: number
  debtAmount: number
  paymentStatus: 'PAID' | 'DEBT'
  notes: string
}
