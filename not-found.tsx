import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Film, Book, Gamepad2, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="container mx-auto px-4 text-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 opacity-20">
            <Film className="h-16 w-16 text-primary" />
            <Book className="h-16 w-16 text-secondary" />
            <Gamepad2 className="h-16 w-16 text-accent" />
          </div>

          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            404
          </h1>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-balance">Страница не найдена</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto text-balance leading-relaxed">
              Похоже, этот контент исчез. Давай вернём тебя к открытию удивительных медиа.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="gap-2 neon-glow">
              <Home className="h-5 w-5" />
              На главную
            </Button>
          </Link>
          <Link href="/movies">
            <Button size="lg" variant="outline" className="gap-2 bg-transparent">
              <Film className="h-5 w-5" />
              Смотреть фильмы
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
