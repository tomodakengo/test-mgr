import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const { username, name, password } = await request.json()

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Username already taken' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const user = await prisma.user.create({
            data: {
                username,
                name,
                password: hashedPassword,
                role: 'MEMBER', // Default role
            },
        })

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