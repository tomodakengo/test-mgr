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

        const { title, type, projectId, content, status } = await request.json()

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
            return new NextResponse(
                JSON.stringify({ error: 'You are not a member of this project' }),
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
            },
            include: {
                project: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        return NextResponse.json(document)
    } catch (error) {
        console.error('Document creation error:', error)
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

        return NextResponse.json(documents)
    } catch (error) {
        console.error('Document fetch error:', error)
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 