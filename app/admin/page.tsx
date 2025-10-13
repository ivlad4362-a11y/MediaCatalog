"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { AdminTable } from "@/components/admin-table"
import { AdminForm } from "@/components/admin-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Film, Book, Gamepad2 } from "lucide-react"
import type { MediaItem } from "@/lib/types"

const initialMovies: MediaItem[] = [
  {
    id: "1",
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology",
    coverImage: "/inception-movie-poster.png",
    type: "movie",
    rating: 8.8,
    year: 2010,
    genre: ["Sci-Fi", "Thriller"],
    popularity: 95,
  },
  {
    id: "4",
    title: "Breaking Bad",
    description: "A chemistry teacher turned methamphetamine producer",
    coverImage: "/breaking-bad-inspired-poster.png",
    type: "movie",
    rating: 9.5,
    year: 2008,
    genre: ["Drama", "Crime"],
    popularity: 99,
  },
]

const initialBooks: MediaItem[] = [
  {
    id: "3",
    title: "Dune",
    description: "A science fiction novel about politics, religion, and ecology",
    coverImage: "/dune-book-cover.png",
    type: "book",
    rating: 8.5,
    year: 1965,
    genre: ["Sci-Fi", "Fantasy"],
    popularity: 92,
  },
]

const initialGames: MediaItem[] = [
  {
    id: "2",
    title: "The Witcher 3",
    description: "An open-world RPG set in a fantasy universe",
    coverImage: "/witcher-3-inspired-cover.png",
    type: "game",
    rating: 9.3,
    year: 2015,
    genre: ["RPG", "Adventure"],
    popularity: 98,
  },
]

export default function AdminPage() {
  const [movies, setMovies] = useState<MediaItem[]>(initialMovies)
  const [books, setBooks] = useState<MediaItem[]>(initialBooks)
  const [games, setGames] = useState<MediaItem[]>(initialGames)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [currentType, setCurrentType] = useState<"movie" | "book" | "game">("movie")

  const handleAdd = (type: "movie" | "book" | "game") => {
    setCurrentType(type)
    setEditingItem(null)
    setIsFormOpen(true)
  }

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item)
    setCurrentType(item.type)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string, type: "movie" | "book" | "game") => {
    if (type === "movie") {
      setMovies(movies.filter((m) => m.id !== id))
    } else if (type === "book") {
      setBooks(books.filter((b) => b.id !== id))
    } else {
      setGames(games.filter((g) => g.id !== id))
    }
  }

  const handleSave = (item: MediaItem) => {
    if (editingItem) {
      if (item.type === "movie") {
        setMovies(movies.map((m) => (m.id === item.id ? item : m)))
      } else if (item.type === "book") {
        setBooks(books.map((b) => (b.id === item.id ? item : b)))
      } else {
        setGames(games.map((g) => (g.id === item.id ? item : g)))
      }
    } else {
      const newItem = { ...item, id: Date.now().toString() }
      if (item.type === "movie") {
        setMovies([...movies, newItem])
      } else if (item.type === "book") {
        setBooks([...books, newItem])
      } else {
        setGames([...games, newItem])
      }
    }
    setIsFormOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-balance">Панель администратора</h1>
              <p className="text-muted-foreground text-pretty">Управляй контентом медиа-каталога</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="movies" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="movies" className="gap-2">
              <Film className="h-4 w-4" />
              Фильмы
            </TabsTrigger>
            <TabsTrigger value="books" className="gap-2">
              <Book className="h-4 w-4" />
              Книги
            </TabsTrigger>
            <TabsTrigger value="games" className="gap-2">
              <Gamepad2 className="h-4 w-4" />
              Игры
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => handleAdd("movie")} className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить фильм
              </Button>
            </div>
            <AdminTable items={movies} onEdit={handleEdit} onDelete={(id) => handleDelete(id, "movie")} />
          </TabsContent>

          <TabsContent value="books" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => handleAdd("book")} className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить книгу
              </Button>
            </div>
            <AdminTable items={books} onEdit={handleEdit} onDelete={(id) => handleDelete(id, "book")} />
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => handleAdd("game")} className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить игру
              </Button>
            </div>
            <AdminTable items={games} onEdit={handleEdit} onDelete={(id) => handleDelete(id, "game")} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <ScrollToTop />

      <AdminForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSave}
        item={editingItem}
        type={currentType}
      />
    </div>
  )
}
