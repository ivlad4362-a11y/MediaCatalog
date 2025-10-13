import { Hero } from "@/components/hero"
import { SearchBar } from "@/components/search-bar"
import { MediaCarousel } from "@/components/media-carousel"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// Mock data - in production this would come from a database
const popularItems = [
  {
    id: "1",
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology",
    coverImage: "/inception-movie-poster.png",
    type: "movie" as const,
    rating: 8.8,
    year: 2010,
    genre: ["Sci-Fi", "Thriller"],
    popularity: 95,
  },
  {
    id: "2",
    title: "The Witcher 3",
    description: "An open-world RPG set in a fantasy universe",
    coverImage: "/witcher-3-inspired-cover.png",
    type: "game" as const,
    rating: 9.3,
    year: 2015,
    genre: ["RPG", "Adventure"],
    popularity: 98,
  },
  {
    id: "3",
    title: "Dune",
    description: "A science fiction novel about politics, religion, and ecology",
    coverImage: "/dune-book-cover.png",
    type: "book" as const,
    rating: 8.5,
    year: 1965,
    genre: ["Sci-Fi", "Fantasy"],
    popularity: 92,
  },
  {
    id: "4",
    title: "Breaking Bad",
    description: "A chemistry teacher turned methamphetamine producer",
    coverImage: "/breaking-bad-inspired-poster.png",
    type: "movie" as const,
    rating: 9.5,
    year: 2008,
    genre: ["Drama", "Crime"],
    popularity: 99,
  },
  {
    id: "5",
    title: "Elden Ring",
    description: "An action RPG developed by FromSoftware",
    coverImage: "/generic-fantasy-game-cover.png",
    type: "game" as const,
    rating: 9.1,
    year: 2022,
    genre: ["RPG", "Action"],
    popularity: 96,
  },
]

const newItems = [
  {
    id: "6",
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer",
    coverImage: "/images/posters/oppenheimer-poster.png",
    type: "movie" as const,
    rating: 8.9,
    year: 2023,
    genre: ["Biography", "Drama"],
    popularity: 94,
  },
  {
    id: "7",
    title: "Baldurs Gate 3",
    description: "A role-playing video game based on Dungeons & Dragons",
    coverImage: "/fantasy-rpg-cover.png",
    type: "game" as const,
    rating: 9.4,
    year: 2023,
    genre: ["RPG", "Strategy"],
    popularity: 97,
  },
  {
    id: "8",
    title: "Project Hail Mary",
    description: "A lone astronaut must save Earth from disaster",
    coverImage: "/project-hail-mary-book.png",
    type: "book" as const,
    rating: 8.7,
    year: 2021,
    genre: ["Sci-Fi", "Adventure"],
    popularity: 91,
  },
  {
    id: "9",
    title: "The Last of Us",
    description: "A post-apocalyptic drama series",
    coverImage: "/last-of-us-series-poster.jpg",
    type: "movie" as const,
    rating: 8.8,
    year: 2023,
    genre: ["Drama", "Horror"],
    popularity: 93,
  },
  {
    id: "10",
    title: "Starfield",
    description: "An action RPG set in space",
    coverImage: "/starfield-game-cover.png",
    type: "game" as const,
    rating: 7.8,
    year: 2023,
    genre: ["RPG", "Sci-Fi"],
    popularity: 85,
  },
]

const recommendedItems = [
  {
    id: "11",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space",
    coverImage: "/interstellar-movie-poster.jpg",
    type: "movie" as const,
    rating: 8.7,
    year: 2014,
    genre: ["Sci-Fi", "Drama"],
    popularity: 94,
  },
  {
    id: "12",
    title: "Red Dead Redemption 2",
    description: "An epic tale of life in Americas unforgiving heartland",
    coverImage: "/red-dead-redemption-2.jpg",
    type: "game" as const,
    rating: 9.7,
    year: 2018,
    genre: ["Action", "Adventure"],
    popularity: 98,
  },
  {
    id: "13",
    title: "The Three-Body Problem",
    description: "A secret military project sends signals into space",
    coverImage: "/three-body-problem-book.jpg",
    type: "book" as const,
    rating: 8.1,
    year: 2008,
    genre: ["Sci-Fi", "Mystery"],
    popularity: 88,
  },
  {
    id: "14",
    title: "The Dark Knight",
    description: "Batman faces the Joker in Gotham City",
    coverImage: "/dark-knight-inspired-poster.png",
    type: "movie" as const,
    rating: 9.0,
    year: 2008,
    genre: ["Action", "Crime"],
    popularity: 97,
  },
  {
    id: "15",
    title: "God of War",
    description: "Kratos and his son embark on a journey",
    coverImage: "/god-of-war-game-cover.jpg",
    type: "game" as const,
    rating: 9.5,
    year: 2018,
    genre: ["Action", "Adventure"],
    popularity: 96,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <Hero />

        <div className="container mx-auto px-4 py-12 space-y-16">
          <SearchBar />

          <MediaCarousel title="Популярное сейчас" items={popularItems} gradient="from-primary/20 to-transparent" />

          <MediaCarousel title="Новинки" items={newItems} gradient="from-secondary/20 to-transparent" />

          <MediaCarousel
            title="Рекомендации для вас"
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
