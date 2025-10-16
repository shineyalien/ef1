'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

interface RecentInvoice {
  id: string
  invoiceNumber: string
  customerName: string
  totalAmount: number
  status: string
  fbrSubmitted: boolean
  fbrValidated: boolean
  createdAt: string
}

const RecentInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<RecentInvoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentInvoices = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setInvoices(data.stats.recentInvoices || [])
          }
        }
      } catch (error) {
        console.error('Failed to fetch recent invoices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentInvoices()
  }, [])

  const getStatusBadge = (invoice: RecentInvoice) => {
    if (invoice.fbrValidated) {
      return <Badge className="bg-green-100 text-green-800 text-xs">FBR Validated</Badge>
    }
    if (invoice.fbrSubmitted) {
      return <Badge className="bg-blue-100 text-blue-800 text-xs">FBR Submitted</Badge>
    }
    if (invoice.status === 'SAVED') {
      return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Saved</Badge>
    }
    return <Badge className="bg-gray-100 text-gray-800 text-xs">Draft</Badge>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Recent Invoices</CardTitle>
          <CardDescription className="text-sm">Your latest invoice activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Recent Invoices</CardTitle>
        <CardDescription className="text-sm">Your latest invoice activity</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length > 0 ? (
          <>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">
                      {invoice.customerName} - {formatCurrency(invoice.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(invoice.createdAt)}</p>
                  </div>
                  {getStatusBadge(invoice)}
                </div>
              ))}
            </div>
            <Link href="/invoices">
              <Button variant="ghost" className="w-full mt-4">
                View all invoices
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No invoices yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first invoice to see it here</p>
            <Link href="/invoices/create">
              <Button className="mt-4">
                Create Invoice
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentInvoices