'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TestTube, Play, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface TestResult {
  success: boolean
  endpoint: string
  result?: any
  error?: string
  timestamp?: string
}

export default function FBRTestPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, TestResult>>({})

  // Test parameters
  const [taxRateParams, setTaxRateParams] = useState({
    date: '24-Feb-2024',
    transTypeId: '18',
    originationSupplier: '1'
  })

  const [sroScheduleParams, setSroScheduleParams] = useState({
    rateId: '413',
    date: '04-Feb-2024',
    originationSupplier: '1'
  })

  const [hsUomParams, setHsUomParams] = useState({
    hsCode: '5904.9000',
    annexureId: '3'
  })

  const [sroItemParams, setSroItemParams] = useState({
    date: '2025-03-25',
    sroId: '389'
  })

  const [statlParams, setStatlParams] = useState({
    regno: '0788762',
    date: '2025-05-18'
  })

  const [regTypeParam, setRegTypeParam] = useState('0788762')

  const testEndpoint = async (endpoint: string, params?: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/fbr/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint, params })
      })

      const data = await response.json()
      
      setResults(prev => ({
        ...prev,
        [endpoint]: data
      }))

    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          success: false,
          endpoint,
          error: error.message
        }
      }))
    } finally {
      setLoading(false)
    }
  }

  const testAllLookupEndpoints = async () => {
    const lookupEndpoints = [
      'provinces',
      'documentTypes',
      'hsCodes',
      'sroItems',
      'transactionTypes',
      'uom'
    ]

    for (const endpoint of lookupEndpoints) {
      await testEndpoint(endpoint)
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const ResultCard = ({ endpoint, result }: { endpoint: string, result?: TestResult }) => (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{endpoint}</h4>
        {result && (
          result.success ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )
        )}
      </div>
      {result ? (
        <div className="space-y-2">
          {result.success ? (
            <>
              <div className="text-sm text-gray-600">
                Records: {result.result?.data?.length || result.result?.length || 'N/A'}
              </div>
              {result.timestamp && (
                <div className="text-xs text-gray-500">
                  {new Date(result.timestamp).toLocaleString()}
                </div>
              )}
              <details className="text-xs">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-700">
                  View Response
                </summary>
                <pre className="mt-2 p-2 bg-white rounded border overflow-x-auto max-h-40">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </details>
            </>
          ) : (
            <div className="text-sm text-red-600">{result.error}</div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-400">Not tested yet</div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TestTube className="h-8 w-8" />
            FBR API Testing
          </h1>
          <p className="text-gray-600 mt-2">
            Test all FBR PRAL API endpoints to verify integration
          </p>
        </div>

        {/* Quick Test All */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Test All Lookup Endpoints</CardTitle>
            <CardDescription>
              Test all public lookup endpoints in one click
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={testAllLookupEndpoints}
              disabled={loading}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {loading ? 'Testing...' : 'Test All Lookup Endpoints'}
            </Button>
          </CardContent>
        </Card>

        {/* Lookup Endpoints */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Public Lookup Endpoints</CardTitle>
            <CardDescription>
              These endpoints do not require authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['provinces', 'documentTypes', 'hsCodes', 'sroItems', 'transactionTypes', 'uom'].map(endpoint => (
                <div key={endpoint}>
                  <Button
                    onClick={() => testEndpoint(endpoint)}
                    disabled={loading}
                    variant="outline"
                    className="w-full mb-2"
                  >
                    Test {endpoint}
                  </Button>
                  <ResultCard endpoint={endpoint} result={results[endpoint]} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Parameterized Endpoints */}
        <div className="space-y-6">
          {/* Tax Rates */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Rates</CardTitle>
              <CardDescription>Get tax rates by date, transaction type, and province</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label>Date (DD-MMM-YYYY)</Label>
                  <Input
                    value={taxRateParams.date}
                    onChange={(e) => setTaxRateParams({ ...taxRateParams, date: e.target.value })}
                    placeholder="24-Feb-2024"
                  />
                </div>
                <div>
                  <Label>Transaction Type ID</Label>
                  <Input
                    value={taxRateParams.transTypeId}
                    onChange={(e) => setTaxRateParams({ ...taxRateParams, transTypeId: e.target.value })}
                    placeholder="18"
                  />
                </div>
                <div>
                  <Label>Province ID</Label>
                  <Input
                    value={taxRateParams.originationSupplier}
                    onChange={(e) => setTaxRateParams({ ...taxRateParams, originationSupplier: e.target.value })}
                    placeholder="1"
                  />
                </div>
              </div>
              <Button
                onClick={() => testEndpoint('taxRates', {
                  date: taxRateParams.date,
                  transTypeId: parseInt(taxRateParams.transTypeId),
                  originationSupplier: parseInt(taxRateParams.originationSupplier)
                })}
                disabled={loading}
                className="w-full mb-4"
              >
                <Play className="h-4 w-4 mr-2" />
                Test Tax Rates
              </Button>
              <ResultCard endpoint="taxRates" result={results['taxRates']} />
            </CardContent>
          </Card>

          {/* SRO Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>SRO Schedule</CardTitle>
              <CardDescription>Get SRO schedule by rate ID, date, and province</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label>Rate ID</Label>
                  <Input
                    value={sroScheduleParams.rateId}
                    onChange={(e) => setSroScheduleParams({ ...sroScheduleParams, rateId: e.target.value })}
                    placeholder="413"
                  />
                </div>
                <div>
                  <Label>Date (DD-MMM-YYYY)</Label>
                  <Input
                    value={sroScheduleParams.date}
                    onChange={(e) => setSroScheduleParams({ ...sroScheduleParams, date: e.target.value })}
                    placeholder="04-Feb-2024"
                  />
                </div>
                <div>
                  <Label>Province ID</Label>
                  <Input
                    value={sroScheduleParams.originationSupplier}
                    onChange={(e) => setSroScheduleParams({ ...sroScheduleParams, originationSupplier: e.target.value })}
                    placeholder="1"
                  />
                </div>
              </div>
              <Button
                onClick={() => testEndpoint('sroSchedule', {
                  rateId: parseInt(sroScheduleParams.rateId),
                  date: sroScheduleParams.date,
                  originationSupplier: parseInt(sroScheduleParams.originationSupplier)
                })}
                disabled={loading}
                className="w-full mb-4"
              >
                <Play className="h-4 w-4 mr-2" />
                Test SRO Schedule
              </Button>
              <ResultCard endpoint="sroSchedule" result={results['sroSchedule']} />
            </CardContent>
          </Card>

          {/* HS Code with UOM */}
          <Card>
            <CardHeader>
              <CardTitle>HS Code with UOM</CardTitle>
              <CardDescription>Get unit of measurement for HS code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>HS Code</Label>
                  <Input
                    value={hsUomParams.hsCode}
                    onChange={(e) => setHsUomParams({ ...hsUomParams, hsCode: e.target.value })}
                    placeholder="5904.9000"
                  />
                </div>
                <div>
                  <Label>Annexure ID</Label>
                  <Input
                    value={hsUomParams.annexureId}
                    onChange={(e) => setHsUomParams({ ...hsUomParams, annexureId: e.target.value })}
                    placeholder="3"
                  />
                </div>
              </div>
              <Button
                onClick={() => testEndpoint('hsCodeWithUOM', {
                  hsCode: hsUomParams.hsCode,
                  annexureId: parseInt(hsUomParams.annexureId)
                })}
                disabled={loading}
                className="w-full mb-4"
              >
                <Play className="h-4 w-4 mr-2" />
                Test HS Code UOM
              </Button>
              <ResultCard endpoint="hsCodeWithUOM" result={results['hsCodeWithUOM']} />
            </CardContent>
          </Card>

          {/* SRO Item */}
          <Card>
            <CardHeader>
              <CardTitle>SRO Item</CardTitle>
              <CardDescription>Get SRO items by date and SRO ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Date (YYYY-MM-DD)</Label>
                  <Input
                    value={sroItemParams.date}
                    onChange={(e) => setSroItemParams({ ...sroItemParams, date: e.target.value })}
                    placeholder="2025-03-25"
                  />
                </div>
                <div>
                  <Label>SRO ID</Label>
                  <Input
                    value={sroItemParams.sroId}
                    onChange={(e) => setSroItemParams({ ...sroItemParams, sroId: e.target.value })}
                    placeholder="389"
                  />
                </div>
              </div>
              <Button
                onClick={() => testEndpoint('sroItem', {
                  date: sroItemParams.date,
                  sroId: parseInt(sroItemParams.sroId)
                })}
                disabled={loading}
                className="w-full mb-4"
              >
                <Play className="h-4 w-4 mr-2" />
                Test SRO Item
              </Button>
              <ResultCard endpoint="sroItem" result={results['sroItem']} />
            </CardContent>
          </Card>

          {/* STATL Check */}
          <Card>
            <CardHeader>
              <CardTitle>STATL Check</CardTitle>
              <CardDescription>Check Sales Tax Active Taxpayers List status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Registration Number</Label>
                  <Input
                    value={statlParams.regno}
                    onChange={(e) => setStatlParams({ ...statlParams, regno: e.target.value })}
                    placeholder="0788762"
                  />
                </div>
                <div>
                  <Label>Date (YYYY-MM-DD)</Label>
                  <Input
                    value={statlParams.date}
                    onChange={(e) => setStatlParams({ ...statlParams, date: e.target.value })}
                    placeholder="2025-05-18"
                  />
                </div>
              </div>
              <Button
                onClick={() => testEndpoint('statl', statlParams)}
                disabled={loading}
                className="w-full mb-4"
              >
                <Play className="h-4 w-4 mr-2" />
                Test STATL
              </Button>
              <ResultCard endpoint="statl" result={results['statl']} />
            </CardContent>
          </Card>

          {/* Registration Type */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Type</CardTitle>
              <CardDescription>Check if registration number is registered or unregistered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>Registration Number</Label>
                <Input
                  value={regTypeParam}
                  onChange={(e) => setRegTypeParam(e.target.value)}
                  placeholder="0788762"
                />
              </div>
              <Button
                onClick={() => testEndpoint('registrationType', { registrationNo: regTypeParam })}
                disabled={loading}
                className="w-full mb-4"
              >
                <Play className="h-4 w-4 mr-2" />
                Test Registration Type
              </Button>
              <ResultCard endpoint="registrationType" result={results['registrationType']} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
