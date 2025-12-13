"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Film, Book, Gamepad2, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([])

  useEffect(() => {
    setIsVisible(true)
    // Particle мәндерін тек клиентте есептеу (hydration қатесін болдырмау үшін)
    setParticles(
      Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${4 + Math.random() * 4}s`,
      }))
    )
  }, [])

  return (
    <section className="relative overflow-x-hidden bg-gradient-to-b from-primary/10 via-background to-background min-h-[90vh] flex items-center w-full">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] animate-fade-in" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 particles">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className={`mx-auto max-w-4xl text-center space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 rounded-full glass-enhanced px-4 py-2 text-sm animate-scale-in hover-lift">
            <Sparkles className="h-4 w-4 text-primary animate-pulse-glow" />
            <span className="text-balance">Шабыт пен жаңа ашылуларға арналған каталог</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            <span className="text-gradient-animate animate-slide-in-right">
              Ең үздік
            </span>
            <br />
            <span className="text-gradient-animate animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              фильмдер, кітаптар және ойындар
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Барлық сүйікті ойын-сауықты бір жерде зертте, бағала және талқыла. Таңдауың мен талғамыңа қарай жеке
            ұсыныстар ал.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link href="/movies" className="group">
              <Button size="lg" className="gap-2 neon-glow hover-lift hover-glow smooth-transition group-hover:animate-pulse-glow">
                <Film className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Бастау
              </Button>
            </Link>
            <Link href="/books" className="group">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 hover-lift hover:neon-glow-blue bg-transparent smooth-transition group-hover:bg-secondary/10"
              >
                <Book className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Каталогқа өту
              </Button>
            </Link>
            <Link href="/games" className="group">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 hover-lift hover:neon-glow-pink bg-transparent smooth-transition group-hover:bg-accent/10"
              >
                <Gamepad2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Ойындар
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Animated gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-fade-in" />
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-primary/50 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
