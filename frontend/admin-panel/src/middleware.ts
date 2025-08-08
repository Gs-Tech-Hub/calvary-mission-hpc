import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const role = request.cookies.get('role')?.value

    // ⛔️ If logged in and trying to access /login, redirect to dashboard
    if (role && pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // 🔐 If not logged in and trying to access /dashboard, redirect to login
    if (!role && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/login', '/dashboard/:path*'],
}
