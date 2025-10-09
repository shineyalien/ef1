'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  MapPin,
  FileText,
  Save,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  Palette,
  FileEdit,
  Eye,
  AlertTriangle
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { SharedLoading } from "@/components/shared-loading"
import { SharedNavigation } from "@/components/shared-navigation"

interface BusinessProfile {
  companyName: string
  ntnNumber: string
  address: string
  province: string
  businessType: string
  sector: string
  sellerCity: string | null
  sellerContact: string | null
  sellerEmail: string | null
  posId: string | null
  electronicSoftwareRegNo: string | null
  fbrIntegratorLicenseNo: string | null
  // New customization fields
  logoUrl: string | null
  invoiceTemplate: string | null
  invoicePrefix: string | null
  invoiceFooter: string | null
  taxIdLabel: string | null
  defaultTerms: string | null
  primaryColor: string | null
  secondaryColor: string | null
  defaultCurrency: string
  pdfTheme: string | null
  defaultScenario: string | null
}

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Gilgit-Baltistan',
  'Azad Kashmir',
  'Islamabad'
]

const BUSINESS_TYPES = [
  'Manufacturer',
  'Importer',
  'Distributor',
  'Wholesaler',
  'Exporter',
  'Retailer',
  'Service Provider',
  'Other'
]

const SECTORS = [
  'All Other Sectors',
  'Steel',
  'FMCG',
  'Textile',
  'Telecom',
  'Petroleum',
  'Electricity Distribution',
  'Gas Distribution',
  'Automobile',
  'CNG Stations',
  'Pharmaceuticals',
  'Wholesale / Retails',
  'Other'
]

// Import FBR scenario functions
import {
  getApplicableScenarios,
  getScenarioDescription,
  validateScenarioApplicability,
  type FBRScenario
} from '@/lib/fbr-scenarios'

// Import error context directly to avoid dynamic loading issues
import { useError } from '@/contexts/error-context'

