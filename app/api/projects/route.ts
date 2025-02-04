import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        // Get user from headers
        const headersList = headers()
        const userId = headersList.get('x-user-id')
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
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
                        ...members.map((username: string) => ({
                            user: {
                                connect: {
                                    username: username.trim(),
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
                                username: true,
                            },
                        },
                    },
                },
            },
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error('Project creation error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    try {
        // Get user from headers
        const headersList = headers()
        const userId = headersList.get('x-user-id')
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
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
                                username: true,
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

        return NextResponse.json(projects)
    } catch (error) {
        console.error('Project fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 