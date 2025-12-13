import { NextResponse } from "next/server"
import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"
import { requireAdmin } from "@/lib/auth-helpers"
import bcrypt from "bcryptjs"

interface MockUser {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
  passwordHash: string
}

const USERS_FILE = join(process.cwd(), ".mock-users.json")

// Пайдаланушыларды файлдан оқу
function loadUsers(): MockUser[] {
  try {
    if (existsSync(USERS_FILE)) {
      const data = readFileSync(USERS_FILE, "utf-8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Пайдаланушыларды жүктеу қатесі:", error)
  }
  return []
}

// Пайдаланушыларды файлға сақтау
function saveUsers(users: MockUser[]) {
  try {
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8")
  } catch (error) {
    console.error("Пайдаланушыларды сақтау қатесі:", error)
  }
}

// Пайдаланушы паролін өзгерту (тек админ үшін)
export async function POST(request: Request) {
  const authResult = await requireAdmin()
  if (authResult) return authResult

  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email және жаңа пароль қажет" }, { status: 400 })
    }

    if (newPassword.length < 4) {
      return NextResponse.json({ error: "Пароль кемінде 4 символ болуы керек" }, { status: 400 })
    }

    const users = loadUsers()
    const userIndex = users.findIndex((u) => u.email === email)

    if (userIndex === -1) {
      return NextResponse.json({ error: "Пайдаланушы табылмады" }, { status: 404 })
    }

    // Жаңа парольді хэштеу
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // Парольді өзгерту
    users[userIndex].passwordHash = newPasswordHash
    saveUsers(users)

    return NextResponse.json({
      message: `${email} пайдаланушысының паролі сәтті өзгертілді`,
      email: users[userIndex].email,
    })
  } catch (error) {
    console.error("Парольді өзгерту қатесі:", error)
    const errorMessage = error instanceof Error ? error.message : "Парольді өзгерту қатесі"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}


















