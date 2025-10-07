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
  validateScenarioApplicability
} from '@/lib/fbr-scenarios'

export default function BusinessSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
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
      const data = await response.json()
      
      if (data.success) {
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
      }
    } catch (error) {
      console.error('Failed to load business:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Maximum size is 5MB.')
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

      const result = await response.json()

      if (result.success) {
        await loadBusiness()
        alert('Logo uploaded successfully!')
      } else {
        throw new Error(result.error || 'Failed to upload logo')
      }
    } catch (error) {
      console.error('Logo upload error:', error)
      alert('Failed to upload logo. Please try again.')
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

      const result = await response.json()

      if (result.success) {
        await loadBusiness()
        alert('Logo removed successfully!')
      } else {
        throw new Error(result.error || 'Failed to remove logo')
      }
    } catch (error) {
      console.error('Logo remove error:', error)
      alert('Failed to remove logo. Please try again.')
    }
  }

  const saveBusiness = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      
      if (result.success) {
        await loadBusiness()
        alert('Business settings updated successfully!')
      } else {
        throw new Error(result.error || 'Failed to update business settings')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to update business settings. Please try again.')
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
                      // Update available scenarios when business type changes
                      const scenarios = getApplicableScenarios(value, formData.sector)
                      if (scenarios.scenarios.length > 0) {
                        setFormData(prev => ({
                          ...prev,
                          defaultScenario: scenarios.defaultScenario
                        }))
                      }
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
                      // Update available scenarios when sector changes
                      const scenarios = getApplicableScenarios(formData.businessType, value)
                      if (scenarios.scenarios.length > 0) {
                        setFormData(prev => ({
                          ...prev,
                          defaultScenario: scenarios.defaultScenario
                        }))
                      }
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
                  disabled={!formData.businessType || !formData.sector}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type and sector first">
                      {formData.defaultScenario && (
                        <span className="font-medium">{formData.defaultScenario}</span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      if (!formData.businessType || !formData.sector) return []
                      const scenarios = getApplicableScenarios(formData.businessType, formData.sector)
                      return scenarios.scenarios.map((scenario) => (
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
                    <p><strong>Description:</strong> {getScenarioDescription(formData.defaultScenario)}</p>
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
                      src={formData.logoUrl}
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
