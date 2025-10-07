'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'

interface NetworkStatusProps {
  onOnline?: () => void
  onOffline?: () => void
}

export default function NetworkStatus({ onOnline, onOffline }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showStatus, setShowStatus] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag
    setIsClient(true)

    // Set initial online status
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    const handleOnline = () => {
      console.log('Network: Back online')
      setIsOnline(true)
      setShowStatus(true)
      onOnline?.()
      
      // Hide status after 3 seconds
      setTimeout(() => setShowStatus(false), 3000)
    }

    const handleOffline = () => {
      console.log('Network: Gone offline')
      setIsOnline(false)
      setShowStatus(true)
      onOffline?.()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onOnline, onOffline])

  // Don't render on server-side
  if (!isClient) {
    return null
  }

  // Only show when offline or when coming back online
  if (!showStatus && isOnline) {
    return null
  }

  return (
    <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      showStatus ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className={`px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 ${
        isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            <span className="text-sm font-medium">Back online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">No internet connection</span>
          </>
        )}
      </div>
    </div>
  )
}

// Hook for using network status in components
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setWasOffline(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, wasOffline }
}