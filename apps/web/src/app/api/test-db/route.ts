import { NextRequest, NextResponse } from 'next/server'
import { db, prisma } from '@/lib/database'

export async function GET() {
  try {
    // Test database connection
    const connectionTest = await db.testConnection()
    
    if (!connectionTest.success) {
      return NextResponse.json({ 
        success: false, 
        message: connectionTest.message 
      }, { status: 500 })
    }

    // Get some basic stats using direct Prisma client
    const stats = {
      users: await prisma.user.count(),
      businesses: await prisma.business.count(),
      customers: await prisma.customer.count(),
      invoices: await prisma.invoice.count()
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      stats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json({ 
      success: false, 
      message: `Database error: ${error}`,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}