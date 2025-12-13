/**
 * Жоқ суреттерді түзету скрипті
 * Базадағы суреттерді тексеріп, жоқ суреттерді placeholder-мен ауыстырады
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

// Prisma Client-ті құру (environment variables жүктелгеннен кейін)
const prisma = new PrismaClient()

// Жоқ суреттерді түзету
const missingImages: Record<string, string> = {
  "lotr-book-cover.jpg": "/the-lord-of-the-rings.png",
  "1984-book-cover.jpg": "/placeholder.svg",
  "matrix-poster.jpg": "/the-matrix.png",
}

async function fixMissingImages() {
  try {
    console.log("🔍 Суреттерді тексеру басталды...\n")

    const items = await prisma.mediaItem.findMany({
      select: {
        id: true,
        title: true,
        coverImage: true,
      },
    })

    let fixedCount = 0

    for (const item of items) {
      if (!item.coverImage) {
        console.log(`⚠️  ${item.title}: Сурет жоқ`)
        await prisma.mediaItem.update({
          where: { id: item.id },
          data: { coverImage: "/placeholder.svg" },
        })
        fixedCount++
        continue
      }

      // Жоқ суреттерді тексеру
      const imageName = item.coverImage.split("/").pop() || ""
      if (missingImages[imageName]) {
        console.log(`🔧 ${item.title}: ${item.coverImage} → ${missingImages[imageName]}`)
        await prisma.mediaItem.update({
          where: { id: item.id },
          data: { coverImage: missingImages[imageName] },
        })
        fixedCount++
      } else if (item.coverImage.startsWith("/") && !item.coverImage.includes("placeholder")) {
        // Сурет жолын тексеру (public папкасында бар ма?)
        const publicPath = resolve(process.cwd(), "public", item.coverImage.slice(1))
        if (!existsSync(publicPath)) {
          console.log(`⚠️  ${item.title}: Сурет табылмады: ${item.coverImage}`)
          await prisma.mediaItem.update({
            where: { id: item.id },
            data: { coverImage: "/placeholder.svg" },
          })
          fixedCount++
        }
      }
    }

    console.log("\n" + "=".repeat(50))
    console.log(`✅ Түзетілді: ${fixedCount} сурет`)
    console.log("=".repeat(50))

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error("❌ Қате:", error instanceof Error ? error.message : String(error))
    await prisma.$disconnect()
    process.exit(1)
  }
}

fixMissingImages()

