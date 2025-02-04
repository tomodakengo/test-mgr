import { NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'
import { headers } from 'next/headers'
import {
    ApiResponse,
    ProjectDocument,
    CreateDocumentRequest,
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

        const { title, type, projectId, content, status }: CreateDocumentRequest = await request.json()

        // Check if user is a member of the project
        const projectMember = await prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId,
                },
            },
        })

        if (!projectMember) {
            const response: ApiError = { error: 'You are not a member of this project' }
            return new NextResponse(
                JSON.stringify(response),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Create document
        const document = await prisma.document.create({
            data: {
                title,
                type,
                content,
                status,
                projectId,
                version: 1,
            },
            include: {
                project: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        const response: ApiResponse<ProjectDocument> = {
            data: document as unknown as ProjectDocument
        }
        return new NextResponse(
            JSON.stringify(response),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Document creation error:', error)
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

        // Get documents from projects where user is a member
        const documents = await prisma.document.findMany({
            where: {
                project: {
                    members: {
                        some: {
                            userId,
                        },
                    },
                },
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        })

        const response: ApiResponse<ProjectDocument[]> = {
            data: documents as unknown as ProjectDocument[]
        }
        return new NextResponse(
            JSON.stringify(response),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Document fetch error:', error)
        const response: ApiError = { error: 'Internal server error' }
        return new NextResponse(
            JSON.stringify(response),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 