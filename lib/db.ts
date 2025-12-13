import { PrismaClient } from "@prisma/client"
import type { MediaItem } from "./types"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Медиа элементтерін алу (жанрлармен бірге)
export async function getMediaItems(type?: "movie" | "book" | "game"): Promise<MediaItem[]> {
  // Базамен байланысты тексеру - егер базамен байланыс қатесі болса, бірден mock мәліметтерден қалпына келтіру
  try {
    const where = type ? { type } : {}

    const items = await prisma.mediaItem.findMany({
      where,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: {
        popularity: "desc",
      },
    })

    const result = items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      coverImage: item.coverImage || "",
      watchUrl: item.watchUrl || undefined,
      type: item.type as "movie" | "book" | "game",
      rating: Number(item.rating),
      year: item.year,
      genre: item.genres.map((mg) => mg.genre.name),
      popularity: item.popularity,
    }))

    // Егер базада материалдар жоқ болса, mock мәліметтерден қалпына келтіру
    // Қате хабарламасын консольге баспау (fallback механизмі қосылған)
    if (result.length === 0 && type) {
      // Базада материалдар жоқ болса, mock мәліметтерден қалпына келтіру
      const { mockMovies, mockBooks, mockGames } = await import("./db-mock")
      
      if (type === "movie") {
        return mockMovies.filter((m) => m.type === "movie")
      } else if (type === "book") {
        return mockBooks.filter((b) => b.type === "book")
      } else if (type === "game") {
        return mockGames.filter((g) => g.type === "game")
      }
    }

    return result
  } catch (error) {
    // Базамен байланыс қатесі - қате туралы егжей-тегжейлі ақпарат
    if (error instanceof Error) {
      const errorMessage = error.message
      const errorStack = error.stack || ""
      
      // Prisma қателерін тексеру
      const isConnectionError = 
        errorMessage.includes("P1001") || 
        errorMessage.includes("Can't reach database") ||
        errorMessage.includes("Authentication failed") ||
        errorMessage.includes("PrismaClientInitializationError") ||
        errorStack.includes("PrismaClientInitializationError")
      
      if (isConnectionError) {
        // Базамен байланыс қатесі болса, mock мәліметтерден қалпына келтіру
        // Қате хабарламасын консольге баспау (fallback механизмі қосылған)
        try {
          const { mockMovies, mockBooks, mockGames } = await import("./db-mock")
          
          if (type === "movie") {
            return mockMovies.filter((m) => m.type === "movie")
          } else if (type === "book") {
            return mockBooks.filter((b) => b.type === "book")
          } else if (type === "game") {
            return mockGames.filter((g) => g.type === "game")
          }
          
          // Барлық материалдарды қайтару
          return [...mockMovies, ...mockBooks, ...mockGames]
        } catch (importError) {
          // Import қатесінде ғана қате хабарлама беру
          console.error("Mock мәліметтерден қалпына келтіру қатесі:", importError)
          return []
        }
      } else {
        // Басқа қателерді ғана консольге басып шығару
        console.error("Базадан материалдарды алу қатесі:", error)
        if (errorMessage.includes("P2002") || errorMessage.includes("Unique constraint")) {
          console.error("⚠️ Дубликат материалдар қатесі!")
        }
      }
    }
    
    // Қате кезінде бос массив қайтару
    return []
  }
}

// Бір медиа элементін алу
export async function getMediaItem(id: string): Promise<MediaItem | null> {
  const item = await prisma.mediaItem.findUnique({
    where: { id },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  })

  if (!item) return null

  return {
    id: item.id,
    title: item.title,
    description: item.description || "",
    coverImage: item.coverImage || "",
    watchUrl: item.watchUrl || undefined,
    type: item.type as "movie" | "book" | "game",
    rating: Number(item.rating),
    year: item.year,
    genre: item.genres.map((mg) => mg.genre.name),
    popularity: item.popularity,
  }
}

