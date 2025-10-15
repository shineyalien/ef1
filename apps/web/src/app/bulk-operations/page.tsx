'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  FileText,
  Users,
  TrendingUp,
  ArrowLeft,
  Home
} from "lucide-react"
import { useDropzone } from 'react-dropzone'

// Prevent static generation for this page since it uses useSession
export const dynamic = 'force-dynamic'

interface BulkOperationResult {
  id: string
  fileName: string
  totalRecords: number
  validRecords: number
  invalidRecords: number
  processingStatus: string
  uploadedAt: string
  errors?: Array<{
    row: number
    field: string
    message: string
  }>
}

export default function BulkOperationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploadResult, setUploadResult] = useState<BulkOperationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [recentOperations, setRecentOperations] = useState<BulkOperationResult[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Prevent SSR issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/login')
    return null
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setLoading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/invoices/bulk', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setUploadResult(result.operation)
        // Refresh recent operations
        loadRecentOperations()
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadRecentOperations = async () => {
    try {
      const response = await fetch('/api/invoices/bulk')
      const result = await response.json()
      
      if (result.success) {
        setRecentOperations(result.operations)
      }
    } catch (error) {
      console.error('Failed to load recent operations:', error)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    disabled: loading
  })

  const downloadTemplate = () => {
    const template = `Customer Name,Customer Email,Customer Address,Product Description,HS Code,Quantity,Unit Price,Tax Rate
ABC Company,contact@abc.com,"123 Main St, Karachi",Computer Mouse,8471.60.90,10,1500,18
XYZ Corp,info@xyz.com,"456 Business Ave, Lahore",Office Chair,9401.61.00,5,12000,18
Tech Solutions,tech@solutions.pk,"789 Tech Park, Islamabad",Laptop Stand,8473.30.20,3,2500,18`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = 'invoice_template.csv'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'PROCESSING':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-700 bg-green-50'
      case 'FAILED':
        return 'text-red-700 bg-red-50'
      case 'PROCESSING':
        return 'text-yellow-700 bg-yellow-50'
      default:
        return 'text-gray-700 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
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

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bulk Invoice Operations</h1>
            <p className="text-gray-600 mt-1">Upload multiple invoices at once using CSV or Excel files</p>
          </div>
          <Button onClick={downloadTemplate} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Invoice Data</CardTitle>
            <CardDescription>
              Drag and drop your CSV or Excel file, or click to browse. Maximum file size: 10MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : loading
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 hover:border-gray-400 cursor-pointer'
              }`}
            >
              <input {...getInputProps()} />
              
              {loading ? (
                <div>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-lg font-medium text-gray-900">Processing your file...</p>
                  <p className="text-gray-600">This may take a few moments</p>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-lg font-medium text-blue-600">Drop your file here</p>
                  ) : (
                    <>
                      <p className="text-lg font-medium text-gray-900">
                        Drag & drop your invoice file here
                      </p>
                      <p className="text-gray-600 mt-2">
                        or click to browse for CSV, XLS, or XLSX files
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload Result */}
        {uploadResult && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getStatusIcon(uploadResult.processingStatus)}
                <span>Upload Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{uploadResult.totalRecords}</div>
                  <div className="text-sm text-gray-600">Total Records</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{uploadResult.validRecords}</div>
                  <div className="text-sm text-gray-600">Valid Records</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{uploadResult.invalidRecords}</div>
                  <div className="text-sm text-gray-600">Invalid Records</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className={`text-2xl font-bold px-2 py-1 rounded text-sm ${getStatusColor(uploadResult.processingStatus)}`}>
                    {uploadResult.processingStatus}
                  </div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>

              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-red-700 mb-2">Validation Errors:</h4>
                  <div className="max-h-60 overflow-y-auto bg-red-50 rounded-lg p-3">
                    {uploadResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700 mb-1">
                        Row {error.row}: {error.field} - {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Operations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bulk Operations</CardTitle>
            <CardDescription>
              History of your bulk invoice uploads and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentOperations.length === 0 ? (
              <div className="text-center py-12">
                <FileSpreadsheet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bulk operations yet</h3>
                <p className="text-gray-600">Upload your first bulk invoice file to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOperations.map((operation) => (
                  <div key={operation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(operation.processingStatus)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{operation.fileName}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(operation.uploadedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-green-600">
                          <span className="font-medium">{operation.validRecords}</span> valid
                        </div>
                        {operation.invalidRecords > 0 && (
                          <div className="text-red-600">
                            <span className="font-medium">{operation.invalidRecords}</span> errors
                          </div>
                        )}
                        <div className="text-gray-600">
                          <span className="font-medium">{operation.totalRecords}</span> total
                        </div>
                      </div>
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(operation.processingStatus)}`}>
                        {operation.processingStatus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}