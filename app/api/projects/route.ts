import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        // Get user from headers
        const headersList = await headers()
        const userId = headersList.get('x-user-id')
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const { name, description, members, isPrivate } = await request.json()

        // Create project
        const project = await prisma.project.create({
            data: {
                name,
                description,
                members: {
                    create: [
                        {
                            userId,
                            role: 'MANAGER',
                        },
                        ...members.map((email: string) => ({
                            user: {
                                connect: {
                                    email: email.trim(),
                                },
                            },
                            role: 'MEMBER',
                        })),
                    ],
                },
            },
            include: {
                members: {
                    include: {
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
        })

        return new NextResponse(
            JSON.stringify(project),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Project creation error:', error)
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

export async function GET(request: Request) {
    try {
        // Get user from headers
        const headersList = await headers()
        const userId = headersList.get('x-user-id')
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Get projects where user is a member
        const projects = await prisma.project.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                documents: {
                    select: {
                        id: true,
                        type: true,
                        status: true,
                    },
                },
            },
        })

        return new NextResponse(
            JSON.stringify(projects),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Project fetch error:', error)
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 