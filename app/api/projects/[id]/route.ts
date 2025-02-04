import { NextResponse } from 'next/server'
import { PrismaClient, ProjectRole } from '@prisma/client'
import { headers } from 'next/headers'
import { ApiResponse, Project, ApiError } from '@/types'

const prisma = new PrismaClient()

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        // Get project with members and documents
        const project = await prisma.project.findUnique({
            where: { id: params.id },
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
                        type: true,
                        status: true,
                        version: true,
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

        if (!project) {
            const response: ApiError = { error: 'Project not found' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Check if user is a member of the project
        const isMember = project.members.some(member => member.user.id === userId)
        if (!isMember) {
            const response: ApiError = { error: 'You do not have access to this project' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const response: ApiResponse<Project> = { data: project as unknown as Project }
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

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        const { name, description } = await request.json()

        // Check if user is a manager of the project
        const projectMember = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId: params.id,
                    userId,
                },
            },
        })

        if (!projectMember || projectMember.role !== ProjectRole.MANAGER) {
            const response: ApiError = { error: 'Only managers can update project details' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Update project
        const project = await prisma.project.update({
            where: { id: params.id },
            data: {
                name,
                description,
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

        const response: ApiResponse<Project> = { data: project as unknown as Project }
        return new NextResponse(
            JSON.stringify(response),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Project update error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        // Check if user is a manager of the project
        const projectMember = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId: params.id,
                    userId,
                },
            },
        })

        if (!projectMember || projectMember.role !== ProjectRole.MANAGER) {
            const response: ApiError = { error: 'Only managers can delete projects' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Delete project (this will cascade delete all related records)
        await prisma.project.delete({
            where: { id: params.id },
        })

        return new NextResponse(
            JSON.stringify({ message: 'Project deleted successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Project deletion error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 