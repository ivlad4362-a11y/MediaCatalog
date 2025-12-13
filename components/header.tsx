"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Film, Book, Gamepad2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { AuthDialog } from "@/components/auth-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUser()

    // Пайдаланушы өзгергенде жаңарту (логин/логаут)
    const handleStorageChange = (e: StorageEvent) => {
      try {
        fetchUser()
      } catch (error) {
        // Қатені басқару
        console.error("Storage change handler error:", error)
      }
    }

    // Focus event-ті тыңдау (табыға қайтқанда)
    const handleFocus = () => {
      try {
        fetchUser()
      } catch (error) {
        // Қатені басқару
        console.error("Focus handler error:", error)
      }
    }

    // Storage event-ті тыңдау (басқа табыдағы өзгерістер)
    window.addEventListener("storage", handleStorageChange)

    // Focus event-ті тыңдау (табыға қайтқанда)
    window.addEventListener("focus", handleFocus)

    // Периодикалық тексеру (5 секунд сайын)
    const interval = setInterval(fetchUser, 5000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", handleFocus)
      clearInterval(interval)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      // Қатені консольда көрсетпеу, бірақ user-ді null етіп орнату
      setUser(null)
    }
  }

  const isAdmin = user?.role === "admin"

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 glass-enhanced supports-[backdrop-filter]:bg-background/60 animate-fade-in">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 smooth-transition hover:scale-105 group">
          <div className="flex items-center gap-1">
            <Film className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <Book className="h-6 w-6 text-secondary transition-transform group-hover:-rotate-12" />
            <Gamepad2 className="h-6 w-6 text-accent transition-transform group-hover:rotate-12" />
          </div>
          <span className="text-xl font-bold text-gradient-animate">
            MediaCatalog
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/movies" className="text-sm font-medium transition-colors hover:text-primary">
            Фильмдер
          </Link>
          <Link href="/books" className="text-sm font-medium transition-colors hover:text-secondary">
            Кітаптар
          </Link>
          <Link href="/games" className="text-sm font-medium transition-colors hover:text-accent">
            Ойындар
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium transition-colors hover:text-foreground">
              Әкімші
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthDialog />

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <span className="sr-only">Мәзір</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Мәзір</SheetTitle>
                <SheetDescription>
                  Навигация мәзірі. Беттер арасында навигациялау үшін пайдаланыңыз.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/movies"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium transition-colors hover:text-primary py-2"
                >
                  Фильмдер
                </Link>
                <Link
                  href="/books"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium transition-colors hover:text-secondary py-2"
                >
                  Кітаптар
                </Link>
                <Link
                  href="/games"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium transition-colors hover:text-accent py-2"
                >
                  Ойындар
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium transition-colors hover:text-foreground py-2"
                  >
                    Әкімші
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}