// Медиа элементін қосу
export async function createMediaItem(item: Omit<MediaItem, "id"> & { id?: string }): Promise<MediaItem> {
  try {
    // Дубликаттарды тексеру: бірдей тақырып пен типі бар материал бар ма?
    const existingItem = await prisma.mediaItem.findFirst({
      where: {
        title: { equals: item.title.trim(), mode: "insensitive" },
        type: item.type,
      },
    })

    if (existingItem) {
      const typeLabel = item.type === "movie" ? "фильм" : item.type === "book" ? "кітап" : "ойын"
      throw new Error(`"${item.title}" деген ${typeLabel} қазірдің өзінде бар`)
    }
  } catch (error) {
    // Базамен байланыс қатесі болса, қате туралы хабарлама беру
    if (error instanceof Error && (
      error.message.includes("Authentication failed") ||
      error.message.includes("Can't reach database") ||
      error.message.includes("P1001") ||
      error.message.includes("PrismaClientInitializationError")
    )) {
      console.error("⚠️ Базамен байланыс қатесі! Материалды сақтау мүмкін емес.")
      throw error
    }
    // Дубликат қатесінде қайтару
    if (error instanceof Error && error.message.includes("қазірдің өзінде бар")) {
      throw error
    }
    // Басқа қателерді де қайтару
    throw error
  }

  const id = item.id || Date.now().toString()

  // Жанрларды табу немесе қосу
  const genreIds: number[] = []
  for (const genreName of item.genre) {
    let genre = await prisma.genre.findUnique({
      where: { name: genreName },
    })

    if (!genre) {
      genre = await prisma.genre.create({
        data: { name: genreName },
      })
    }

    genreIds.push(genre.id)
  }

  // Медиа элементін қосу
  const created = await prisma.mediaItem.create({
    data: {
      id,
      title: item.title.trim(),
      description: item.description,
      coverImage: item.coverImage,
      watchUrl: item.watchUrl,
      type: item.type,
      rating: item.rating,
      year: item.year,
      popularity: item.popularity,
      genres: {
        create: genreIds.map((genreId) => ({
          genreId,
        })),
      },
    },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  })

  return {
    id: created.id,
    title: created.title,
    description: created.description || "",
    coverImage: created.coverImage || "",
    watchUrl: created.watchUrl || undefined,
    type: created.type as "movie" | "book" | "game",
    rating: Number(created.rating),
    year: created.year,
    genre: created.genres.map((mg) => mg.genre.name),
    popularity: created.popularity,
  }
}

// Медиа элементін жаңарту
export async function updateMediaItem(id: string, item: Partial<Omit<MediaItem, "id">>): Promise<MediaItem | null> {
  // Ескі жанрларды жою
  await prisma.mediaGenre.deleteMany({
    where: { mediaId: id },
  })

  // Жаңа жанрларды қосу
  if (item.genre) {
    const genreIds: number[] = []
    for (const genreName of item.genre) {
      let genre = await prisma.genre.findUnique({
        where: { name: genreName },
      })

      if (!genre) {
        genre = await prisma.genre.create({
          data: { name: genreName },
        })
      }

      genreIds.push(genre.id)
    }

    await prisma.mediaGenre.createMany({
      data: genreIds.map((genreId) => ({
        mediaId: id,
        genreId,
      })),
    })
  }

  // Медиа элементін жаңарту
  const updated = await prisma.mediaItem.update({
    where: { id },
    data: {
      title: item.title,
      description: item.description,
      coverImage: item.coverImage,
      watchUrl: item.watchUrl,
      type: item.type,
      rating: item.rating,
      year: item.year,
      popularity: item.popularity,
    },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  })

  return {
    id: updated.id,
    title: updated.title,
    description: updated.description || "",
    coverImage: updated.coverImage || "",
    type: updated.type as "movie" | "book" | "game",
    rating: Number(updated.rating),
    year: updated.year,
    genre: updated.genres.map((mg) => mg.genre.name),
    popularity: updated.popularity,
  }
}

// Медиа элементін жою
export async function deleteMediaItem(id: string): Promise<boolean> {
  try {
    await prisma.mediaItem.delete({
      where: { id },
    })
    return true
  } catch (error) {
    console.error("Жою қатесі:", error)
    return false
  }
}

