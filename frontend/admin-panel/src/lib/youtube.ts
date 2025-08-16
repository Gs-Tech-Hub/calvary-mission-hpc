export function extractYouTubeId(input: string): string | null {
    if (!input) return null
    // Trim
    const s = input.trim()

    // If raw 11-char id
    const rawId = s.match(/^([A-Za-z0-9_-]{11})$/)
    if (rawId) return rawId[1]

    // Try URL parsing
    try {
        const url = new URL(s)
        // short link youtu.be/ID
        if (url.hostname.includes('youtu.be')) return url.pathname.slice(1)
        // typical youtube.com/watch?v=ID
        const v = url.searchParams.get('v')
        if (v) return v
        // embed /v/ or /embed/
        const parts = url.pathname.split('/')
        const possible = parts.reverse().find(Boolean)
        if (possible && /^[A-Za-z0-9_-]{11}$/.test(possible)) return possible
    } catch (e) {
        // not a URL — try regex fallback
        const match = s.match(/([A-Za-z0-9_-]{11})/)
        if (match) return match[1]
    }

    return null
}
