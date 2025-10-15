'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { ReactNode } from 'react'
import { ErrorProvider } from '@/contexts/error-context'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorProvider enableErrorLogging={true} maxErrors={50} maxToasts={5}>
      <SessionProvider>
        {children}
        <Toaster position="top-right" richColors />
      </SessionProvider>
    </ErrorProvider>
  )
}