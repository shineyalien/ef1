import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Check if the test user exists
    const testUser = await prisma.user.findUnique({
      where: {
        email: 'test@test.com'
      }
    })

    // Get all users for debugging
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      testUser,
      allUsers,
      totalUsers: allUsers.length
    })
  } catch (error) {
    console.error('Error checking users:', error)
    return NextResponse.json(
      { error: 'Failed to check users' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}