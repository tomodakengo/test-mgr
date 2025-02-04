import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

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
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        const response = NextResponse.next()

        // Add user info to headers for backend routes
        response.headers.set('x-user-id', (decoded as any).userId)
        response.headers.set('x-user-role', (decoded as any).role)

        return response
    } catch (error) {
        // Token is invalid
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

// Configure paths that should be protected by the middleware
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/projects/:path*',
        '/api/projects/:path*',
        '/api/documents/:path*',
    ],
} 