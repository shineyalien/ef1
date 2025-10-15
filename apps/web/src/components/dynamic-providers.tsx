/**
 * Dynamic Providers Component
 *
 * This component only renders on the client side to prevent SSR issues.
 * It wraps the application with providers that use hooks and client-side features.
 */
'use client'

import { useEffect, useState } from 'react'
import { ErrorProvider } from '@/contexts/error-context'
import GlobalErrorHandler from '@/components/global-error-handler'

interface DynamicProvidersProps {
  children: React.ReactNode
}

export default function DynamicProviders({ children }: DynamicProvidersProps) {
  const [isClient, setIsClient] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true)
    
    // Add a small delay to ensure proper hydration
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  // During SSR or before hydration, render children without providers
  if (!isClient || !isMounted) {
    return <div suppressHydrationWarning>{children}</div>
  }

  // After hydration, wrap with full provider stack
  try {
    return (
      <ErrorProvider enableErrorLogging={true} maxErrors={50} maxToasts={5}>
        <GlobalErrorHandler enableErrorLogging={true} enableToastNotifications={true}>
          {children}
        </GlobalErrorHandler>
      </ErrorProvider>
    )
  } catch (error) {
    // Fallback to children if providers fail
    console.error('Failed to initialize providers:', error)
    return <div suppressHydrationWarning>{children}</div>
  }
}