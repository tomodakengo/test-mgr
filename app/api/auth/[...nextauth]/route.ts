import { Auth } from "@auth/core"
import { authConfig } from "@/lib/auth"

export const { GET, POST } = Auth(authConfig) 