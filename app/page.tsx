import { Hero } from "@/components/hero"
import { SearchBar } from "@/components/search-bar"
import { MediaCarousel } from "@/components/media-carousel"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { MediaItem } from "@/lib/types"

async function getMediaData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const [moviesRes, booksRes, gamesRes] = await Promise.all([
      fetch(`${baseUrl}/api/movies`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/books`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/games`, { cache: "no-store" }),
    ])

    // JSON парсинг (қателерді өңдеу)
    let movies: MediaItem[] = []
    let books: MediaItem[] = []
    let games: MediaItem[] = []

    try {
      if (moviesRes.ok) {
        const moviesData = await moviesRes.json()
        movies = Array.isArray(moviesData) ? moviesData : []
      }
    } catch (error) {
      console.error("Фильмдерді алу қатесі:", error)
      movies = []
    }

    try {
      if (booksRes.ok) {
        const booksData = await booksRes.json()
        books = Array.isArray(booksData) ? booksData : []
      }
    } catch (error) {
      console.error("Кітаптарды алу қатесі:", error)
      books = []
    }

    try {
      if (gamesRes.ok) {
        const gamesData = await gamesRes.json()
        games = Array.isArray(gamesData) ? gamesData : []
      }
    } catch (error) {
      console.error("Ойындарды алу қатесі:", error)
      games = []
    }

    // Массив екенін тексеру және біріктіру
    const allMovies = Array.isArray(movies) ? movies : []
    const allBooks = Array.isArray(books) ? books : []
    const allGames = Array.isArray(games) ? games : []

    return [...allMovies, ...allBooks, ...allGames]
  } catch (error) {
    console.error("Мәліметтерді алу қатесі:", error)
    return []
  }
}

export default async function HomePage() {
  const allMedia = await getMediaData()

  // Танымал - популярлық бойынша сұрыпталған
  const popularItems = [...allMedia]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5)

  // Жаңалықтар - жыл бойынша сұрыпталған
  const newItems = [...allMedia]
    .sort((a, b) => b.year - a.year)
    .slice(0, 5)

  // Ұсыныстар - рейтинг бойынша сұрыпталған
  const recommendedItems = [...allMedia]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <Hero />

        <div className="container mx-auto px-4 py-12 space-y-16">
          <SearchBar />

          <MediaCarousel title="Қазір танымал" items={popularItems} gradient="from-primary/20 to-transparent" />

          <MediaCarousel title="Жаңалықтар" items={newItems} gradient="from-secondary/20 to-transparent" />

          <MediaCarousel
            title="Сізге арналған ұсыныстар"
            items={recommendedItems}
            gradient="from-accent/20 to-transparent"
          />
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
