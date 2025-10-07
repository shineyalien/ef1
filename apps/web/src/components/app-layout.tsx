'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar, MobileNav } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, User, LogOut, Settings, Building2, Shield } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  
  // Don't show navigation on auth pages
  if (pathname.startsWith('/auth')) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>

              {/* User menu */}
              <div className="flex items-center gap-x-3">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm font-semibold text-gray-900">
                    {session?.user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {session?.user?.email}
                  </p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/settings/profile'}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/settings/business'}
                      className="cursor-pointer"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Business Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/settings/fbr'}
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      FBR Integration
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/settings/security'}
                      className="cursor-pointer"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => signOut({ callbackUrl: '/auth/login' })}
                      className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  )
}