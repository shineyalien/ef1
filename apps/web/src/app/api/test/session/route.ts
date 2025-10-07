import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getCurrentBusiness } from '@/lib/session'

// GET /api/test/session - Test session and business lookup
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing session and business lookup...')
    
    // Test session
    const user = await getCurrentUser()
    console.log('User from session:', user ? user.email : 'None')
    
    if (!user) {
      return NextResponse.json({ 
        error: 'No authenticated user',
        authenticated: false 
      }, { status: 401 })
    }

    // Test business lookup
    const business = await getCurrentBusiness()
    console.log('Business from database:', business ? business.companyName : 'None')
    
    return NextResponse.json({
      authenticated: true,
      user: {
        email: user.email,
        name: user.name,
      },
      business: business ? {
        id: business.id,
        companyName: business.companyName,
        ntnNumber: business.ntnNumber,
      } : null,
      message: 'Session and business lookup successful'
    })

  } catch (error) {
    console.error('❌ Session test error:', error)
    return NextResponse.json({
      error: 'Session test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}