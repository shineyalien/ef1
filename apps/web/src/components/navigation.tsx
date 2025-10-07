'use client'

import { usePathname } from 'next/navigation'
import { FileText, Users, Settings, BarChart3, Home } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, disabled: true },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Easy Filer</span>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={(item.disabled ? '#' : item.href) as any}
                  className={cn(
                    isActive
                      ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    item.disabled && 'opacity-50 cursor-not-allowed',
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-l-md transition-colors'
                  )}
                  onClick={(e) => item.disabled && e.preventDefault()}
                >
                  <Icon
                    className={cn(
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-5 w-5'
                    )}
                  />
                  {item.name}
                  {item.disabled && (
                    <span className="ml-auto text-xs text-gray-400">Soon</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="text-xs text-gray-500">
            <p className="font-medium">Easy Filer v1.0</p>
            <p>FBR Compliant Invoicing</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <nav className="flex justify-around">
        {navigation.filter(item => !item.disabled).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href as any}
              className={cn(
                'flex flex-col items-center py-2 px-3 text-xs transition-colors',
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600'
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}