/**
 * Client Layout Wrapper
 *
 * This component wraps the app content with providers only on the client side.
 * It's used to avoid SSR issues with error context.
 */
'use client'

import { useEffect, useState } from 'react'
import DynamicProviders from '@/components/dynamic-providers'

interface ClientLayoutWrapperProps {
  children: React.ReactNode
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only render providers on the client side
  if (isClient) {
    return <DynamicProviders>{children}</DynamicProviders>
  }

  // Return children without providers during SSR - ensure it's a valid React element
  return <div>{children}</div>
}