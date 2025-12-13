/**
 * Базадағы мәліметтерді көру скрипті
 * 
 * Пайдалану:
 * npx tsx scripts/view-database.ts
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

async function viewDatabase() {
  try {
    console.log("📊 Базадағы мәліметтер:\n")
    console.log("=".repeat(60))

    // Пайдаланушылар
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    console.log(`\n👥 Пайдаланушылар (${users.length}):`)
    console.log("-".repeat(60))
    if (users.length === 0) {
      console.log("  Пайдаланушылар жоқ")
    } else {
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email}`)
        console.log(`     Аты: ${user.name || "Жоқ"}`)
        console.log(`     Рөл: ${user.role}`)
        console.log(`     Тіркелген: ${user.createdAt.toLocaleDateString()}`)
        console.log()
      })
    }

    // Фильмдер
    const movies = await prisma.mediaItem.findMany({
      where: { type: "movie" },
      select: {
        id: true,
        title: true,
        year: true,
        rating: true,
        popularity: true,
      },
      orderBy: {
        popularity: "desc",
      },
    })

    console.log(`\n🎬 Фильмдер (${movies.length}):`)
    console.log("-".repeat(60))
    if (movies.length === 0) {
      console.log("  Фильмдер жоқ")
    } else {
      movies.slice(0, 10).forEach((movie, index) => {
        console.log(`  ${index + 1}. ${movie.title} (${movie.year})`)
        console.log(`     Рейтинг: ${movie.rating} | Популярлық: ${movie.popularity}`)
      })
      if (movies.length > 10) {
        console.log(`  ... және тағы ${movies.length - 10} фильм`)
      }
    }

    // Кітаптар
    const books = await prisma.mediaItem.findMany({
      where: { type: "book" },
      select: {
        id: true,
        title: true,
        year: true,
        rating: true,
        popularity: true,
      },
      orderBy: {
        popularity: "desc",
      },
    })

    console.log(`\n📚 Кітаптар (${books.length}):`)
    console.log("-".repeat(60))
    if (books.length === 0) {
      console.log("  Кітаптар жоқ")
    } else {
      books.slice(0, 10).forEach((book, index) => {
        console.log(`  ${index + 1}. ${book.title} (${book.year})`)
        console.log(`     Рейтинг: ${book.rating} | Популярлық: ${book.popularity}`)
      })
      if (books.length > 10) {
        console.log(`  ... және тағы ${books.length - 10} кітап`)
      }
    }

    // Ойындар
    const games = await prisma.mediaItem.findMany({
      where: { type: "game" },
      select: {
        id: true,
        title: true,
        year: true,
        rating: true,
        popularity: true,
      },
      orderBy: {
        popularity: "desc",
      },
    })

    console.log(`\n🎮 Ойындар (${games.length}):`)
    console.log("-".repeat(60))
    if (games.length === 0) {
      console.log("  Ойындар жоқ")
    } else {
      games.slice(0, 10).forEach((game, index) => {
        console.log(`  ${index + 1}. ${game.title} (${game.year})`)
        console.log(`     Рейтинг: ${game.rating} | Популярлық: ${game.popularity}`)
      })
      if (games.length > 10) {
        console.log(`  ... және тағы ${games.length - 10} ойын`)
      }
    }

    // Жанрлар
    const genres = await prisma.genre.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    console.log(`\n🏷️ Жанрлар (${genres.length}):`)
    console.log("-".repeat(60))
    if (genres.length === 0) {
      console.log("  Жанрлар жоқ")
    } else {
      const genreNames = genres.map((g) => g.name).join(", ")
      console.log(`  ${genreNames}`)
    }

    // Статистика
    const totalMedia = movies.length + books.length + games.length
    console.log(`\n📈 Статистика:`)
    console.log("-".repeat(60))
    console.log(`  Барлығы материалдар: ${totalMedia}`)
    console.log(`  Фильмдер: ${movies.length}`)
    console.log(`  Кітаптар: ${books.length}`)
    console.log(`  Ойындар: ${games.length}`)
    console.log(`  Пайдаланушылар: ${users.length}`)
    console.log(`  Жанрлар: ${genres.length}`)

    console.log("\n" + "=".repeat(60))
    console.log("✅ Мәліметтер көрсетілді!")

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error("❌ Қате:", error instanceof Error ? error.message : String(error))
    await prisma.$disconnect()
    process.exit(1)
  }
}

viewDatabase()












