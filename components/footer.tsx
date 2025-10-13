import Link from "next/link"
import { Film, Book, Gamepad2, Github, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Film className="h-5 w-5 text-primary" />
                <Book className="h-5 w-5 text-secondary" />
                <Gamepad2 className="h-5 w-5 text-accent" />
              </div>
              <span className="font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                MediaCatalog
              </span>
            </Link>
            <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
              Универсальная платформа для открытия лучших фильмов, книг и игр.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Каталог</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/movies" className="text-muted-foreground hover:text-primary transition-colors">
                  Фильмы
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-muted-foreground hover:text-secondary transition-colors">
                  Книги
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-muted-foreground hover:text-accent transition-colors">
                  Игры
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Компания</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Админ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Соцсети</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MediaCatalog. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
