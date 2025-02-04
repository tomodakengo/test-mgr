import { ProjectRole, DocumentType, DocumentStatus, Prisma } from '@prisma/client'

// User related types
export type UserRole = ProjectRole

export interface User {
    id: string
    name: string
    email: string
}

// Project related types
export interface Project {
    id: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    members: ProjectMember[]
    documents: ProjectDocument[]
}

export interface ProjectMember {
    id: string
    userId: string
    projectId: string
    role: ProjectRole
    user: User
    createdAt: Date
    updatedAt: Date
}

export interface CreateProjectRequest {
    name: string
    description?: string
    members: string[] // email addresses
    isPrivate: boolean
}

export type CreateProjectMemberInput = Prisma.ProjectMemberCreateWithoutProjectInput

// Document related types
export interface ProjectDocument {
    id: string
    title: string
    content: string
    type: DocumentType
    status: DocumentStatus
    version: number
    projectId: string
    project: {
        name: string
    }
    createdAt: Date
    updatedAt: Date
}

export interface CreateDocumentRequest {
    title: string
    type: DocumentType
    content: string
    status: DocumentStatus
    projectId: string
}

export interface UpdateDocumentRequest {
    title: string
    content: string
    status: DocumentStatus
}

// API Response types
export interface ApiResponse<T> {
    data?: T
    error?: string
}

// Error response type
export interface ApiError {
    error: string
} 