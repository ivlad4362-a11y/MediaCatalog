import Link from "next/link"
import { Film, Book, Gamepad2, Github, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 glass-enhanced">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 opacity-100">
            <Link href="/" className="flex flex-col items-start gap-3 group smooth-transition">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 border-2 border-primary/50 backdrop-blur-sm group-hover:border-primary group-hover:from-primary/40 group-hover:via-secondary/40 group-hover:to-accent/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                  <div className="flex items-center gap-1">
                    <Film className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
                    <Book className="h-6 w-6 text-secondary transition-transform group-hover:-rotate-12" />
                    <Gamepad2 className="h-6 w-6 text-accent transition-transform group-hover:rotate-12" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                    MediaCatalog
                  </span>
                  <span className="text-xs text-muted-foreground/80">Медиа каталогы</span>
                </div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
              Ең үздік фильмдер, кітаптар және ойындарды табуға арналған әмбебап платформа.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Каталог</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/movies" className="text-muted-foreground hover:text-primary transition-colors">
                  Фильмдер
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-muted-foreground hover:text-secondary transition-colors">
                  Кітаптар
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-muted-foreground hover:text-accent transition-colors">
                  Ойындар
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Компания</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Біз туралы
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Байланыс
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Әкімші
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Әлеуметтік желілер</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground smooth-transition hover-lift hover-glow rounded-full p-2"
              >
                <Github className="h-5 w-5 transition-transform hover:rotate-12" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground smooth-transition hover-lift hover-glow rounded-full p-2"
              >
                <Twitter className="h-5 w-5 transition-transform hover:rotate-12" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground smooth-transition hover-lift hover-glow rounded-full p-2"
              >
                <Instagram className="h-5 w-5 transition-transform hover:rotate-12" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MediaCatalog. Барлық құқықтар қорғалған.</p>
        </div>
      </div>
    </footer>
  )
}
