'use client'

import { useState, useEffect } from 'react'
import MobileCustomerManager from '@/components/mobile/customer-manager'

export default function MobileCustomersPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Prevent SSR issues
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <MobileCustomerManager />
}