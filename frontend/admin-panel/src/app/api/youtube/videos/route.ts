import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get('channelId')

    if (!channelId) {
        return NextResponse.json({ error: 'Channel ID required' }, { status: 400 })
    }

    try {
        const apiKey = process.env.YOUTUBE_API_KEY
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=50&key=${apiKey}`
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error?.message || 'YouTube API error')
        }

        const videos = data.items?.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnailUrl: item.snippet.thumbnails.medium.url,
            publishedAt: item.snippet.publishedAt
        })) || []

        return NextResponse.json(videos)
    } catch (error: any) {
        console.error('Get videos error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}