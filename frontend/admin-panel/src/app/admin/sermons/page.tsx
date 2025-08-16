'use client'

import React, { useState, useEffect } from 'react'
import LivePlayer from '@/components/LivePlayer'
import VideoEmbed from '@/components/VideoEmbed'
import { extractYouTubeId } from '@/lib/youtube'
import { api, YouTubeLiveStream } from '@/lib/api'  // Updated import
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { YouTubeAuthManager } from '@/lib/youtube-auth'

type Sermon = {
    id: number
    documentId: string
    title: string
    speaker?: string
    date?: string
    youtubeId: string
    description?: string
    broadcastId?: string
}

export default function SermonsPage() {
    const [sermons, setSermons] = useState<Sermon[]>([])
    const [liveStream, setLiveStream] = useState<any>(null)
    const [isCreatingStream, setIsCreatingStream] = useState(false)
    const [isStartingStream, setIsStartingStream] = useState(false)
    const [streamCredentials, setStreamCredentials] = useState<YouTubeLiveStream | null>(null)
    const [streamStatus, setStreamStatus] = useState<any>(null)

    // form
    const [title, setTitle] = useState('')
    const [speaker, setSpeaker] = useState('')
    const [date, setDate] = useState('')
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [selected, setSelected] = useState<Sermon | null>(null)

    // Live streaming
    const [streamTitle, setStreamTitle] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Grab token from query params if present
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const tokenFromUrl = params.get('access_token')
            const refreshToken = params.get('refresh_token')
            const expiresIn = params.get('expires_in')

            if (tokenFromUrl) {
                YouTubeAuthManager.setTokens(
                    tokenFromUrl,
                    refreshToken || undefined,
                    expiresIn ? parseInt(expiresIn) : undefined
                )

                // Remove tokens from URL
                params.delete('access_token')
                params.delete('refresh_token')
                params.delete('expires_in')
                const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
                window.history.replaceState({}, '', newUrl)

                setIsAuthenticated(true)
            } else {
                checkYouTubeAuth()
            }
        }
    }, [])



    useEffect(() => {
        loadSermons()
        loadLiveStream()
        checkYouTubeAuth()
    }, [])

    // Poll stream status when we have an active broadcast
    useEffect(() => {
        if (streamCredentials && isAuthenticated) {
            // Check status immediately
            checkStreamStatus()

            const interval = setInterval(checkStreamStatus, 5000) // Check every 5 seconds
            return () => clearInterval(interval)
        }
    }, [streamCredentials, isAuthenticated])

    async function checkStreamStatus() {
        if (!streamCredentials) return

        try {
            const accessToken = localStorage.getItem('youtube_access_token')
            if (!accessToken) return

            const status = await api.getStreamStatus(streamCredentials.id)  // Updated call
            setStreamStatus(status)
            // console.log('Stream status update:', status)
        } catch (error) {
            console.error('Failed to get stream status:', error)
        }
    }

    async function loadSermons() {
        try {
            const data = await api.getSermons()  // Updated call
            setSermons(data)
        } catch (error) {
            console.error('Failed to load sermons:', error)
        }
    }

    async function loadLiveStream() {
        try {
            const data = await api.getLiveStream()  // Updated call
            setLiveStream(data)

            // If we have stream credentials stored, restore them
            if (data?.broadcastId) {
                setStreamCredentials({
                    id: data.broadcastId,
                    title: data.title || '',
                    streamUrl: data.streamUrl || '',
                    streamKey: data.streamKey || '',
                    watchUrl: data.watchUrl || '',
                    status: data.isLive ? 'live' : 'ready',
                    streamId: data.streamId || ''
                })
            }
        } catch (error) {
            console.error('Failed to load live stream:', error)
        }
    }

    function checkYouTubeAuth() {
        if (typeof window !== 'undefined') {
            const token = YouTubeAuthManager.getAccessToken()
            setIsAuthenticated(!!token)
        }
    }

    async function handleYouTubeAuth() {
        try {
            const authUrl = await api.getAuthUrl()  // Updated call
            window.open(authUrl, '_blank')
        } catch (error) {
            console.error('Failed to get auth URL:', error)
            setError('Failed to initiate YouTube authentication')
        }
    }

    async function createLiveStream() {
        if (!streamTitle.trim()) {
            setError('Please enter a stream title')
            return
        }

        setIsCreatingStream(true)
        setError(null)

        try {
            const accessToken = localStorage.getItem('youtube_access_token')
            if (!accessToken) {
                throw new Error('Please authenticate with YouTube first')
            }

            const stream = await api.createLiveStream(streamTitle)  // Updated call
            setStreamCredentials(stream)

            // Update Strapi with stream info
            await api.updateLiveStream({  // Updated call
                streamUrl: stream.streamUrl,
                streamKey: stream.streamKey,
                streamId: stream.streamId,
                broadcastId: stream.id,
                watchUrl: stream.watchUrl,
                isLive: false,
                title: streamTitle,
                startedAt: new Date().toISOString()
            })

            setStreamTitle('')
            loadLiveStream()
        } catch (error: any) {
            console.error('Failed to create live stream:', error)
            setError(error.message || 'Failed to create live stream. Please try again.')
        } finally {
            setIsCreatingStream(false)
        }
    }

    async function startLiveStream() {
        if (!streamCredentials) return

        setIsStartingStream(true)
        setError(null)

        try {
            const accessToken = localStorage.getItem('youtube_access_token')
            if (!accessToken) {
                throw new Error('Please authenticate with YouTube first')
            }

            // Call the API to start the stream
            await api.startLiveStream(streamCredentials.id)

            // Update Strapi to mark as live
            await api.updateLiveStream({ isLive: true })

            // Wait a moment then check status to confirm the transition
            setTimeout(async () => {
                await checkStreamStatus()
            }, 2000)

            loadLiveStream()

        } catch (error: any) {
            console.error('Failed to start live stream:', error)
            setError(error.message || 'Failed to start live stream. Make sure your streaming software is connected and broadcasting.')
        } finally {
            setIsStartingStream(false)
        }
    }

    async function stopLiveStream() {
        if (!streamCredentials) return

        try {
            const accessToken = await YouTubeAuthManager.getValidAccessToken()
            if (!accessToken) return

            await api.stopLiveStream(streamCredentials.id)
            await api.updateLiveStream({ isLive: false })


            // Auto-archive as sermon with the broadcast ID as YouTube video ID
            await api.createSermon({
                title: streamCredentials.title,
                youtubeId: streamCredentials.id, // This becomes the YouTube video ID
                // broadcastId: streamCredentials.id,
                date: new Date().toISOString().split('T')[0],
                description: 'Auto-archived from live stream'
            })

            setStreamCredentials(null)
            setStreamStatus(null)
            loadLiveStream()
            loadSermons()
            console.log("all done")
            await api.deleteLiveStream()  // Updated call

            // Show success message
            alert('Live stream ended and automatically saved to sermon library!')

        } catch (error) {
            console.error('Failed to stop live stream:', error)
            setError('Failed to stop live stream. Please try again.')
        }
    }

    async function handleAddSermon() {
        const id = extractYouTubeId(youtubeUrl)
        if (!id) {
            setError('Invalid YouTube URL or ID')
            return
        }

        try {
            await api.createSermon({  // Updated call
                title: title || 'Untitled',
                speaker,
                date,
                youtubeId: id
            })

            setTitle('')
            setSpeaker('')
            setDate('')
            setYoutubeUrl('')
            setError(null)
            loadSermons()
        } catch (error) {
            console.error('Failed to add sermon:', error)
            setError('Failed to add sermon. Please try again.')
        }
    }

    // Helper function to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
            case 'live':
            case 'good':
                return 'bg-green-100 text-green-700'
            case 'ready':
            case 'testing':
            case 'ok':
                return 'bg-yellow-100 text-yellow-700'
            case 'inactive':
            case 'error':
            case 'bad':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Sermons & Live Streaming</h1>

            {/* Error Display */}
            {error && (
                <Card className="p-4 bg-red-50 border-red-200">
                    <p className="text-red-700">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setError(null)}
                        className="mt-2"
                    >
                        Dismiss
                    </Button>
                </Card>
            )}

            {/* YouTube Authentication */}
            {!isAuthenticated && (
                <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <h3 className="font-semibold text-yellow-800">YouTube Authentication Required</h3>
                    <p className="text-sm text-yellow-700 mb-3">
                        Connect your YouTube account to create and manage live streams
                    </p>
                    <Button onClick={handleYouTubeAuth}>Connect YouTube</Button>
                </Card>
            )}

            {/* Live Streaming Section */}
            <Card className="p-6">
                <h2 className="font-semibold mb-4">Live Streaming Control</h2>

                {!streamCredentials ? (
                    <div className="space-y-3">
                        <Input
                            placeholder="Stream Title"
                            value={streamTitle}
                            onChange={(e) => setStreamTitle(e.target.value)}
                            disabled={!isAuthenticated}
                        />
                        <Button
                            onClick={createLiveStream}
                            disabled={!isAuthenticated || isCreatingStream}
                        >
                            {isCreatingStream ? 'Creating Stream...' : 'Create Live Broadcast'}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded">
                            <h4 className="font-semibold mb-2">Current Broadcast: {streamCredentials.title}</h4>

                            {/* Detailed Stream Status */}
                            {streamStatus && (
                                <div className="mb-3 p-3 bg-white rounded border">
                                    <h5 className="font-medium mb-2 text-sm">Stream Status</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                        <div>
                                            <span className="block text-gray-600">Broadcast:</span>
                                            <span className={`inline-block px-2 py-1 rounded ${getStatusColor(streamStatus.lifeCycleStatus)}`}>
                                                {streamStatus.lifeCycleStatus || 'unknown'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-600">Stream:</span>
                                            <span className={`inline-block px-2 py-1 rounded ${getStatusColor(streamStatus.streamStatus)}`}>
                                                {streamStatus.streamStatus || 'unknown'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-600">Health:</span>
                                            <span className={`inline-block px-2 py-1 rounded ${getStatusColor(streamStatus.healthStatus)}`}>
                                                {streamStatus.healthStatus || 'unknown'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-600">Recording:</span>
                                            <span className={`inline-block px-2 py-1 rounded ${getStatusColor(streamStatus.recordingStatus)}`}>
                                                {streamStatus.recordingStatus || 'unknown'}
                                            </span>
                                        </div>
                                    </div>

                                    {streamStatus.lifeCycleStatus === 'ready' && (
                                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                            <p className="text-yellow-800 text-xs">
                                                ⚠️ Stream is ready. Start your streaming software (OBS, etc.) and begin broadcasting.
                                            </p>
                                        </div>
                                    )}

                                    {streamStatus.lifeCycleStatus === 'testing' && (
                                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                            <p className="text-blue-800 text-xs">
                                                🎬 Stream detected! Go to YouTube Studio and click "GO LIVE" to start broadcasting, or click the button below to go live automatically.
                                            </p>
                                        </div>
                                    )}

                                    {streamStatus.lifeCycleStatus === 'live' && (
                                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                                            <p className="text-green-800 text-xs">
                                                ✅ You are now LIVE! Stream is broadcasting to YouTube.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2 text-sm">
                                <div>
                                    <strong>Stream URL (Server):</strong>
                                    <code className="block mt-1 p-2 bg-white rounded text-xs break-all">{streamCredentials.streamUrl}</code>
                                </div>
                                <div>
                                    <strong>Stream Key:</strong>
                                    <code className="block mt-1 p-2 bg-white rounded text-xs break-all">{streamCredentials.streamKey}</code>
                                </div>
                                <div>
                                    <strong>Watch URL:</strong>
                                    <a href={streamCredentials.watchUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                                        {streamCredentials.watchUrl}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Streaming Software Instructions */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Setup Instructions:</h4>

                            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                                <h5 className="font-medium text-blue-800 mb-2">Step-by-Step Process:</h5>
                                <ol className="text-sm text-blue-700 space-y-1">
                                    <li>1. Copy the Stream URL and Stream Key above</li>
                                    <li>2. Configure your streaming software (OBS, Streamlabs, etc.)</li>
                                    <li>3. Start streaming in your software</li>
                                    <li>4. Wait for "Stream: active" status above</li>
                                    <li>5. Click "Start Live Broadcast" below</li>
                                </ol>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div className="p-3 border rounded">
                                    <strong>OBS Studio:</strong>
                                    <ol className="mt-2 space-y-1 text-xs">
                                        <li>• Settings → Stream</li>
                                        <li>• Service: YouTube - RTMP</li>
                                        <li>• Server: [Stream URL]</li>
                                        <li>• Stream Key: [Stream Key]</li>
                                        <li>• Click "Start Streaming"</li>
                                    </ol>
                                </div>
                                <div className="p-3 border rounded">
                                    <strong>Streamlabs:</strong>
                                    <ol className="mt-2 space-y-1 text-xs">
                                        <li>• Settings → Stream</li>
                                        <li>• Platform: Custom RTMP</li>
                                        <li>• URL: [Stream URL]</li>
                                        <li>• Stream Key: [Stream Key]</li>
                                        <li>• Start stream</li>
                                    </ol>
                                </div>
                                <div className="p-3 border rounded">
                                    <strong>XSplit:</strong>
                                    <ol className="mt-2 space-y-1 text-xs">
                                        <li>• Outputs → Add</li>
                                        <li>• Custom RTMP</li>
                                        <li>• RTMP URL: [Stream URL]</li>
                                        <li>• Stream Key: [Stream Key]</li>
                                        <li>• Start broadcasting</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            <Button
                                onClick={startLiveStream}
                                disabled={
                                    streamStatus?.lifeCycleStatus === 'live' ||
                                    isStartingStream ||
                                    !streamStatus ||
                                    (streamStatus.lifeCycleStatus === 'ready' && streamStatus.streamStatus === 'unknown')
                                }
                                className={streamStatus?.lifeCycleStatus === 'live' ? 'bg-red-500' : ''}
                            >
                                {isStartingStream ? 'Starting Broadcast...' :
                                    streamStatus?.lifeCycleStatus === 'live' ? '🔴 LIVE' :
                                        !streamStatus ? 'Checking Status...' :
                                            streamStatus.lifeCycleStatus === 'ready' && streamStatus.streamStatus === 'unknown' ? 'Start streaming software first' :
                                                streamStatus.lifeCycleStatus === 'testing' ? 'Go Live on YouTube' :
                                                    'Start Live Broadcast'}
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={stopLiveStream}
                                disabled={streamStatus?.lifeCycleStatus !== 'live'}
                            >
                                Stop & Archive Stream
                            </Button>

                            <Button
                                variant="outline"
                                onClick={async () => {
                                    if (confirm('Cancel this broadcast? This will delete the stream setup and remove all data.')) {
                                        try {
                                            // Delete the broadcast on YouTube if we have credentials
                                            const accessToken = localStorage.getItem('youtube_access_token')
                                            if (accessToken && streamCredentials) {
                                                try {
                                                    await fetch(
                                                        `https://www.googleapis.com/youtube/v3/liveBroadcasts?id=${streamCredentials.id}`,
                                                        {
                                                            method: 'DELETE',
                                                            headers: {
                                                                'Authorization': `Bearer ${accessToken}`
                                                            }
                                                        }
                                                    )
                                                    console.log('YouTube broadcast deleted')
                                                } catch (youtubeError) {
                                                    console.warn('Could not delete YouTube broadcast:', youtubeError)
                                                    // Continue with local cleanup even if YouTube deletion fails
                                                }
                                            }

                                            // Delete the entire live stream record from Strapi
                                            await api.deleteLiveStream()

                                            // Clean up local state
                                            setStreamCredentials(null)
                                            setStreamStatus(null)

                                            // Reload to confirm deletion
                                            loadLiveStream()

                                            console.log('Broadcast cancelled and deleted successfully')
                                        } catch (error) {
                                            console.error('Failed to cancel and delete broadcast:', error)
                                            setError('Failed to delete broadcast. Please try again.')
                                        }
                                    }
                                }}
                            >
                                Cancel & Delete Broadcast
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={checkStreamStatus}
                                disabled={!streamCredentials}
                            >
                                Refresh Status
                            </Button>
                        </div>

                        {/* Debug Info */}
                        {streamStatus && (
                            <details className="text-xs text-gray-500">
                                <summary className="cursor-pointer">Debug Info</summary>
                                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                                    {JSON.stringify(streamStatus, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                )}
            </Card>

            {/* Current Live Stream Display */}
            <Card className="p-4">
                <h2 className="font-semibold mb-2">Current Live Stream</h2>
                {liveStream?.isLive ? (
                    <div>
                        <LivePlayer />
                        <div className="mt-2 p-2 bg-red-100 rounded">
                            <span className="text-red-600 font-semibold">🔴 LIVE</span>
                            <span className="ml-2">{liveStream.title}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No live stream currently active</p>
                        <p className="text-sm">Create a broadcast above to get started</p>
                    </div>
                )}
            </Card>

            {/* Add Past Sermon Section */}
            <Card className="p-4 space-y-3">
                <h2 className="font-semibold">Add Past Sermon (YouTube)</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Input placeholder="Speaker" value={speaker} onChange={(e) => setSpeaker(e.target.value)} />
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    <Input placeholder="YouTube URL or ID" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
                </div>
                <div className="flex gap-2 mt-2">
                    <Button onClick={handleAddSermon}>Save Sermon</Button>
                </div>
            </Card>

            {/* Sermons List and Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-4 lg:col-span-2">
                    <h3 className="font-semibold mb-2">Sermon Library ({sermons.length})</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="py-2 pr-4">Title</th>
                                    <th className="py-2 pr-4">Speaker</th>
                                    <th className="py-2 pr-4">Date</th>
                                    <th className="py-2 pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sermons.map(s => (
                                    <tr key={s.id} className="border-b">
                                        <td className="py-2 pr-4">{s.title}</td>
                                        <td className="py-2 pr-4">{s.speaker || '-'}</td>
                                        <td className="py-2 pr-4">{s.date || '-'}</td>
                                        <td className="py-2 pr-4">
                                            <div className="flex gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setSelected(s)}
                                                >
                                                    Preview
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={async () => {
                                                        if (confirm('Delete this sermon?')) {
                                                            await api.deleteSermon(s.documentId)  // Updated call
                                                            loadSermons()
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {sermons.length === 0 && (
                                    <tr><td className="py-8 text-center text-gray-500" colSpan={4}>
                                        No sermons yet. Add some sermons or create a live stream!
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card className="p-4">
                    <h3 className="font-semibold mb-2">Preview</h3>
                    {selected ? (
                        <div>
                            <VideoEmbed videoId={selected.youtubeId} />
                            <div className="mt-3 space-y-1">
                                <h4 className="font-medium">{selected.title}</h4>
                                {selected.speaker && (
                                    <p className="text-sm text-gray-600">Speaker: {selected.speaker}</p>
                                )}
                                {selected.date && (
                                    <p className="text-sm text-gray-600">Date: {selected.date}</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 text-center py-8">
                            Select a sermon to preview
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}