import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'

function isValidE164Phone(phone: string) {
  return /^\+[1-9]\d{7,14}$/.test(phone)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, address, isMember } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Full name, email and phone are required' },
        { status: 400 }
      );
    }

    if (!isValidE164Phone(phone)) {
      return NextResponse.json(
        { error: 'Phone must include country code in E.164 format (e.g. +2348012345678)' },
        { status: 400 }
      );
    }

    // Ensure phone number is clean (remove any extra spaces or characters)
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!isValidE164Phone(cleanPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format after cleaning' },
        { status: 400 }
      );
    }

    // 1. Register with Strapi using phone as password
    console.log('Attempting Strapi registration:', { username: fullName, email, phone: phone.substring(0, 8) + '...' });
    const registerResponse = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: fullName, email, password: cleanPhone }),
    });

    const registerData = await registerResponse.json();
    console.log('Strapi registration response status:', registerResponse.status);
    console.log('Strapi registration response:', registerData);

    if (!registerResponse.ok) {
      console.error('Strapi registration failed:', registerData);
      return NextResponse.json(
        { error: registerData.error?.message || `Registration failed: ${registerResponse.status} ${registerResponse.statusText}` },
        { status: registerResponse.status }
      );
    }

    const jwt = registerData.jwt;
    const userId = registerData.user?.id;

    // 2. Update user profile with phone
    if (userId && jwt) {
      const userRes = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ phone: cleanPhone, address: address, member: isMember }),
      });
      if (!userRes.ok) {
        const userErr = await userRes.json();
        return NextResponse.json({ error: userErr.error?.message || 'Failed to update user phone' }, { status: 500 });
      }
    }

    return NextResponse.json(
      {
        user: {
          ...registerData.user,
          fullName,
          email,
          phone: cleanPhone
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
