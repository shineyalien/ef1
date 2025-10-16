import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { generateFbrJsonFromDb } from '@/lib/fbr-json-generator'

// GET /api/invoices/[id]/fbr-json - Generate FBR production JSON for an invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: invoiceId } = await params

    try {
      // Use the unified FBR JSON generator
      const result = await generateFbrJsonFromDb(invoiceId)
      return NextResponse.json(result)
    } catch (dbError: any) {
      console.error('Error generating FBR JSON from database:', dbError)
      return NextResponse.json({
        error: 'Failed to generate FBR JSON',
        details: dbError.message
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Error in FBR JSON API route:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 })
  }
}