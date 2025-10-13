"use client"

import Link from "next/link"
import { Film, Book, Gamepad2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex items-center gap-1">
            <Film className="h-6 w-6 text-primary" />
            <Book className="h-6 w-6 text-secondary" />
            <Gamepad2 className="h-6 w-6 text-accent" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            MediaCatalog
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/movies" className="text-sm font-medium transition-colors hover:text-primary">
            Фильмы
          </Link>
          <Link href="/books" className="text-sm font-medium transition-colors hover:text-secondary">
            Книги
          </Link>
          <Link href="/games" className="text-sm font-medium transition-colors hover:text-accent">
            Игры
          </Link>
          <Link href="/admin" className="text-sm font-medium transition-colors hover:text-foreground">
            Админ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="md:hidden">
            <span className="sr-only">Меню</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  )
}
