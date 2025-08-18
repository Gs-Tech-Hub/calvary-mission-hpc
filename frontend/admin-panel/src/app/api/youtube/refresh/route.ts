// app/api/youtube/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { refreshToken } = await request.json()

        if (!refreshToken) {
            return NextResponse.json({ error: 'Refresh token required' }, { status: 400 })
        }

        const clientId = process.env.YOUTUBE_CLIENT_ID
        const clientSecret = process.env.YOUTUBE_CLIENT_SECRET

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: 'YouTube configuration missing' }, { status: 500 })
        }

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            })
        })

        if (!response.ok) {
            const error = await response.json()
            console.error('Token refresh failed:', error)
            return NextResponse.json({ error: 'Failed to refresh token' }, { status: 400 })
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (error) {
        console.error('Refresh token error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}