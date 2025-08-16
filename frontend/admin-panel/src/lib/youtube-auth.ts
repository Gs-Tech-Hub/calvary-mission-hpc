
export class YouTubeAuthManager {
    private static readonly ACCESS_TOKEN_KEY = 'youtube_access_token'
    private static readonly REFRESH_TOKEN_KEY = 'youtube_refresh_token'
    private static readonly TOKEN_EXPIRY_KEY = 'youtube_token_expiry'

    static setTokens(accessToken: string, refreshToken?: string, expiresIn?: number) {
        if (typeof window === 'undefined') return

        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)

        if (refreshToken) {
            localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
        }

        if (expiresIn) {
            const expiryTime = Date.now() + (expiresIn * 1000)
            localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString())
        }
    }

    static getAccessToken(): string | null {
        if (typeof window === 'undefined') return null

        const token = localStorage.getItem(this.ACCESS_TOKEN_KEY)
        const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY)

        // Check if token is expired
        if (expiry && Date.now() > parseInt(expiry)) {
            this.clearTokens()
            return null
        }

        return token
    }

    static getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null
        return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    }

    static isTokenExpired(): boolean {
        if (typeof window === 'undefined') return true

        const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY)
        if (!expiry) return true

        return Date.now() > parseInt(expiry)
    }

    static clearTokens() {
        if (typeof window === 'undefined') return

        localStorage.removeItem(this.ACCESS_TOKEN_KEY)
        localStorage.removeItem(this.REFRESH_TOKEN_KEY)
        localStorage.removeItem(this.TOKEN_EXPIRY_KEY)
    }

    static async refreshAccessToken(): Promise<string | null> {
        const refreshToken = this.getRefreshToken()
        if (!refreshToken) return null

        try {
            const response = await fetch('/api/youtube/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            })

            if (!response.ok) {
                this.clearTokens()
                return null
            }

            const data = await response.json()
            this.setTokens(data.access_token, refreshToken, data.expires_in)

            return data.access_token
        } catch (error) {
            console.error('Failed to refresh token:', error)
            this.clearTokens()
            return null
        }
    }

    static async getValidAccessToken(): Promise<string | null> {
        let token = this.getAccessToken()

        if (!token) return null

        // If token is expired, try to refresh
        if (this.isTokenExpired()) {
            token = await this.refreshAccessToken()
        }

        return token
    }
}