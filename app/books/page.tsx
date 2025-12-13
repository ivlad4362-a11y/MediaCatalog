import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CatalogGrid } from "@/components/catalog-grid"
import { Book } from "lucide-react"
import type { MediaItem } from "@/lib/types"

async function getBooks() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/books`, { cache: "no-store" })
    const books: MediaItem[] = await res.json()
    return books
  } catch (error) {
    console.error("Кітаптарды алу қатесі:", error)
    return []
  }
}

export default async function BooksPage() {
  const bookItems = await getBooks()

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 neon-glow-blue">
              <Book className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-balance">Кітаптар</h1>
              <p className="text-muted-foreground text-pretty">Қызықты оқиғалар мен білімді зертте</p>
            </div>
          </div>
        </div>

        <CatalogGrid items={bookItems} type="book" />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
