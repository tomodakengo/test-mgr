import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { ApiResponse, User, ApiError } from '@/types'

const prisma = new PrismaClient()

export interface RegisterRequest {
    name: string
    email: string
    password: string
}

export async function POST(request: Request) {
    try {
        const { name, email, password }: RegisterRequest = await request.json()

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            const response: ApiError = { error: 'User already exists' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Hash password
        const hashedPassword = await hash(password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        })

        const response: ApiResponse<User> = { data: user }
        return new NextResponse(
            JSON.stringify(response),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Registration error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
        // Generate JWT token
        const token = jwt.sign(
                { userId: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '1d' }
            )

        // Return user data and token
        return NextResponse.json({
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
            },
            token,
        })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 