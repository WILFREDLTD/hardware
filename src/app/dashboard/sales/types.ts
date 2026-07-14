'use client'

export type Product = {
  id: string
  name: string
  nickname?: string | null
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
    status?: 'PENDING' | 'PARTIAL' | 'PAID'
    amount?: number
    amountPaid?: number
  }
}

export type SaleModalProps = {
  selectedSale: Sale | null
  showSaleModal: boolean
  closeSaleModal: () => void
  updateSaleStatus: (e?: React.FormEvent) => Promise<boolean>
  isProcessing: boolean
  editedSaleItems: SaleItem[]
  updateModalItemQty: (itemId: string, qty: number) => void
  removeModalSaleItem: (itemId: string) => void
  statusOption: 'PAID' | 'DEBT'
  setStatusOption: (value: 'PAID' | 'DEBT') => void
  debtorName: string
  setDebtorName: (value: string) => void
  debtorPhone: string
  setDebtorPhone: (value: string) => void
  confirmDelete: boolean
  setConfirmDelete: (value: boolean) => void
  deleteSale: () => Promise<void>
  deleteReason: string
  setDeleteReason: (value: string) => void
}

export type PendingSalePayload = {
  paymentMethod: string
  paidAmount: number
  debtAmount: number
  paymentStatus: 'PAID' | 'DEBT'
  notes: string
}
