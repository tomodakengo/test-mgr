import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'
import { ApiResponse, User, ApiError } from '@/types'

const prisma = new PrismaClient()
const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
)
const alg = 'HS256'

export interface LoginRequest {
    email: string
    password: string
}

export async function POST(request: Request) {
    try {
        const { email, password }: LoginRequest = await request.json()

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            const response: ApiError = { error: 'メールアドレスまたはパスワードが正しくありません' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            const response: ApiError = { error: 'メールアドレスまたはパスワードが正しくありません' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Generate JWT token
        const token = await new jose.SignJWT({
            userId: user.id,
            email: user.email,
        })
            .setProtectedHeader({ alg })
            .setExpirationTime('1d')
            .sign(secret)

        // Create response
        const response: ApiResponse<{ user: User; token: string }> = {
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        }

        const nextResponse = new NextResponse(
            JSON.stringify(response),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        )

        // Set cookie
        nextResponse.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 1 day
        })

        return nextResponse
    } catch (error) {
        console.error('Login error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 