import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/auth"
import { z } from 'zod'
import { db } from '@/lib/database'
import { getAuthenticatedBusiness } from '@/lib/auth-helpers'

const fbrSettingsSchema = z.object({
  sandboxToken: z.string().optional(),
  productionToken: z.string().optional(),
  environment: z.enum(['LOCAL', 'SANDBOX', 'PRODUCTION']).default('LOCAL'),
  fbrSetupComplete: z.boolean().default(false),
  sandboxValidated: z.boolean().default(false)
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Auto-create business if it doesn't exist
    const business = await getAuthenticatedBusiness()

    return NextResponse.json({
      success: true,
      settings: {
        environment: business.integrationMode || 'LOCAL',
        fbrSetupComplete: business.fbrSetupComplete || false,
        sandboxValidated: business.sandboxValidated || false,
        hasTokens: {
          sandbox: !!business.sandboxToken,
          production: !!business.productionToken
        }
      }
    })

  } catch (error) {
    console.error('Error loading FBR settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = fbrSettingsSchema.parse(body)

    // Auto-create business if it doesn't exist
    const business = await getAuthenticatedBusiness()

    // Update business with FBR settings
    const updatedBusiness = await db.updateBusiness(business.id, {
      integrationMode: validatedData.environment,
      fbrSetupComplete: validatedData.fbrSetupComplete,
      sandboxValidated: validatedData.sandboxValidated,
      ...(validatedData.sandboxToken && { sandboxToken: validatedData.sandboxToken }),
      ...(validatedData.productionToken && { productionToken: validatedData.productionToken })
    })

    return NextResponse.json({
      success: true,
      message: 'FBR settings updated successfully',
      business: updatedBusiness
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation error',
        details: error.errors
      }, { status: 400 })
    }

    console.error('Error updating FBR settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}