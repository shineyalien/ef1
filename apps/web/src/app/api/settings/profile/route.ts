import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

/**
 * GET /api/settings/profile
 * Get user profile information
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        country: true,
        subscriptionPlan: true,
        createdAt: true,
        emailNotifications: true,
        invoiceNotifications: true,
        fbrSubmissionNotifications: true,
        marketingEmails: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: user
    })

  } catch (error) {
    console.error('❌ Profile API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch profile'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/settings/profile
 * Update user profile information
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      phoneNumber, 
      country,
      emailNotifications,
      invoiceNotifications,
      fbrSubmissionNotifications,
      marketingEmails
    } = body

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        firstName,
        lastName,
        phoneNumber: phoneNumber || null,
        country: country || 'Pakistan',
        emailNotifications: emailNotifications ?? true,
        invoiceNotifications: invoiceNotifications ?? true,
        fbrSubmissionNotifications: fbrSubmissionNotifications ?? true,
        marketingEmails: marketingEmails ?? false
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        country: true,
        subscriptionPlan: true,
        createdAt: true,
        emailNotifications: true,
        invoiceNotifications: true,
        fbrSubmissionNotifications: true,
        marketingEmails: true
      }
    })

    return NextResponse.json({
      success: true,
      profile: updatedUser
    })

  } catch (error) {
    console.error('❌ Profile Update Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update profile'
      },
      { status: 500 }
    )
  }
}
