import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/auth"
import { prisma } from '@/lib/database'
import { getAuthenticatedBusiness } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Auto-create business if it doesn't exist
    const business = await getAuthenticatedBusiness()

    // Get all invoices for this business
    const invoices = await prisma.invoice.findMany({
      where: {
        businessId: business.id
      },
      select: {
        id: true,
        status: true,
        mode: true,
        fbrSubmitted: true,
        fbrValidated: true,
        submissionTimestamp: true,
        fbrTimestamp: true,
        createdAt: true,
        updatedAt: true,
        fbrErrorCode: true,
        fbrErrorMessage: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate statistics
    const totalInvoices = invoices.length
    const draftInvoices = invoices.filter(inv => inv.status === 'DRAFT').length
    const submittedInvoices = invoices.filter(inv => inv.fbrSubmitted).length
    const validatedInvoices = invoices.filter(inv => inv.fbrValidated).length
    const failedInvoices = invoices.filter(inv => inv.status === 'FAILED').length
    const sandboxInvoices = invoices.filter(inv => inv.mode === 'SANDBOX' && inv.fbrSubmitted).length
    const productionInvoices = invoices.filter(inv => inv.mode === 'PRODUCTION' && inv.fbrSubmitted).length

    // Calculate success rate
    const successRate = submittedInvoices > 0 
      ? ((validatedInvoices / submittedInvoices) * 100).toFixed(1) + '%'
      : '0%'

    // Find last submission
    const lastSubmission = invoices
      .filter(inv => inv.submissionTimestamp || inv.fbrTimestamp)
      .sort((a, b) => {
        const dateA = new Date(b.submissionTimestamp || b.fbrTimestamp || 0)
        const dateB = new Date(a.submissionTimestamp || a.fbrTimestamp || 0)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 1)
      .map(inv => ({
        timestamp: inv.submissionTimestamp || inv.fbrTimestamp || inv.createdAt,
        mode: inv.mode,
        status: inv.fbrValidated ? 'Validated' : inv.fbrSubmitted ? 'Submitted' : inv.status
      }))[0] || null

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentActivity = {
      total: invoices.filter(inv => new Date(inv.createdAt) >= sevenDaysAgo).length,
      submitted: invoices.filter(inv => 
        new Date(inv.createdAt) >= sevenDaysAgo && inv.fbrSubmitted
      ).length,
      validated: invoices.filter(inv => 
        new Date(inv.createdAt) >= sevenDaysAgo && inv.fbrValidated
      ).length,
      failed: invoices.filter(inv => 
        new Date(inv.createdAt) >= sevenDaysAgo && inv.status === 'FAILED'
      ).length
    }

    // Get error breakdown
    const errorBreakdown = invoices
      .filter(inv => inv.fbrErrorCode && inv.status === 'FAILED')
      .reduce((acc, inv) => {
        const key = inv.fbrErrorCode || 'Unknown'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    // Prepare response data matching the FBRStats interface from the frontend
    const stats = {
      totalInvoices,
      draftInvoices,
      submittedInvoices,
      sandboxInvoices,
      productionInvoices,
      validatedInvoices,
      failedInvoices,
      successRate,
      lastSubmission,
      // Additional metrics for enhanced reporting
      recentActivity,
      errorBreakdown,
      // Environment breakdown
      environmentStats: {
        local: invoices.filter(inv => inv.mode === 'LOCAL').length,
        sandbox: invoices.filter(inv => inv.mode === 'SANDBOX').length,
        production: invoices.filter(inv => inv.mode === 'PRODUCTION').length
      },
      // Status breakdown
      statusBreakdown: {
        draft: invoices.filter(inv => inv.status === 'DRAFT').length,
        saved: invoices.filter(inv => inv.status === 'SAVED').length,
        submitted: invoices.filter(inv => inv.status === 'SUBMITTED').length,
        validated: invoices.filter(inv => inv.status === 'VALIDATED' || inv.fbrValidated).length,
        published: invoices.filter(inv => inv.status === 'PUBLISHED').length,
        failed: invoices.filter(inv => inv.status === 'FAILED').length,
        cancelled: invoices.filter(inv => inv.status === 'CANCELLED').length
      }
    }

    return NextResponse.json({
      success: true,
      stats,
      business: {
        id: business.id,
        name: business.companyName,
        environment: business.integrationMode,
        fbrSetupComplete: business.fbrSetupComplete
      }
    })

  } catch (error) {
    console.error('Error fetching FBR stats:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch FBR statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}