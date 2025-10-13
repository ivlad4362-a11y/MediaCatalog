import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CatalogGrid } from "@/components/catalog-grid"
import { Book } from "lucide-react"

const bookItems = [
  {
    id: "3",
    title: "Dune",
    description: "A science fiction novel about politics, religion, and ecology on the desert planet Arrakis",
    coverImage: "/dune-book-cover.png",
    type: "book" as const,
    rating: 8.5,
    year: 1965,
    genre: ["Sci-Fi", "Fantasy"],
    popularity: 92,
  },
  {
    id: "8",
    title: "Project Hail Mary",
    description: "A lone astronaut must save Earth from disaster in this thrilling science fiction adventure",
    coverImage: "/project-hail-mary-book.png",
    type: "book" as const,
    rating: 8.7,
    year: 2021,
    genre: ["Sci-Fi", "Adventure"],
    popularity: 91,
  },
  {
    id: "13",
    title: "The Three-Body Problem",
    description: "A secret military project sends signals into space to establish contact with aliens",
    coverImage: "/three-body-problem-book.jpg",
    type: "book" as const,
    rating: 8.1,
    year: 2008,
    genre: ["Sci-Fi", "Mystery"],
    popularity: 88,
  },
]

export default function BooksPage() {
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
              <h1 className="text-3xl md:text-4xl font-bold text-balance">Книги</h1>
              <p className="text-muted-foreground text-pretty">Исследуй захватывающие истории и знания</p>
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
