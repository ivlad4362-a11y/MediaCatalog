/**
 * Админ рөлін қалпына келтіру скрипті
 * 
 * Бұл скрипт барлық админдерді көрсетеді және оларды жоюға/рөлді өзгертуге мүмкіндік береді
 * 
 * Пайдалану:
 * npx tsx scripts/reset-admin.ts
 */

import { readFileSync, existsSync } from "fs"
import { resolve } from "path"
import { PrismaClient } from "@prisma/client"
import * as readline from "readline"

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
        if (!value) return
        value = value.replace(/^["']|["']$/g, "")
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    }
  })
}

const prisma = new PrismaClient()

// Readline интерфейсі
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function listAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    if (admins.length === 0) {
      console.log("\n❌ Базада админдер табылмады")
      return []
    }

    console.log("\n" + "=".repeat(60))
    console.log("📋 Барлық админдер:")
    console.log("=".repeat(60))
    
    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. Email: ${admin.email}`)
      console.log(`   Аты: ${admin.name || "Жоқ"}`)
      console.log(`   ID: ${admin.id}`)
      console.log(`   Тіркелген: ${admin.createdAt.toLocaleString()}`)
    })
    
    console.log("\n" + "=".repeat(60))
    
    return admins
  } catch (error) {
    console.error("❌ Қате:", error instanceof Error ? error.message : String(error))
    return []
  }
}

async function removeAdminRole(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`❌ Пайдаланушы табылмады: ${email}`)
      return false
    }

    if (user.role !== "admin") {
      console.log(`ℹ️  Пайдаланушы админ емес: ${email}`)
      return false
    }

    await prisma.user.update({
      where: { email },
      data: { role: "user" },
    })

    console.log(`✅ Админ рөлі жойылды: ${email}`)
    return true
  } catch (error) {
    console.error("❌ Қате:", error instanceof Error ? error.message : String(error))
    return false
  }
}

async function deleteUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`❌ Пайдаланушы табылмады: ${email}`)
      return false
    }

    await prisma.user.delete({
      where: { email },
    })

    console.log(`✅ Пайдаланушы жойылды: ${email}`)
    return true
  } catch (error) {
    console.error("❌ Қате:", error instanceof Error ? error.message : String(error))
    return false
  }
}

async function makeAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`❌ Пайдаланушы табылмады: ${email}`)
      console.log("\n💡 Алдымен сайтта тіркелу керек!")
      return false
    }

    if (user.role === "admin") {
      console.log(`✅ Пайдаланушы қазірдің өзінде админ: ${email}`)
      return true
    }

    await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    })

    console.log(`✅ Пайдаланушы админ рөліне ие болды: ${email}`)
    return true
  } catch (error) {
    console.error("❌ Қате:", error instanceof Error ? error.message : String(error))
    return false
  }
}

async function main() {
  console.log("\n" + "=".repeat(60))
  console.log("🔧 Админ рөлін қалпына келтіру")
  console.log("=".repeat(60))

  // Барлық админдерді көрсету
  const admins = await listAdmins()

  if (admins.length > 0) {
    console.log("\n📌 Нұсқалар:")
    console.log("1. Бұрынғы админнің рөлін 'user' деп өзгерту")
    console.log("2. Бұрынғы админді толығымен жою")
    console.log("3. Жаңа пайдаланушыны админ қылу")
    console.log("4. Шығу")

    const choice = await question("\nТаңдаңыз (1-4): ")

    if (choice === "1") {
      const email = await question("\n📧 Email енгізіңіз (рөлін өзгерту үшін): ")
      await removeAdminRole(email)
    } else if (choice === "2") {
      const email = await question("\n📧 Email енгізіңіз (жою үшін): ")
      const confirm = await question(`⚠️  Сіз шынымен ${email} пайдаланушысын жойғыңыз келе ме? (yes/no): `)
      if (confirm.toLowerCase() === "yes") {
        await deleteUser(email)
      } else {
        console.log("❌ Операция тоқтатылды")
      }
    } else if (choice === "3") {
      const email = await question("\n📧 Жаңа админ email енгізіңіз: ")
      await makeAdmin(email)
    } else {
      console.log("👋 Шығу...")
    }
  } else {
    console.log("\n💡 Жаңа админ құру:")
    const email = await question("📧 Email енгізіңіз: ")
    await makeAdmin(email)
  }

  await prisma.$disconnect()
  rl.close()
}

main().catch((error) => {
  console.error("❌ Қате:", error)
  process.exit(1)
})





