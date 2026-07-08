'use client'
import { useState } from 'react'
import { PendingSalePayload } from './types'

export function useDebtModal() {
  const [showDebtModal, setShowDebtModal] = useState(false)
  const [debtorNameInput, setDebtorNameInput] = useState('')
  const [debtorPhoneInput, setDebtorPhoneInput] = useState('')
  const [pendingSalePayload, setPendingSalePayload] = useState<PendingSalePayload | null>(null)
  const [debtModalError, setDebtModalError] = useState('')

  function openDebtModal(payload: PendingSalePayload) {
    setPendingSalePayload(payload)
    setDebtorNameInput('')
    setDebtorPhoneInput('')
    setDebtModalError('')
    setShowDebtModal(true)
  }

  function closeDebtModal() {
    setShowDebtModal(false)
    setPendingSalePayload(null)
    setDebtModalError('')
  }

  return {
    showDebtModal,
    debtorNameInput,
    setDebtorNameInput,
    debtorPhoneInput,
    setDebtorPhoneInput,
    pendingSalePayload,
    debtModalError,
    setDebtModalError,
    openDebtModal,
    closeDebtModal,
  }
}
