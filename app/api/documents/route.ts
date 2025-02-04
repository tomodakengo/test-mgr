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

        const { title, type, content, projectId, status } = await request.json()

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

        // Get URL parameters
        const { searchParams } = new URL(request.url)
        const projectId = searchParams.get('projectId')
        const type = searchParams.get('type')
        const status = searchParams.get('status')
        const search = searchParams.get('search')

        // Build where clause
        const where: any = {
            project: {
                members: {
                    some: {
                        userId: token.sub as string,
                    },
                },
            },
        }

        if (projectId) {
            where.projectId = projectId
        }

        if (type) {
            where.type = type
        }

        if (status) {
            where.status = status
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ]
        }

        // Get documents
        const documents = await prisma.document.findMany({
            where,
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
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 