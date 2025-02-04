import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'

const prisma = new PrismaClient()
const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
)
const alg = 'HS256'

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json()

        // Find user by username
        const user = await prisma.user.findUnique({
            where: { username },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            )
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            )
        }

        // Generate JWT token
        const token = await new jose.SignJWT({
            userId: user.id,
            username: user.username,
            role: user.role,
        })
            .setProtectedHeader({ alg })
            .setExpirationTime('1d')
            .sign(secret)

        // Create response with token in both body and cookie
        const response = NextResponse.json({
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
            },
            token,
        })

        // Set cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 1 day
        })

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 