import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { MediaDetail } from "@/components/media-detail"
import { notFound } from "next/navigation"

const bookData: Record<string, any> = {
  "3": {
    id: "3",
    title: "Dune",
    description:
      "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange, a drug capable of extending life and enhancing consciousness. Coveted across the known universe, melange is a prize worth killing for.",
    coverImage: "/dune-book-cover.png",
    type: "book" as const,
    rating: 8.5,
    year: 1965,
    genre: ["Sci-Fi", "Fantasy", "Adventure"],
    popularity: 92,
  },
  "8": {
    id: "8",
    title: "Project Hail Mary",
    description:
      "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it. A thrilling science fiction adventure from the author of The Martian.",
    coverImage: "/project-hail-mary-book.png",
    type: "book" as const,
    rating: 8.7,
    year: 2021,
    genre: ["Sci-Fi", "Adventure", "Thriller"],
    popularity: 91,
  },
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const book = bookData[params.id]

  if (!book) {
    notFound()
  }

  const relatedBooks = [
    {
      id: "13",
      title: "The Three-Body Problem",
      coverImage: "/three-body-problem-book.jpg",
      rating: 8.1,
    },
  ]

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
