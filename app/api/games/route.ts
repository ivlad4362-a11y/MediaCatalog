import { NextResponse } from "next/server"
import { getMediaItems, createMediaItem, updateMediaItem, deleteMediaItem } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"
import type { MediaItem } from "@/lib/types"

// Барлық ойындарды алу
export async function GET() {
  try {
    // getMediaItems функциясы қате болғанда өзі fallback механизмін қолданады
    let games = await getMediaItems("game")
    return NextResponse.json(games)
  } catch (error) {
    // Қосымша fallback - егер getMediaItems қате берсе де, mock мәліметтерден қалпына келтіру
    // Қате хабарламасын консольге баспау (fallback механизмі қосылған)
    try {
      const { mockGames } = await import("@/lib/db-mock")
      return NextResponse.json(mockGames.filter((g) => g.type === "game"))
    } catch (mockError) {
      // Import қатесінде ғана қате хабарлама беру
      console.error("Mock мәліметтерден қалпына келтіру қатесі:", mockError)
      return NextResponse.json([])
    }
  }
}

// Жаңа ойын қосу (тек админ үшін)
export async function POST(request: Request) {
  // Админ рөлін тексеру
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const body = await request.json()
    const newGame: Omit<MediaItem, "id"> & { id?: string } = {
      ...body,
      type: "game",
    }
    const game = await createMediaItem(newGame)
    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error("Ойын қосу қатесі:", error)
    const errorMessage = error instanceof Error ? error.message : "Ойын қосу қатесі"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}

// Ойынды өзгерту (тек админ үшін)
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
      return NextResponse.json({ error: "Ойын табылмады" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Ойынды өзгерту қатесі:", error)
    return NextResponse.json({ error: "Ойынды өзгерту қатесі" }, { status: 400 })
  }
}

// Ойынды жою (тек админ үшін)
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
      return NextResponse.json({ error: "Ойын табылмады" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ойынды жою қатесі:", error)
    return NextResponse.json({ error: "Ойынды жою қатесі" }, { status: 400 })
  }
}
