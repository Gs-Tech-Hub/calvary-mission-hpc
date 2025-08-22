import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { firstName, lastName, email, phone, amount, donationType, message, anonymous, status } = body;
    
    if (!firstName || !lastName || !email || !phone || !amount || !donationType || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create donation record in Strapi
    const donationData = {
      data: {
        firstName,
        lastName,
        email,
        phone,
        amount: parseFloat(amount),
        donationType,
        message: message || '',
        anonymous: anonymous || false,
        status,
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    const response = await fetch(`${STRAPI_URL}/api/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify(donationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Strapi error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create donation record' },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      donation: result.data,
      message: 'Donation record created successfully'
    });

  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const status = searchParams.get('status');
    const donationType = searchParams.get('donationType');

    let query = `pagination[page]=${page}&pagination[pageSize]=${limit}&sort=createdAt:desc`;
    
    if (status) {
      query += `&filters[status][$eq]=${status}`;
    }
    
    if (donationType) {
      query += `&filters[donationType][$eq]=${donationType}`;
    }

    const response = await fetch(`${STRAPI_URL}/api/donations?${query}`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch donations');
    }

    const result = await response.json();
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
