'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'

// Prevent static generation for this page since it uses useSession
export const dynamic = 'force-dynamic'
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
  Eye
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
// import { useError } from '@/contexts/error-context'

export default function BusinessSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Use error hooks directly
  // const {
  //   showErrorToast,
  //   showSuccessToast,
  //   handleNetworkError,
  //   handleValidationError,
  //   handleApiError,
  //   handleGenericError
  // } = useError()
  
  // Fallback error handlers
  const showErrorToast = (title: string, message: string) => {
    console.error(`${title}: ${message}`);
    alert(`${title}: ${message}`);
  };
  
  const showSuccessToast = (title: string, message: string) => {
    console.log(`${title}: ${message}`);
    // Could use a toast library here
  };
  
  const handleNetworkError = (error: Error, context: string) => {
    console.error(`Network error in ${context}:`, error);
    showErrorToast('Network Error', `${context}. Please check your connection.`);
  };
  
  const handleValidationError = (message: string, field?: string) => {
    console.error(`Validation error: ${message}`, field);
    showErrorToast('Validation Error', message);
  };
  
  const handleApiError = (error: Error, context: string) => {
    console.error(`API error in ${context}:`, error);
    showErrorToast('API Error', `${context}. Please try again.`);
  };
  
  const handleGenericError = (error: Error, context: string) => {
    console.error(`Error in ${context}:`, error);
    showErrorToast('Error', `${context}. Please try again.`);
  };
  
  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [availableScenarios, setAvailableScenarios] = useState<FBRScenario[]>([])
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
  // Update available scenarios when business type or sector changes
  useEffect(() => {
    if (formData.businessType && formData.sector) {
      fetchScenarios(formData.businessType, formData.sector)
    } else {
      setAvailableScenarios([])
    }
  }, [formData.businessType, formData.sector])

  // Function to fetch scenarios from API
  const fetchScenarios = async (businessType: string, sector: string) => {
    try {
      const response = await fetch(
        `/api/fbr/scenarios?businessType=${encodeURIComponent(businessType)}&sector=${encodeURIComponent(sector)}`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAvailableScenarios(data.data)
          
          // Set default scenario if none is selected
          if (!formData.defaultScenario && data.data.length > 0) {
            // Use SN001 as default if available, otherwise use the first scenario
            const defaultScenario = data.data.find((s: FBRScenario) => s.code === 'SN001') || data.data[0]
            setFormData(prev => ({
              ...prev,
              defaultScenario: defaultScenario.code
            }))
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch scenarios:', error)
      // Fallback to in-memory scenarios
      const scenarios = getApplicableScenarios(businessType, sector)
      setAvailableScenarios(scenarios.scenarios)
      
      // Set default scenario if none is selected
      if (!formData.defaultScenario && scenarios.scenarios.length > 0) {
        setFormData(prev => ({
          ...prev,
          defaultScenario: scenarios.defaultScenario
        }))
      }
    }
  }

  const loadBusiness = async () => {
    try {
      const response = await fetch('/api/settings/business')
      if (!response.ok) {
        throw new Error(`Failed to load business settings: ${response.status}`)
      }
      
      const responseJson = await response.json()
      
      if (responseJson.success) {
        setBusiness(responseJson.business)
        setFormData({
          companyName: responseJson.business.companyName || '',
          ntnNumber: responseJson.business.ntnNumber || '',
          address: responseJson.business.address || '',
          province: responseJson.business.province || 'Punjab',
          businessType: responseJson.business.businessType || 'Service Provider',
          sector: responseJson.business.sector || 'All Other Sectors',
          sellerCity: responseJson.business.sellerCity || '',
          sellerContact: responseJson.business.sellerContact || '',
          sellerEmail: responseJson.business.sellerEmail || '',
          posId: responseJson.business.posId || '',
          electronicSoftwareRegNo: responseJson.business.electronicSoftwareRegNo || '',
          fbrIntegratorLicenseNo: responseJson.business.fbrIntegratorLicenseNo || '',
          logoUrl: responseJson.business.logoUrl || null,
          invoiceTemplate: responseJson.business.invoiceTemplate || 'default',
          invoicePrefix: responseJson.business.invoicePrefix || 'INV-',
          invoiceFooter: responseJson.business.footerText || null,
          taxIdLabel: responseJson.business.taxIdLabel || 'NTN',
          defaultTerms: responseJson.business.defaultPaymentTerms || 'Payment due within 30 days',
          primaryColor: responseJson.business.primaryColor || '#3B82F6',
          secondaryColor: responseJson.business.secondaryColor || '#10B981',
          defaultCurrency: responseJson.business.defaultCurrency || 'PKR',
          pdfTheme: responseJson.business.invoiceTemplate || 'default',
          defaultScenario: responseJson.business.defaultScenario || null
        })
      } else {
        throw new Error(responseJson.error?.message || 'Failed to load business settings')
      }
    } catch (error) {
      console.error('Failed to load business:', error)
      handleApiError(error instanceof Error ? error : new Error('Failed to load business settings'), 'Loading business settings')
      showErrorToast('Failed to Load', 'Could not load your business settings. Please try again.')
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
      
      const response = await fetch('/api/settings/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Failed to update business settings: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
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
                  onValueChange={(value) => setFormData({ ...formData, defaultScenario: value })}
                  disabled={!formData.businessType || !formData.sector || availableScenarios.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type and sector first" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableScenarios.map((scenario: FBRScenario) => (
                      <SelectItem key={scenario.code} value={scenario.code}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-sm">{scenario.code}</span>
                          <span className="text-xs text-gray-600 mt-1 leading-tight">{scenario.description}</span>
                        </div>
                      </SelectItem>
                    ))}
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

          {/* Logo Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Company Logo</span>
              </CardTitle>
              <CardDescription>
                Upload your company logo to appear on invoices (max 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.logoUrl ? (
                <div className="flex items-center space-x-4">
                  <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={formData.logoUrl || ''}
                      alt="Company Logo"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Current logo</p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveLogo}
                        className="flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Remove</span>
                      </Button>
                      <label htmlFor="logo-upload">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={uploadingLogo}
                          className="flex items-center space-x-2"
                          asChild
                        >
                          <span>
                            <Upload className="h-4 w-4" />
                            <span>Change Logo</span>
                          </span>
                        </Button>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <label htmlFor="logo-upload">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                    {uploadingLogo ? (
                      <div className="flex flex-col items-center space-y-2">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        <p className="text-sm text-gray-600">Uploading...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload logo</p>
                        <p className="text-xs text-gray-500">PNG, JPG, WebP (max 5MB)</p>
                      </div>
                    )}
                  </div>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Invoice Customization Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileEdit className="h-5 w-5" />
                <span>Invoice Customization</span>
              </CardTitle>
              <CardDescription>
                Customize invoice format, numbering, and default terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pdfTheme">PDF Theme</Label>
                  <Select
                    value={formData.pdfTheme || 'default'}
                    onValueChange={(value) => setFormData({ ...formData, pdfTheme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Choose the visual style for your PDF invoices</p>
                </div>

                <div>
                  <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={formData.invoicePrefix || ''}
                    onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                    placeholder="INV-"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxIdLabel">Tax ID Label</Label>
                  <Input
                    id="taxIdLabel"
                    value={formData.taxIdLabel || ''}
                    onChange={(e) => setFormData({ ...formData, taxIdLabel: e.target.value })}
                    placeholder="NTN, Tax ID, GST No, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select
                    value={formData.defaultCurrency}
                    onValueChange={(value) => setFormData({ ...formData, defaultCurrency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PKR">PKR (Pakistani Rupee)</SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="defaultTerms">Default Payment Terms</Label>
                <Textarea
                  id="defaultTerms"
                  value={formData.defaultTerms || ''}
                  onChange={(e) => setFormData({ ...formData, defaultTerms: e.target.value })}
                  placeholder="Payment due within 30 days"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="invoiceFooter">Invoice Footer</Label>
                <Textarea
                  id="invoiceFooter"
                  value={formData.invoiceFooter || ''}
                  onChange={(e) => setFormData({ ...formData, invoiceFooter: e.target.value })}
                  placeholder="Thank you for your business! For inquiries, contact us at..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme Customization Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Theme & Branding</span>
              </CardTitle>
              <CardDescription>
                Customize colors to match your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor || '#3B82F6'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.primaryColor || '#3B82F6'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Used for headers and buttons</p>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor || '#10B981'}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={formData.secondaryColor || '#10B981'}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      placeholder="#10B981"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Used for accents and highlights</p>
                </div>
              </div>

              {/* Color Preview */}
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </p>
                <div className="space-y-2">
                  <div
                    className="p-3 rounded text-white font-medium"
                    style={{ backgroundColor: formData.primaryColor || '#3B82F6' }}
                  >
                    Primary Color - Invoice Header
                  </div>
                  <div
                    className="p-3 rounded text-white font-medium"
                    style={{ backgroundColor: formData.secondaryColor || '#10B981' }}
                  >
                    Secondary Color - Accent Elements
                  </div>
                </div>
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
