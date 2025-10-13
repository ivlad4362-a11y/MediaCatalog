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

interface CatalogGridProps {
  items: MediaItem[]
  type: MediaType
}

export function CatalogGrid({ items, type }: CatalogGridProps) {
  const [sortBy, setSortBy] = useState("popularity")
  const [yearRange, setYearRange] = useState([1950, 2024])
  const [minRating, setMinRating] = useState([0])

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "year":
        return b.year - a.year
      case "title":
        return a.title.localeCompare(b.title)
      default:
        return b.popularity - a.popularity
    }
  })

  const filteredItems = sortedItems.filter(
    (item) => item.year >= yearRange[0] && item.year <= yearRange[1] && item.rating >= minRating[0],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Показано <span className="font-medium text-foreground">{filteredItems.length}</span> результатов
        </p>

        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">По популярности</SelectItem>
              <SelectItem value="rating">По рейтингу</SelectItem>
              <SelectItem value="year">По дате</SelectItem>
              <SelectItem value="title">По алфавиту</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="flex-shrink-0 bg-transparent">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Фильтры</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Фильтры</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-3">
                  <Label>Год</Label>
                  <Slider
                    min={1950}
                    max={2024}
                    step={1}
                    value={yearRange}
                    onValueChange={setYearRange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{yearRange[0]}</span>
                    <span>{yearRange[1]}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Минимальный рейтинг</Label>
                  <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    value={minRating}
                    onValueChange={setMinRating}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">{minRating[0].toFixed(1)}+</div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <Link key={item.id} href={`/${type}s/${item.id}`} className="group">
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
                  <p className="text-xs text-white/90 line-clamp-4 text-pretty leading-relaxed">{item.description}</p>
                </div>
              </div>
              <CardContent className="p-3 space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2 text-balance leading-snug">{item.title}</h3>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="font-medium">{item.rating}</span>
                  </div>
                  <span className="text-muted-foreground">{item.year}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.genre.slice(0, 2).map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs px-1.5 py-0">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
