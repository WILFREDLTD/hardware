'use client'

import SaleModalBody from './SaleModalBody'
import type { SaleModalProps } from './types'

export default function SaleModal(props: SaleModalProps) {
  if (!props.showSaleModal || !props.selectedSale) return null
  return <SaleModalBody {...props} />
}
