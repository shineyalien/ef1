'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import MobileNavigation from './navigation'
import NetworkStatus from '@/components/pwa/network-status'
import InstallPrompt from '@/components/pwa/install-prompt-simple'

interface MobileLayoutProps {
  children: ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Show basic layout during SSR/hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    )
  }
  
  // Don't show mobile layout on auth pages
  if (pathname?.startsWith('/auth')) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Main Content */}
      <main className="pb-20 lg:pb-0">
        {children}
      </main>
      
      {/* PWA Components */}
      <NetworkStatus />
      <InstallPrompt />
    </div>
  )
}