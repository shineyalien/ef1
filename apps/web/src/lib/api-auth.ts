/**
 * Standardized API Authentication Middleware
 * Provides consistent authentication patterns across all API routes
 */

import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

/**
 * Standard authentication check for API routes
 * Returns authenticated user or throws error
 */
export async function authenticate() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized: No valid session found')
  }
  
  return session
}

/**
 * Get authenticated user with business context
 * Ensures user has a business associated
 */
export async function getAuthenticatedUser() {
  const session = await authenticate()
  
  if (!session.user?.id) {
    throw new Error('User ID not found in session')
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      businesses: {
        take: 1
      }
    }
  })
  
  if (!user) {
    throw new Error('User not found')
  }
  
  if (user.businesses.length === 0) {
    throw new Error('No business found for user')
  }
  
  return {
    user,
    business: user.businesses[0],
    session
  }
}

/**
 * API route wrapper that handles authentication automatically
 */
export function withAuth<T extends any[]>(
  handler: (req: NextRequest, context: { user: any; business: any; session: any }, ...args: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      const { user, business, session } = await getAuthenticatedUser()
      
      return await handler(req, { user, business, session }, ...args)
    } catch (error: any) {
      console.error('Authentication error:', error)
      
      return NextResponse.json(
        { 
          error: error.message || 'Authentication failed',
          code: 'AUTH_ERROR'
        },
        { status: 401 }
      )
    }
  }
}

/**
 * Optional authentication - doesn't throw error if not authenticated
 */
export async function optionalAuth() {
  try {
    return await getAuthenticatedUser()
  } catch {
    return null
  }
}

/**
 * Role-based access control
 */
export function requireRole(allowedRoles: string[]) {
  return async (req: NextRequest, context: any) => {
    const { user } = context
    
    if (!user.subscriptionPlan || !allowedRoles.includes(user.subscriptionPlan)) {
      return NextResponse.json(
        { 
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: allowedRoles,
          current: user.subscriptionPlan
        },
        { status: 403 }
      )
    }
    
    return null // Continue to handler
  }
}

/**
 * Business-specific access control
 */
export function requireBusinessAccess(businessId?: string) {
  return async (req: NextRequest, context: any) => {
    const { business } = context
    
    if (businessId && business.id !== businessId) {
      return NextResponse.json(
        { 
          error: 'Access denied to this business',
          code: 'BUSINESS_ACCESS_DENIED'
        },
        { status: 403 }
      )
    }
    
    return null // Continue to handler
  }
}

/**
 * Rate limiting helper
 */
export function createRateLimit(maxRequests: number, windowMs: number) {
  const requests = new Map<string, { count: number; resetTime: number }>()
  
  return async (req: NextRequest, context: any) => {
    const { user } = context
    const key = user.id
    const now = Date.now()
    
    const userRequests = requests.get(key)
    
    if (!userRequests || now > userRequests.resetTime) {
      requests.set(key, { count: 1, resetTime: now + windowMs })
      return null // Continue
    }
    
    if (userRequests.count >= maxRequests) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          resetTime: userRequests.resetTime
        },
        { status: 429 }
      )
    }
    
    userRequests.count++
    return null // Continue
  }
}

/**
 * CORS helper for API routes
 */
export function handleCORS(req: NextRequest) {
  const origin = req.headers.get('origin')
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://easyfiler.com',
    // Add your production domains here
  ]
  
  if (allowedOrigins.includes(origin || '')) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin || '',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  }
  
  return null
}

/**
 * Error handling wrapper for API routes
 */
export function withErrorHandler<T extends any[]>(
  handler: (req: NextRequest, context: any, ...args: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: any, ...args: T): Promise<NextResponse> => {
    try {
      return await handler(req, context, ...args)
    } catch (error: any) {
      console.error('API Error:', error)
      
      // Don't expose internal errors in production
      const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message
      
      return NextResponse.json(
        { 
          error: message,
          code: error.code || 'INTERNAL_ERROR',
          ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
        },
        { status: error.status || 500 }
      )
    }
  }
}

/**
 * Combined middleware helper
 */
export function withMiddleware<T extends any[]>(
  ...middlewares: Array<(req: NextRequest, context: any) => Promise<NextResponse | null>>
) {
  return (handler: (req: NextRequest, context: any, ...args: T) => Promise<NextResponse>) => {
    return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
      const context: any = {}
      
      for (const middleware of middlewares) {
        const result = await middleware(req, context)
        if (result) return result
      }
      
      return await handler(req, context, ...args)
    }
  }
}