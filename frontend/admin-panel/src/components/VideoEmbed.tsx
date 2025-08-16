'use client'

import React from 'react'

export default function VideoEmbed({ videoId }: { videoId: string }) {
    if (!videoId) return null
    const src = `https://www.youtube.com/embed/${videoId}`
    return (
        <div className="w-full rounded overflow-hidden bg-black">
            <div className="aspect-video">
                <iframe
                    src={src}
                    title="Sermon Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    )
}
