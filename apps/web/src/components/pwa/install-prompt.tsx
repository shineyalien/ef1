'use client'

import { useEffect, useState } from 'react'

interface PWAInstallPromptProps {
  onInstall?: () => void
  onDismiss?: () => void
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstallPrompt({ onInstall, onDismiss }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag
    setIsClient(true)

    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standalone)

    // Don't show prompt if already installed
    if (standalone) return

    // Check if already dismissed this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('pwa-prompt-dismissed')) {
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired')
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA: App was installed')
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      onInstall?.()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Show install prompt after a delay on iOS (where beforeinstallprompt doesn't fire)
    if (iOS && !standalone) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true)
      }, 5000) // Show after 5 seconds

      return () => {
        clearTimeout(timer)
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.removeEventListener('appinstalled', handleAppInstalled)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [onInstall])

  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOS) return

    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt()
      
      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice
      console.log(`PWA: User response to install prompt: ${outcome}`)
      
      if (outcome === 'accepted') {
        onInstall?.()
      }
      
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    onDismiss?.()
    
    // Don't show again for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }
  }

  // Don't render on server-side
  if (!isClient) {
    return null
  }

  // Don't show if already dismissed this session
  if (typeof window !== 'undefined' && sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null
  }

  // Don't show if not supported or already installed
  if (!showInstallPrompt || isStandalone) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              Install Easy Filer App
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isIOS 
                ? 'Add to your home screen for quick access and offline features.'
                : 'Install our app for faster access and offline invoice management.'
              }
            </p>
            
            {isIOS && (
              <div className="mt-2 text-xs text-gray-500">
                <p>Tap <span className="font-medium">Share</span> → <span className="font-medium">Add to Home Screen</span></p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Install App
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            {isIOS ? 'Got it' : 'Maybe Later'}
          </button>
        </div>
      </div>
    </div>
  )
}