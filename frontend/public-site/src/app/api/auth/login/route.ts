import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'

function isValidE164Phone(phone: string) {
  return /^\+[1-9]\d{7,14}$/.test(phone)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = body

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone is required' },
        { status: 400 }
      )
    }

    if (!isValidE164Phone(phone)) {
      return NextResponse.json(
        { error: 'Phone must include country code in E.164 format (e.g. +2348012345678)' },
        { status: 400 }
      )
    }

    // Phone is used as both identifier and password (per registration scheme)
    const response = await fetch(`${STRAPI_URL}/api/phone-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        password: phone,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Authentication failed' },
        { status: response.status }
      )
    }

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
