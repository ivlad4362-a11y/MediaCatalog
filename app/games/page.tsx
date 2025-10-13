import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CatalogGrid } from "@/components/catalog-grid"
import { Gamepad2 } from "lucide-react"

const gameItems = [
  {
    id: "2",
    title: "The Witcher 3",
    description: "An open-world RPG set in a fantasy universe full of meaningful choices and impactful consequences",
    coverImage: "/witcher-3-inspired-cover.png",
    type: "game" as const,
    rating: 9.3,
    year: 2015,
    genre: ["RPG", "Adventure"],
    popularity: 98,
  },
  {
    id: "5",
    title: "Elden Ring",
    description: "An action RPG developed by FromSoftware and George R.R. Martin",
    coverImage: "/generic-fantasy-game-cover.png",
    type: "game" as const,
    rating: 9.1,
    year: 2022,
    genre: ["RPG", "Action"],
    popularity: 96,
  },
  {
    id: "7",
    title: "Baldurs Gate 3",
    description: "A role-playing video game based on Dungeons & Dragons tabletop system",
    coverImage: "/fantasy-rpg-cover.png",
    type: "game" as const,
    rating: 9.4,
    year: 2023,
    genre: ["RPG", "Strategy"],
    popularity: 97,
  },
  {
    id: "10",
    title: "Starfield",
    description: "An action RPG set in space where you can explore over 1000 planets",
    coverImage: "/starfield-game-cover.png",
    type: "game" as const,
    rating: 7.8,
    year: 2023,
    genre: ["RPG", "Sci-Fi"],
    popularity: 85,
  },
  {
    id: "12",
    title: "Red Dead Redemption 2",
    description: "An epic tale of life in Americas unforgiving heartland during the decline of the outlaw era",
    coverImage: "/red-dead-redemption-2.jpg",
    type: "game" as const,
    rating: 9.7,
    year: 2018,
    genre: ["Action", "Adventure"],
    popularity: 98,
  },
  {
    id: "15",
    title: "God of War",
    description: "Kratos and his son Atreus embark on a journey through Norse mythology",
    coverImage: "/god-of-war-game-cover.jpg",
    type: "game" as const,
    rating: 9.5,
    year: 2018,
    genre: ["Action", "Adventure"],
    popularity: 96,
  },
]

export default function GamesPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 neon-glow-pink">
              <Gamepad2 className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-balance">Игры</h1>
              <p className="text-muted-foreground text-pretty">Найди своё следующее игровое приключение</p>
            </div>
          </div>
        </div>

        <CatalogGrid items={gameItems} type="game" />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
