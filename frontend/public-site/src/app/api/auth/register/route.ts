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
    
    // Ensure phone number is clean (remove any extra spaces or characters)
    const cleanPhone = phone.trim().replace(/\s+/g, '')
    if (!isValidE164Phone(cleanPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format after cleaning' },
        { status: 400 }
      )
    }

    // Register with Strapi using phone as password to satisfy local auth requirements
    console.log('Attempting Strapi registration:', { username: fullName, email, phone: phone.substring(0, 8) + '...' })
    const registerResponse = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: fullName, email, password: cleanPhone }),
    })

    const registerData = await registerResponse.json()
    console.log('Strapi registration response status:', registerResponse.status)
    console.log('Strapi registration response:', registerData)

    if (!registerResponse.ok) {
      console.error('Strapi registration failed:', registerData)
      return NextResponse.json(
        { error: registerData.error?.message || `Registration failed: ${registerResponse.status} ${registerResponse.statusText}` },
        { status: registerResponse.status }
      )
    }

    const jwt = registerData.jwt
    const userId = registerData.user?.id

    // Step 1: Submit onboarding
    let onboardingId = null;
    try {
      const onboardingRes = await fetch(`${STRAPI_URL}/api/onboardings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            fullName,
            email,
            phone: cleanPhone,
            address,
            isMember,
            churchBranch,
            department,
            isChristian,
            previousChurch,
            notes: '',
            followUpNeeded: true
          }
        })
      });
      const onboardingData = await onboardingRes.json();
      onboardingId = onboardingData?.data?.id || null;
    } catch (err) {
      console.warn('Onboarding submission failed:', err);
    }

    // Step 2: If member, update member record
    if (isMember && userId && jwt) {
      try {
        await fetch(`${STRAPI_URL}/api/members/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              name: fullName,
              email,
              phone: cleanPhone,
              address,
              member_status: 'Active',
              department,
              joinDate: new Date().toISOString().slice(0, 10),
              churchBranch
            }
          })
        });
      } catch (err) {
        console.warn('Member update failed:', err);
      }
    }

    // Step 3: Update user profile with internalizedPhone
    if (userId && jwt) {
      try {
        await fetch(`${STRAPI_URL}/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ internalizedPhone: cleanPhone })
        });
      } catch (err) {
        console.warn('Failed to update user internalizedPhone:', err);
      }
    }

    return NextResponse.json(
      {
        user: {
          ...registerData.user,
          fullName,
          email,
          phone: cleanPhone,
          address,
          isMember: !!isMember,
          isChristian: !!isChristian,
          previousChurch: previousChurch || null,
          churchBranch: churchBranch || null,
          department: department || null,
          onboardingId
        },
        jwt,
        message: 'Registration successful'
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
