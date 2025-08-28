import { NextRequest, NextResponse } from 'next/server';

// Sample member schema for reference
// {
//   id: string, // user permission id
//   joinDate: string | null,
//   member_status: string,
//   department: string,
//   birthDate: string | null,
//   maritalStatus: string,
//   church_branch: string
// }

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      id, // user permission id
      joinDate = null,
      member_status,
      department,
      birthDate = null,
      maritalStatus,
      church_branch
    } = data;

    if (!id || !member_status || !department || !maritalStatus || !church_branch) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Save member data to database or external API
    // For now, just return the received data as a mock response
    return NextResponse.json({
      message: 'Member data received',
      data: {
        id,
        joinDate,
        member_status,
        department,
        birthDate,
        maritalStatus,
        church_branch
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
