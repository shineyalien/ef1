import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Test database connection by counting users
    const userCount = await prisma.user.count()
    
    // Get all users (without passwords for security)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      userCount,
      users
    })
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
