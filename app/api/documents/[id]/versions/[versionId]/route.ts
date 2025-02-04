import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'
import { ApiResponse, DocumentVersion, ApiError } from '@/types'

const prisma = new PrismaClient()

export async function GET(
    request: Request,
    { params }: { params: { id: string; versionId: string } }
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

        // Get specific version
        const version = await prisma.documentVersion.findUnique({
            where: {
                id: params.versionId,
                documentId: params.id,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        if (!version) {
            const response: ApiError = { error: 'Version not found' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const response: ApiResponse<DocumentVersion> = {
            data: version as unknown as DocumentVersion
        }
        return new NextResponse(
            JSON.stringify(response),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Document version fetch error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 