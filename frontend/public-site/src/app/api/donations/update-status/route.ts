import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { transactionId, status, flutterwaveRef } = body;
    
    if (!transactionId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the donation by transactionId and update its status
    const response = await fetch(`${STRAPI_URL}/api/donations?filters[transactionId][$eq]=${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to find donation');
    }

    const result = await response.json();
    
    if (!result.data || result.data.length === 0) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    const donationId = result.data[0].id;

    // Update the donation status
    const updateData = {
      data: {
        status,
        flutterwaveRef: flutterwaveRef || null,
        paymentCompletedAt: status === 'completed' ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      }
    };

    const updateResponse = await fetch(`${STRAPI_URL}/api/donations/${donationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('Strapi update error:', errorData);
      return NextResponse.json(
        { error: 'Failed to update donation status' },
        { status: 500 }
      );
    }

    const updateResult = await updateResponse.json();
    
    return NextResponse.json({
      success: true,
      donation: updateResult.data,
      message: 'Donation status updated successfully'
    });

  } catch (error) {
    console.error('Error updating donation status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
