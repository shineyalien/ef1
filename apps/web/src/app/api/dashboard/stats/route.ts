import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 })
    }

    // Get user's business
    const business = await prisma.business.findFirst({
      where: {
        user: { email: session.user.email }
      }
    })

    if (!business) {
      // Return zero stats if no business exists
      return NextResponse.json({
        success: true,
        stats: {
          totalInvoices: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          fbrSubmissions: 0,
          fbrSuccessRate: 0,
          recentInvoices: [],
          monthlyGrowth: {
            invoices: 0,
            revenue: 0
          }
        }
      })
    }

    const currentMonth = new Date()
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const startOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)
    const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)

    // Get all stats in parallel
    const [
      totalInvoices,
      totalRevenue,
      totalCustomers,
      fbrSubmitted,
      fbrValidated,
      recentInvoices,
      currentMonthInvoices,
      currentMonthRevenue,
      lastMonthInvoices,
      lastMonthRevenue
    ] = await Promise.all([
      // Total invoices
      prisma.invoice.count({
        where: { businessId: business.id }
      }),

      // Total revenue
      prisma.invoice.aggregate({
        where: { businessId: business.id },
        _sum: { totalAmount: true }
      }),

      // Total customers
      prisma.customer.count({
        where: { businessId: business.id }
      }),

      // FBR submitted count
      prisma.invoice.count({
        where: { 
          businessId: business.id,
          fbrSubmitted: true
        }
      }),

      // FBR validated count
      prisma.invoice.count({
        where: { 
          businessId: business.id,
          fbrValidated: true
        }
      }),

      // Recent invoices (last 5)
      prisma.invoice.findMany({
        where: { businessId: business.id },
        include: {
          customer: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),

      // Current month invoices
      prisma.invoice.count({
        where: {
          businessId: business.id,
          createdAt: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth
          }
        }
      }),

      // Current month revenue
      prisma.invoice.aggregate({
        where: {
          businessId: business.id,
          createdAt: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth
          }
        },
        _sum: { totalAmount: true }
      }),

      // Last month invoices
      prisma.invoice.count({
        where: {
          businessId: business.id,
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),

      // Last month revenue
      prisma.invoice.aggregate({
        where: {
          businessId: business.id,
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        },
        _sum: { totalAmount: true }
      })
    ])

    // Calculate growth percentages
    const invoiceGrowth = lastMonthInvoices > 0 
      ? ((currentMonthInvoices - lastMonthInvoices) / lastMonthInvoices) * 100 
      : 0

    const revenueGrowth = (lastMonthRevenue._sum.totalAmount || 0) > 0
      ? (((currentMonthRevenue._sum.totalAmount || 0) - (lastMonthRevenue._sum.totalAmount || 0)) / (lastMonthRevenue._sum.totalAmount || 0)) * 100
      : 0

    // Calculate FBR success rate
    const fbrSuccessRate = fbrSubmitted > 0 
      ? (fbrValidated / fbrSubmitted) * 100 
      : 0

    // Format recent invoices
    const formattedRecentInvoices = recentInvoices.map(invoice => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customer?.name || 'Unknown Customer',
      totalAmount: invoice.totalAmount,
      status: invoice.status,
      fbrSubmitted: invoice.fbrSubmitted,
      fbrValidated: invoice.fbrValidated,
      createdAt: invoice.createdAt
    }))

    return NextResponse.json({
      success: true,
      stats: {
        totalInvoices,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalCustomers,
        fbrSubmissions: fbrSubmitted,
        fbrSuccessRate: Math.round(fbrSuccessRate),
        recentInvoices: formattedRecentInvoices,
        monthlyGrowth: {
          invoices: Math.round(invoiceGrowth),
          revenue: Math.round(revenueGrowth)
        }
      }
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}