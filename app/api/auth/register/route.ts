import { NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Дұрыс email енгізіңіз"),
  password: z.string().min(6, "Пароль кемінде 6 таңба болуы керек"),
  name: z.string().min(2, "Аты-жөні кемінде 2 таңба болуы керек").optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Email бойынша тексеру
    const existingUser = await getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json({ error: "Бұл email бойынша пайдаланушы бар" }, { status: 400 })
    }

    // Жаңа пайдаланушыны қосу
    const user = await createUser(validatedData.email, validatedData.password, validatedData.name)

    return NextResponse.json(
      {
        message: "Тіркелу сәтті өтті",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Тіркелу қатесі:", error)
    
    // Қатені детальды көрсету (development режимінде)
    const errorMessage = error instanceof Error ? error.message : "Тіркелу қатесі"
    return NextResponse.json(
      { 
        error: "Тіркелу қатесі",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      }, 
      { status: 500 }
    )
  }
}

