import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

async function strapiRequest(endpoint: string, searchParams?: string, options: RequestInit = {}) {
    const url = `${STRAPI_URL}/api/${endpoint}${searchParams ? `?${searchParams}` : ''}`
    console.log("Proxying request to Strapi:", url)

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
            ...options.headers,
        },
        ...options,
    }

    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
        throw new Error(`Strapi API error: ${response.statusText} - ${JSON.stringify(data)}`)
    }

    return data
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')

    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint required' }, { status: 400 })
    }

    // Remove "endpoint" and forward the rest of the query
    searchParams.delete("endpoint")
    const query = searchParams.toString()

    try {
        const data = await strapiRequest(endpoint, query)
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
