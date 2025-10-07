import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/database'

export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    redirect('/auth/login')
  }
  return session.user
}

export async function getCurrentBusiness() {
  const session = await auth()
  if (!session?.user?.email) {
    return null
  }

  try {
    const business = await prisma.business.findFirst({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    })

    return business
  } catch (error) {
    console.error('Error fetching business:', error)
    return null
  }
}

export async function requireBusiness() {
  const business = await getCurrentBusiness()
  if (!business) {
    redirect('/dashboard')
  }
  return business
}