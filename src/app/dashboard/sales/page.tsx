'use client'

import SalesPageView from './SalesPageView'
import { useSalesPage } from './useSalesPage'

export default function SalesPage() {
  return <SalesPageView {...useSalesPage()} />
}
