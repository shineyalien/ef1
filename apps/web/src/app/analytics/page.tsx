'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Download,
  ArrowLeft,
  Home
} from "lucide-react"

// Prevent static generation for this page since it uses useSession
export const dynamic = 'force-dynamic'

interface AnalyticsData {
  summary: {
    totalInvoices: number
    totalRevenue: number
    fbrSubmitted: number
    pendingInvoices: number
    averageInvoiceValue: number
    fbrSubmissionRate: number
  }
  topCustomers: Array<{
    customerId: string
    customerName: string
    customerEmail?: string
    _sum: { totalAmount: number }
    _count: { id: number }
  }>
  monthlyTrends: Array<{
    month: string
    invoice_count: number
    revenue: number
  }>
  statusDistribution: Array<{
    status: string
    _count: { id: number }
  }>
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const [businesses, setBusinesses] = useState<any[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      redirect('/auth/login')
      return
    }

    loadBusinessesAndAnalytics()
  }, [session, status, selectedPeriod])

  const loadBusinessesAndAnalytics = async () => {
    try {
      setLoading(true)
      
      // Mock business data for demo
      const mockBusinesses = [{
        id: '1',
        companyName: 'Demo Business',
        ntnNumber: '1234567890123',
        userId: session?.user?.id || '1'
      }]
      
      setBusinesses(mockBusinesses)

      if (mockBusinesses.length > 0 && mockBusinesses[0]) {
        const response = await fetch(`/api/analytics?businessId=${mockBusinesses[0].id}&period=${selectedPeriod}`)
        const data = await response.json()
        
        if (data.success) {
          setAnalytics(data.analytics)
        }
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const firstBusiness = businesses && businesses.length > 0 ? businesses[0] : null

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/dashboard'}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Home</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {analytics && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(analytics.summary.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    Avg: {formatCurrency(analytics.summary.averageInvoiceValue)} per invoice
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.summary.totalInvoices}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.summary.pendingInvoices} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">FBR Submission Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(analytics.summary.fbrSubmissionRate)}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.summary.fbrSubmitted} of {analytics.summary.totalInvoices} invoices
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Business Performance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.summary.fbrSubmissionRate > 80 ? 'Excellent' : 
                     analytics.summary.fbrSubmissionRate > 60 ? 'Good' : 'Needs Improvement'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    FBR compliance status
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Customers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                  <CardDescription>
                    Highest revenue customers in the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topCustomers.map((customer, index) => (
                      <div key={customer.customerId} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{customer.customerName}</p>
                            <p className="text-xs text-gray-500">{customer._count.id} invoices</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(customer._sum.totalAmount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Status</CardTitle>
                  <CardDescription>
                    Distribution of invoice statuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.statusDistribution.map((status) => (
                      <div key={status.status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            status.status === 'VALIDATED' ? 'bg-green-500' :
                            status.status === 'SUBMITTED' ? 'bg-blue-500' :
                            status.status === 'DRAFT' ? 'bg-gray-500' :
                            'bg-yellow-500'
                          }`} />
                          <span className="text-sm font-medium capitalize">
                            {status.status.toLowerCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{status._count.id}</span>
                          <span className="text-xs text-gray-500">
                            ({((status._count.id / analytics.summary.totalInvoices) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>
                  Revenue and invoice count over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.monthlyTrends.map((trend, index) => {
                    const month = new Date(trend.month).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{month}</p>
                          <p className="text-sm text-gray-600">{trend.invoice_count} invoices</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(trend.revenue)}</p>
                          <p className="text-sm text-gray-600">
                            Avg: {formatCurrency(trend.revenue / trend.invoice_count)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!analytics && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No analytics data available</h3>
              <p className="text-gray-600 mb-6">Create some invoices to see your business analytics.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}