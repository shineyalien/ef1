'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Upload,
  Settings,
  Menu,
  X,
  Wifi,
  WifiOff,
  Download,
  Package
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useNetworkStatus } from '@/hooks/use-network-status'
import { useOfflineInvoices, useOfflineCustomers } from '@/hooks/use-offline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Bulk Import', href: '/bulk-operations', icon: Upload },
  { name: 'Settings', href: '/settings/fbr', icon: Settings },
]

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const { isOnline } = useNetworkStatus()
  const { hasUnsyncedInvoices } = useOfflineInvoices()
  const { hasUnsyncedCustomers } = useOfflineCustomers()
  
  const hasUnsyncedData = hasUnsyncedInvoices || hasUnsyncedCustomers

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render on server-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <header className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EF</span>
                </div>
                <span className="font-semibold text-gray-900">Easy Filer</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <Download className="h-3 w-3 mr-1" />
                Install
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsOpen(true)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EF</span>
                </div>
                <span className="font-semibold text-gray-900">Easy Filer</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Connection Status */}
              <div className="flex items-center space-x-1">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                {hasUnsyncedData && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </div>
              
              {/* Install PWA Button */}
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <Download className="h-3 w-3 mr-1" />
                Install
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-gray-600 bg-opacity-75">
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EF</span>
                </div>
                <span className="font-semibold text-gray-900">Easy Filer</span>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Connection Status Banner */}
            <div className={`p-3 ${isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-b`}>
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Offline Mode</span>
                  </>
                )}
              </div>
              {hasUnsyncedData && (
                <div className="mt-1 text-xs text-orange-600">
                  {hasUnsyncedInvoices && 'Unsynced invoices'} 
                  {hasUnsyncedInvoices && hasUnsyncedCustomers && ' • '}
                  {hasUnsyncedCustomers && 'Unsynced customers'}
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <Link
                    key={item.name}
                    href={item.href as any}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="text-xs text-gray-500">
                Easy Filer PWA v1.0<br />
                FBR Compliant Invoicing
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar (Alternative Mobile Navigation) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigation.slice(0, 4).map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href as any}
                className={`
                  flex flex-col items-center space-y-1 p-2 rounded-lg text-xs transition-colors
                  ${isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="lg:hidden h-16"></div>
    </>
  )
}