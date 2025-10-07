import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'
import { getAuthenticatedBusiness } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get business
    const business = await getAuthenticatedBusiness()

    // Get submission statistics
    const [
      totalInvoices,
      draftInvoices,
      submittedInvoices,
      sandboxInvoices,
      productionInvoices,
      validatedInvoices,
      failedInvoices,
      lastSubmission
    ] = await Promise.all([
      // Total invoices
      prisma.invoice.count({
        where: { businessId: business.id }
      }),
      
      // Draft invoices
      prisma.invoice.count({
        where: { 
          businessId: business.id,
          status: 'DRAFT'
        }
      }),
      
      // Submitted to FBR
      prisma.invoice.count({
        where: { 
          businessId: business.id,
          fbrSubmitted: true
        }
      }),
      
      // Sandbox submissions
      prisma.invoice.count({
        where: { 
          businessId: business.id,
          mode: 'SANDBOX'
        }
      }),
      
      // Production submissions
      prisma.invoice.count({
        where: { 
          businessId: business.id,
          mode: 'PRODUCTION'
        }
      }),
      
      // Validated invoices
      prisma.invoice.count({
        where: { 
          businessId: business.id,
          fbrValidated: true
        }
      }),
      
      // Failed submissions
      prisma.invoice.count({
        where: { 
          businessId: business.id,
          status: 'FAILED'
        }
      }),
      
      // Last submission
      prisma.invoice.findFirst({
        where: { 
          businessId: business.id,
          fbrSubmitted: true
        },
        orderBy: {
          submissionTimestamp: 'desc'
        },
        select: {
          submissionTimestamp: true,
          mode: true,
          status: true
        }
      })
    ])

    // Calculate success rate
    const successRate = submittedInvoices > 0 
      ? ((validatedInvoices / submittedInvoices) * 100).toFixed(1)
      : '0'

    return NextResponse.json({
      success: true,
      stats: {
        totalInvoices,
        draftInvoices,
        submittedInvoices,
        sandboxInvoices,
        productionInvoices,
        validatedInvoices,
        failedInvoices,
        successRate: `${successRate}%`,
        lastSubmission: lastSubmission ? {
          timestamp: lastSubmission.submissionTimestamp,
          mode: lastSubmission.mode,
          status: lastSubmission.status
        } : null
      }
    })

  } catch (error) {
    console.error('Error fetching FBR stats:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
