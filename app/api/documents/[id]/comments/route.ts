import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'
import {
    ApiResponse,
    DocumentComment,
    CreateCommentRequest,
    ApiError
} from '@/types'

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

        // Check if user has access to the document
        const document = await prisma.document.findUnique({
            where: { id: params.id },
            include: {
                project: {
                    include: {
                        members: {
                            where: { userId },
                        },
                    },
                },
            },
        })

        if (!document) {
            const response: ApiError = { error: 'Document not found' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
        }

        if (document.project.members.length === 0) {
            const response: ApiError = { error: 'You do not have access to this document' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Get comments with replies
        const comments = await prisma.documentComment.findMany({
            where: {
                documentId: params.id,
                parentId: null, // Get only top-level comments
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        const response: ApiResponse<DocumentComment[]> = {
            data: comments as unknown as DocumentComment[]
        }
        return new NextResponse(
            JSON.stringify(response),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Comments fetch error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
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

        // Check if user has access to the document
        const document = await prisma.document.findUnique({
            where: { id: params.id },
            include: {
                project: {
                    include: {
                        members: {
                            where: { userId },
                        },
                    },
                },
            },
        })

        if (!document) {
            const response: ApiError = { error: 'Document not found' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
        }

        if (document.project.members.length === 0) {
            const response: ApiError = { error: 'You do not have access to this document' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const { content, parentId }: CreateCommentRequest = await request.json()

        // If this is a reply, check if parent comment exists
        if (parentId) {
            const parentComment = await prisma.documentComment.findUnique({
                where: {
                    id: parentId,
                    documentId: params.id,
                },
            })

            if (!parentComment) {
                const response: ApiError = { error: 'Parent comment not found' }
                return new NextResponse(
                    JSON.stringify(response),
                    { status: 404, headers: { 'Content-Type': 'application/json' } }
                )
            }

            if (parentComment.parentId) {
                const response: ApiError = { error: 'Cannot reply to a reply' }
                return new NextResponse(
                    JSON.stringify(response),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                )
            }
        }

        // Create comment
        const comment = await prisma.documentComment.create({
            data: {
                content,
                documentId: params.id,
                userId,
                parentId,
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
            data: comment as unknown as DocumentComment
        }
        return new NextResponse(
            JSON.stringify(response),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Comment creation error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 