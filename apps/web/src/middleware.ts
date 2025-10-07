import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl
  const isAuth = !!req.auth

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/products',
    '/invoices',
    '/customers',
    '/settings',
  ]

  // Protected API routes
  const protectedApiRoutes = [
    '/api/products',
    '/api/invoices',
    '/api/customers',
  ]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check if the current path is a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // If user is not authenticated and trying to access protected route
  if (!isAuth && (isProtectedRoute || isProtectedApiRoute)) {
    if (isProtectedApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuth && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Allow the request to continue
  return NextResponse.next()
})

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - api/test (Test routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|api/test|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}