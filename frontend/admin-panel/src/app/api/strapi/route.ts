import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

async function strapiRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${STRAPI_URL}/api/${endpoint}`
    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
            ...options.headers,
        },
        ...options,
    }

    try {
        const response = await fetch(url, config)
        const data = await response.json()

        if (!response.ok) {
            console.error('Strapi API error:', data)
            throw new Error(`Strapi API error: ${response.statusText} - ${JSON.stringify(data)}`)
        }

        return data
    } catch (error) {
        console.error('Request failed:', error)
        throw error
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')

    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint required' }, { status: 400 })
    }

    try {
        const data = await strapiRequest(endpoint)
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')

    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint required' }, { status: 400 })
    }

    try {
        const body = await request.json()
        const data = await strapiRequest(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        })
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')

    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint required' }, { status: 400 })
    }

    try {
        const body = await request.json()
        const data = await strapiRequest(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        })
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')

    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint required' }, { status: 400 })
    }

    try {
        const data = await strapiRequest(endpoint, {
            method: 'DELETE'
        })

        // Strapi DELETE might return empty response, handle it
        return NextResponse.json(data || { success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}