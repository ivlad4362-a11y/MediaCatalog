"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Search query:", query)
    // In production, this would navigate to search results
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          type="search"
          placeholder="Введите название…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-14 pl-12 pr-32 text-lg glass border-border/50 transition-all focus:neon-glow"
        />
        <Button
          type="submit"
          size="lg"
          className="absolute right-2 top-1/2 -translate-y-1/2 transition-all hover:scale-105"
        >
          Поиск
        </Button>
      </div>
    </form>
  )
}
