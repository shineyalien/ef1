/**
 * Authentication and Business Utilities
 * Helper functions for ensuring user and business exist
 */

import { auth } from '@/auth'
import { prisma } from '@/lib/database'

/**
 * Gets the current authenticated session or throws an error
 */
export async function getAuthSession() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }
  return session
}

/**
 * Gets or creates a user from the session
 */
export async function getOrCreateUser(email: string, name?: string | null) {
  let user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: '', // Empty password for OAuth/session-based users
        firstName: name?.split(' ')[0] || 'User',
        lastName: name?.split(' ')[1] || '',
        isActive: true,
        subscriptionPlan: 'FREE',
        country: 'Pakistan'
      }
    })
  }

  return user
}

/**
 * Gets or creates a business for the authenticated user
 * This ensures every user has at least one business to work with
 */
export async function getOrCreateBusiness(email: string, name?: string | null) {
  // Try to find existing business
  let business = await prisma.business.findFirst({
    where: {
      user: { email }
    }
  })

  if (!business) {
    // Get or create user first
    const user = await getOrCreateUser(email, name)

    // Create default business
    business = await prisma.business.create({
      data: {
        userId: user.id,
        companyName: `${name || 'My'} Business`,
        ntnNumber: '1234567', // Placeholder - user should update
        address: '123 Business Street',
        province: 'Punjab',
        businessType: 'Services',
        sector: 'Technology'
      }
    })
  }

  return business
}

/**
 * Gets business for the authenticated user (with session)
 * Convenience wrapper that includes auth check
 */
export async function getAuthenticatedBusiness() {
  const session = await getAuthSession()
  if (!session?.user?.email) {
    throw new Error('User session not found')
  }
  return await getOrCreateBusiness(session.user.email, session.user.name || null)
}
