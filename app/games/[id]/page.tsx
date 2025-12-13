import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { MediaDetail } from "@/components/media-detail"
import { notFound } from "next/navigation"
import type { MediaItem } from "@/lib/types"

async function getGame(id: string): Promise<MediaItem | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/games`, { cache: "no-store" })
    const games: MediaItem[] = await res.json()
    return games.find((game) => game.id === id) || null
  } catch (error) {
    console.error("Ойынды алу қатесі:", error)
    return null
  }
}

async function getRelatedGames(currentId: string): Promise<Array<{ id: string; title: string; coverImage: string; rating: number }>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/games`, { cache: "no-store" })
    const games: MediaItem[] = await res.json()
    return games
      .filter((game) => game.id !== currentId)
      .slice(0, 3)
      .map((game) => ({
        id: game.id,
        title: game.title,
        coverImage: game.coverImage,
        rating: game.rating,
      }))
  } catch (error) {
    console.error("Ұқсас ойындарды алу қатесі:", error)
    return []
  }
}

export default async function GameDetailPage({ params }: { params: { id: string } }) {
  const game = await getGame(params.id)

  if (!game) {
    notFound()
  }

  const relatedGames = await getRelatedGames(params.id)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MediaDetail item={game} relatedItems={relatedGames} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
