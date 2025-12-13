"use client"

import { useState, useEffect } from "react"
import { Star, SlidersHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { SafeImage } from "@/components/safe-image"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import type { MediaItem, MediaType } from "@/lib/types"

interface CatalogGridProps {
  items: MediaItem[]
  type: MediaType
}

export function CatalogGrid({ items, type }: CatalogGridProps) {
  const [sortBy, setSortBy] = useState("popularity")
  const [yearRange, setYearRange] = useState([1950, 2024])
  const [minRating, setMinRating] = useState([0])
  const { ref, isRevealed } = useScrollReveal()

  // Тип бойынша фильтрлеу (қосымша қорғау - тек сәйкес типтегі материалдарды көрсету)
  const filteredByType = items.filter((item) => item.type === type)

  const sortedItems = [...filteredByType].sort((a, b) => {
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

  useEffect(() => {
    // Scroll reveal animation for cards
    const cards = document.querySelectorAll(".scroll-reveal")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [filteredItems])

  return (
    <div ref={ref} className={`space-y-6 scroll-reveal ${isRevealed ? "revealed" : ""}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Көрсетілген <span className="font-medium text-foreground">{filteredItems.length}</span> нәтиже
        </p>

        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Сұрыптау" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Танымалдығы бойынша</SelectItem>
              <SelectItem value="rating">Рейтинг бойынша</SelectItem>
              <SelectItem value="year">Жылы бойынша</SelectItem>
              <SelectItem value="title">Әліпби бойынша</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="flex-shrink-0 bg-transparent">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Сүзгілер</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Сүзгілер</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-3">
                  <Label>Жыл</Label>
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
                  <Label>Минималды рейтинг</Label>
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
        {filteredItems.map((item, index) => (
          <Link 
            key={item.id} 
            href={`/${type}s/${item.id}`} 
            className="group scroll-reveal"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <Card className="overflow-hidden border-border/50 card-hover hover:border-primary/50">
              <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                <SafeImage
                  src={item.coverImage || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full transition-all duration-300 group-hover:translate-y-0">
                  <p className="text-xs text-white/95 line-clamp-4 text-pretty leading-relaxed drop-shadow-lg">{item.description}</p>
                </div>
                {/* Rating badge */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Badge className="bg-primary/90 backdrop-blur-sm border-primary/50">
                    <Star className="h-3 w-3 fill-white text-white mr-1" />
                    {item.rating}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3 space-y-2 bg-card/50 backdrop-blur-sm">
                <h3 className="font-semibold text-sm line-clamp-2 text-balance leading-snug group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-primary text-primary animate-pulse" />
                    <span className="font-medium">{item.rating}</span>
                  </div>
                  <span className="text-muted-foreground">{item.year}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.genre.slice(0, 2).map((genre) => (
                    <Badge 
                      key={genre} 
                      variant="outline" 
                      className="text-xs px-1.5 py-0 hover:bg-primary/10 transition-colors"
                    >
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
