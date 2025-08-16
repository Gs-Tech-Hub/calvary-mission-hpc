import { NextResponse } from 'next/server'

export async function GET() {
    const clientId = process.env.YOUTUBE_CLIENT_ID
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI

    console.log(clientId, redirectUri);

    if (!clientId || !redirectUri) {
        return NextResponse.json({ error: 'YouTube configuration missing' }, { status: 500 })
    }

    const scopes = [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl'
    ].join(' ')

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scopes,
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent'
    })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
    console.log('YouTube auth URL:', authUrl)
    return NextResponse.json({ authUrl })
}
