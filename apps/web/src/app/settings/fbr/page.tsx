'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Settings,
  Globe,
  Key,
  TestTube,
  Zap,
  ArrowLeft,
  Home,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  TrendingUp,
  Database,
  Clock
} from "lucide-react"

interface FBRSettings {
  environment: 'LOCAL' | 'SANDBOX' | 'PRODUCTION'
  fbrSetupComplete: boolean
  sandboxValidated: boolean
  hasTokens: {
    sandbox: boolean
    production: boolean
  }
}

interface FBRStats {
  totalInvoices: number
  draftInvoices: number
  submittedInvoices: number
  sandboxInvoices: number
  productionInvoices: number
  validatedInvoices: number
  failedInvoices: number
  successRate: string
  lastSubmission: {
    timestamp: string
    mode: string
    status: string
  } | null
}

export default function FBRSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<FBRSettings | null>(null)
  const [stats, setStats] = useState<FBRStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingConnection, setTestingConnection] = useState<'sandbox' | 'production' | null>(null)
  const [sandboxToken, setSandboxToken] = useState('')
  const [productionToken, setProductionToken] = useState('')
  const [showSandboxToken, setShowSandboxToken] = useState(false)
  const [showProductionToken, setShowProductionToken] = useState(false)
  const [validationMessage, setValidationMessage] = useState<{type: 'success' | 'error', message: string} | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      redirect('/auth/login')
      return
    }

    loadSettings()
    loadStats()
  }, [session, status])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings/fbr')
      const data = await response.json()
      
      if (data.success) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/settings/fbr/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const saveSettings = async (updateData: Partial<FBRSettings>) => {
    setSaving(true)
    setValidationMessage(null)
    try {
      const response = await fetch('/api/settings/fbr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...updateData,
          ...(sandboxToken && { sandboxToken }),
          ...(productionToken && { productionToken })
        })
      })

      const result = await response.json()
      
      if (result.success) {
        await loadSettings()
        setValidationMessage({ type: 'success', message: 'Settings saved successfully!' })
        setSandboxToken('')
        setProductionToken('')
      } else {
        throw new Error(result.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Save error:', error)
      setValidationMessage({ type: 'error', message: 'Failed to save settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleEnvironmentChange = (environment: 'LOCAL' | 'SANDBOX' | 'PRODUCTION') => {
    if (environment === 'PRODUCTION' && !settings?.sandboxValidated) {
      setValidationMessage({ 
        type: 'error', 
        message: 'You must complete sandbox validation before switching to production' 
      })
      return
    }
    
    saveSettings({ environment })
  }

  const testConnection = async (environment: 'sandbox' | 'production') => {
    const token = environment === 'sandbox' ? sandboxToken : productionToken
    
    if (!token) {
      setValidationMessage({ 
        type: 'error', 
        message: `Please enter a ${environment} token first` 
      })
      return
    }

    setTestingConnection(environment)
    setValidationMessage(null)

    try {
      const response = await fetch('/api/settings/fbr/validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, environment })
      })

      const result = await response.json()

      if (result.success) {
        setValidationMessage({ 
          type: 'success', 
          message: `✓ Successfully connected to FBR ${environment} environment` 
        })
        
        // Auto-save the token after successful validation
        await saveSettings({
          ...(environment === 'sandbox' && { sandboxValidated: true })
        })
      } else {
        setValidationMessage({ 
          type: 'error', 
          message: result.message || `Failed to connect to FBR ${environment}` 
        })
      }
    } catch (error) {
      console.error('Connection test error:', error)
      setValidationMessage({ 
        type: 'error', 
        message: 'Connection test failed. Please check your token and try again.' 
      })
    } finally {
      setTestingConnection(null)
    }
  }

  const handleTokenSubmit = (tokenType: 'sandbox' | 'production') => {
    const token = tokenType === 'sandbox' ? sandboxToken : productionToken
    if (!token.trim()) {
      setValidationMessage({ type: 'error', message: 'Please enter a valid token' })
      return
    }

    const updateData = {
      [tokenType === 'sandbox' ? 'sandboxToken' : 'productionToken']: token,
      fbrSetupComplete: true
    }

    saveSettings(updateData)
  }

  const handleRefreshStats = async () => {
    await loadStats()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading FBR settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="text-2xl font-bold text-gray-900">FBR Integration Settings</h1>
          <p className="text-gray-600 mt-1">Configure your Federal Board of Revenue (FBR) integration</p>
        </div>

        {/* Validation Messages */}
        {validationMessage && (
          <Alert className={`mb-6 ${validationMessage.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <AlertDescription className={validationMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {validationMessage.message}
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Integration Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  {settings?.environment === 'LOCAL' ? (
                    <Globe className="h-8 w-8 text-gray-500" />
                  ) : settings?.environment === 'SANDBOX' ? (
                    <TestTube className="h-8 w-8 text-yellow-500" />
                  ) : (
                    <Zap className="h-8 w-8 text-green-500" />
                  )}
                </div>
                <div className="font-medium text-gray-900">{settings?.environment}</div>
                <div className="text-sm text-gray-600">Current Environment</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  {settings?.fbrSetupComplete ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  )}
                </div>
                <div className="font-medium text-gray-900">
                  {settings?.fbrSetupComplete ? 'Complete' : 'Pending'}
                </div>
                <div className="text-sm text-gray-600">Setup Status</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-2">
                  {settings?.sandboxValidated ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="font-medium text-gray-900">
                  {settings?.sandboxValidated ? 'Validated' : 'Not Validated'}
                </div>
                <div className="text-sm text-gray-600">Sandbox Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Environment Configuration</CardTitle>
            <CardDescription>
              Choose your FBR integration environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleEnvironmentChange('LOCAL')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  settings?.environment === 'LOCAL'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled={saving}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Globe className="h-6 w-6 text-gray-600" />
                  <span className="font-medium">Local Mode</span>
                </div>
                <p className="text-sm text-gray-600">
                  Test invoicing without FBR integration. Perfect for getting started.
                </p>
              </button>

              <button
                onClick={() => handleEnvironmentChange('SANDBOX')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  settings?.environment === 'SANDBOX'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled={saving || !settings?.hasTokens.sandbox}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <TestTube className="h-6 w-6 text-yellow-600" />
                  <span className="font-medium">Sandbox Mode</span>
                </div>
                <p className="text-sm text-gray-600">
                  Test with FBR's sandbox environment. Required before production.
                </p>
                {!settings?.hasTokens.sandbox && (
                  <p className="text-xs text-red-600 mt-2">Requires sandbox token</p>
                )}
              </button>

              <button
                onClick={() => handleEnvironmentChange('PRODUCTION')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  settings?.environment === 'PRODUCTION'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled={saving || !settings?.hasTokens.production || !settings?.sandboxValidated}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Zap className="h-6 w-6 text-green-600" />
                  <span className="font-medium">Production Mode</span>
                </div>
                <p className="text-sm text-gray-600">
                  Live FBR integration for real business operations.
                </p>
                {(!settings?.hasTokens.production || !settings?.sandboxValidated) && (
                  <p className="text-xs text-red-600 mt-2">
                    Requires production token and sandbox validation
                  </p>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* FBR Submission Statistics */}
        {stats && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>FBR Submission Statistics</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefreshStats}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-blue-900">{stats.totalInvoices}</div>
                  <div className="text-sm text-blue-700">Total Invoices</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-green-900">{stats.submittedInvoices}</div>
                  <div className="text-sm text-green-700">FBR Submitted</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <TestTube className="h-6 w-6 text-yellow-600 mb-2" />
                  <div className="text-2xl font-bold text-yellow-900">{stats.sandboxInvoices}</div>
                  <div className="text-sm text-yellow-700">Sandbox</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-purple-900">{stats.productionInvoices}</div>
                  <div className="text-sm text-purple-700">Production</div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Success Rate</div>
                  <div className="text-lg font-semibold text-gray-900">{stats.successRate}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Failed Submissions</div>
                  <div className="text-lg font-semibold text-red-600">{stats.failedInvoices}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Last Submission</div>
                  <div className="text-sm font-medium text-gray-900 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {stats.lastSubmission 
                      ? new Date(stats.lastSubmission.timestamp).toLocaleString()
                      : 'Never'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Sandbox Token</span>
              </CardTitle>
              <CardDescription>
                Configure your PRAL sandbox token for testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sandboxToken">Sandbox Bearer Token</Label>
                  <div className="relative mt-1">
                    <Input
                      id="sandboxToken"
                      type={showSandboxToken ? "text" : "password"}
                      value={sandboxToken}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSandboxToken(e.target.value)}
                      placeholder={settings?.hasTokens.sandbox ? "••••••••••••" : "Enter your PRAL sandbox token"}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSandboxToken(!showSandboxToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSandboxToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      {settings?.hasTokens.sandbox ? (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Token configured
                        </span>
                      ) : (
                        <span className="text-gray-600">No token configured</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => testConnection('sandbox')}
                        disabled={testingConnection !== null || !sandboxToken.trim()}
                        size="sm"
                        variant="outline"
                      >
                        {testingConnection === 'sandbox' ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <TestTube className="h-4 w-4 mr-2" />
                            Test
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleTokenSubmit('sandbox')}
                        disabled={saving || !sandboxToken.trim()}
                        size="sm"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Token'
                        )}
                      </Button>
                    </div>
                  </div>
                  <a
                    href="https://dicrm.pral.com.pk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center"
                  >
                    Get token from PRAL CRM Portal →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Production Token</span>
              </CardTitle>
              <CardDescription>
                Configure your PRAL production token for live operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productionToken">Production Bearer Token</Label>
                  <div className="relative mt-1">
                    <Input
                      id="productionToken"
                      type={showProductionToken ? "text" : "password"}
                      value={productionToken}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductionToken(e.target.value)}
                      placeholder={settings?.hasTokens.production ? "••••••••••••" : "Enter your PRAL production token"}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowProductionToken(!showProductionToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showProductionToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      {settings?.hasTokens.production ? (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Token configured
                        </span>
                      ) : (
                        <span className="text-gray-600">No token configured</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => testConnection('production')}
                        disabled={testingConnection !== null || !productionToken.trim()}
                        size="sm"
                        variant="outline"
                      >
                        {testingConnection === 'production' ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Test
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleTokenSubmit('production')}
                        disabled={saving || !productionToken.trim() || !settings?.sandboxValidated}
                        size="sm"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Token'
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {!settings?.sandboxValidated && (
                    <p className="text-xs text-yellow-600">
                      Complete sandbox validation first
                    </p>
                  )}
                  
                  <a
                    href="https://iris.fbr.gov.pk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center"
                  >
                    Get token from FBR IRIS Portal →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-sm">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Authentication Type: Bearer Token
                </h4>
                <p className="text-blue-800">
                  Easy Filer uses <strong>Bearer Token</strong> authentication to connect with FBR PRAL APIs. 
                  You will receive a 5-year validity token from PRAL that acts as your authentication credential.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">1. Get PRAL Bearer Tokens</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                  <li>Visit the PRAL Digital Invoicing portal at <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">https://gw.fbr.gov.pk</code></li>
                  <li>Register your business and request sandbox access</li>
                  <li>You will receive a <strong>Bearer Token</strong> (5-year validity)</li>
                  <li>Token format: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">2. Configure Sandbox Environment</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                  <li>Paste your sandbox Bearer Token in the field above</li>
                  <li>Click "Save Token" to store it securely (encrypted)</li>
                  <li>Switch to "Sandbox Mode" environment</li>
                  <li>Test invoice submission and validation</li>
                  <li>Complete all required business scenarios</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">3. Validate Integration</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                  <li>Submit test invoices covering all your business types</li>
                  <li>FBR will validate your submissions automatically</li>
                  <li>Ensure all scenario-based tests pass successfully</li>
                  <li>System will mark sandbox as "Validated" when complete</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">4. Move to Production</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                  <li>After sandbox validation, log into IRIS portal manually</li>
                  <li>Generate your production Bearer Token from IRIS interface</li>
                  <li>Copy and paste the production token here</li>
                  <li>Switch to "Production Mode" for live operations</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Important Security Notes
                </h4>
                <ul className="list-disc list-inside space-y-1 text-yellow-800 ml-2">
                  <li>Your Bearer Tokens are stored encrypted in the database</li>
                  <li>Never share your tokens with anyone</li>
                  <li>Tokens are valid for 5 years from issuance</li>
                  <li>Keep track of token expiry dates</li>
                  <li>Production tokens require completed sandbox validation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}