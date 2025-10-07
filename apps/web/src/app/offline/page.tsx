'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  WifiOff, 
  RefreshCw, 
  Home, 
  Download,
  Smartphone,
  CheckCircle
} from 'lucide-react'

export default function OfflinePage() {
  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = '/'
    } else {
      window.location.reload()
    }
  }

  const features = [
    {
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      title: "View Invoices",
      description: "Access your recently viewed invoices",
      available: true
    },
    {
      icon: <Download className="h-6 w-6 text-green-600" />,
      title: "Export Data",
      description: "Download cached reports and data",
      available: true
    },
    {
      icon: <Smartphone className="h-6 w-6 text-purple-600" />,
      title: "Mobile Optimized",
      description: "Full mobile experience when offline",
      available: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Easy Filer</span>
              <span className="ml-2 text-sm text-gray-500">(Offline)</span>
            </div>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Offline Status Card */}
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mr-4">
                <WifiOff className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">You're Currently Offline</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Don't worry! You can still access some features while waiting for your connection to return.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Available Features */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Easy Filer Works Offline
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Access your cached data and continue working while disconnected
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                  {feature.available && (
                    <div className="flex items-center justify-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Available Offline</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto" variant="default">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            
            <Button onClick={handleRetry} variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Connection
            </Button>
          </div>

          {/* Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Offline Tips</CardTitle>
              <CardDescription>
                Make the most of Easy Filer while offline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Your recent invoices and customers are cached locally</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Any new invoices created offline will sync when you're back online</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Install our app for even better offline experience</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>FBR submissions require internet connection</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>Easy Filer - Pakistani Business Invoicing Software</p>
            <p className="mt-1">Offline mode active - some features may be limited</p>
          </div>
        </div>
      </footer>
    </div>
  )
}