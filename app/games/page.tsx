import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CatalogGrid } from "@/components/catalog-grid"
import { Gamepad2 } from "lucide-react"
import type { MediaItem } from "@/lib/types"

async function getGames() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/games`, { cache: "no-store" })
    const games: MediaItem[] = await res.json()
    return games
  } catch (error) {
    console.error("Ойындарды алу қатесі:", error)
    return []
  }
}

export default async function GamesPage() {
  const gameItems = await getGames()

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
              <h1 className="text-3xl md:text-4xl font-bold text-balance">Ойындар</h1>
              <p className="text-muted-foreground text-pretty">Келесі ойынға толы шытырманды таңда</p>
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
