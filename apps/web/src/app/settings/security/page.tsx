'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Home,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Key
} from "lucide-react"

export default function SecuritySettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changing, setChanging] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/login')
    return null
  }

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number'
    }
    return null
  }

  const handleChangePassword = async () => {
    setMessage(null)

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({
        type: 'error',
        message: 'All fields are required'
      })
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        message: 'New passwords do not match'
      })
      return
    }

    const passwordError = validatePassword(formData.newPassword)
    if (passwordError) {
      setMessage({
        type: 'error',
        message: passwordError
      })
      return
    }

    setChanging(true)
    try {
      const response = await fetch('/api/settings/security/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      const result = await response.json()

      if (result.success) {
        setMessage({
          type: 'success',
          message: 'Password changed successfully!'
        })
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setMessage({
          type: 'error',
          message: result.error || 'Failed to change password'
        })
      }
    } catch (error) {
      console.error('Password change error:', error)
      setMessage({
        type: 'error',
        message: 'An error occurred. Please try again.'
      })
    } finally {
      setChanging(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 max-w-3xl mx-auto">
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
          <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
          <p className="text-gray-600 mt-1">Manage your password and account security</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertTitle className={message.type === 'success' ? 'text-green-900' : 'text-red-900'}>
              {message.type === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Change Password Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Change Password</span>
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Avoid using common words or personal information</li>
                </ul>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleChangePassword}
                  disabled={changing}
                  className="flex items-center space-x-2"
                >
                  {changing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Changing Password...</span>
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4" />
                      <span>Change Password</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Account Active</p>
                  <p className="text-sm text-gray-600">Your account is active and secure</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Email Verified</p>
                  <p className="text-sm text-gray-600">{session.user?.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Not enabled (Coming Soon)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle>Security Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Use a unique password that you don't use for other accounts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Change your password regularly (every 3-6 months)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Never share your password with anyone</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Log out when using shared or public computers</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
