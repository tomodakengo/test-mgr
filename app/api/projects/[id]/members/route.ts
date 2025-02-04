import { NextResponse } from 'next/server'
import { PrismaClient, ProjectRole } from '@prisma/client'
import { headers } from 'next/headers'
import { ApiResponse, ProjectMember, ApiError } from '@/types'

const prisma = new PrismaClient()

interface AddMemberRequest {
    email: string
    role: ProjectRole
}

interface UpdateMemberRequest {
    userId: string
    role: ProjectRole
}

export async function POST(
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
            const response: ApiError = { error: 'Only managers can add members' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const { email, role }: AddMemberRequest = await request.json()

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            const response: ApiError = { error: 'User not found' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Check if user is already a member
        const existingMember = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId: params.id,
                    userId: user.id,
                },
            },
        })

        if (existingMember) {
            const response: ApiError = { error: 'User is already a member of this project' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Add member to project
        const newMember = await prisma.projectMember.create({
            data: {
                projectId: params.id,
                userId: user.id,
                role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        const response: ApiResponse<ProjectMember> = {
            data: newMember as unknown as ProjectMember
        }
        return new NextResponse(
            JSON.stringify(response),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Add member error:', error)
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
            const response: ApiError = { error: 'Only managers can update member roles' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const { userId: targetUserId, role }: UpdateMemberRequest = await request.json()

        // Update member role
        const updatedMember = await prisma.projectMember.update({
            where: {
                projectId_userId: {
                    projectId: params.id,
                    userId: targetUserId,
                },
            },
            data: {
                role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        const response: ApiResponse<ProjectMember> = {
            data: updatedMember as unknown as ProjectMember
        }
        return new NextResponse(
            JSON.stringify(response),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Update member error:', error)
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
            const response: ApiError = { error: 'Only managers can remove members' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const { userId: targetUserId } = await request.json()

        // Cannot remove the last manager
        const managers = await prisma.projectMember.count({
            where: {
                projectId: params.id,
                role: ProjectRole.MANAGER,
            },
        })

        const targetMember = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId: params.id,
                    userId: targetUserId,
                },
            },
        })

        if (managers === 1 && targetMember?.role === ProjectRole.MANAGER) {
            const response: ApiError = { error: 'Cannot remove the last manager' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Remove member from project
        await prisma.projectMember.delete({
            where: {
                projectId_userId: {
                    projectId: params.id,
                    userId: targetUserId,
                },
            },
        })

        return new NextResponse(
            JSON.stringify({ message: 'Member removed successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Remove member error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 