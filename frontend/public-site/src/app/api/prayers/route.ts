import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { data } = body;
    const { name, request: prayerRequest, email, phone } = data;
    
    if (!name || !prayerRequest || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, prayer request, email and phone are required' },
        { status: 400 }
      );
    }

    // Create prayer request in Strapi
    const response = await fetch(`${STRAPI_URL}/api/prayers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          name,
          email: email || undefined,
          phone: phone || undefined,
          request: prayerRequest,
          status: 'new',
          createdAt: new Date().toISOString(),
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Strapi error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create prayer request' },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      prayer: result.data,
      message: 'Prayer request submitted successfully'
    });

  } catch (error) {
    console.error('Error creating prayer request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
