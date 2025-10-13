import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CatalogGrid } from "@/components/catalog-grid"
import { Film } from "lucide-react"

const movieItems = [
  {
    id: "1",
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task",
    coverImage: "/inception-movie-poster.png",
    type: "movie" as const,
    rating: 8.8,
    year: 2010,
    genre: ["Sci-Fi", "Thriller"],
    popularity: 95,
  },
  {
    id: "4",
    title: "Breaking Bad",
    description: "A chemistry teacher turned methamphetamine producer partners with a former student",
    coverImage: "/breaking-bad-inspired-poster.png",
    type: "movie" as const,
    rating: 9.5,
    year: 2008,
    genre: ["Drama", "Crime"],
    popularity: 99,
  },
  {
    id: "6",
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in developing the atomic bomb",
    coverImage: "/images/posters/oppenheimer-poster.png",
    type: "movie" as const,
    rating: 8.9,
    year: 2023,
    genre: ["Biography", "Drama"],
    popularity: 94,
  },
  {
    id: "9",
    title: "The Last of Us",
    description: "A post-apocalyptic drama series following survivors in a world devastated by a fungal infection",
    coverImage: "/last-of-us-series-poster.jpg",
    type: "movie" as const,
    rating: 8.8,
    year: 2023,
    genre: ["Drama", "Horror"],
    popularity: 93,
  },
  {
    id: "11",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival",
    coverImage: "/interstellar-movie-poster.jpg",
    type: "movie" as const,
    rating: 8.7,
    year: 2014,
    genre: ["Sci-Fi", "Drama"],
    popularity: 94,
  },
  {
    id: "14",
    title: "The Dark Knight",
    description: "Batman faces the Joker in Gotham City, testing his moral limits",
    coverImage: "/dark-knight-inspired-poster.png",
    type: "movie" as const,
    rating: 9.0,
    year: 2008,
    genre: ["Action", "Crime"],
    popularity: 97,
  },
]

export default function MoviesPage() {
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
              <h1 className="text-3xl md:text-4xl font-bold text-balance">Фильмы</h1>
              <p className="text-muted-foreground text-pretty">Открой удивительные фильмы со всего мира</p>
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
