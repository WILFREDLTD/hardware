'use client'
import { useState } from 'react'
import { Sale, SaleItem } from './types'

export function useSaleModal() {
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [editedSaleItems, setEditedSaleItems] = useState<SaleItem[]>([])
  const [statusOption, setStatusOption] = useState<'PAID' | 'DEBT'>('PAID')
  const [debtorName, setDebtorName] = useState('')
  const [debtorPhone, setDebtorPhone] = useState('')
  const [deleteReason, setDeleteReason] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  function openSaleModal(sale: Sale) {
    setSelectedSale(sale)
    setEditedSaleItems(sale.saleItems?.map((item) => ({ ...item })) || [])
    setStatusOption(sale.paymentStatus === 'DEBT' ? 'DEBT' : 'PAID')
    setDebtorName(sale.debt?.debtorName || '')
    setDebtorPhone(sale.debt?.debtorPhone || '')
    setDeleteReason('')
    setConfirmDelete(false)
    setShowSaleModal(true)
  }

  function closeSaleModal() {
    setSelectedSale(null)
    setEditedSaleItems([])
    setShowSaleModal(false)
    setStatusOption('PAID')
    setDebtorName('')
    setDebtorPhone('')
    setDeleteReason('')
    setConfirmDelete(false)
  }

  function updateModalItemQty(itemId: string, qty: number) {
    setEditedSaleItems((items) => items.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item)))
  }

  function removeModalSaleItem(itemId: string) {
    setEditedSaleItems((items) => items.filter((item) => item.id !== itemId))
  }

  return {
    showSaleModal,
    selectedSale,
    editedSaleItems,
    statusOption,
    setStatusOption,
    debtorName,
    setDebtorName,
    debtorPhone,
    setDebtorPhone,
    deleteReason,
    setDeleteReason,
    confirmDelete,
    setConfirmDelete,
    openSaleModal,
    closeSaleModal,
    updateModalItemQty,
    removeModalSaleItem,
  }
}
