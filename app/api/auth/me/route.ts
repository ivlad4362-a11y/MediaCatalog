import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { getUserById } from "@/lib/auth"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // JWT токенді тексеру
    const { payload } = await jwtVerify(token, secret)

    if (!payload.id) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Пайдаланушыны алу
    const user = await getUserById(payload.id as string)

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Пайдаланушыны алу қатесі:", error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}

