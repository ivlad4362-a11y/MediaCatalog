"use client"

import { useState } from "react"
import { Star, SlidersHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import Image from "next/image"
import type { MediaItem, MediaType } from "@/lib/types"

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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">По популярности</SelectItem>
                <SelectItem value="rating">По рейтингу</SelectItem>
                <SelectItem value="year">По году</SelectItem>
                <SelectItem value="title">По названию</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">Фильтры</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label>Минимальный рейтинг: {minRating[0]}</Label>
                    <Slider
                      value={minRating}
                      onValueChange={setMinRating}
                      max={10}
                      min={0}
                      step={0.1}
                    />
                  </div>
                  {allGenres.length > 0 && (
                    <div className="space-y-2">
                      <Label>Жанрлар</Label>
                      <div className="flex flex-wrap gap-2">
                        {allGenres.map((genre) => (
                          <Button
                            key={genre}
                            variant={selectedGenres.includes(genre) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setSelectedGenres((prev) =>
                                prev.includes(genre)
                                  ? prev.filter((g) => g !== genre)
                                  : [...prev, genre]
                              )
                            }}
                          >
                            {genre}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <p className="text-sm text-muted-foreground">
            Показано: {filteredItems.length} из {items.length}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <Link
            key={item.id}
            href={`/${item.type}s/${item.id}`}
            className="group"
          >
            <Card className="overflow-hidden border-border/50 transition-all duration-300 hover:scale-105 hover:neon-glow hover:border-primary/50">
              <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                <Image
                  src={item.coverImage || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full transition-transform group-hover:translate-y-0">
                  <p className="text-xs text-white/90 line-clamp-4 text-pretty leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              <CardContent className="p-3 space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="font-medium">{item.rating}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {typeNames[item.type]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
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





















