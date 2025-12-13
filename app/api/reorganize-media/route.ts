import { NextResponse } from "next/server"
import { getMediaItems } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"

// Материалдардың санын алу (тек админ үшін)
export async function POST() {
  const authResult = await requireAdmin()
  if (authResult) return authResult

  try {
    // Барлық материалдарды базадан алу
    const movies = await getMediaItems("movie")
    const books = await getMediaItems("book")
    const games = await getMediaItems("game")
    
    return NextResponse.json({ 
      message: `Базадағы материалдар: ${movies.length} фильм, ${books.length} кітап, ${games.length} ойын`,
      movies: movies.length,
      books: books.length,
      games: games.length
    })
  } catch (error) {
    console.error("Материалдарды алу қатесі:", error)
    const errorMessage = error instanceof Error ? error.message : "Материалдарды алу қатесі"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

