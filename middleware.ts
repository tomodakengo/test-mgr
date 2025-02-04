import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
)

export async function middleware(request: NextRequest) {
    // Public paths that don't require authentication
    const publicPaths = ['/login', '/register', '/']
    const path = request.nextUrl.pathname

    if (publicPaths.includes(path)) {
        return NextResponse.next()
    }

    // Check for auth token
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
        console.log('No auth token found, redirecting to login')
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        // Verify token
        const { payload } = await jose.jwtVerify(token, secret)

        // Create a new response
        const response = NextResponse.next()

        // Add user info to headers for backend routes
        response.headers.set('x-user-id', payload.userId as string)
        response.headers.set('x-user-role', payload.role as string)

        return response
    } catch (error) {
        // Token is invalid
        console.log('Invalid token:', error)
        // Delete the invalid token
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('auth-token')
        return response
    }
}

// Configure paths that should be protected by the middleware
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/projects/:path*',
        '/api/documents/:path*',
    ],
} 