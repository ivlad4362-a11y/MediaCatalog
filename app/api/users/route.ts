import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-helpers"
import { prisma } from "@/lib/db"

// Барлық пайдаланушыларды алу (тек админ үшін)
export async function GET() {
  // Админ рөлін тексеру
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Пайдаланушыларды форматтау
    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error("Пайдаланушыларды алу қатесі:", error)
    return NextResponse.json({ error: "Пайдаланушыларды алу қатесі" }, { status: 500 })
  }
}
