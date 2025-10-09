'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  Mail,
  Phone,
  Shield,
  ArrowLeft,
  Home,
  Save,
  Loader2,
  Bell,
  CheckCircle2
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { ProfileSkeleton } from "@/components/ui/profile-skeleton"

interface UserProfile {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  country: string
  subscriptionPlan: string
  createdAt: string
  emailNotifications: boolean
  invoiceNotifications: boolean
  fbrSubmissionNotifications: boolean
  marketingEmails: boolean
}

export default function UserProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: 'Pakistan',
    emailNotifications: true,
    invoiceNotifications: true,
    fbrSubmissionNotifications: true,
    marketingEmails: false
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      redirect('/auth/login')
      return
    }

    loadProfile()
    
    // Add timeout to prevent indefinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false)
        setError('Loading timed out. Please refresh the page.')
      }
    }, 10000) // 10 seconds timeout

    return () => clearTimeout(timeoutId)
  }, [session, status])

  const loadProfile = async () => {
    try {
      setError(null)
      const response = await fetch('/api/settings/profile')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setProfile(data.profile)
        setFormData({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          phoneNumber: data.profile.phoneNumber || '',
          country: data.profile.country || 'Pakistan',
          emailNotifications: data.profile.emailNotifications ?? true,
          invoiceNotifications: data.profile.invoiceNotifications ?? true,
          fbrSubmissionNotifications: data.profile.fbrSubmissionNotifications ?? true,
          marketingEmails: data.profile.marketingEmails ?? false
        })
      } else {
        throw new Error(data.error || 'Failed to load profile')
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      setError(error instanceof Error ? error.message : 'Failed to load profile')
    } finally {
      // Add a small delay to ensure the skeleton loader is visible
      setTimeout(() => {
        setLoading(false)
      }, 300)
    }
  }

  const saveProfile = async () => {
    setSaving(true)
    setError(null)
    try {
      const response = await fetch('/api/settings/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        await loadProfile()
        alert('Profile updated successfully!')
      } else {
        throw new Error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Save error:', error)
      setError(error instanceof Error ? error.message : 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Show skeleton loader for initial load, but show centered loader for session loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="relative">
            <Loader2 className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <div className="absolute inset-0 h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4 animate-ping opacity-20"></div>
          </div>
          <p className="text-gray-600 mb-2">Checking authentication...</p>
          <p className="text-sm text-gray-500">This should only take a moment</p>
        </div>
      </div>
    )
  }

  // Show skeleton loader for profile data loading
  if (loading) {
    return <ProfileSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError(null)}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="p-6 max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Pakistan"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={saveProfile}
                    disabled={saving}
                    className="flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications" className="text-base cursor-pointer">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive email updates about your account
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="invoiceNotifications" className="text-base cursor-pointer">
                      Invoice Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Get notified when invoices are created or updated
                    </p>
                  </div>
                  <Switch
                    id="invoiceNotifications"
                    checked={formData.invoiceNotifications}
                    onCheckedChange={(checked) => setFormData({ ...formData, invoiceNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="fbrSubmissionNotifications" className="text-base cursor-pointer">
                      FBR Submission Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive alerts about FBR submissions and validations
                    </p>
                  </div>
                  <Switch
                    id="fbrSubmissionNotifications"
                    checked={formData.fbrSubmissionNotifications}
                    onCheckedChange={(checked) => setFormData({ ...formData, fbrSubmissionNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingEmails" className="text-base cursor-pointer">
                      Marketing Emails
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive updates about new features and promotions
                    </p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={formData.marketingEmails}
                    onCheckedChange={(checked) => setFormData({ ...formData, marketingEmails: checked })}
                  />
                </div>

                <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Notification preferences are saved automatically</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Password Management</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    For security reasons, password changes require email verification.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/settings/security' as any)}
                  >
                    Change Password
                  </Button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-green-800 mb-3">
                    Add an extra layer of security to your account.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled
                  >
                    Enable 2FA (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Subscription Plan</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {profile?.subscriptionPlan || 'Free'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Account Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push('/settings/business')}
                >
                  Business Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push('/settings/fbr')}
                >
                  FBR Integration
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push('/settings/security' as any)}
                >
                  Security Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
