"use client"

import { useState } from "react"
import { Star, Heart, Calendar, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    content: "Absolutely mind-blowing! One of the best experiences I've had. The attention to detail is incredible.",
    rating: 9.5,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    userId: "2",
    userName: "Sarah Chen",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "A masterpiece that keeps you thinking long after it ends. Highly recommended!",
    rating: 9.0,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    userId: "3",
    userName: "Mike Rodriguez",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "Great overall, though it has some pacing issues in the middle. Still worth experiencing.",
    rating: 8.0,
    createdAt: "2024-01-05",
  },
]

export function MediaDetail({ item, relatedItems }: MediaDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [comment, setComment] = useState("")

  const handleAddComment = () => {
    console.log("[v0] Adding comment:", comment)
    setComment("")
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <Image src={item.coverImage || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <Card className="overflow-hidden border-border/50 neon-glow h-fit">
            <div className="relative aspect-[2/3]">
              <Image src={item.coverImage || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
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
                      {item.type}
                    </Badge>
                  </div>
                </div>

                <Button
                  size="lg"
                  variant={isFavorite ? "default" : "outline"}
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="gap-2 transition-all hover:scale-105"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "В избранном" : "В избранное"}
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
            </div>

            <div className="space-y-4 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Похожие материалы</h2>
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
                        <Image
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
              <h2 className="text-2xl font-bold">Отзывы пользователей</h2>

              <div className="space-y-4">
                <Card className="glass border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <Textarea
                      placeholder="Поделись своими мыслями…"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleAddComment} disabled={!comment.trim()} className="gap-2">
                        Опубликовать отзыв
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {mockComments.map((review) => (
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
