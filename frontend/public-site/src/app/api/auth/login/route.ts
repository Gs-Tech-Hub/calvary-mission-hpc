import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, password } = body

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      )
    }

    // Proxy login request to Strapi
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Authentication failed' },
        { status: response.status }
      )
    }

    // Set authentication cookie
    const responseHeaders = new Headers()
    responseHeaders.set('Set-Cookie', `auth-token=${data.jwt}; Path=/; HttpOnly; SameSite=Strict`)

    return NextResponse.json(
      { 
        user: data.user,
        jwt: data.jwt,
        message: 'Login successful' 
      },
      { 
        status: 200,
        headers: responseHeaders
      }
    )
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
