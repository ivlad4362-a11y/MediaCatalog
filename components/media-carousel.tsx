"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import type { MediaItem } from "@/lib/types"

interface MediaCarouselProps {
  title: string
  items: MediaItem[]
  gradient?: string
}

export function MediaCarousel({ title, items, gradient }: MediaCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`carousel-${title}`)
    if (!container) return

    const scrollAmount = 300
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)

    container.scrollTo({ left: newPosition, behavior: "smooth" })
    setScrollPosition(newPosition)
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-balance">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            disabled={scrollPosition === 0}
            className="h-9 w-9 transition-all hover:neon-glow"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="h-9 w-9 transition-all hover:neon-glow"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        id={`carousel-${title}`}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <Link key={item.id} href={`/${item.type}s/${item.id}`} className="group flex-shrink-0">
            <Card className="w-[200px] overflow-hidden border-border/50 transition-all duration-300 hover:scale-105 hover:neon-glow hover:border-primary/50">
              <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                <Image
                  src={item.coverImage || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform group-hover:translate-y-0">
                  <p className="text-sm text-white/90 line-clamp-3 text-pretty leading-relaxed">{item.description}</p>
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold line-clamp-1 text-balance">{item.title}</h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{item.rating}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.genre.slice(0, 2).map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
