// lib/api.ts - Secure client-side API service
import { YouTubeAuthManager } from './youtube-auth'

export interface YouTubeLiveStream {
    id: string
    title: string
    streamUrl: string
    streamKey: string
    watchUrl: string
    status: 'ready' | 'live' | 'complete'
    streamId: string
}

export interface YouTubeVideo {
    id: string
    title: string
    thumbnailUrl: string
    publishedAt: string
}

class ApiService {

    // Generic request handler with error handling
    private async request(url: string, options: RequestInit = {}) {
        console.log(options)
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        return response.json()
    }

    // Strapi Methods (through server proxy)
    private async strapiRequest(endpoint: string, options: RequestInit = {}) {
        console.log("endpoint", endpoint)
        const url = `/api/strapi?endpoint=${encodeURIComponent(endpoint)}`

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        // Handle empty response (like DELETE operations)
        const text = await response.text()
        if (!text) {
            return { success: true }
        }

        try {
            return JSON.parse(text)
        } catch (error) {
            return { success: true }
        }
    }

    // Live Stream Methods
    async updateLiveStream(data: {
        streamUrl?: string
        streamKey?: string
        streamId?: string
        isLive?: boolean
        title?: string
        startedAt?: string
        broadcastId?: string
        watchUrl?: string
    }) {
        try {
            // First, try to get existing live stream record
            const existing = await this.strapiRequest('live-streams?pagination[limit]=1')

            // Clean the data - remove undefined/null values
            const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    acc[key] = value
                }
                return acc
            }, {} as any)

            if (existing.data.length > 0) {
                // Update existing record using documentId
                const documentId = existing.data[0].documentId
                return this.strapiRequest(`live-streams/${documentId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ data: cleanData }),
                })
            } else {
                // Create new record
                return this.strapiRequest('live-streams', {
                    method: 'POST',
                    body: JSON.stringify({ data: cleanData }),
                })
            }
        } catch (error) {
            console.error('Update live stream error:', error)
            throw error
        }
    }

    async getLiveStream() {
        try {
            const response = await this.strapiRequest('live-streams?pagination[limit]=1')
            return response.data[0] || null
        } catch (error) {
            console.error('Get live stream error:', error)
            return null
        }
    }


    async deleteLiveStream(): Promise<void> {
        try {
            // First, get the existing live stream record to get its documentId
            const existing = await this.strapiRequest('live-streams?pagination[limit]=1')

            if (existing.data.length > 0) {
                const documentId = existing.data[0].documentId

                // Delete the record using documentId
                await this.strapiRequest(`live-streams/${documentId}`, {
                    method: 'DELETE',
                })

                console.log('Live stream record deleted successfully')
            } else {
                console.log('No live stream record found to delete')
            }
        } catch (error) {
            console.error('Delete live stream error:', error)
            throw error
        }
    }

    // Sermon Methods
    async createSermon(data: {
        title: string
        speaker?: string
        date?: string
        youtubeId: string
        description?: string
        broadcastId?: string
    }) {
        return this.strapiRequest('sermons', {
            method: 'POST',
            body: JSON.stringify({ data }),
        })
    }

    async getSermons() {
        const response = await this.strapiRequest('sermons?sort=date:desc')
        return response.data
    }

    async updateSermon(documentId: string, data: any) {
        return this.strapiRequest(`sermons/${documentId}`, {
            method: 'PUT',
            body: JSON.stringify({ data }),
        })
    }

    async deleteSermon(documentId: string) {
        return this.strapiRequest(`sermons/${documentId}`, {
            method: 'DELETE',
        })
    }


    // Member Methods
    async createMember(data: {
        name: string
        email: string
        phone?: string
        address?: string
        joinDate?: string
        member_status: string
        department?: string
        birthDate?: string
        maritalStatus?: string
    }) {
        return this.strapiRequest('members', {
            method: 'POST',
            body: JSON.stringify({ data }),
        })
    }

    async getMembers() {
        const response = await this.strapiRequest('members?sort=name:asc')
        return response.data
    }

    async updateMember(documentId: string, data: any) {
        return this.strapiRequest(`members/${documentId}`, {
            method: 'PUT',
            body: JSON.stringify({ data }),
        })
    }

    async deleteMember(documentId: string) {
        return this.strapiRequest(`members/${documentId}`, {
            method: 'DELETE',
        })
    }

    // Donation Methods
    async createDonation(data: {
        donor: string
        amount: number
        type: string
        method: string
        reference?: string
        notes?: string
        date?: string
    }) {
        return this.strapiRequest('donations', {
            method: 'POST',
            body: JSON.stringify({ data }),
        })
    }

    async getDonations() {
        const response = await this.strapiRequest('donations?sort=date:desc')
        return response.data
    }

    async updateDonation(documentId: string, data: any) {
        return this.strapiRequest(`donations/${documentId}`, {
            method: 'PUT',
            body: JSON.stringify({ data }),
        })
    }

    async deleteDonation(documentId: string) {
        return this.strapiRequest(`donations/${documentId}`, {
            method: 'DELETE',
        })
    }

    // YouTube Methods (through server proxy)
    async getAuthUrl(): Promise<string> {
        const data = await this.request('/api/youtube/auth')
        return data.authUrl
    }

    async createLiveStream(title: string): Promise<YouTubeLiveStream> {
        const accessToken = await YouTubeAuthManager.getValidAccessToken()
        if (!accessToken) {
            throw new Error('Please authenticate with YouTube first')
        }
        const data = await this.request('/api/youtube/livestream', {
            method: 'POST',
            body: JSON.stringify({
                action: 'create',
                accessToken,
                title
            })
        })
        return data
    }

    async startLiveStream(broadcastId: string): Promise<void> {
        const accessToken = await YouTubeAuthManager.getValidAccessToken()
        if (!accessToken) {
            throw new Error('Please authenticate with YouTube first')
        }
        await this.request('/api/youtube/livestream', {
            method: 'POST',
            body: JSON.stringify({
                action: 'start',
                accessToken,
                broadcastId
            })
        })
    }

    async stopLiveStream(broadcastId: string): Promise<void> {
        const accessToken = await YouTubeAuthManager.getValidAccessToken()
        if (!accessToken) {
            throw new Error('Please authenticate with YouTube first')
        }
        await this.request('/api/youtube/livestream', {
            method: 'POST',
            body: JSON.stringify({
                action: 'stop',
                accessToken,
                broadcastId
            })
        })
    }

    async getStreamStatus(broadcastId: string): Promise<{
        broadcastStatus: string,
        streamStatus: string,
        healthStatus?: string,
        recordingStatus?: string,
        lifeCycleStatus?: string
    }> {
        try {
            const accessToken = await YouTubeAuthManager.getValidAccessToken()
            if (!accessToken) {
                throw new Error('Please authenticate with YouTube first')
            }

            // First, get the broadcast to find the associated stream ID
            const broadcastResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id,status,contentDetails&id=${broadcastId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            )

            if (!broadcastResponse.ok) {
                throw new Error(`Broadcast status check failed: ${broadcastResponse.statusText}`)
            }

            const broadcastData = await broadcastResponse.json()
            const broadcast = broadcastData.items?.[0]

            if (!broadcast) {
                throw new Error('Broadcast not found')
            }

            // Get the stream ID from the broadcast
            const streamId = broadcast.contentDetails?.boundStreamId

            type StreamStatus = {
                status?: {
                    streamStatus?: string
                    healthStatus?: {
                        status?: string
                    }
                }
            }

            let streamData: StreamStatus | null = null

            if (streamId) {
                // Get specific stream data using the stream ID
                const streamResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/liveStreams?part=id,status&id=${streamId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                )

                if (streamResponse.ok) {
                    const streamResponseData = await streamResponse.json()
                    streamData = streamResponseData.items?.[0] as StreamStatus
                }
            }

            // If no specific stream found, fall back to getting the latest stream
            if (!streamData) {
                const allStreamsResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/liveStreams?part=id,status&mine=true`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                )

                if (allStreamsResponse.ok) {
                    const allStreamsData = await allStreamsResponse.json()
                    streamData = allStreamsData.items?.[0] as StreamStatus // Get the latest stream
                }
            }

            console.log('Broadcast data:', broadcast)
            console.log('Stream data:', streamData)

            return {
                broadcastStatus: broadcast.status?.lifeCycleStatus || 'unknown',
                streamStatus: streamData?.status?.streamStatus || 'unknown',
                healthStatus: streamData?.status?.healthStatus?.status || 'unknown',
                recordingStatus: broadcast.status?.recordingStatus || 'unknown',
                lifeCycleStatus: broadcast.status?.lifeCycleStatus || 'unknown'
            }

        } catch (error) {
            console.error('Get stream status error:', error)
            return {
                broadcastStatus: 'error',
                streamStatus: 'error',
                healthStatus: 'error',
                recordingStatus: 'error',
                lifeCycleStatus: 'error'
            }
        }
    }

    async getBroadcastDetails(broadcastId: string): Promise<any> {

        const accessToken = await YouTubeAuthManager.getValidAccessToken()
        if (!accessToken) {
            throw new Error('Please authenticate with YouTube first')
        }
        // This can be implemented if needed
        return this.getStreamStatus(broadcastId)
    }

    async getChannelVideos(channelId: string): Promise<YouTubeVideo[]> {
        return this.request(`/api/youtube/videos?channelId=${channelId}`)
    }
}

// Create and export the API instance
export const api = new ApiService()

// For backward compatibility with existing code
export const strapiApi = api
export const youtubeApi = api

// Individual method exports for more specific imports if needed
export default api