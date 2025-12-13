import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-helpers"
import { createMediaItem } from "@/lib/db"
import { getMediaItems } from "@/lib/db"
import { mockMovies, mockBooks, mockGames } from "@/lib/db-mock"
import type { MediaItem } from "@/lib/types"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

// .mock-media.json файлынан мәліметтерді оқу
function loadMediaFromFile(): { movies: MediaItem[]; books: MediaItem[]; games: MediaItem[] } | null {
  const MEDIA_FILE = join(process.cwd(), ".mock-media.json")
  try {
    if (existsSync(MEDIA_FILE)) {
      const data = readFileSync(MEDIA_FILE, "utf-8")
      
      if (!data || data.trim().length === 0) {
        return null
      }
      
      const parsed = JSON.parse(data)
      return {
        movies: Array.isArray(parsed.movies) ? parsed.movies : [],
        books: Array.isArray(parsed.books) ? parsed.books : [],
        games: Array.isArray(parsed.games) ? parsed.games : [],
      }
    }
  } catch (error) {
    console.error("Материалдарды файлдан жүктеу қатесі:", error)
  }
  return null
}

// Mock мәліметтерді базаға импорттау (тек админ үшін)
export async function POST() {
  const authResult = await requireAdmin()
  if (authResult) return authResult

  try {
    // Базада материалдар бар ма тексеру
    let existingItems: MediaItem[] = []
    try {
      existingItems = await getMediaItems()
    } catch (error) {
      console.error("Базадан материалдарды алу қатесі:", error)
      // Базамен байланыс қатесі болса да, импорттауды жалғастыру
    }
    
    // Егер барлық материалдар бар болса (фильмдер, кітаптар, ойындар), импорттауды өткізіп жіберу
    if (existingItems.length > 50) {
      return NextResponse.json({ 
        message: `Базада ${existingItems.length} материал бар. Импорттау керек емес.`,
        imported: 0,
        skipped: existingItems.length
      })
    }

    let importedCount = 0
    let skippedCount = 0
    const errors: string[] = []

    // Алдымен .mock-media.json файлынан мәліметтерді оқу
    const fileData = loadMediaFromFile()
    let itemsToImport: MediaItem[] = []
    
    if (fileData && (fileData.movies.length > 0 || fileData.books.length > 0 || fileData.games.length > 0)) {
      // Файлда мәліметтер бар - оларды пайдалану
      console.log(`Файлдан мәліметтер табылды: ${fileData.movies.length} фильм, ${fileData.books.length} кітап, ${fileData.games.length} ойын`)
      itemsToImport = [...fileData.movies, ...fileData.books, ...fileData.games]
    } else {
      // Файлда мәліметтер жоқ - бастапқы mock мәліметтерден импорттау
      console.log("Файлда мәліметтер жоқ, бастапқы mock мәліметтерден импорттау")
      itemsToImport = [...mockMovies, ...mockBooks, ...mockGames]
    }
    
    // Материалдарды импорттау (дубликаттарды өткізіп жіберу)
    for (const item of itemsToImport) {
      try {
        // Дубликатты тексеру - базада бар ма?
        const isDuplicate = existingItems.some(
          (existing) => existing.title.toLowerCase() === item.title.toLowerCase() && existing.type === item.type
        )
        
        if (isDuplicate) {
          skippedCount++
          continue
        }
        
        await createMediaItem(item)
        importedCount++
      } catch (error) {
        skippedCount++
        const errorMsg = error instanceof Error ? error.message : "Белгісіз қате"
        // Дубликат қатесінде хабарламаны қоспау
        if (!errorMsg.includes("қазірдің өзінде бар")) {
          errors.push(`${item.type === "movie" ? "Фильм" : item.type === "book" ? "Кітап" : "Ойын"} "${item.title}": ${errorMsg}`)
        }
      }
    }

    return NextResponse.json({
      message: `${importedCount} материал сәтті импортталды${skippedCount > 0 ? `, ${skippedCount} өткізілді` : ""}`,
      imported: importedCount,
      skipped: skippedCount,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined, // Тек алғашқы 10 қатені көрсету
      source: fileData ? "file" : "mock" // Қайдан импортталғанын көрсету
    }, { status: 200 })
  } catch (error) {
    console.error("Mock мәліметтерді импорттау қатесі:", error)
    const errorMessage = error instanceof Error ? error.message : "Mock мәліметтерді импорттау қатесі"
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Дұрыс JSON response қайтару
    return NextResponse.json({ 
      error: errorMessage,
      details: errorStack ? errorStack.substring(0, 200) : undefined
    }, { status: 500 })
  }
}

