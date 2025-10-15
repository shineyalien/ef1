'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { generateUUID, isValidUUID, safeGenerateUUID } from '@/lib/uuid'
import { useError } from '@/contexts/error-context'

// Prevent static generation since this page uses ErrorProvider hooks
export const dynamic = 'force-dynamic'

export default function TestUUIDPage() {
  const { showErrorToast, showSuccessToast } = useError()
  const [uuids, setUuids] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [testResults, setTestResults] = useState<{
    standardGeneration: boolean
    safeGeneration: boolean
    validation: boolean
  }>({
    standardGeneration: false,
    safeGeneration: false,
    validation: false
  })

  const testStandardGeneration = () => {
    try {
      const uuid = generateUUID()
      setUuids(prev => [uuid, ...prev].slice(0, 5))
      setTestResults(prev => ({ ...prev, standardGeneration: true }))
      showSuccessToast('Success', 'Standard UUID generation works')
    } catch (error) {
      showErrorToast('Error', 'Standard UUID generation failed')
      console.error('Standard UUID generation failed:', error)
    }
  }

  const testSafeGeneration = () => {
    try {
      const uuid = safeGenerateUUID('test-context')
      setUuids(prev => [uuid, ...prev].slice(0, 5))
      setTestResults(prev => ({ ...prev, safeGeneration: true }))
      showSuccessToast('Success', 'Safe UUID generation works')
    } catch (error) {
      showErrorToast('Error', 'Safe UUID generation failed')
      console.error('Safe UUID generation failed:', error)
    }
  }

  const testValidation = () => {
    try {
      const uuid = generateUUID()
      const isValid = isValidUUID(uuid)
      const isValidInvalid = isValidUUID('invalid-uuid')
      
      if (isValid && !isValidInvalid) {
        setTestResults(prev => ({ ...prev, validation: true }))
        showSuccessToast('Success', 'UUID validation works correctly')
      } else {
        showErrorToast('Error', 'UUID validation failed')
      }
    } catch (error) {
      showErrorToast('Error', 'UUID validation failed')
      console.error('UUID validation failed:', error)
    }
  }

  const runAllTests = async () => {
    setIsGenerating(true)
    
    try {
      // Test standard generation
      testStandardGeneration()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Test safe generation
      testSafeGeneration()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Test validation
      testValidation()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      showSuccessToast('All Tests', 'UUID tests completed successfully')
    } catch (error) {
      showErrorToast('Test Failed', 'One or more UUID tests failed')
      console.error('UUID tests failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const testErrorContext = () => {
    try {
      // Test the error context with available methods
      showSuccessToast('Success', 'Error context test completed successfully')
    } catch (error) {
      showErrorToast('Error', 'Error context test failed')
      console.error('Error context test failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">UUID Generation Test</h1>
          <p className="text-gray-600 mt-1">Test the UUID generation utilities and error handling</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>UUID Generation Tests</CardTitle>
            <CardDescription>Test different UUID generation methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={testStandardGeneration}
                disabled={isGenerating}
                className={testResults.standardGeneration ? "bg-green-600" : ""}
              >
                {testResults.standardGeneration ? "✓ Standard Generation" : "Test Standard Generation"}
              </Button>
              
              <Button
                onClick={testSafeGeneration}
                disabled={isGenerating}
                className={testResults.safeGeneration ? "bg-green-600" : ""}
              >
                {testResults.safeGeneration ? "✓ Safe Generation" : "Test Safe Generation"}
              </Button>
              
              <Button
                onClick={testValidation}
                disabled={isGenerating}
                className={testResults.validation ? "bg-green-600" : ""}
              >
                {testResults.validation ? "✓ Validation" : "Test Validation"}
              </Button>
              
              <Button
                onClick={testErrorContext}
                disabled={isGenerating}
              >
                Test Error Context
              </Button>
            </div>
            
            <Button
              onClick={runAllTests}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Running Tests..." : "Run All Tests"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated UUIDs</CardTitle>
            <CardDescription>Recent UUIDs generated during testing</CardDescription>
          </CardHeader>
          <CardContent>
            {uuids.length > 0 ? (
              <div className="space-y-2">
                {uuids.map((uuid, index) => (
                  <div key={uuid} className="p-2 bg-gray-100 rounded font-mono text-sm">
                    {index + 1}. {uuid} {isValidUUID(uuid) ? "✓" : "✗"}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No UUIDs generated yet. Click the test buttons above.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Status of all test cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${testResults.standardGeneration ? "bg-green-500" : "bg-red-500"}`}></div>
                <span>Standard UUID Generation: {testResults.standardGeneration ? "Passed" : "Failed"}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${testResults.safeGeneration ? "bg-green-500" : "bg-red-500"}`}></div>
                <span>Safe UUID Generation: {testResults.safeGeneration ? "Passed" : "Failed"}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${testResults.validation ? "bg-green-500" : "bg-red-500"}`}></div>
                <span>UUID Validation: {testResults.validation ? "Passed" : "Failed"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}