import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getToken } from 'next-auth/jwt'

const prisma = new PrismaClient()

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Get user from session
        const token = await getToken({ req: request as any })
        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get document
        const document = await prisma.document.findUnique({
            where: {
                id: params.id,
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
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
                },
            },
        })

        if (!document) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            )
        }

        // Check if user has access to the document
        const hasAccess = document.project.members.some(
            (member) => member.user.id === token.sub
        )

        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        return NextResponse.json(document)
    } catch (error) {
        console.error('Document fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Get user from session
        const token = await getToken({ req: request as any })
        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { title, content, status } = await request.json()

        // Get document with project members
        const existingDocument = await prisma.document.findUnique({
            where: {
                id: params.id,
            },
            include: {
                project: {
                    select: {
                        members: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        if (!existingDocument) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            )
        }

        // Check if user has access to the document
        const hasAccess = existingDocument.project.members.some(
            (member) => member.user.id === token.sub
        )

        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Update document
        const document = await prisma.document.update({
            where: {
                id: params.id,
            },
            data: {
                title,
                content,
                status,
                version: {
                    increment: 1,
                },
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
        console.error('Document update error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Get user from session
        const token = await getToken({ req: request as any })
        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get document with project members
        const document = await prisma.document.findUnique({
            where: {
                id: params.id,
            },
            include: {
                project: {
                    select: {
                        members: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        if (!document) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            )
        }

        // Check if user has access to the document
        const hasAccess = document.project.members.some(
            (member) => member.user.id === token.sub && member.role === 'MANAGER'
        )

        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Delete document
        await prisma.document.delete({
            where: {
                id: params.id,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Document deletion error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 