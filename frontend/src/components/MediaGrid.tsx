import { useState } from "react"
import { Star } from "lucide-react"

// Типтер
export type MediaType = "movie" | "book" | "game"

export interface MediaItem {
  id: string
  title: string
  description: string
  coverImage: string
  type: MediaType
  rating: number
  year: number
  popularity: number
  genre: string[]
}

interface MediaGridProps {
  items: MediaItem[]
  type?: MediaType
  showFilters?: boolean
}

export function MediaGrid({ items, type, showFilters = true }: MediaGridProps) {
  const [sortBy, setSortBy] = useState("popularity")
  const [minRating, setMinRating] = useState([0])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  // Барлық жанрларды алу
  const allGenres = Array.from(new Set(items.flatMap((item) => item.genre)))

  // Сұрыптау
  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.popularity - a.popularity
      case "rating":
        return b.rating - a.rating
      case "year":
        return b.year - a.year
      case "title":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  // Фильтрлеу
  const filteredItems = sortedItems.filter((item) => {
    const ratingMatch = item.rating >= minRating[0]
    const genreMatch =
      selectedGenres.length === 0 || selectedGenres.some((genre) => item.genre.includes(genre))
    return ratingMatch && genreMatch
  })

  const typeNames: Record<MediaType, string> = {
    movie: "Фильм",
    book: "Кітап",
    game: "Ойын",
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-md bg-background text-foreground"
            >
              <option value="popularity">По популярности</option>
              <option value="rating">По рейтингу</option>
              <option value="year">По году</option>
              <option value="title">По названию</option>
            </select>
          </div>
          <p className="text-sm text-muted-foreground">
            Показано: {filteredItems.length} из {items.length}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative aspect-[2/3] overflow-hidden bg-muted rounded-lg">
              <img
                src={item.coverImage || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{item.rating}</span>
                </div>
                <span className="text-xs capitalize">{typeNames[item.type]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Мәліметтер табылмады</p>
        </div>
      )}
    </div>
  )
}
