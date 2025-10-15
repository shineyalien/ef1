/**
 * Client Wrapper Component
 * 
 * This component ensures that complex components only render on the client side
 * and have access to the error context. This prevents SSR issues during static generation.
 */
'use client'

import { useEffect, useState } from 'react'

interface ClientWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  delay?: number
}

export default function ClientWrapper({ 
  children, 
  fallback = null, 
  delay = 0 
}: ClientWrapperProps) {
  const [isClient, setIsClient] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true)
    
    // Add delay if specified (useful for complex components)
    if (delay > 0) {
      const timer = setTimeout(() => {
        setIsReady(true)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      setIsReady(true)
    }
    
    // Always return a cleanup function
    return () => {}
  }, [delay])

  // During SSR or before ready, render fallback
  if (!isClient || !isReady) {
    return <>{fallback}</>
  }

  // After hydration, render children
  return <>{children}</>
}

/**
 * Higher-order component to wrap components with client-side rendering
 */
export function withClientRendering<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode
    delay?: number
  }
) {
  const WrappedComponent = (props: P) => (
    <ClientWrapper 
      fallback={options?.fallback} 
      delay={options?.delay}
    >
      <Component {...props} />
    </ClientWrapper>
  )

  WrappedComponent.displayName = `withClientRendering(${Component.displayName || Component.name})`
  
  return WrappedComponent
}