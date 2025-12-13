import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { MediaDetail } from "@/components/media-detail"
import { notFound } from "next/navigation"
import type { MediaItem } from "@/lib/types"

async function getMovie(id: string): Promise<MediaItem | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/movies`, { cache: "no-store" })
    const movies: MediaItem[] = await res.json()
    return movies.find((movie) => movie.id === id) || null
  } catch (error) {
    console.error("Фильмді алу қатесі:", error)
    return null
  }
}

async function getRelatedMovies(currentId: string): Promise<Array<{ id: string; title: string; coverImage: string; rating: number }>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/movies`, { cache: "no-store" })
    const movies: MediaItem[] = await res.json()
    return movies
      .filter((movie) => movie.id !== currentId)
      .slice(0, 3)
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        coverImage: movie.coverImage,
        rating: movie.rating,
      }))
  } catch (error) {
    console.error("Ұқсас фильмдерді алу қатесі:", error)
    return []
  }
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = await getMovie(params.id)

  if (!movie) {
    notFound()
  }

  const relatedMovies = await getRelatedMovies(params.id)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MediaDetail item={movie} relatedItems={relatedMovies} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
