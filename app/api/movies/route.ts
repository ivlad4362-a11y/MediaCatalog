import { NextResponse } from "next/server"
import { getMediaItems, createMediaItem, updateMediaItem, deleteMediaItem } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"
import type { MediaItem } from "@/lib/types"

// Барлық фильмдерді алу
export async function GET() {
  try {
    // getMediaItems функциясы қате болғанда өзі fallback механизмін қолданады
    let movies = await getMediaItems("movie")
    return NextResponse.json(movies)
  } catch (error) {
    // Қосымша fallback - егер getMediaItems қате берсе де, mock мәліметтерден қалпына келтіру
    // Қате хабарламасын консольге баспау (fallback механизмі қосылған)
    try {
      const { mockMovies } = await import("@/lib/db-mock")
      return NextResponse.json(mockMovies.filter((m) => m.type === "movie"))
    } catch (mockError) {
      // Import қатесінде ғана қате хабарлама беру
      console.error("Mock мәліметтерден қалпына келтіру қатесі:", mockError)
      return NextResponse.json([])
    }
  }
}

// Жаңа фильм қосу (тек админ үшін)
export async function POST(request: Request) {
  // Админ рөлін тексеру
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const body = await request.json()
    const newMovie: Omit<MediaItem, "id"> & { id?: string } = {
      ...body,
      type: "movie",
    }
    const movie = await createMediaItem(newMovie)
    return NextResponse.json(movie, { status: 201 })
  } catch (error) {
    console.error("Фильм қосу қатесі:", error)
    const errorMessage = error instanceof Error ? error.message : "Фильм қосу қатесі"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}

// Фильмді өзгерту (тек админ үшін)
export async function PUT(request: Request) {
  // Админ рөлін тексеру
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "ID табылмады" }, { status: 400 })
    }

    const updated = await updateMediaItem(id, updates)
    if (!updated) {
      return NextResponse.json({ error: "Фильм табылмады" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Фильмді өзгерту қатесі:", error)
    return NextResponse.json({ error: "Фильмді өзгерту қатесі" }, { status: 400 })
  }
}

// Фильмді жою (тек админ үшін)
export async function DELETE(request: Request) {
  // Админ рөлін тексеру
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID табылмады" }, { status: 400 })
    }

    const success = await deleteMediaItem(id)
    if (!success) {
      return NextResponse.json({ error: "Фильм табылмады" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Фильмді жою қатесі:", error)
    return NextResponse.json({ error: "Фильмді жою қатесі" }, { status: 400 })
  }
}
