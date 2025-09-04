import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const isProd = process.env.NODE_ENV === 'production'
    const cookieParts = [
      'auth-token=;',
      'Path=/',
      'HttpOnly',
      'SameSite=Strict',
      isProd ? 'Secure' : '',
      'Max-Age=0',
    ].filter(Boolean)

    const responseHeaders = new Headers()
    responseHeaders.set('Set-Cookie', cookieParts.join('; '))

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200, headers: responseHeaders }
    )
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
