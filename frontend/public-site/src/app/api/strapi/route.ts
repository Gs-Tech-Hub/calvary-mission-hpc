/* eslint-disable @typescript-eslint/no-explicit-any */ 
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
        // Try to read JWT from auth cookie and prefer it over static token
        const cookieHeader = request.headers.get('cookie')
        const authToken = cookieHeader?.split('auth-token=')[1]?.split(';')[0]

        const headers: Record<string, string> = {}
        if (authToken) {
            headers.Authorization = `Bearer ${authToken}`
        }

        const data = await strapiRequest(endpoint, query, { headers })
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Minimal phone format validator for E.164 with country code
function isValidE164Phone(phone: string) {
    return /^\+[1-9]\d{7,14}$/.test(phone)
}

// Registration proxy using phone-based auth; removes unsupported fields from initial Strapi call
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            username,
            email,
            phone,
            address,
            churchBranch,
            department,
            isMember,
            isChristian,
            churchAttended,
        } = body

        if (!username || !email || !phone) {
            return NextResponse.json(
                { error: 'username, email and phone are required' },
                { status: 400 }
            )
        }

        if (!isValidE164Phone(phone)) {
            return NextResponse.json(
                { error: 'Phone must include country code in E.164 format (e.g. +2348012345678)' },
                { status: 400 }
            )
        }

        // Use phone as password to satisfy Strapi local auth requirement
        const registerPayload = {
            username,
            email,
            password: phone,
        }

        const registerResponse = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerPayload),
        })

        const registerData = await registerResponse.json()
        if (!registerResponse.ok) {
            return NextResponse.json(
                { error: registerData.error?.message || 'Registration failed' },
                { status: registerResponse.status }
            )
        }

        const jwt = registerData.jwt
        const userId = registerData.user?.id

        // Attach extra profile fields in a follow-up update
        const profileData: any = {
            phone,
            address,
            isMember: !!isMember,
            isChristian: !!isChristian,
        }

        if (isMember) {
            if (churchBranch) profileData.churchBranch = churchBranch
            if (department) profileData.department = department
        } else if (isChristian && churchAttended) {
            profileData.churchAttended = churchAttended
        }

        if (userId && jwt) {
            await fetch(`${STRAPI_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify(profileData),
            })
        }

        return NextResponse.json(
            {
                user: { ...registerData.user, ...profileData },
                jwt,
                message: 'Registration successful',
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}