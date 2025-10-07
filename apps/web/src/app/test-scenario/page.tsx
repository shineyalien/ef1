'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function TestScenarioPage() {
  const [loading, setLoading] = useState(true)
  const [businessData, setBusinessData] = useState<any>(null)
  const [scenarios, setScenarios] = useState<any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load business settings
      const businessRes = await fetch('/api/settings/business')
      if (businessRes.ok) {
        const businessData = await businessRes.json()
        setBusinessData(businessData.business)
        console.log('Business data:', businessData.business)
      } else {
        throw new Error('Failed to load business settings')
      }

      // Load scenarios
      const scenariosRes = await fetch('/api/fbr/scenarios?includeGeneral=true')
      if (scenariosRes.ok) {
        const scenariosData = await scenariosRes.json()
        setScenarios(scenariosData.data || [])
        console.log('Scenarios data:', scenariosData.data)
      } else {
        throw new Error('Failed to load scenarios')
      }
    } catch (error: any) {
      console.error('Error loading data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading scenario data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={loadData} className="mt-4">Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Scenario ID Test Page</h1>
        
        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Business Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {businessData ? (
              <div className="space-y-2">
                <p><strong>Company Name:</strong> {businessData.companyName}</p>
                <p><strong>Business Type:</strong> {businessData.businessType}</p>
                <p><strong>Sector:</strong> {businessData.sector}</p>
                <p><strong>Default Scenario:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    businessData.defaultScenario 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {businessData.defaultScenario || 'NOT SET'}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No business data found</p>
            )}
          </CardContent>
        </Card>

        {/* Available Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Available Scenarios ({scenarios.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {scenarios.map((scenario) => (
                <div 
                  key={scenario.code} 
                  className={`p-3 border rounded ${
                    businessData?.defaultScenario === scenario.code
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{scenario.code}</span>
                      <span className="ml-2 text-sm text-gray-600">{scenario.description}</span>
                      {scenario.businessType && (
                        <span className="ml-2 text-xs text-blue-600">
                          ({scenario.businessType} - {scenario.sector})
                        </span>
                      )}
                    </div>
                    {businessData?.defaultScenario === scenario.code && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium mr-2">Business has default scenario:</span>
                {businessData?.defaultScenario ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Default scenario is valid:</span>
                {businessData?.defaultScenario && scenarios.some(s => s.code === businessData.defaultScenario) ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Scenarios loaded:</span>
                <span className={scenarios.length > 0 ? 'text-green-600' : 'text-red-600'}>
                  {scenarios.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={loadData}>Refresh Data</Button>
        </div>
      </div>
    </div>
  )
}