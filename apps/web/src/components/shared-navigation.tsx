import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface SharedNavigationProps {
  backUrl?: string
  backLabel?: string
  showHome?: boolean
  currentPage?: string
}

export function SharedNavigation({ 
  backUrl, 
  backLabel = "Back", 
  showHome = true, 
  currentPage 
}: SharedNavigationProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      {backUrl && (
        <Link href={backUrl as string}>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>{backLabel}</span>
          </Button>
        </Link>
      )}
      
      {showHome && (
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
        </Link>
      )}
      
      {currentPage && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Current:</span>
          <span className="font-medium text-gray-700">{currentPage}</span>
        </div>
      )}
    </div>
  )
}