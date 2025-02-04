import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getToken } from 'next-auth/jwt'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        // Get user from session
        const token = await getToken({ req: request as any })
        if (!token) {
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
                            userId: token.sub as string,
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
        // Get user from session
        const token = await getToken({ req: request as any })
        if (!token) {
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
                        userId: token.sub as string,
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

        return NextResponse.json(projects)
    } catch (error) {
        console.error('Project fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 