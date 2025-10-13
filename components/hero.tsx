"use client"

import { Button } from "@/components/ui/button"
import { Film, Book, Gamepad2, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-balance">Каталог для вдохновения и новых открытий</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Открой лучшие{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              фильмы, книги и игры
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Исследуй, оценивай и обсуждай любимые развлечения в одном красивом месте. Получай персональные рекомендации
            на основе твоих предпочтений.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/movies">
              <Button size="lg" className="gap-2 neon-glow transition-all hover:scale-105">
                <Film className="h-5 w-5" />
                Начать
              </Button>
            </Link>
            <Link href="/books">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 transition-all hover:scale-105 hover:neon-glow-blue bg-transparent"
              >
                <Book className="h-5 w-5" />
                Перейти к каталогу
              </Button>
            </Link>
            <Link href="/games">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 transition-all hover:scale-105 hover:neon-glow-pink bg-transparent"
              >
                <Gamepad2 className="h-5 w-5" />
                Игры
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
    </section>
  )
}
