import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CatalogGrid } from "@/components/catalog-grid"
import { Film } from "lucide-react"
import type { MediaItem } from "@/lib/types"

async function getMovies() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/movies`, { cache: "no-store" })
    const movies: MediaItem[] = await res.json()
    return movies
  } catch (error) {
    console.error("Фильмдерді алу қатесі:", error)
    return []
  }
}

export default async function MoviesPage() {
  const movieItems = await getMovies()

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 neon-glow">
              <Film className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-balance">Фильмдер</h1>
              <p className="text-muted-foreground text-pretty">Әлемнің ең қызықты фильмдерін аш</p>
            </div>
          </div>
        </div>

        <CatalogGrid items={movieItems} type="movie" />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