export default function BusinessSettingsPageFixed() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Use error hooks directly
  const {
    showErrorToast,
    showSuccessToast,
    handleNetworkError,
    handleValidationError,
    handleApiError,
    handleGenericError
  } = useError()
  
  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [needsInitialSetup, setNeedsInitialSetup] = useState(false)
  const [formData, setFormData] = useState<BusinessProfile>({
    companyName: '',
    ntnNumber: '',
    address: '',
    province: 'Punjab',
    businessType: 'Service Provider',
    sector: 'All Other Sectors',
    sellerCity: '',
    sellerContact: '',
    sellerEmail: '',
    posId: '',
    electronicSoftwareRegNo: '',
    fbrIntegratorLicenseNo: '',
    logoUrl: null,
    invoiceTemplate: 'default',
    invoicePrefix: 'INV-',
    invoiceFooter: null,
    taxIdLabel: 'NTN',
    defaultTerms: 'Payment due within 30 days',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    defaultCurrency: 'PKR',
    pdfTheme: 'default',
    defaultScenario: null
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      redirect('/auth/login')
      return
    }

    loadBusiness()
  }, [session, status])

  const loadBusiness = async () => {
    try {
      const response = await fetch('/api/settings/business')
      if (response.ok) {
        const data = await response.json()
        
        if (data.success && data.business) {
          setBusiness(data.business)
          setFormData({
            companyName: data.business.companyName || '',
            ntnNumber: data.business.ntnNumber || '',
            address: data.business.address || '',
            province: data.business.province || 'Punjab',
            businessType: data.business.businessType || 'Service Provider',
            sector: data.business.sector || 'All Other Sectors',
            sellerCity: data.business.sellerCity || '',
            sellerContact: data.business.sellerContact || '',
            sellerEmail: data.business.sellerEmail || '',
            posId: data.business.posId || '',
            electronicSoftwareRegNo: data.business.electronicSoftwareRegNo || '',
            fbrIntegratorLicenseNo: data.business.fbrIntegratorLicenseNo || '',
            logoUrl: (data.business as any).logoUrl || null,
            invoiceTemplate: (data.business as any).invoiceTemplate || 'default',
            invoicePrefix: (data.business as any).invoicePrefix || 'INV-',
            invoiceFooter: (data.business as any).footerText || null,
            taxIdLabel: (data.business as any).taxIdLabel || 'NTN',
            defaultTerms: (data.business as any).defaultPaymentTerms || 'Payment due within 30 days',
            primaryColor: (data.business as any).primaryColor || '#3B82F6',
            secondaryColor: (data.business as any).secondaryColor || '#10B981',
            defaultCurrency: (data.business as any).defaultCurrency || 'PKR',
            pdfTheme: (data.business as any).invoiceTemplate || 'default',
            defaultScenario: (data.business as any).defaultScenario || null
          })
        } else {
          throw new Error(data.error?.message || 'Failed to load business settings')
        }
      } else {
        // Handle 404 (business not found) and other errors
        if (response.status === 404) {
          console.warn('⚠️ Business not found, showing initial setup')
          setNeedsInitialSetup(true)
          // Don't show error toast for 404 - it's expected for new users
        } else {
          throw new Error(`Failed to load business settings: ${response.status}`)
        }
      }
    } catch (error) {
      console.error('Failed to load business:', error)
      // Only show error toast if it's not a 404 issue
      if (!(error instanceof Error && error.message.includes('404'))) {
        handleApiError(error instanceof Error ? error : new Error('Failed to load business settings'), 'Loading business settings')
        showErrorToast('Failed to Load', 'Could not load your business settings. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      handleValidationError('Please upload an image file', 'logo')
      showErrorToast('Invalid File', 'Please upload an image file (PNG, JPG, etc.)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      handleValidationError('File size too large. Maximum size is 5MB.', 'logo')
      showErrorToast('File Too Large', 'Please upload an image smaller than 5MB.')
      return
    }

    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const response = await fetch('/api/settings/business/logo', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Failed to upload logo: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        await loadBusiness()
        showSuccessToast('Logo Uploaded', 'Your company logo has been updated successfully!')
      } else {
        throw new Error(result.error?.message || 'Failed to upload logo')
      }
    } catch (error) {
      console.error('Logo upload error:', error)
      handleNetworkError(error instanceof Error ? error : new Error('Failed to upload logo'), 'Uploading logo')
      showErrorToast('Upload Failed', 'Failed to upload logo. Please try again.')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleRemoveLogo = async () => {
    if (!confirm('Are you sure you want to remove the logo?')) return

    try {
      const response = await fetch('/api/settings/business/logo', {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Failed to remove logo: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        await loadBusiness()
        showSuccessToast('Logo Removed', 'Your company logo has been removed successfully!')
      } else {
        throw new Error(result.error?.message || 'Failed to remove logo')
      }
    } catch (error) {
      console.error('Logo remove error:', error)
      handleNetworkError(error instanceof Error ? error : new Error('Failed to remove logo'), 'Removing logo')
      showErrorToast('Removal Failed', 'Failed to remove logo. Please try again.')
    }
  }

  const saveBusiness = async () => {
    // Validate required fields
    if (!formData.companyName || formData.companyName.trim() === '') {
      handleValidationError('Company name is required', 'companyName')
      showErrorToast('Validation Error', 'Company name is required')
      return
    }
    
    if (!formData.ntnNumber || formData.ntnNumber.trim() === '') {
      handleValidationError('NTN number is required', 'ntnNumber')
      showErrorToast('Validation Error', 'NTN number is required')
      return
    }
    
    if (!formData.address || formData.address.trim() === '') {
      handleValidationError('Business address is required', 'address')
      showErrorToast('Validation Error', 'Business address is required')
      return
    }
    
    if (!formData.businessType || formData.businessType.trim() === '') {
      handleValidationError('Business type is required', 'businessType')
      showErrorToast('Validation Error', 'Business type is required')
      return
    }
    
    if (!formData.sector || formData.sector.trim() === '') {
      handleValidationError('Industry sector is required', 'sector')
      showErrorToast('Validation Error', 'Industry sector is required')
      return
    }
    
    setSaving(true)
    try {
      // For initial setup, we need to create the business record
      const endpoint = needsInitialSetup ? '/api/settings/business/create' : '/api/settings/business'
      
      // Prepare the payload with all business settings
      const payload = {
        companyName: formData.companyName,
        ntnNumber: formData.ntnNumber,
        address: formData.address,
        province: formData.province,
        businessType: formData.businessType,
        sector: formData.sector,
        sellerCity: formData.sellerCity,
        sellerContact: formData.sellerContact,
        sellerEmail: formData.sellerEmail,
        posId: formData.posId,
        electronicSoftwareRegNo: formData.electronicSoftwareRegNo,
        fbrIntegratorLicenseNo: formData.fbrIntegratorLicenseNo,
        logoUrl: formData.logoUrl,
        invoiceTemplate: formData.invoiceTemplate,
        invoicePrefix: formData.invoicePrefix,
        invoiceFooter: formData.invoiceFooter,
        taxIdLabel: formData.taxIdLabel,
        defaultTerms: formData.defaultTerms,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        defaultCurrency: formData.defaultCurrency,
        pdfTheme: formData.pdfTheme,
        defaultScenario: formData.defaultScenario
      }
      
      console.log('💾 Saving business settings:', payload)
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Failed to update business settings: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setNeedsInitialSetup(false)
        await loadBusiness()
        showSuccessToast('Settings Saved', 'Your business settings have been updated successfully!')
        console.log('✅ Business settings saved successfully')
      } else {
        throw new Error(result.error?.message || 'Failed to update business settings')
      }
    } catch (error) {
      console.error('Save error:', error)
      handleApiError(error instanceof Error ? error : new Error('Failed to update business settings'), 'Saving business settings')
      showErrorToast('Save Failed', 'Failed to update business settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return <SharedLoading message="Loading business settings..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 max-w-4xl mx-auto">
        {/* Navigation */}
        <SharedNavigation
          backUrl="/settings"
          backLabel="Settings"
          showHome={true}
          currentPage="Business Settings"
        />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Business Settings</h1>
          <p className="text-gray-600 mt-1">Manage your business information and FBR details</p>
        </div>

        {/* Initial Setup Warning */}
        {needsInitialSetup && (
          <Card className="border-blue-200 bg-blue-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-blue-800">
                    Initial Business Setup Required
                  </span>
                  <p className="text-sm text-blue-600 mt-1">
                    Please complete your business profile to start creating invoices and ensure FBR compliance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Company Information</span>
              </CardTitle>
              <CardDescription>
                Basic business details for invoicing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ntnNumber">NTN Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="ntnNumber"
                    value={formData.ntnNumber}
                    onChange={(e) => setFormData({ ...formData, ntnNumber: e.target.value })}
                    placeholder="7-digit NTN"
                  />
                </div>

                <div>
                  <Label htmlFor="province">Province <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) => setFormData({ ...formData, province: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Business Address <span className="text-red-500">*</span></Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Complete business address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sellerCity">City</Label>
                  <Input
                    id="sellerCity"
                    value={formData.sellerCity || ''}
                    onChange={(e) => setFormData({ ...formData, sellerCity: e.target.value })}
                    placeholder="City name"
                  />
                </div>

                <div>
                  <Label htmlFor="sellerContact">Contact Number</Label>
                  <Input
                    id="sellerContact"
                    value={formData.sellerContact || ''}
                    onChange={(e) => setFormData({ ...formData, sellerContact: e.target.value })}
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sellerEmail">Business Email</Label>
                <Input
                  id="sellerEmail"
                  type="email"
                  value={formData.sellerEmail || ''}
                  onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                  placeholder="business@example.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Business Classification</span>
              </CardTitle>
              <CardDescription>
                Define your business type and sector for FBR scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessType">Business Type <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => {
                      setFormData({ ...formData, businessType: value })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sector">Industry Sector <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) => {
                      setFormData({ ...formData, sector: value })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="defaultScenario">Default FBR Scenario</Label>
                <Select
                  value={formData.defaultScenario || ''}
                  onValueChange={(value) => {
                    setFormData({ ...formData, defaultScenario: value })
                    // Update available scenarios when business type or sector changes
                    const scenarios = getApplicableScenarios(formData.businessType, formData.sector)
                    if (scenarios.scenarios.length > 0 && !value) {
                      setFormData(prev => ({
                        ...prev,
                        defaultScenario: scenarios.defaultScenario
                      }))
                    }
                  }}
                  disabled={!formData.businessType || !formData.sector}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type and sector first" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      if (!formData.businessType || !formData.sector) return []
                      const scenarios = getApplicableScenarios(formData.businessType, formData.sector)
                      return scenarios.scenarios.map((scenario: FBRScenario) => (
                        <SelectItem key={scenario.code} value={scenario.code}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium text-sm">{scenario.code}</span>
                            <span className="text-xs text-gray-600 mt-1 leading-tight">{scenario.description}</span>
                          </div>
                        </SelectItem>
                      ))
                    })()}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  This scenario will be used for FBR sandbox testing. Production submissions use actual invoice data.
                </p>
              </div>

              {/* Scenario Information */}
              {formData.defaultScenario && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Scenario Information</h4>
                  <div className="text-sm text-blue-800">
                    <p><strong>Scenario:</strong> {formData.defaultScenario}</p>
                    <p><strong>Description:</strong> {formData.defaultScenario ? getScenarioDescription(formData.defaultScenario) : ''}</p>
                    <p className="text-xs text-blue-600 mt-2">
                      This scenario is applicable for your business type and sector according to FBR guidelines.
                    </p>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>FBR Registration Details</span>
              </CardTitle>
              <CardDescription>
                Optional FBR-specific registration numbers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="posId">POS ID</Label>
                <Input
                  id="posId"
                  value={formData.posId || ''}
                  onChange={(e) => setFormData({ ...formData, posId: e.target.value })}
                  placeholder="Point of Sale ID (if applicable)"
                />
              </div>

              <div>
                <Label htmlFor="electronicSoftwareRegNo">Electronic Software Registration Number</Label>
                <Input
                  id="electronicSoftwareRegNo"
                  value={formData.electronicSoftwareRegNo || ''}
                  onChange={(e) => setFormData({ ...formData, electronicSoftwareRegNo: e.target.value })}
                  placeholder="Software registration number from FBR"
                />
              </div>

              <div>
                <Label htmlFor="fbrIntegratorLicenseNo">FBR Integrator License Number</Label>
                <Input
                  id="fbrIntegratorLicenseNo"
                  value={formData.fbrIntegratorLicenseNo || ''}
                  onChange={(e) => setFormData({ ...formData, fbrIntegratorLicenseNo: e.target.value })}
                  placeholder="Licensed integrator number (if applicable)"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={saveBusiness}
              disabled={saving}
              className="flex items-center space-x-2"
              size="lg"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}