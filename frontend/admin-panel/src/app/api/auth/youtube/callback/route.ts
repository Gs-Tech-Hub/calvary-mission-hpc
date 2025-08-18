// src/app/api/auth/youtube/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    console.log('Callback received:', { code: !!code, error })

    if (error) {
        console.error('OAuth error:', error)
        return NextResponse.redirect(new URL('/admin/sermons?error=access_denied', request.url))
    }

    if (!code) {
        console.error('No authorization code received')
        return NextResponse.redirect(new URL('/admin/sermons?error=no_code', request.url))
    }

    try {
        console.log('Exchanging code for tokens...')

        // Get environment variables
        const clientId = process.env.YOUTUBE_CLIENT_ID
        const clientSecret = process.env.YOUTUBE_CLIENT_SECRET
        const redirectUri = process.env.YOUTUBE_REDIRECT_URI

        if (!clientId || !clientSecret || !redirectUri) {
            throw new Error('YouTube configuration missing')
        }

        // Exchange authorization code for tokens
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        })

        const tokenData = await response.json()

        if (!response.ok) {
            throw new Error(`OAuth error: ${tokenData.error_description || tokenData.error}`)
        }

        console.log('Token exchange successful:', {
            hasAccessToken: !!tokenData.access_token,
            hasRefreshToken: !!tokenData.refresh_token
        })

        // Build redirect URL with token data
        const redirectUrl = new URL('/admin/sermons', request.url)
        redirectUrl.searchParams.set('access_token', tokenData.access_token)

        if (tokenData.refresh_token) {
            redirectUrl.searchParams.set('refresh_token', tokenData.refresh_token)
        }

        if (tokenData.expires_in) {
            redirectUrl.searchParams.set('expires_in', tokenData.expires_in.toString())
        }

        return NextResponse.redirect(redirectUrl)

    } catch (error: any) {
        console.error('Failed to exchange code for token:', error)
        const errorMessage = encodeURIComponent(error.message || 'Unknown error')
        return NextResponse.redirect(new URL(`/admin/sermons?error=token_exchange_failed&details=${errorMessage}`, request.url))
    }
}