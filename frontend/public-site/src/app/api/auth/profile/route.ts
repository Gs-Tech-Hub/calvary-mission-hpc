import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      address,
      isMember,
      churchBranch,
      department,
      isChristian,
      previousChurch,
    } = body;

    // You may want to get the user from session/cookie or require userId in the body
    // For this example, assume userId and jwt are sent in headers (customize as needed)
    const userId = request.headers.get('x-user-id');
    const jwt = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!userId || !jwt) {
      return NextResponse.json({ error: 'Unauthorized: userId and jwt required' }, { status: 401 });
    }

    // 2. If member, update member record
    if (isMember) {
      const memberRes = await fetch(`${STRAPI_URL}/api/members/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            address,
            member_status: 'Active',
            department,
            joinDate: new Date().toISOString().slice(0, 10),
            churchBranch
          }
        })
      });
      if (!memberRes.ok) {
        const memberErr = await memberRes.json();
        return NextResponse.json({ error: memberErr.error?.message || 'Member update failed' }, { status: 500 });
      }
    }

    // 3. Submit onboarding
    const onboardingRes = await fetch(`${STRAPI_URL}/api/onboardings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
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
    if (!onboardingRes.ok) {
      const onboardingErr = await onboardingRes.json();
      return NextResponse.json({ error: onboardingErr.error?.message || 'Onboarding failed' }, { status: 500 });
    }
    const onboardingData = await onboardingRes.json();
    const onboardingId = onboardingData?.data?.id || null;

    return NextResponse.json({ message: 'Profile setup successful', onboardingId }, { status: 200 });
  } catch (error: any) {
    console.error('Profile setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
