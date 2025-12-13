import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { getUserById } from "@/lib/auth"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
}

// Аутентификацияны тексеру
export async function checkAuth(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    // JWT токенді тексеру
    const { payload } = await jwtVerify(token, secret)

    if (!payload.id) {
      return null
    }

    // Пайдаланушыны алу
    const user = await getUserById(payload.id as string)

    if (!user) {
      return null
    }

    return user
  } catch (error) {
    return null
  }
}

// Админ рөлін тексеру
export async function requireAdmin(): Promise<{ user: AuthUser } | NextResponse> {
  const user = await checkAuth()

  if (!user) {
    return NextResponse.json({ error: "Кіру қажет" }, { status: 401 })
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Админ құқығы қажет" }, { status: 403 })
  }

  return { user }
}






