"use client"

import { useState, useEffect } from "react"
import * as React from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { SafeImage } from "@/components/safe-image"
import type { MediaItem } from "@/lib/types"

interface MediaCarouselProps {
  title: string
  items: MediaItem[]
  gradient?: string
}

export function MediaCarousel({ title, items, gradient }: MediaCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = () => {
    const container = document.getElementById(`carousel-${title}`)
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setScrollPosition(scrollLeft)
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  React.useEffect(() => {
    const container = document.getElementById(`carousel-${title}`)
    if (!container) return

    updateScrollButtons()
    container.addEventListener("scroll", updateScrollButtons)
    window.addEventListener("resize", updateScrollButtons)

    return () => {
      container.removeEventListener("scroll", updateScrollButtons)
      window.removeEventListener("resize", updateScrollButtons)
    }
  }, [title, items])

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`carousel-${title}`)
    if (!container) return

    const scrollAmount = 300
    const currentScroll = container.scrollLeft
    const newPosition =
      direction === "left"
        ? Math.max(0, currentScroll - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, currentScroll + scrollAmount)

    container.scrollTo({ left: newPosition, behavior: "smooth" })
  }


  return (
    <section className="space-y-4 opacity-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="h-9 w-9 hover-lift hover-glow smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 transition-transform hover:scale-125" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="h-9 w-9 hover-lift hover-glow smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4 transition-transform hover:scale-125" />
          </Button>
        </div>
      </div>

      <div
        id={`carousel-${title}`}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => (
          <Link 
            key={item.id} 
            href={`/${item.type}s/${item.id}`} 
            className="group flex-shrink-0"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Card className="w-[200px] overflow-hidden border-border/50 card-hover hover:border-primary/50">
              <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                <SafeImage
                  src={item.coverImage || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-125"
                />
                {/* Gradient overlay with animation */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* Description overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-all duration-300 group-hover:translate-y-0">
                  <p className="text-sm text-white/95 line-clamp-3 text-pretty leading-relaxed drop-shadow-lg">{item.description}</p>
                </div>
                
                {/* Rating badge */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Badge className="bg-primary/90 backdrop-blur-sm border-primary/50">
                    <Star className="h-3 w-3 fill-white text-white mr-1" />
                    {item.rating}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-2 bg-card/50 backdrop-blur-sm">
                <h3 className="font-semibold line-clamp-1 text-balance group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary animate-pulse" />
                    <span className="font-medium">{item.rating}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {item.type}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.genre.slice(0, 2).map((genre) => (
                    <Badge 
                      key={genre} 
                      variant="outline" 
                      className="text-xs hover:bg-primary/10 transition-colors"
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
    </section>
  )
}
