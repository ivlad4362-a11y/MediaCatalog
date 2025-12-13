"use client"

import type React from "react"
import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { SafeImage } from "@/components/safe-image"
import type { MediaItem } from "@/lib/types"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<MediaItem[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setIsDialogOpen(true)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
      const data: MediaItem[] = await res.json()
      setResults(data)
    } catch (error) {
      console.error("Іздеу қатесі:", error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSearch} className="mx-auto max-w-2xl animate-fade-in-up">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-110" />
          <Input
            type="search"
            placeholder="Атауын енгізіңіз…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 pl-12 pr-32 text-lg glass-enhanced border-border/50 transition-all duration-300 focus:neon-glow focus:scale-[1.02] hover:border-primary/50"
          />
          <Button
            type="submit"
            size="lg"
            className="absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 hover-lift"
            disabled={isSearching}
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse">Іздеуде...</span>
              </span>
            ) : (
              "Іздеу"
            )}
          </Button>
        </div>
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Іздеу нәтижелері: "{query}" ({results.length})
            </DialogTitle>
            <DialogDescription>
              Табылған материалдардың тізімі. Нәтижені басып, толық ақпаратты көруге болады.
            </DialogDescription>
          </DialogHeader>

          {isSearching ? (
            <div className="py-8 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Іздеу жүріп жатыр...</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground animate-fade-in">
              <p className="text-lg mb-2">Нәтиже табылмады</p>
              <p className="text-sm">Басқа сөзбен іздеп көріңіз</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {results.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/${item.type}s/${item.id}`}
                  onClick={() => setIsDialogOpen(false)}
                  className="scroll-reveal"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="overflow-hidden border-border/50 card-hover hover:border-primary/50">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden bg-muted rounded-lg">
                        <SafeImage
                          src={item.coverImage || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-4 flex-1 space-y-2">
                        <h3 className="font-semibold line-clamp-2 text-balance group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs capitalize hover:bg-primary/10 transition-colors">
                            {item.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{item.year}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="text-primary">⭐</span> {item.rating}
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
