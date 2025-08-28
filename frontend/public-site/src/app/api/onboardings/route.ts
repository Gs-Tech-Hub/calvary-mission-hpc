import { NextRequest, NextResponse } from 'next/server';

// Sample onboarding schema for reference
// {
//   fullName: string,
//   email: string,
//   phone: string,
//   address: string,
//   isChristian: boolean,
//   previousChurch?: string | null,
//   notes?: string | null,
//   followUpNeeded: boolean
// }

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Validate required fields
    const {
      fullName,
      email,
      phone,
      address,
      isChristian,
      previousChurch = null,
      notes = null,
      followUpNeeded
    } = data;

    if (!fullName || !email || !phone || !address || typeof isChristian !== 'boolean' || typeof followUpNeeded !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Save onboarding data to database or external API
    // For now, just return the received data as a mock response
    return NextResponse.json({
      message: 'Onboarding data received',
      data: {
        fullName,
        email,
        phone,
        address,
        isChristian,
        previousChurch,
        notes,
        followUpNeeded
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
