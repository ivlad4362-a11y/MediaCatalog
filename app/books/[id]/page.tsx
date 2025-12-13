import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { MediaDetail } from "@/components/media-detail"
import { notFound } from "next/navigation"
import type { MediaItem } from "@/lib/types"

async function getBook(id: string): Promise<MediaItem | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/books`, { cache: "no-store" })
    const books: MediaItem[] = await res.json()
    return books.find((book) => book.id === id) || null
  } catch (error) {
    console.error("Кітапты алу қатесі:", error)
    return null
  }
}

async function getRelatedBooks(currentId: string): Promise<Array<{ id: string; title: string; coverImage: string; rating: number }>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/books`, { cache: "no-store" })
    const books: MediaItem[] = await res.json()
    return books
      .filter((book) => book.id !== currentId)
      .slice(0, 3)
      .map((book) => ({
        id: book.id,
        title: book.title,
        coverImage: book.coverImage,
        rating: book.rating,
      }))
  } catch (error) {
    console.error("Ұқсас кітаптарды алу қатесі:", error)
    return []
  }
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id)

  if (!book) {
    notFound()
  }

  const relatedBooks = await getRelatedBooks(params.id)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MediaDetail item={book} relatedItems={relatedBooks} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
