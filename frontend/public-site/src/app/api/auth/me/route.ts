import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookie
    const cookieHeader = request.headers.get('cookie')
    const authToken = cookieHeader?.split('auth-token=')[1]?.split(';')[0]

    if (!authToken) {
      return NextResponse.json(
        { error: 'No authentication token' },
        { status: 401 }
      )
    }

    // Verify token with Strapi
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const user = await response.json()
    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('User verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
