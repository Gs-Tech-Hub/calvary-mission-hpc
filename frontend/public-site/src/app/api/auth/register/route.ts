import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'

function isValidE164Phone(phone: string) {
  return /^\+[1-9]\d{7,14}$/.test(phone)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, phone, address, churchBranch, department, isMember, isChristian, previousChurch } = body

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Full name, email and phone are required' },
        { status: 400 }
      )
    }

    if (!isValidE164Phone(phone)) {
      return NextResponse.json(
        { error: 'Phone must include country code in E.164 format (e.g. +2348012345678)' },
        { status: 400 }
      )
    }

    // Register with Strapi using phone as password to satisfy local auth requirements
    const registerResponse = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: fullName, email, password: phone }),
    })

    const registerData = await registerResponse.json()

    if (!registerResponse.ok) {
      return NextResponse.json(
        { error: registerData.error?.message || 'Registration failed' },
        { status: registerResponse.status }
      )
    }

    const jwt = registerData.jwt
    const userId = registerData.user?.id

    // Create onboarding record per schema
    const onboardingPayload: any = {
      data: {
        fullName,
        email,
        phone,
        address,
        isMember: !!isMember,
        churchBranch: churchBranch || null,
        isChristian: !!isChristian,
        previousChurch: previousChurch || null,
      }
    }
    if (isMember) {
      if (department) onboardingPayload.data.department = department
    }
    const onboardingRes = await fetch(`${STRAPI_URL}/api/onboardings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(onboardingPayload),
    })
    if (!onboardingRes.ok) {
      const err = await onboardingRes.json()
      return NextResponse.json({ error: err.error?.message || 'Failed to create onboarding' }, { status: onboardingRes.status })
    }

    // If member, also create member profile
    if (isMember) {
      const memberPayload = {
        data: {
          name: fullName,
          email,
          phone,
          address,
          member_status: 'Active',
          department: department || undefined,
          joinDate: new Date().toISOString().slice(0,10),
        }
      }
      const memberRes = await fetch(`${STRAPI_URL}/api/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberPayload),
      })
      if (!memberRes.ok) {
        const err = await memberRes.json()
        return NextResponse.json({ error: err.error?.message || 'Failed to create member profile' }, { status: memberRes.status })
      }
    }

    return NextResponse.json(
      { 
        user: { ...registerData.user, fullName, email, phone },
        jwt,
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
