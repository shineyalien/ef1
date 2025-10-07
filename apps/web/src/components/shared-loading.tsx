import { Loader2 } from 'lucide-react'

interface SharedLoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function SharedLoading({ message = "Loading...", size = 'lg' }: SharedLoadingProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600 mx-auto mb-4`}></div>
        <p className={`text-gray-600 ${textSizes[size]}`}>{message}</p>
      </div>
    </div>
  )
}