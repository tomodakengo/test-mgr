import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'
import {
    ApiResponse,
    DocumentComment,
    UpdateCommentRequest,
    ApiError
} from '@/types'

const prisma = new PrismaClient()

export async function PUT(
    request: Request,
    { params }: { params: { id: string; commentId: string } }
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

        // Check if comment exists and belongs to the user
        const comment = await prisma.documentComment.findUnique({
            where: {
                id: params.commentId,
                documentId: params.id,
            },
        })

        if (!comment) {
            const response: ApiError = { error: 'Comment not found' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
        }

        if (comment.userId !== userId) {
            const response: ApiError = { error: 'You can only edit your own comments' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const { content }: UpdateCommentRequest = await request.json()

        // Update comment
        const updatedComment = await prisma.documentComment.update({
            where: {
                id: params.commentId,
            },
            data: {
                content,
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

        const response: ApiResponse<DocumentComment> = {
            data: updatedComment as unknown as DocumentComment
        }
        return new NextResponse(
            JSON.stringify(response),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Comment update error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string; commentId: string } }
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

        // Check if comment exists and belongs to the user
        const comment = await prisma.documentComment.findUnique({
            where: {
                id: params.commentId,
                documentId: params.id,
            },
            include: {
                document: {
                    include: {
                        project: {
                            include: {
                                members: {
                                    where: {
                                        userId,
                                        role: 'MANAGER',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        if (!comment) {
            const response: ApiError = { error: 'Comment not found' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Allow deletion if user is the comment author or a project manager
        const isManager = comment.document.project.members.length > 0
        if (comment.userId !== userId && !isManager) {
            const response: ApiError = { error: 'You can only delete your own comments' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Delete comment and its replies
        await prisma.documentComment.deleteMany({
            where: {
                OR: [
                    { id: params.commentId },
                    { parentId: params.commentId },
                ],
            },
        })

        return new NextResponse(
            JSON.stringify({ message: 'Comment deleted successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Comment deletion error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 