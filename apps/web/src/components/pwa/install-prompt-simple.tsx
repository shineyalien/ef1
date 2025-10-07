'use client'

import { useEffect, useState } from 'react'

interface PWAInstallPromptProps {
  onInstall?: () => void
  onDismiss?: () => void
}

export default function PWAInstallPrompt({ onInstall, onDismiss }: PWAInstallPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag to enable rendering
    setIsClient(true)

    // Check if running in browser
    if (typeof window === 'undefined') return

    // Simple PWA install prompt logic (simplified for now)
    const timer = setTimeout(() => {
      // Only show if not dismissed this session and not already installed
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed')
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      
      if (!dismissed && !isStandalone) {
        setShowPrompt(true)
      }
    }, 5000) // Show after 5 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setShowPrompt(false)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }
    onDismiss?.()
  }

  // Don't render on server-side
  if (!isClient || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Install Easy Filer
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Get the full app experience with offline access and faster loading.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // Simplified install logic
                  setShowPrompt(false)
                  onInstall?.()
                }}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}