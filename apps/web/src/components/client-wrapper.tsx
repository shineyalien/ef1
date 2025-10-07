'use client'

import { useEffect, useState } from 'react'
import PWAManager from '@/components/pwa/pwa-manager'
import MobileLayout from '@/components/mobile/layout'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // During SSR and initial hydration, render a simple layout
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    )
  }

  // After hydration, render the full client-side layout
  return (
    <>
      <PWAManager />
      <MobileLayout>
        {children}
      </MobileLayout>
    </>
  )
}