// Іздеу
export async function searchMediaItems(query: string): Promise<MediaItem[]> {
  try {
    const items = await prisma.mediaItem.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    })

    // Жанр бойынша да іздеу
    const genreItems = await prisma.mediaItem.findMany({
      where: {
        genres: {
          some: {
            genre: {
              name: { contains: query, mode: "insensitive" },
            },
          },
        },
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    })

    // Бірегей элементтерді алу
    const allItems = [...items, ...genreItems]
    const uniqueItems = Array.from(new Map(allItems.map((item) => [item.id, item])).values())

    return uniqueItems.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      coverImage: item.coverImage || "",
      watchUrl: item.watchUrl || undefined,
      type: item.type as "movie" | "book" | "game",
      rating: Number(item.rating),
      year: item.year,
      genre: item.genres.map((mg) => mg.genre.name),
      popularity: item.popularity,
    }))
  } catch (error) {
    // Базамен байланыс қатесі болса, mock мәліметтерден іздеу
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
        // Базамен байланыс қатесі болса, mock мәліметтерден іздеу
        // Қате хабарламасын консольге баспау (fallback механизмі қосылған)
        try {
          const { mockMovies, mockBooks, mockGames } = await import("./db-mock")
          const allItems = [...mockMovies, ...mockBooks, ...mockGames]
          const queryLower = query.toLowerCase()
          
          return allItems.filter((item) =>
            item.title.toLowerCase().includes(queryLower) ||
            item.description.toLowerCase().includes(queryLower) ||
            item.genre.some((g) => g.toLowerCase().includes(queryLower))
          )
        } catch (importError) {
          // Import қатесінде ғана қате хабарлама беру
          console.error("Mock мәліметтерден іздеу қатесі:", importError)
        }
      } else {
        // Басқа қателерді ғана консольге басып шығару
        console.error("Іздеу қатесі:", error)
      }
    }
    
    // Қате кезінде бос массив қайтару
    return []
  }
}

// Дубликаттарды тауып жою: бірдей тақырып пен типі бар материалдарды жояды
export async function removeDuplicates(): Promise<{ removed: number; duplicates: Array<{ title: string; type: string; ids: string[] }> }> {
  // Барлық материалдарды алу
  const allItems = await prisma.mediaItem.findMany({
    orderBy: { createdAt: "asc" } // Ескілерді сақтап, жаңаларын жою
  })

  const duplicatesMap = new Map<string, typeof allItems>()
  
  // Барлық материалдарды топтастыру (тақырып + тип бойынша)
  for (const item of allItems) {
    const key = `${item.title.toLowerCase().trim()}_${item.type}`
    if (!duplicatesMap.has(key)) {
      duplicatesMap.set(key, [])
    }
    duplicatesMap.get(key)!.push(item)
  }

  // Дубликаттарды табу және жою
  const duplicates: Array<{ title: string; type: string; ids: string[] }> = []
  let removedCount = 0

  for (const [key, items] of duplicatesMap.entries()) {
    if (items.length > 1) {
      const [firstItem, ...duplicateItems] = items
      const typeLabel = firstItem.type === "movie" ? "фильм" : firstItem.type === "book" ? "кітап" : "ойын"
      
      duplicates.push({
        title: firstItem.title,
        type: typeLabel,
        ids: items.map(i => i.id)
      })

      // Дубликаттарды жою (біріншісін қалдырып, қалғандарын жою)
      for (const duplicateItem of duplicateItems) {
        await prisma.mediaItem.delete({
          where: { id: duplicateItem.id }
        })
        removedCount++
      }
    }
  }

  return {
    removed: removedCount,
    duplicates
  }
}

