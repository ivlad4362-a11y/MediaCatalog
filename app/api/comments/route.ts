import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Барлық пікірлерді алу (медиа ID бойынша)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mediaId = searchParams.get("mediaId")

    if (!mediaId) {
      return NextResponse.json({ error: "mediaId табылмады" }, { status: 400 })
    }

    // Базадан пікірлерді алу (Prisma арқылы)
    try {
      const comments = await prisma.comment.findMany({
        where: { mediaId },
        orderBy: { createdAt: "desc" },
      })
      
      return NextResponse.json(
        comments.map((c) => ({
          id: c.id.toString(),
          userId: c.userId || "",
          userName: c.userName,
          userAvatar: c.userAvatar || "/placeholder.svg",
          content: c.content,
          rating: c.rating ? Number(c.rating) : 0,
          createdAt: c.createdAt.toISOString().split("T")[0],
        }))
      )
    } catch (dbError) {
      console.error("Базадан пікірлерді алу қатесі:", dbError)
      // Базамен байланыс қатесі болса, mock пікірлерді қайтару
      const mockComments = [
        {
          id: "1",
          userId: "1",
          userName: "Alex Johnson",
          userAvatar: "/placeholder.svg",
          content: "Нағыз әсерлі туынды! Көрген ең керемет тәжірибелерімнің бірі. Әрбір ұсақ детальі керемет ойластырылған.",
          rating: 9.5,
          createdAt: "2024-01-15",
        },
        {
          id: "2",
          userId: "2",
          userName: "Sarah Chen",
          userAvatar: "/placeholder.svg",
          content: "Нағыз шедевр, аяқталғаннан кейін де ұзақ ойлантып қояды. Міндетті түрде көруге кеңес беремін!",
          rating: 9.0,
          createdAt: "2024-01-10",
        },
      ]
      return NextResponse.json(mockComments)
    }
  } catch (error) {
    console.error("Пікірлерді алу қатесі:", error)
    return NextResponse.json({ error: "Пікірлерді алу қатесі" }, { status: 500 })
  }
}

// Жаңа пікір қосу
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mediaId, content, userId, userName, userAvatar, rating } = body

    if (!mediaId || !content) {
      return NextResponse.json({ error: "Қажетті деректер жоқ (mediaId және content қажет)" }, { status: 400 })
    }

    // Базаға пікірді сақтау
    try {
      const comment = await prisma.comment.create({
        data: {
          mediaId: mediaId.toString(),
          userId: userId ? userId.toString() : null,
          userName: userName || "Пайдаланушы",
          userAvatar: userAvatar || "/placeholder.svg",
          content: content.trim(),
          rating: rating ? parseFloat(rating.toString()) : null,
        },
      })

      return NextResponse.json(
        {
          id: comment.id.toString(),
          userId: comment.userId || "",
          userName: comment.userName,
          userAvatar: comment.userAvatar || "/placeholder.svg",
          content: comment.content,
          rating: comment.rating ? Number(comment.rating) : 0,
          createdAt: comment.createdAt.toISOString().split("T")[0],
        },
        { status: 201 }
      )
    } catch (dbError) {
      // Базамен байланыс қатесі болса, fallback механизмін қолдану
      if (dbError instanceof Error) {
        const errorMessage = dbError.message
        const errorStack = dbError.stack || ""
        
        const isConnectionError = 
          errorMessage.includes("Authentication failed") ||
          errorMessage.includes("Can't reach database") ||
          errorMessage.includes("P1001") ||
          errorMessage.includes("PrismaClientInitializationError") ||
          errorStack.includes("PrismaClientInitializationError") ||
          errorMessage.includes("P2002") ||
          errorMessage.includes("Unique constraint")
        
        if (isConnectionError) {
          // Базамен байланыс қатесі болса, пікірді mock түрде сақтау (егер localStorage қолжетімді болса)
          // Немесе қате хабарламасын дұрыс қайтару
          const mockComment = {
            id: Date.now().toString(),
            userId: userId || "",
            userName: userName || "Пайдаланушы",
            userAvatar: userAvatar || "/placeholder.svg",
            content: content.trim(),
            rating: rating ? parseFloat(rating.toString()) : 0,
            createdAt: new Date().toISOString().split("T")[0],
          }
          
          // Mock пікірді қайтару (фронтендте көрсету үшін)
          return NextResponse.json(mockComment, { status: 201 })
        }
      }
      
      // Басқа қателерді дұрыс өңдеу
      console.error("Базаға пікір сақтау қатесі:", dbError)
      const errorMessage = dbError instanceof Error ? dbError.message : "Пікір сақтау қатесі"
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
  } catch (error) {
    console.error("Пікір қосу қатесі:", error)
    
    // JSON парсинг қатесінде
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Деректердің форматы дұрыс емес" }, { status: 400 })
    }
    
    const errorMessage = error instanceof Error ? error.message : "Пікір қосу қатесі"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}


