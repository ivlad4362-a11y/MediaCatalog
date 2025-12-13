import { NextResponse } from "next/server"
import { updateUserRole } from "@/lib/auth"
import { requireAdmin } from "@/lib/auth-helpers"

// Пайдаланушыны админ қылу (тек админ үшін)
export async function POST(request: Request) {
  // Админ рөлін тексеру
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email табылмады" }, { status: 400 })
    }

    const updatedUser = await updateUserRole(email, "admin")

    if (!updatedUser) {
      return NextResponse.json({ error: "Пайдаланушы табылмады" }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Пайдаланушы рөлін өзгерту қатесі:", error)
    return NextResponse.json({ error: "Пайдаланушы рөлін өзгерту қатесі" }, { status: 500 })
  }
}






