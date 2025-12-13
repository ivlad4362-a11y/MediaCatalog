/**
 * Пайдаланушыны админ қылу скрипті
 * 
 * Пайдалану:
 * npx tsx scripts/make-admin.ts <email>
 * 
 * Мысал:
 * npx tsx scripts/make-admin.ts user@example.com
 */

import { readFileSync, existsSync } from "fs"
import { resolve } from "path"
import { PrismaClient } from "@prisma/client"

// .env.local файлын жүктеу
const envPath = resolve(process.cwd(), ".env.local")
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8")
  envContent.split("\n").forEach((line) => {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      const match = trimmedLine.match(/^([^=:#]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        let value = match[2].trim()
        // Бос жолдарды өткізіп жіберу
        if (!value) return
        // Тірнарлықты алып тастау
        value = value.replace(/^["']|["']$/g, "")
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    }
  })
  console.log("✅ .env.local файлы жүктелді")
} else {
  console.warn("⚠️ .env.local файлы табылмады!")
}

const prisma = new PrismaClient()

async function makeAdmin(email: string) {
  try {
    console.log(`📧 Пайдаланушыны іздеу: ${email}`)
    
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`❌ Пайдаланушы табылмады: ${email}`)
      console.log("\n💡 Алдымен тіркелу керек:")
      console.log("   1. Сайтқа кіріңіз")
      console.log("   2. Тіркелу батырмасын басыңыз")
      console.log("   3. Email және пароль енгізіңіз")
      process.exit(1)
    }

    if (user.role === "admin") {
      console.log(`✅ Пайдаланушы қазірдің өзінде админ: ${email}`)
      await prisma.$disconnect()
      process.exit(0)
    }

    console.log(`🔄 Рөлді өзгерту: ${user.role} → admin`)

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    console.log("\n" + "=".repeat(50))
    console.log("✅ Пайдаланушы админ рөліне ие болды!")
    console.log("=".repeat(50))
    console.log(`📧 Email: ${updatedUser.email}`)
    console.log(`👤 Аты: ${updatedUser.name || "Жоқ"}`)
    console.log(`🔑 Рөл: ${updatedUser.role}`)
    console.log("\n💡 Енді сайтқа кіріп, /admin бетіне өтуге болады!")

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error("❌ Қате:", error instanceof Error ? error.message : String(error))
    await prisma.$disconnect()
    process.exit(1)
  }
}

// Скрипт аргументтерін тексеру
const email = process.argv[2]

if (!email) {
  console.error("❌ Email енгізіңіз!")
  console.log("\nПайдалану:")
  console.log("  npx tsx scripts/make-admin.ts <email>")
  console.log("\nМысал:")
  console.log("  npx tsx scripts/make-admin.ts user@example.com")
  process.exit(1)
}

makeAdmin(email)

