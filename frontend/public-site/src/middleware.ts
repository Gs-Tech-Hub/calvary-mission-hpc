import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get auth token from cookie
  const authToken = request.cookies.get('auth-token')

  // Get the current path
  const path = request.nextUrl.pathname

  // Public routes that should redirect to dashboard if logged in
  const publicRoutes = ['/', '/about', '/contact']
  
  // Routes that require authentication
  const protectedRoutes = ['/dashboard']

  // If user is logged in and trying to access public routes, redirect to dashboard
  if (authToken && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not logged in and trying to access protected routes, redirect to login
  if (!authToken && protectedRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Specify which routes should be handled by middleware
  matcher: ['/', '/about', '/contact', '/dashboard/:path*']
}