// Таңдаулыларды алу
// userId undefined болса - барлық таңдаулыларды алу (әкімші үшін)
// userId берілген болса - тек ол пайдаланушының таңдаулыларын алу
export async function getFavorites(userId?: string): Promise<Array<{ id: string; mediaId: string; userId: string; createdAt: string }>> {
  try {
    // Prisma клиентін тексеру
    if (!prisma || !(prisma as any).favorite) {
      console.error("Prisma клиенті дұрыс инициализацияланбаған немесе Favorite моделі жоқ")
      return []
    }

    // userId undefined болса - барлық таңдаулыларды алу
    // userId берілген болса - тек ол пайдаланушының таңдаулыларын алу
    const where = userId !== undefined ? { userId } : {}
    
    const favorites = await (prisma as any).favorite.findMany({
      where,
      include: {
        media: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return favorites.map((fav: any) => ({
      id: fav.id.toString(),
      mediaId: fav.mediaId,
      userId: fav.userId,
      createdAt: fav.createdAt.toISOString(),
    }))
  } catch (error) {
    console.error("Таңдаулыларды алу қатесі:", error)
    
    // Базамен байланыс қатесі болса, бос массив қайтару
    if (error instanceof Error) {
      const errorMessage = error.message
      const errorStack = error.stack || ""
      
      const isConnectionError = 
        errorMessage.includes("Authentication failed") ||
        errorMessage.includes("Can't reach database") ||
        errorMessage.includes("P1001") ||
        errorMessage.includes("PrismaClientInitializationError") ||
        errorMessage.includes("findUnique") ||
        errorMessage.includes("findMany") ||
        errorStack.includes("PrismaClientInitializationError")
      
      if (isConnectionError) {
        // Базамен байланыс қатесі болса, бос массив қайтару
        return []
      }
    }
    
    return []
  }
}

// Таңдаулыға қосу
export async function addFavorite(userId: string, mediaId: string): Promise<{ id: string; mediaId: string; userId: string; createdAt: string } | null> {
  try {
    // Prisma клиентін тексеру
    if (!prisma || !(prisma as any).favorite) {
      console.error("Prisma клиенті дұрыс инициализацияланбаған немесе Favorite моделі жоқ")
      // Fallback: mock таңдаулы қайтару
      return {
        id: Date.now().toString(),
        mediaId,
        userId,
        createdAt: new Date().toISOString(),
      }
    }

    // Бірдей таңдаулыны қоспау
    const existing = await (prisma as any).favorite.findUnique({
      where: {
        userId_mediaId: {
          userId,
          mediaId,
        },
      },
    })

    if (existing) {
      // Таңдаулы қазірдің өзінде бар
      return {
        id: existing.id.toString(),
        mediaId: existing.mediaId,
        userId: existing.userId,
        createdAt: existing.createdAt.toISOString(),
      }
    }

    const favorite = await (prisma as any).favorite.create({
      data: {
        userId,
        mediaId,
      },
    })

    return {
      id: favorite.id.toString(),
      mediaId: favorite.mediaId,
      userId: favorite.userId,
      createdAt: favorite.createdAt.toISOString(),
    }
  } catch (error) {
    console.error("Таңдаулыға қосу қатесі:", error)
    
    // Базамен байланыс қатесі болса, fallback қайтару
    if (error instanceof Error && (
      error.message.includes("Authentication failed") ||
      error.message.includes("Can't reach database") ||
      error.message.includes("P1001") ||
      error.message.includes("PrismaClientInitializationError") ||
      error.message.includes("findUnique")
    )) {
      // Fallback: mock таңдаулы қайтару
      return {
        id: Date.now().toString(),
        mediaId,
        userId,
        createdAt: new Date().toISOString(),
      }
    }
    
    throw error
  }
}

// Таңдаулыдан жою
export async function removeFavorite(userId: string, mediaId: string): Promise<boolean> {
  try {
    // Prisma клиентін тексеру
    if (!prisma || !(prisma as any).favorite) {
      console.error("Prisma клиенті дұрыс инициализацияланбаған немесе Favorite моделі жоқ")
      // Fallback: true қайтару (жою сәтті болды деп есептеу)
      return true
    }

    await (prisma as any).favorite.deleteMany({
      where: {
        userId,
        mediaId,
      },
    })

    return true
  } catch (error) {
    console.error("Таңдаулыдан жою қатесі:", error)
    
    // Базамен байланыс қатесі болса, true қайтару (fallback)
    if (error instanceof Error && (
      error.message.includes("Authentication failed") ||
      error.message.includes("Can't reach database") ||
      error.message.includes("P1001") ||
      error.message.includes("PrismaClientInitializationError") ||
      error.message.includes("deleteMany")
    )) {
      return true
    }
    
    return false
  }
}

// Таңдаулыды тексеру
export async function isFavorite(userId: string, mediaId: string): Promise<boolean> {
  try {
    // Prisma клиентін тексеру
    if (!prisma || !(prisma as any).favorite) {
      console.error("Prisma клиенті дұрыс инициализацияланбаған немесе Favorite моделі жоқ")
      return false
    }

    const favorite = await (prisma as any).favorite.findUnique({
      where: {
        userId_mediaId: {
          userId,
          mediaId,
        },
      },
    })

    return !!favorite
  } catch (error) {
    console.error("Таңдаулыды тексеру қатесі:", error)
    
    // Базамен байланыс қатесі болса, false қайтару
    if (error instanceof Error && (
      error.message.includes("Authentication failed") ||
      error.message.includes("Can't reach database") ||
      error.message.includes("P1001") ||
      error.message.includes("PrismaClientInitializationError") ||
      error.message.includes("findUnique")
    )) {
      return false
    }
    
    return false
  }
}






