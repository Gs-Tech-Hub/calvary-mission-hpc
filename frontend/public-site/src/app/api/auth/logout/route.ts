import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Clear authentication cookie
    const responseHeaders = new Headers()
    responseHeaders.set('Set-Cookie', 'auth-token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0')

    return NextResponse.json(
      { message: 'Logout successful' },
      { 
        status: 200,
        headers: responseHeaders
      }
    )
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
