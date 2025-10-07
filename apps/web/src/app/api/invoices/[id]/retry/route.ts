import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/database'
import { retryFBRSubmission, isEligibleForRetry, resetRetryCount, disableRetry } from '@/lib/retry-service'

// POST /api/invoices/[id]/retry - Manually retry a failed FBR submission
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const invoiceId = params.id

    // Verify ownership
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        business: {
          include: {
            user: true
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    if (invoice.business.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check eligibility
    const eligible = await isEligibleForRetry(invoiceId)
    if (!eligible) {
      return NextResponse.json({
        error: 'Invoice is not eligible for retry',
        details: {
          status: invoice.status,
          retryCount: invoice.retryCount,
          maxRetries: invoice.maxRetries,
          retryEnabled: invoice.retryEnabled,
          fbrSubmitted: invoice.fbrSubmitted,
          fbrValidated: invoice.fbrValidated
        }
      }, { status: 400 })
    }

    // Attempt retry
    const result = await retryFBRSubmission(invoiceId)

    if (result.success) {
      return NextResponse.json({
        message: result.message,
        fbrInvoiceNumber: result.fbrInvoiceNumber,
        retryAttempt: invoice.retryCount + 1
      })
    } else {
      return NextResponse.json({
        error: result.message,
        details: result.error,
        retryAttempt: invoice.retryCount + 1
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error in retry endpoint:', error)
    return NextResponse.json({
      error: 'Failed to retry submission',
      details: error.message
    }, { status: 500 })
  }
}

// GET /api/invoices/[id]/retry - Get retry status
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const invoiceId = params.id

    // Get invoice with retry info
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        retryCount: true,
        maxRetries: true,
        lastRetryAt: true,
        nextRetryAt: true,
        retryEnabled: true,
        fbrErrorCode: true,
        fbrErrorMessage: true,
        fbrSubmitted: true,
        fbrValidated: true,
        business: {
          select: {
            user: {
              select: {
                email: true
              }
            }
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    if (invoice.business.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const eligible = await isEligibleForRetry(invoiceId)

    return NextResponse.json({
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      retryInfo: {
        retryCount: invoice.retryCount,
        maxRetries: invoice.maxRetries,
        lastRetryAt: invoice.lastRetryAt,
        nextRetryAt: invoice.nextRetryAt,
        retryEnabled: invoice.retryEnabled,
        eligible: eligible
      },
      error: {
        code: invoice.fbrErrorCode,
        message: invoice.fbrErrorMessage
      }
    })
  } catch (error: any) {
    console.error('Error fetching retry status:', error)
    return NextResponse.json({
      error: 'Failed to fetch retry status',
      details: error.message
    }, { status: 500 })
  }
}

// PUT /api/invoices/[id]/retry - Reset or disable retry
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const invoiceId = params.id
    const body = await request.json()
    const { action } = body // 'reset' or 'disable'

    // Verify ownership
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        business: {
          include: {
            user: true
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    if (invoice.business.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (action === 'reset') {
      const success = await resetRetryCount(invoiceId)
      if (success) {
        return NextResponse.json({
          message: 'Retry count reset successfully. Invoice will retry immediately.'
        })
      } else {
        return NextResponse.json({
          error: 'Failed to reset retry count'
        }, { status: 500 })
      }
    } else if (action === 'disable') {
      const success = await disableRetry(invoiceId)
      if (success) {
        return NextResponse.json({
          message: 'Automatic retry disabled for this invoice.'
        })
      } else {
        return NextResponse.json({
          error: 'Failed to disable retry'
        }, { status: 500 })
      }
    } else {
      return NextResponse.json({
        error: 'Invalid action. Use "reset" or "disable".'
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Error in retry PUT endpoint:', error)
    return NextResponse.json({
      error: 'Failed to update retry settings',
      details: error.message
    }, { status: 500 })
  }
}
