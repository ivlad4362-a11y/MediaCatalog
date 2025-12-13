import { NextResponse } from "next/server"
import { searchMediaItems } from "@/lib/db"

// Іздеу
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    if (!query.trim()) {
      return NextResponse.json([])
    }

    const results = await searchMediaItems(query.trim())
    return NextResponse.json(results)
  } catch (error) {
    // Базамен байланыс қатесі болса, mock мәліметтерден іздеу
    // Қате хабарламасын консольге баспау (fallback механизмі қосылған)
    if (error instanceof Error) {
      const errorMessage = error.message
      const errorStack = error.stack || ""
      
      const isConnectionError = 
        errorMessage.includes("Authentication failed") ||
        errorMessage.includes("Can't reach database") ||
        errorMessage.includes("P1001") ||
        errorMessage.includes("PrismaClientInitializationError") ||
        errorStack.includes("PrismaClientInitializationError")
      
      if (isConnectionError) {
        try {
          const { mockMovies, mockBooks, mockGames } = await import("@/lib/db-mock")
          const allItems = [...mockMovies, ...mockBooks, ...mockGames]
          const queryLower = query.toLowerCase().trim()
          
          const filtered = allItems.filter((item) =>
            item.title.toLowerCase().includes(queryLower) ||
            item.description.toLowerCase().includes(queryLower) ||
            item.genre.some((g) => g.toLowerCase().includes(queryLower))
          )
          
          return NextResponse.json(filtered)
        } catch (mockError) {
          // Import қатесінде ғана қате хабарлама беру
          console.error("Mock мәліметтерден іздеу қатесі:", mockError)
          return NextResponse.json([])
        }
      }
    }
    
    return NextResponse.json([])
  }
}
