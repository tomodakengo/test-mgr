import { NextResponse } from 'next/server'
import { PrismaClient, ProjectRole, Prisma } from '@prisma/client'
import { headers } from 'next/headers'
import {
    ApiResponse,
    Project,
    CreateProjectRequest,
    ApiError
} from '@/types'

const prisma = new PrismaClient()

export async function POST(request: Request) {
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

        const { name, description, members, isPrivate }: CreateProjectRequest = await request.json()

        // Prepare project members
        const projectMembers: Prisma.ProjectMemberCreateWithoutProjectInput[] = [
            {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                role: ProjectRole.MANAGER,
            },
            ...members.map((email: string) => ({
                user: {
                    connect: {
                        email: email.trim(),
                    },
                },
                role: ProjectRole.MEMBER,
            })),
        ]

        // Create project
        const project = await prisma.project.create({
            data: {
                name,
                description,
                members: {
                    create: projectMembers,
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
                        title: true,
                        content: true,
                        type: true,
                        status: true,
                        version: true,
                        projectId: true,
                        createdAt: true,
                        updatedAt: true,
                        project: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        })

        const response: ApiResponse<Project> = {
            data: project as unknown as Project
        }
        return new NextResponse(
            JSON.stringify(response),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Project creation error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
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
            const response: ApiError = { error: 'Unauthorized' }
            return new NextResponse(
                JSON.stringify(response),
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
                        title: true,
                        content: true,
                        type: true,
                        status: true,
                        version: true,
                        projectId: true,
                        createdAt: true,
                        updatedAt: true,
                        project: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        })

        const response: ApiResponse<Project[]> = {
            data: projects as unknown as Project[]
        }
        return new NextResponse(
            JSON.stringify(response),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Project fetch error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 