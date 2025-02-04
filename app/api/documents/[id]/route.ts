import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'

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
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Get document
        const document = await prisma.document.findUnique({
            where: { id: params.id },
            include: {
                project: {
                    include: {
                        members: {
                            where: { userId },
                            select: { role: true },
                        },
                    },
                },
            },
        })

        if (!document) {
            return new NextResponse(
                JSON.stringify({ error: 'Document not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Check if user has access to the document
        if (document.project.members.length === 0) {
            return new NextResponse(
                JSON.stringify({ error: 'You do not have access to this document' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        return NextResponse.json(document)
    } catch (error) {
        console.error('Document fetch error:', error)
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error' }),
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
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const { title, content, status } = await request.json()

        // Get document with project and user role
        const document = await prisma.document.findUnique({
            where: { id: params.id },
            include: {
                project: {
                    include: {
                        members: {
                            where: { userId },
                            select: { role: true },
                        },
                    },
                },
            },
        })

        if (!document) {
            return new NextResponse(
                JSON.stringify({ error: 'Document not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Check if user has access to the document
        if (document.project.members.length === 0) {
            return new NextResponse(
                JSON.stringify({ error: 'You do not have access to this document' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Update document
        const updatedDocument = await prisma.document.update({
            where: { id: params.id },
            data: {
                title,
                content,
                status,
                version: document.version + 1,
            },
            include: {
                project: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        return NextResponse.json(updatedDocument)
    } catch (error) {
        console.error('Document update error:', error)
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error' }),
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
        const userRole = headersList.get('x-user-role')
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Only managers can delete documents
        if (userRole !== 'MANAGER') {
            return new NextResponse(
                JSON.stringify({ error: 'Only managers can delete documents' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Get document with project and user role
        const document = await prisma.document.findUnique({
            where: { id: params.id },
            include: {
                project: {
                    include: {
                        members: {
                            where: { userId },
                            select: { role: true },
                        },
                    },
                },
            },
        })

        if (!document) {
            return new NextResponse(
                JSON.stringify({ error: 'Document not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Check if user has access to the document
        if (document.project.members.length === 0) {
            return new NextResponse(
                JSON.stringify({ error: 'You do not have access to this document' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Delete document
        await prisma.document.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Document deleted successfully' })
    } catch (error) {
        console.error('Document deletion error:', error)
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 