'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Eye, 
  Palette, 
  Settings,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import Link from 'next/link'
import { useSession } from 'next-auth/react'

// Prevent static generation for this page since it uses useSession
export const dynamic = 'force-dynamic'

interface BusinessSettings {
  companyName: string
  ntnNumber: string
  address: string
  province: string
  sellerCity?: string
  sellerContact?: string
  sellerEmail?: string
  logoUrl?: string | null
  invoiceTemplate?: string
  invoicePrefix?: string
  footerText?: string | null
  taxIdLabel?: string | null
  defaultCurrency?: string
  primaryColor?: string | null
  secondaryColor?: string | null
  defaultPaymentTerms?: string | null
}

const themes = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and professional layout with standard colors',
    preview: '/api/test-pdf?theme=default'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with colored headers and card layouts',
    preview: '/api/test-pdf?theme=modern'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional elegant layout with centered elements',
    preview: '/api/test-pdf?theme=classic'
  }
]

export default function PDFThemesPage() {
  const { data: session } = useSession()
  const [business, setBusiness] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState('default')

  useEffect(() => {
    if (session) {
      loadBusiness()
    }
  }, [session])

  const loadBusiness = async () => {
    try {
      const response = await fetch('/api/business/current')
      const data = await response.json()
      
      if (data.success) {
        setBusiness(data.business)
        setSelectedTheme((data.business as any).invoiceTemplate || 'default')
      }
    } catch (error) {
      console.error('Failed to load business:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleThemeChange = async (theme: string) => {
    setSelectedTheme(theme)
    
    try {
      const response = await fetch('/api/settings/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...business,
          invoiceTemplate: theme
        })
      })

      if (response.ok) {
        await loadBusiness()
      }
    } catch (error) {
      console.error('Failed to update theme:', error)
    }
  }

  const downloadPDF = (theme: string) => {
    const link = document.createElement('a')
    link.href = `/api/test-pdf?theme=${theme}`
    link.download = `invoice-${theme}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Authentication Required</CardTitle>
            <CardDescription className="text-center">
              Please log in to access PDF themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login">
              <Button className="w-full">Login to Continue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">PDF Themes</h1>
            </div>
            <Link href="/settings/business">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Business Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Settings Summary */}
        {business && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Current Business Settings</span>
              </CardTitle>
              <CardDescription>
                These settings will be applied to your PDF invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Company Information</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Name:</strong> {business.companyName}</p>
                    <p><strong>{business.taxIdLabel || 'NTN'}:</strong> {business.ntnNumber}</p>
                    <p><strong>Address:</strong> {business.address}</p>
                    <p><strong>City:</strong> {business.sellerCity || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Branding</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: business.primaryColor || '#3B82F6' }}
                      ></div>
                      <span className="text-sm text-gray-600">Primary: {business.primaryColor || '#3B82F6'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: business.secondaryColor || '#10B981' }}
                      ></div>
                      <span className="text-sm text-gray-600">Secondary: {business.secondaryColor || '#10B981'}</span>
                    </div>
                    {business.logoUrl && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">Logo uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Invoice Settings</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Prefix:</strong> {business.invoicePrefix || 'INV-'}</p>
                    <p><strong>Currency:</strong> {business.defaultCurrency || 'PKR'}</p>
                    <p><strong>Theme:</strong> 
                      <Badge variant="secondary" className="ml-2">
                        {themes.find(t => t.id === selectedTheme)?.name || 'Default'}
                      </Badge>
                    </p>
                    {business.footerText && (
                      <p><strong>Footer:</strong> {business.footerText}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Theme Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your PDF Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <Card 
                key={theme.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTheme === theme.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="h-5 w-5" />
                      <span>{theme.name}</span>
                    </CardTitle>
                    {selectedTheme === theme.id && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <CardDescription>{theme.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">Preview</p>
                      <div className="bg-white rounded border border-gray-300 p-2">
                        <div className="h-32 bg-gradient-to-b from-gray-50 to-gray-100 rounded flex items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(theme.preview, '_blank')
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadPDF(theme.id)
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>How to Customize Your PDFs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Theme Selection</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Click on any theme card to select it</li>
                  <li>• Your selection is automatically saved</li>
                  <li>• Preview or download sample PDFs</li>
                  <li>• New invoices will use your selected theme</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Business Settings</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Upload your company logo</li>
                  <li>• Customize primary and secondary colors</li>
                  <li>• Set invoice prefix and footer text</li>
                  <li>• Configure tax ID label and currency</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> All changes are applied to new invoices immediately. 
                Existing invoices will retain their original appearance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}