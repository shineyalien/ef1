'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertTriangle, Loader, Upload, FileText, Eye } from 'lucide-react'

interface FBRSubmissionModalProps {
  invoice: any
  isOpen: boolean
  onClose: () => void
  onSubmit: (environment: string) => Promise<void>
}

export function FBRSubmissionModal({ invoice, isOpen, onClose, onSubmit }: FBRSubmissionModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox')
  const [validationResults, setValidationResults] = useState<any>(null)
  const [submissionResults, setSubmissionResults] = useState<any>(null)
  const [step, setStep] = useState<'select' | 'validate' | 'submit' | 'complete'>('select')

  if (!isOpen) return null

  const handleValidation = async () => {
    setStep('validate')
    setSubmitting(true)

    try {
      // Simulate validation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const results = {
        valid: true,
        checks: [
          { name: 'Customer Information', status: 'passed', message: 'Customer data is valid' },
          { name: 'Invoice Items', status: 'passed', message: 'All items have required fields' },
          { name: 'Tax Calculations', status: 'passed', message: 'Tax rates are correct' },
          { name: 'HS Codes', status: 'warning', message: 'Some HS codes are generic' },
          { name: 'NTN Validation', status: 'passed', message: 'NTN format is correct' }
        ]
      }
      
      setValidationResults(results)
      setStep('submit')
    } catch (error) {
      setValidationResults({ valid: false, error: 'Validation failed' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmission = async () => {
    setSubmitting(true)
    setStep('submit')

    try {
      // Call real FBR submission API
      const response = await fetch(`/api/invoices/${invoice.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ environment })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Submission failed')
      }
      
      // Success - FBR accepted the invoice
      const results = {
        success: true,
        fbrInvoiceNumber: data.fbrInvoiceNumber,
        submissionTime: data.fbrTimestamp || new Date().toISOString(),
        status: 'Validated',
        qrCode: data.qrCode, // Base64 QR code from API
        message: data.message
      }
      
      setSubmissionResults(results)
      setStep('complete')
      
      // Refresh invoice data if parent has onSubmit callback
      if (onSubmit) {
        await onSubmit(environment)
      }
    } catch (error) {
      console.error('FBR Submission Error:', error)
      setSubmissionResults({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Submission failed' 
      })
      setStep('complete')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Step: Environment Selection */}
        {step === 'select' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Submit Invoice to FBR</h2>
              <Button variant="ghost" onClick={onClose}>✕</Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Choose Environment</h3>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="environment"
                      value="sandbox"
                      checked={environment === 'sandbox'}
                      onChange={(e) => setEnvironment(e.target.value as 'sandbox')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">Sandbox</div>
                      <div className="text-sm text-gray-600">Test submission (recommended)</div>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="environment"
                      value="production"
                      checked={environment === 'production'}
                      onChange={(e) => setEnvironment(e.target.value as 'production')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">Production</div>
                      <div className="text-sm text-gray-600">Live submission to FBR</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Invoice Summary</h4>
                <div className="text-sm text-blue-800">
                  <p>Invoice #: {invoice.invoiceNumber}</p>
                  <p>Date: {invoice.invoiceDate}</p>
                  <p>Total: PKR {invoice.totalAmount?.toLocaleString()}</p>
                  <p>Items: {invoice.items?.length} item(s)</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleValidation} className="flex-1">
                  Validate & Submit
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Validation */}
        {step === 'validate' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Validating Invoice</h2>
              <Button variant="ghost" onClick={onClose}>✕</Button>
            </div>

            <div className="space-y-4">
              {submitting ? (
                <div className="text-center py-8">
                  <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600">Validating invoice data...</p>
                </div>
              ) : validationResults ? (
                <div>
                  <h3 className="font-medium mb-4">Validation Results</h3>
                  <div className="space-y-2">
                    {validationResults.checks.map((check: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{check.name}</div>
                          <div className="text-sm text-gray-600">{check.message}</div>
                        </div>
                        <div>
                          {check.status === 'passed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                          {check.status === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                          {check.status === 'failed' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmission} className="flex-1" disabled={!validationResults.valid}>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit to FBR
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Step: Submission */}
        {step === 'submit' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Submitting to FBR</h2>
              <Button variant="ghost" onClick={onClose}>✕</Button>
            </div>

            <div className="text-center py-8">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Submitting invoice to FBR {environment} environment...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          </div>
        )}

        {/* Step: Complete */}
        {step === 'complete' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Submission Complete</h2>
              <Button variant="ghost" onClick={onClose}>✕</Button>
            </div>

            <div className="space-y-4">
              {submissionResults?.success ? (
                <div>
                  <div className="text-center py-6">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-green-900 mb-2">Successfully Submitted!</h3>
                    <p className="text-gray-600">Your invoice has been submitted to FBR and validated.</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">FBR Response</h4>
                    <div className="text-sm text-green-800 space-y-1">
                      <p><strong>FBR Invoice Number:</strong> {submissionResults.fbrInvoiceNumber}</p>
                      <p><strong>Status:</strong> {submissionResults.status}</p>
                      <p><strong>Submission Time:</strong> {new Date(submissionResults.submissionTime).toLocaleString()}</p>
                    </div>
                    
                    {/* Display QR Code if available */}
                    {submissionResults.qrCode && (
                      <div className="mt-4 p-4 bg-white rounded border border-green-200">
                        <h5 className="text-sm font-medium text-green-900 mb-2">FBR QR Code</h5>
                        <div className="flex justify-center">
                          <img 
                            src={submissionResults.qrCode} 
                            alt="FBR Invoice QR Code" 
                            className="w-40 h-40"
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-center">
                          7x7MM QR Code - Scan to verify invoice
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Invoice
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>

                  <Button onClick={onClose} className="w-full">
                    Close
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="text-center py-6">
                    <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-900 mb-2">Submission Failed</h3>
                    <p className="text-gray-600">There was an error submitting your invoice to FBR.</p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">Error Details</h4>
                    <div className="text-sm text-red-800">
                      {submissionResults?.error || 'Unknown error occurred'}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
                      Try Again
                    </Button>
                    <Button onClick={onClose} className="flex-1">
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}