import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'
import { ApiResponse, User, ApiError } from '@/types'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
        // Get user from headers
        const headersList = await headers()
        const userId = headersList.get('x-user-id')
        if (!userId) {
            const response: ApiError = { error: 'Unauthorized' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Get user data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                projects: {
                    include: {
                        project: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                members: {
                                    select: {
                                        role: true,
                                        user: {
                                            select: {
                                                id: true,
                                                name: true,
                                                email: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        if (!user) {
            const response: ApiError = { error: 'User not found' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const response: ApiResponse<User> = { data: user }
        return new NextResponse(
            JSON.stringify(response),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('User fetch error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 