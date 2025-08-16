import { NextRequest, NextResponse } from 'next/server'
import { api, YouTubeLiveStream } from '@/lib/api'

export async function POST(request: NextRequest) {
    try {
        const { action, accessToken, title, broadcastId } = await request.json()

        if (!accessToken) {
            return NextResponse.json({ error: 'Access token required' }, { status: 400 })
        }

        switch (action) {
            case 'create':
                return await createLiveStream(accessToken, title)

            case 'start':
                return await startLiveStream(accessToken, broadcastId)

            case 'stop':
                return await stopLiveStream(accessToken, broadcastId)

            case 'status':
                return await getStreamStatus(accessToken, broadcastId)

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }
    } catch (error: any) {
        console.error('YouTube API error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

async function createLiveStream(accessToken: string, title: string) {
    try {
        // Create broadcast first
        const broadcastResponse = await fetch(
            'https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id,snippet,status,contentDetails',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    snippet: {
                        title,
                        description: 'Live stream from church admin panel',
                        scheduledStartTime: new Date(Date.now() + 30000).toISOString()
                    },
                    status: {
                        privacyStatus: 'public',
                        selfDeclaredMadeForKids: false
                    },
                    contentDetails: {
                        enableAutoStart: false,
                        enableAutoStop: false,
                        enableDvr: true,
                        enableContentEncryption: false,
                        enableEmbed: true,
                        recordFromStart: true,
                        enableClosedCaptions: false,
                        closedCaptionsType: 'closedCaptionsDisabled'
                    }
                })
            }
        )

        const broadcastData = await broadcastResponse.json()
        if (!broadcastResponse.ok) {
            throw new Error(`Broadcast creation error: ${JSON.stringify(broadcastData)}`)
        }

        // Create stream
        const streamResponse = await fetch(
            'https://www.googleapis.com/youtube/v3/liveStreams?part=id,snippet,cdn,status',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    snippet: {
                        title: `${title} - Stream`
                    },
                    cdn: {
                        resolution: '1080p',
                        ingestionType: 'rtmp',
                        frameRate: '60fps'
                    }
                })
            }
        )

        const streamData = await streamResponse.json()
        if (!streamResponse.ok) {
            throw new Error(`Stream creation error: ${JSON.stringify(streamData)}`)
        }

        // Bind broadcast to stream
        const bindResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/liveBroadcasts/bind?part=id,contentDetails&id=${broadcastData.id}&streamId=${streamData.id}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )

        if (!bindResponse.ok) {
            const bindError = await bindResponse.json()
            throw new Error(`Bind error: ${JSON.stringify(bindError)}`)
        }

        const result = {
            id: broadcastData.id,
            title: broadcastData.snippet.title,
            streamUrl: streamData.cdn.ingestionInfo.ingestionAddress,
            streamKey: streamData.cdn.ingestionInfo.streamName,
            watchUrl: `https://www.youtube.com/watch?v=${broadcastData.id}`,
            status: 'ready',
            streamId: streamData.id
        }

        return NextResponse.json(result)
    } catch (error: any) {
        throw new Error(`Create live stream failed: ${error.message}`)
    }
}

async function startLiveStream(accessToken: string, broadcastId: string) {
    try {
        // Check current status first
        const currentStatus = await api.getStreamStatus(broadcastId)
        const currentLifeCycle = currentStatus.lifeCycleStatus

        if (currentLifeCycle === 'ready') {
            // If ready, transition to testing first
            const testResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/liveBroadcasts/transition?broadcastStatus=testing&id=${broadcastId}&part=status`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            )

            if (!testResponse.ok) {
                const testError = await testResponse.json()
                throw new Error(`Testing transition error: ${JSON.stringify(testError)}`)
            }

            // Wait a moment
            await new Promise(resolve => setTimeout(resolve, 2000))
        }

        // Now transition to live (whether we were in ready or testing)
        const liveResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/liveBroadcasts/transition?broadcastStatus=live&id=${broadcastId}&part=status`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )

        if (!liveResponse.ok) {
            const liveError = await liveResponse.json()
            throw new Error(`Live transition error: ${JSON.stringify(liveError)}`)
        }

        return NextResponse.json({
            success: true,
            status: 'live',
            lifeCycleStatus: 'live'
        })
    } catch (error: any) {
        throw new Error(`Start live stream failed: ${error.message}`)
    }
}

async function stopLiveStream(accessToken: string, broadcastId: string) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/liveBroadcasts/transition?broadcastStatus=complete&id=${broadcastId}&part=status`,
            {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`Stop stream error: ${JSON.stringify(errorData)}`)
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        throw new Error(`Stop live stream failed: ${error.message}`)
    }
}

// async function getStreamStatus(accessToken: string, broadcastId: string) {
//     try {
//         // Get both broadcast and stream info
//         const [broadcastResponse, streamResponse] = await Promise.all([
//             fetch(
//                 `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id,status,contentDetails&id=${broadcastId}`,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${accessToken}`
//                     }
//                 }
//             ),
//             fetch(
//                 `https://www.googleapis.com/youtube/v3/liveStreams?part=id,status&mine=true`,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${accessToken}`
//                     }
//                 }
//             )
//         ])

//         const [broadcastData, streamData] = await Promise.all([
//             broadcastResponse.json(),
//             streamResponse.json()
//         ])

//         const broadcast = broadcastData.items?.[0]
//         const stream = streamData.items?.[0] // Get the latest stream

//         console.log('Broadcast data:', broadcast)
//         console.log('Stream data:', stream)

//         const result = {
//             broadcastStatus: broadcast?.status?.lifeCycleStatus || 'unknown',
//             streamStatus: stream?.status?.streamStatus || 'unknown',
//             healthStatus: stream?.status?.healthStatus?.status || 'unknown',
//             recordingStatus: broadcast?.status?.recordingStatus || 'unknown',
//             lifeCycleStatus: broadcast?.status?.lifeCycleStatus || 'unknown'
//         }

//         return NextResponse.json(result)
//     } catch (error: any) {
//         return NextResponse.json({
//             broadcastStatus: 'error',
//             streamStatus: 'error',
//             healthStatus: 'error',
//             recordingStatus: 'error',
//             lifeCycleStatus: 'error'
//         })
//     }
// }