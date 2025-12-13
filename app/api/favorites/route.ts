import { NextResponse } from "next/server"
import { getFavorites, addFavorite, removeFavorite, isFavorite } from "@/lib/db"
import { checkAuth } from "@/lib/auth-helpers"

// Барлық таңдаулыларды алу
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    // Пайдаланушыны тексеру
    const user = await checkAuth()
    if (!user) {
      return NextResponse.json({ error: "Кіру қажет" }, { status: 401 })
    }

    // Әкімші үшін барлық таңдаулыларды алу (userId берілмеген болса)
    // Жай пайдаланушы үшін өзінің таңдаулыларын алу
    let favoritesToLoad: string | undefined
    if (user.role === "admin" && !userId) {
      // Админ үшін барлық таңдаулыларды алу (undefined = барлық)
      favoritesToLoad = undefined
    } else if (userId) {
      // Конкретті пайдаланушының таңдаулыларын алу
      favoritesToLoad = userId
    } else {
      // Жай пайдаланушы үшін өзінің таңдаулыларын алу
      favoritesToLoad = user.id
    }
    
    const favorites = await getFavorites(favoritesToLoad)
    
    // Таңдаулылармен бірге материалдарды да алу
    const favoritesWithMedia = await Promise.all(
      favorites.map(async (fav) => {
        try {
          const { getMediaItem } = await import("@/lib/db")
          const mediaItem = await getMediaItem(fav.mediaId)
          return {
            ...fav,
            media: mediaItem,
          }
        } catch (error) {
          console.error(`Материалды алу қатесі (${fav.mediaId}):`, error)
          return {
            ...fav,
            media: null,
          }
        }
      })
    )

    return NextResponse.json(favoritesWithMedia)
  } catch (error) {
    console.error("Таңдаулыларды алу қатесі:", error)
    return NextResponse.json({ error: "Таңдаулыларды алу қатесі" }, { status: 500 })
  }
}

// Таңдаулыға қосу
export async function POST(request: Request) {
  try {
    const user = await checkAuth()
    if (!user) {
      return NextResponse.json({ error: "Кіру қажет" }, { status: 401 })
    }

    const body = await request.json()
    const { mediaId } = body

    if (!mediaId) {
      return NextResponse.json({ error: "mediaId табылмады" }, { status: 400 })
    }

    const favorite = await addFavorite(user.id, mediaId)
    
    if (!favorite) {
      return NextResponse.json({ error: "Таңдаулыға қосу қатесі" }, { status: 500 })
    }

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error("Таңдаулыға қосу қатесі:", error)
    
    // Дубликат қатесін тексеру
    if (error instanceof Error && (error.message.includes("Unique constraint") || error.message.includes("P2002"))) {
      return NextResponse.json({ error: "Таңдаулы қазірдің өзінде бар" }, { status: 400 })
    }
    
    const errorMessage = error instanceof Error ? error.message : "Таңдаулыға қосу қатесі"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// Таңдаулыдан жою
export async function DELETE(request: Request) {
  try {
    const user = await checkAuth()
    if (!user) {
      return NextResponse.json({ error: "Кіру қажет" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mediaId = searchParams.get("mediaId")

    if (!mediaId) {
      return NextResponse.json({ error: "mediaId табылмады" }, { status: 400 })
    }

    const success = await removeFavorite(user.id, mediaId)
    
    if (!success) {
      return NextResponse.json({ error: "Таңдаулыдан жою қатесі" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Таңдаулыдан жою қатесі:", error)
    const errorMessage = error instanceof Error ? error.message : "Таңдаулыдан жою қатесі"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

