import { AuthConfig } from "@auth/core"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "@auth/core/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const authConfig: AuthConfig = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "メールアドレス", type: "email" },
                password: { label: "パスワード", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("メールアドレスとパスワードを入力してください")
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) {
                    throw new Error("メールアドレスまたはパスワードが正しくありません")
                }

                const isValid = await bcrypt.compare(credentials.password, user.password)

                if (!isValid) {
                    throw new Error("メールアドレスまたはパスワードが正しくありません")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
        newUser: "/register"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    }
} 