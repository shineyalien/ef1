import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    const period = searchParams.get('period') || '30' // days

    if (!businessId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Business ID required' 
      }, { status: 400 })
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get comprehensive analytics
    const [
      totalInvoices,
      totalRevenue,
      fbrSubmitted,
      pendingInvoices,
      topCustomers,
      monthlyTrends,
      statusDistribution
    ] = await Promise.all([
      // Total invoices
      prisma.invoice.count({
        where: { 
          businessId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),

      // Total revenue
      prisma.invoice.aggregate({
        where: { 
          businessId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _sum: { totalAmount: true }
      }),

      // FBR submitted count
      prisma.invoice.count({
        where: { 
          businessId,
          fbrSubmitted: true,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),

      // Pending invoices
      prisma.invoice.count({
        where: { 
          businessId,
          status: { in: ['DRAFT', 'SAVED'] },
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),

      // Top customers by revenue
      prisma.invoice.groupBy({
        by: ['customerId'],
        where: { 
          businessId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _sum: { totalAmount: true },
        _count: { id: true },
        orderBy: { _sum: { totalAmount: 'desc' } },
        take: 5
      }),

      // Monthly trends (last 6 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*)::integer as invoice_count,
          SUM("totalAmount")::float as revenue
        FROM "invoices" 
        WHERE "businessId" = ${businessId} 
          AND "createdAt" >= ${new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
        LIMIT 6
      `,

      // Status distribution
      prisma.invoice.groupBy({
        by: ['status'],
        where: { 
          businessId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _count: { id: true }
      })
    ])

    // Enhance top customers with names
    const customerIds = topCustomers.map(c => c.customerId).filter(Boolean)
    const customerDetails = await prisma.customer.findMany({
      where: { id: { in: customerIds as string[] } },
      select: { id: true, name: true, email: true }
    })

    const topCustomersWithDetails = topCustomers.map(customer => {
      const details = customerDetails.find(d => d.id === customer.customerId)
      return {
        ...customer,
        customerName: details?.name || 'Unknown',
        customerEmail: details?.email
      }
    })

    return NextResponse.json({
      success: true,
      analytics: {
        summary: {
          totalInvoices,
          totalRevenue: totalRevenue._sum.totalAmount || 0,
          fbrSubmitted,
          pendingInvoices,
          averageInvoiceValue: totalInvoices > 0 ? (totalRevenue._sum.totalAmount || 0) / totalInvoices : 0,
          fbrSubmissionRate: totalInvoices > 0 ? (fbrSubmitted / totalInvoices) * 100 : 0
        },
        topCustomers: topCustomersWithDetails,
        monthlyTrends,
        statusDistribution,
        period: `${period} days`,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      }
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}