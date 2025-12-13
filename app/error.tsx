"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Film, Book, Gamepad2, Home, AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Қатені консольге басып шығару
    console.error("Error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="container mx-auto px-4 text-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 opacity-20">
            <Film className="h-16 w-16 text-primary" />
            <Book className="h-16 w-16 text-secondary" />
            <Gamepad2 className="h-16 w-16 text-accent" />
          </div>

          <div className="flex items-center justify-center gap-3">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Қате
            </h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-balance">Бір нәрсе дұрыс жұмыс істемеді</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto text-balance leading-relaxed">
              Кешіріңіз, бір қате орын алды. Бетті қайта жүктеуға тырысыңыз немесе басты бетке оралыңыз.
            </p>
            {error.message && (
              <p className="text-sm text-muted-foreground mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                {error.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="gap-2 neon-glow" onClick={reset}>
            Қайта тырысу
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline" className="gap-2 bg-transparent">
              <Home className="h-5 w-5" />
              Басты бетке
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}












