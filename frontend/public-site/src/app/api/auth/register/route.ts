import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, phone, address, churchBranch, department, isMember, isChristian, churchAttended } = body

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email and password are required' },
        { status: 400 }
      )
    }

    // Prepare user data based on onboarding flow
    const userData: any = {
      username,
      email,
      password,
      phone,
      address,
      isMember: isMember || false,
      isChristian: isChristian || false,
    }

    if (isMember) {
      userData.churchBranch = churchBranch
      userData.department = department
    }

    if (isChristian && !isMember) {
      userData.churchAttended = churchAttended
    }

    // Proxy registration request to Strapi
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Registration failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { 
        user: data.user,
        jwt: data.jwt,
        message: 'Registration successful' 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
