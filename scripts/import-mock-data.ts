/**
 * Барлық мок деректерді базаға сақтау скрипті
 * 
 * Пайдалану:
 * npx tsx scripts/import-mock-data.ts
 * 
 * Немесе:
 * npm run import-data
 */

import { readFileSync, existsSync } from "fs"
import { resolve } from "path"

// .env.local файлын жүктеу
const envPath = resolve(process.cwd(), ".env.local")
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8")
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, "")
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
}

import { createMediaItem } from "../lib/db"
import { getMediaItems } from "../lib/db-mock"
import type { MediaItem } from "../lib/types"

// Мок деректерді lib/db-mock.ts-тан алу
async function getMockData(): Promise<MediaItem[]> {
  const movies = await getMediaItems("movie")
  const books = await getMediaItems("book")
  const games = await getMediaItems("game")
  return [...movies, ...books, ...games]
}

async function importData() {
  console.log("📦 Мок деректерді базаға сақтау басталды...")
  const mockData = await getMockData()
  console.log(`📊 Барлығы ${mockData.length} элемент\n`)

  let successCount = 0
  let errorCount = 0

  for (const item of mockData) {
    try {
      // createMediaItem функциясы конфликттерді өздігінен өңдейді
      await createMediaItem(item)
      console.log(`✅ ${item.type}: ${item.title}`)
      successCount++
    } catch (error) {
      console.error(`❌ ${item.type}: ${item.title} - ${error instanceof Error ? error.message : String(error)}`)
      errorCount++
    }
  }

  console.log("\n" + "=".repeat(50))
  console.log(`✅ Сәтті сақталды: ${successCount}`)
  if (errorCount > 0) {
    console.log(`❌ Қателер: ${errorCount}`)
  }
  console.log("=".repeat(50))
  console.log("\n✨ Деректер импортталды!")
}

// Скриптті іске қосу
importData()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error("Қате:", error)
    process.exit(1)
  })
