'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, DollarSign, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalInvoices: number
  totalRevenue: number
  totalCustomers: number
  fbrSubmissions: number
  fbrSuccessRate: number
  monthlyGrowth: {
    invoices: number
    revenue: number
  }
}

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    fbrSubmissions: 0,
    fbrSuccessRate: 0,
    monthlyGrowth: {
      invoices: 0,
      revenue: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setStats(data.stats)
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Loading...</CardTitle>
              <div className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold bg-gray-200 h-8 w-20 rounded animate-pulse"></div>
              <div className="text-xs text-muted-foreground bg-gray-200 h-4 w-24 rounded animate-pulse mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : ''
    return `${sign}${growth.toFixed(1)}%`
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Invoices</CardTitle>
          <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{stats.totalInvoices}</div>
          <p className="text-xs text-muted-foreground">
            {stats.monthlyGrowth.invoices !== 0 && (
              <span className={stats.monthlyGrowth.invoices >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatGrowth(stats.monthlyGrowth.invoices)} from last month
              </span>
            )}
            {stats.monthlyGrowth.invoices === 0 && (
              <span>No change from last month</span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.monthlyGrowth.revenue !== 0 && (
              <span className={stats.monthlyGrowth.revenue >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatGrowth(stats.monthlyGrowth.revenue)} from last month
              </span>
            )}
            {stats.monthlyGrowth.revenue === 0 && (
              <span>No change from last month</span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Customers</CardTitle>
          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{stats.totalCustomers}</div>
          <p className="text-xs text-muted-foreground">
            Total registered customers
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">FBR Submissions</CardTitle>
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{stats.fbrSubmissions}</div>
          <p className="text-xs text-muted-foreground">
            {stats.fbrSuccessRate > 0 ? (
              <span className={stats.fbrSuccessRate >= 80 ? 'text-green-600' : 'text-orange-600'}>
                {stats.fbrSuccessRate}% success rate
              </span>
            ) : (
              <span>No submissions yet</span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardStats