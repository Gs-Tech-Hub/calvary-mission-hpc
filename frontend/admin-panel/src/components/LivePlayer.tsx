'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'  // Updated import

export default function LivePlayer() {
    const [liveStream, setLiveStream] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadLiveStream()
        // Poll for updates every 30 seconds
        const interval = setInterval(loadLiveStream, 30000)
        return () => clearInterval(interval)
    }, [])

    async function loadLiveStream() {
        try {
            const stream = await api.getLiveStream()  // Updated call
            setLiveStream(stream)
        } catch (error) {
            console.error('Failed to load live stream:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="w-full aspect-video bg-gray-200 animate-pulse rounded"></div>
    }

    if (!liveStream?.isLive || !liveStream?.broadcastId) {  // Updated check
        return (
            <div className="w-full aspect-video bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">No live stream active</p>
            </div>
        )
    }

    // Use the broadcast ID directly for the YouTube embed
    const src = `https://www.youtube.com/embed/${liveStream.broadcastId}?autoplay=1`

    return (
        <div className="w-full rounded overflow-hidden bg-black">
            <div className="aspect-video">
                <iframe
                    src={src}
                    title="Live Stream"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    )
}