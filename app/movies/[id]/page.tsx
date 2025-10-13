import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { MediaDetail } from "@/components/media-detail"
import { notFound } from "next/navigation"

const movieData: Record<string, any> = {
  "1": {
    id: "1",
    title: "Inception",
    description:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.",
    coverImage: "/inception-movie-poster.png",
    type: "movie" as const,
    rating: 8.8,
    year: 2010,
    genre: ["Sci-Fi", "Thriller", "Action"],
    popularity: 95,
  },
  "4": {
    id: "4",
    title: "Breaking Bad",
    description:
      "A chemistry teacher turned methamphetamine producer partners with a former student to secure his family's future as he battles terminal cancer. Walter White's transformation from mild-mannered educator to ruthless drug kingpin is one of television's most compelling character arcs.",
    coverImage: "/breaking-bad-inspired-poster.png",
    type: "movie" as const,
    rating: 9.5,
    year: 2008,
    genre: ["Drama", "Crime", "Thriller"],
    popularity: 99,
  },
}

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = movieData[params.id]

  if (!movie) {
    notFound()
  }

  const relatedMovies = [
    {
      id: "11",
      title: "Interstellar",
      coverImage: "/interstellar-movie-poster.jpg",
      rating: 8.7,
    },
    {
      id: "14",
      title: "The Dark Knight",
      coverImage: "/dark-knight-inspired-poster.png",
      rating: 9.0,
    },
    {
      id: "6",
      title: "Oppenheimer",
      coverImage: "/images/posters/oppenheimer-poster.png",
      rating: 8.9,
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MediaDetail item={movie} relatedItems={relatedMovies} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
