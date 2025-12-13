"use client"

import { useState, useEffect } from "react"
import { Star, Heart, Calendar, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SafeImage } from "@/components/safe-image"
import Image from "next/image"
import Link from "next/link"
import type { MediaItem } from "@/lib/types"

interface MediaDetailProps {
  item: MediaItem
  relatedItems: Array<{ id: string; title: string; coverImage: string; rating: number }>
}

const mockComments = [
  {
    id: "1",
    userId: "1",
    userName: "Alex Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "Нағыз әсерлі туынды! Көрген ең керемет тәжірибелерімнің бірі. Әрбір ұсақ детальі керемет ойластырылған.",
    rating: 9.5,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    userId: "2",
    userName: "Sarah Chen",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "Нағыз шедевр, аяқталғаннан кейін де ұзақ ойлантып қояды. Міндетті түрде көруге кеңес беремін!",
    rating: 9.0,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    userId: "3",
    userName: "Mike Rodriguez",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "Жалпы өте ұнады, ортасында қарқыны сәл бәсеңдегенімен, бәрібір тамашалауға тұрарлық.",
    rating: 8.0,
    createdAt: "2024-01-05",
  },
]

export function MediaDetail({ item, relatedItems }: MediaDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState(mockComments)

  // Отладка: проверка наличия watchUrl
  useEffect(() => {
    if (item.watchUrl) {
      console.log(`[MediaDetail] ${item.title} has watchUrl:`, item.watchUrl)
    } else {
      console.log(`[MediaDetail] ${item.title} has NO watchUrl`)
    }
  }, [item])

  // Таңдаулылар мен пікірлерді жүктеу
  useEffect(() => {
    // Таңдаулыларды API арқылы тексеру
    const checkFavorite = async () => {
      try {
        const userRes = await fetch("/api/auth/me")
        if (userRes.ok) {
          const userData = await userRes.json()
          const user = userData.user
          
          if (user) {
            // Таңдаулыларды API арқылы алу
            const favoritesRes = await fetch(`/api/favorites?userId=${user.id}`)
            if (favoritesRes.ok) {
              const favoritesData = await favoritesRes.json()
              const isFav = favoritesData.some((fav: any) => fav.mediaId === item.id)
              setIsFavorite(isFav)
            }
          }
        } else {
          // Пайдаланушы кірмеген болса, localStorage-дан тексеру
          const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
          setIsFavorite(favorites.includes(item.id))
        }
      } catch (error) {
        console.error("Таңдаулыларды тексеру қатесі:", error)
        // Қате болғанда localStorage-дан тексеру
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        setIsFavorite(favorites.includes(item.id))
      }
    }
    
    checkFavorite()

    // Пікірлерді жүктеу
    const loadComments = async () => {
      try {
        // localStorage-дан пікірлерді алу
        const savedComments = localStorage.getItem(`comments_${item.id}`)
        let allComments = [...mockComments]
        
        if (savedComments) {
          try {
            const parsed = JSON.parse(savedComments)
            // localStorage-дағы пікірлерді алдыңғы орынға қою
            allComments = [...parsed, ...mockComments]
          } catch (error) {
            console.error("Пікірлерді жүктеу қатесі:", error)
          }
        }
        
        setComments(allComments)
      } catch (error) {
        console.error("Пікірлерді жүктеу қатесі:", error)
      }
    }

    loadComments()
  }, [item.id])

  const typeNames: Record<MediaItem["type"], string> = {
    movie: "Фильм",
    book: "Кітап",
    game: "Ойын",
  }

  const handleAddComment = async () => {
    if (!comment.trim()) {
      alert("Пікір енгізіңіз")
      return
    }

    // Пайдаланушы кіруі тексеру
    try {
      const userRes = await fetch("/api/auth/me")
      let user = null
      
      if (userRes.ok) {
        const userData = await userRes.json()
        user = userData.user
      } else {
        // Егер пайдаланушы кірмеген болса, анонимдік пікір қосуға рұқсат беру
        user = {
          id: `anon-${Date.now()}`,
          name: "Анонимдік пайдаланушы",
          image: null,
        }
      }

      // Пікір деректерін құру
      const commentData = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name || "Пайдаланушы",
        userAvatar: user.image || "/placeholder.svg",
        content: comment.trim(),
        rating: item.rating,
        createdAt: new Date().toISOString().split("T")[0],
      }

      // localStorage-ға сақтау
      const existingComments = JSON.parse(localStorage.getItem(`comments_${item.id}`) || "[]")
      existingComments.unshift(commentData)
      localStorage.setItem(`comments_${item.id}`, JSON.stringify(existingComments))

      // Пікірлер тізімін жаңарту
      setComments([commentData, ...comments])
      setComment("")
      
      // API-ға жіберу (опционал, егер базаға сақтау қажет болса)
      try {
        await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mediaId: item.id,
            content: commentData.content,
            userId: commentData.userId,
            userName: commentData.userName,
            userAvatar: commentData.userAvatar,
            rating: commentData.rating,
          }),
        })
      } catch (apiError) {
        // API қатесін елемеу, localStorage-да сақталған
        console.log("API-ға сақтау қатесі (localStorage-да сақталды):", apiError)
      }

      alert("Пікір сәтті қосылды!")
    } catch (error) {
      console.error("Пікір қосу қатесі:", error)
      alert("Пікір қосу кезінде қате орын алды. Қайталап көріңіз.")
    }
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <SafeImage src={item.coverImage || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <Card className="overflow-hidden border-border/50 neon-glow h-fit">
            <div className="relative aspect-[2/3]">
              <SafeImage src={item.coverImage || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
            </div>
          </Card>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">{item.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{item.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="text-lg font-semibold text-foreground">{item.rating}</span>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {typeNames[item.type]}
                    </Badge>
                  </div>
                </div>

                <Button
                  size="lg"
                  variant={isFavorite ? "default" : "outline"}
                  onClick={async () => {
                    try {
                      // Пайдаланушы кіруі тексеру
                      const userRes = await fetch("/api/auth/me")
                      if (!userRes.ok) {
                        alert("Таңдаулыларға қосу үшін кіру қажет")
                        return
                      }
                      
                      const userData = await userRes.json()
                      const user = userData.user
                      
                      if (!user) {
                        alert("Таңдаулыларға қосу үшін кіру қажет")
                        return
                      }

                      if (isFavorite) {
                        // Таңдаулыдан жою
                        const res = await fetch(`/api/favorites?mediaId=${item.id}`, {
                          method: "DELETE",
                        })
                        
                        if (res.ok) {
                          setIsFavorite(false)
                          alert("Таңдаулылардан алынып тасталды!")
                        } else {
                          const error = await res.json()
                          alert(error.error || "Таңдаулыдан жою қатесі")
                        }
                      } else {
                        // Таңдаулыға қосу
                        const res = await fetch("/api/favorites", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ mediaId: item.id }),
                        })
                        
                        if (res.ok) {
                          setIsFavorite(true)
                          alert("Таңдаулыларға қосылды!")
                        } else {
                          const error = await res.json()
                          alert(error.error || "Таңдаулыға қосу қатесі")
                        }
                      }
                    } catch (error) {
                      console.error("Таңдаулыға қосу/жою қатесі:", error)
                      alert("Таңдаулыға қосу/жою қатесі")
                    }
                  }}
                  className="gap-2 transition-all hover:scale-105"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Таңдаулыларда" : "Таңдаулыларға қосу"}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {item.genre.map((genre) => (
                  <Badge key={genre} variant="outline" className="text-sm">
                    {genre}
                  </Badge>
                ))}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">{item.description}</p>
              {item.watchUrl && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href={item.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>
                      {item.type === "movie" && "Фильмді онлайн көру"}
                      {item.type === "book" && "Кітапты онлайн оқу"}
                      {item.type === "game" && "Ойынды онлайн ойнау"}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "The Shawshank Redemption" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://rutube.ru/video/1a13ed24b9f105b43c8b9d19f1b6846a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Фильмді онлайн көру</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "The Godfather" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://kz1.kinogo-films.lat/2341-krestnyj-otec-1972.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Фильмді онлайн көру</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "The Dark Knight" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://vkvideo.ru/video-143260624_456239857"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Фильмді онлайн көру</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "Inception" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://vkvideo.ru/video-220018529_456240825?ref_domain=yastatic.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Фильмді онлайн көру</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "Pulp Fiction" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://vkvideo.ru/video-34229261_456248235?ref_domain=yastatic.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Фильмді онлайн көру</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "Schindler's List" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://vkvideo.ru/video-220018529_456243376?ref_domain=yastatic.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Фильмді онлайн көру</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "Interstellar" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://vkvideo.ru/video-231084166_456244705?ref_domain=yastatic.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Фильмді онлайн көру</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "Spirited Away" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://youtu.be/HHaRYQsNma0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Фильмді онлайн көру</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "The Lord of the Rings: The Return of the King" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://hd.vlastelinkolec-lordfilm.ru/dve-kreposti/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Фильмді онлайн көру</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "Dune" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://1.librebook.me/dune/vol1/2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Кітапты онлайн оқу</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "Project Hail Mary" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://liteka.ru/english/library/4141-project-hail-mary"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Кітапты онлайн оқу</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "The Three-Body Problem" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://libcat.ru/knigi/fantastika-i-fjentezi/83807-cixin-liu-the-three-body-problem.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Кітапты онлайн оқу</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "The Martian" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://liteka.ru/english/library/3521-the-martian-a-novel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Кітапты онлайн оқу</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "The Handmaid's Tale" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://linguabooster.com/ru/en/book/the-robbers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Кітапты онлайн оқу</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "The Witcher 3: Wild Hunt" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://fogplay.mts.ru/computer/the-witcher-3-wild-hunt/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Ойынды онлайн ойнау</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "Red Dead Redemption 2" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://www.rockstargames.com/ru/reddeadonline"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Ойынды онлайн ойнау</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "Baldur's Gate 3" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://fogplay.mts.ru/computer/baldurs-gate-3/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Ойынды онлайн ойнау</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "Elden Ring" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://fogplay.mts.ru/computer/elden-ring-nightreign/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Ойынды онлайн ойнау</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "The Last of Us Part II" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://fogplay.mts.ru/computer/the-last-of-us-part-ii-remastered/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Ойынды онлайн ойнау</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
              {item.title === "God of War" && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <a
                    href="https://sirus.one/?utm_source=yandex&utm_medium=cpc&utm_campaign=72007854&utm_content=17031382173&utm_term=играть+игры+онлайн+бесплатно&ybaip=1&yclid=14565237818767441919"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-lg font-semibold transition-colors group"
                  >
                    <span>Ойынды онлайн ойнау</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Ұқсас материалдар</h2>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4">
                {relatedItems.map((related) => (
                  <Link
                    key={related.id}
                    href={`/${item.type}s/${related.id}`}
                    className="group flex-shrink-0 w-[150px]"
                  >
                    <Card className="overflow-hidden border-border/50 transition-all hover:scale-105 hover:neon-glow">
                      <div className="relative aspect-[2/3]">
                        <SafeImage
                          src={related.coverImage || "/placeholder.svg"}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-3 space-y-1">
                        <h3 className="font-semibold text-sm line-clamp-2 text-balance leading-snug">
                          {related.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span>{related.rating}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border/50">
              <h2 className="text-2xl font-bold">Пайдаланушы пікірлері</h2>

              <div className="space-y-4">
                <Card className="glass border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <Textarea
                      placeholder="Ойыңызды бөлісіңіз…"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleAddComment} disabled={!comment.trim()} className="gap-2">
                        Пікірді жариялау
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {comments.map((review) => (
                    <Card key={review.id} className="border-border/50">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                              <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{review.userName}</p>
                              <p className="text-xs text-muted-foreground">{review.createdAt}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="font-medium">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-pretty">{review.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
