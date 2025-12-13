import { NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"
import { z } from "zod"
import { SignJWT } from "jose"

const loginSchema = z.object({
  email: z.string().email("Дұрыс email енгізіңіз"),
  password: z.string().min(1, "Пароль енгізіңіз"),
})

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Пайдаланушыны тексеру
    const user = await loginUser(validatedData.email, validatedData.password)

    if (!user) {
      return NextResponse.json({ error: "Email немесе пароль дұрыс емес" }, { status: 401 })
    }

    // JWT токен құру
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret)

    // Cookie-ге сақтау
    const response = NextResponse.json(
      {
        message: "Кіру сәтті өтті",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    )

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 күн
      path: "/",
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Кіру қатесі:", error)
    return NextResponse.json({ error: "Кіру қатесі" }, { status: 500 })
  }
}

