"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { AdminTable } from "@/components/admin-table"
import { AdminForm } from "@/components/admin-form"
import { UsersTable } from "@/components/users-table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Film, Book, Gamepad2, BarChart3, Users, Activity, ClipboardList, Trash2, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MediaItem } from "@/lib/types"

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
  passwordHash?: string
  createdAt?: string
}

interface CurrentUser {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
}

export default function AdminPage() {
  const [movies, setMovies] = useState<MediaItem[]>([])
  const [books, setBooks] = useState<MediaItem[]>([])
  const [games, setGames] = useState<MediaItem[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [favorites, setFavorites] = useState<Array<{ id: string; mediaId: string; userId: string; createdAt: string; media: MediaItem | null }>>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [currentType, setCurrentType] = useState<"movie" | "book" | "game">("movie")

  // Аутентификацияны тексеру
  useEffect(() => {
    checkAuth()
  }, [])

  // Мәліметтерді жүктеу (тек админ үшін)
  useEffect(() => {
    if (currentUser?.role === "admin") {
      loadData()
    }
  }, [currentUser])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        if (data.user && data.user.role === "admin") {
          setCurrentUser(data.user)
        } else {
          // Админ емес - бетке кіруге тыйым салу
          window.location.href = "/"
        }
      } else {
        // Кірмеген - бетке кіруге тыйым салу
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Аутентификация тексеру қатесі:", error)
      window.location.href = "/"
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Аутентификация токенін алу
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers["Cookie"] = `auth-token=${token}`
      }

      const [moviesRes, booksRes, gamesRes, usersRes, favoritesRes] = await Promise.all([
        fetch("/api/movies", { credentials: "include" }),
        fetch("/api/books", { credentials: "include" }),
        fetch("/api/games", { credentials: "include" }),
        fetch("/api/users", { credentials: "include" }),
        fetch("/api/favorites", { credentials: "include" }),
      ])

      // Response статусын тексеру
      if (!moviesRes.ok) {
        console.error("Фильмдерді алу қатесі:", moviesRes.status, moviesRes.statusText)
        setMovies([])
      } else {
        const moviesData: MediaItem[] = await moviesRes.json()
        setMovies(Array.isArray(moviesData) ? moviesData : [])
      }

      if (!booksRes.ok) {
        console.error("Кітаптарды алу қатесі:", booksRes.status, booksRes.statusText)
        setBooks([])
      } else {
        const booksData: MediaItem[] = await booksRes.json()
        setBooks(Array.isArray(booksData) ? booksData : [])
      }

      if (!gamesRes.ok) {
        console.error("Ойындарды алу қатесі:", gamesRes.status, gamesRes.statusText)
        setGames([])
      } else {
        const gamesData: MediaItem[] = await gamesRes.json()
        setGames(Array.isArray(gamesData) ? gamesData : [])
      }

      if (!usersRes.ok) {
        console.error("Пайдаланушыларды алу қатесі:", usersRes.status, usersRes.statusText)
        setUsers([])
      } else {
        const usersData: User[] = await usersRes.json()
        setUsers(Array.isArray(usersData) ? usersData : [])
      }

      if (!favoritesRes.ok) {
        console.error("Таңдаулыларды алу қатесі:", favoritesRes.status, favoritesRes.statusText)
        setFavorites([])
      } else {
        const favoritesData = await favoritesRes.json()
        setFavorites(Array.isArray(favoritesData) ? favoritesData : [])
      }
    } catch (error) {
      console.error("Мәліметтерді жүктеу қатесі:", error)
      // Қате кезінде бос массивтерді орнату
      setMovies([])
      setBooks([])
      setGames([])
      setUsers([])
      setFavorites([])
    } finally {
      setIsLoading(false)
    }
  }

  const metrics = [
    {
      title: "Белсенді қолданушылар",
      value: users.length.toString(),
      change: `Жаңа тіркелген: ${users.filter((u) => {
        const userDate = new Date(u.createdAt || u.id)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return userDate > weekAgo
      }).length}`,
      icon: Users,
      style: "bg-primary/15 text-primary",
    },
    {
      title: "Контент саны",
      value: movies.length + books.length + games.length,
      change: "Жаңа 6 позиция",
      icon: Film,
      style: "bg-secondary/15 text-secondary",
    },
    {
      title: "Рейтинг орташа мәні",
      value: (
        (
          [...movies, ...books, ...games].reduce((acc, item) => acc + item.rating, 0) /
          (movies.length + books.length + games.length || 1)
        ).toFixed(1)
      ),
      change: "Активті пікірлер ↑",
      icon: BarChart3,
      style: "bg-accent/15 text-accent",
    },
    {
      title: "Апталық мақсат",
      value: "15 жаңа материал",
      change: "10-ы дайын",
      icon: Activity,
      style: "bg-muted/20 text-foreground",
    },
  ]

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

  const handleDelete = async (id: string, type: "movie" | "book" | "game") => {
    if (!confirm("Бұл элементті жоюға сенімдісіз бе?")) return

    try {
      const res = await fetch(`/api/${type}s?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        // Мәліметтерді қайта жүктеу
        await loadData()
      } else {
        alert("Жою қатесі")
      }
    } catch (error) {
      console.error("Жою қатесі:", error)
      alert("Жою қатесі")
    }
  }

  const handleSave = async (item: MediaItem) => {
    try {
      const isEdit = !!editingItem
      const url = `/api/${item.type}s`
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      })

      if (res.ok) {
        // Мәліметтерді қайта жүктеу
        await loadData()
        setIsFormOpen(false)
        setEditingItem(null)
      } else {
        const error = await res.json()
        alert(error.error || "Сақтау қатесі")
      }
    } catch (error) {
      console.error("Сақтау қатесі:", error)
      alert("Сақтау қатесі")
    }
  }

  const handleCleanupDuplicates = async () => {
    if (!confirm("Дубликаттарды жоюға сенімдісіз бе? Бұл әрекетті қайтаруға болмайды.")) return

    try {
      const res = await fetch("/api/cleanup-duplicates", {
        method: "POST",
      })

      const result = await res.json()

      if (res.ok) {
        if (result.removed > 0) {
          alert(`${result.removed} дубликат жойылды!`)
          // Мәліметтерді қайта жүктеу
          await loadData()
        } else {
          alert("Дубликаттар табылмады")
        }
      } else {
        alert(result.error || "Дубликаттарды жою қатесі")
      }
    } catch (error) {
      console.error("Дубликаттарды жою қатесі:", error)
      alert("Дубликаттарды жою қатесі")
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Тексеру...</p>
        </div>
      </div>
    )
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Сізде осы бетке кіру құқығы жоқ</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Мәліметтер жүктелуде...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1.5">
              <h1 className="text-3xl md:text-4xl font-bold text-balance">Әкімші панелі</h1>
              <p className="text-muted-foreground text-pretty">
                Каталогты жаңартып, көрсеткіштерді бақылаңыз және командаңызға тапсырмалар бөліңіз.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  alert("Контент жоспары функциясы әзірленуде. Бұл функция арқылы сіз контент қосуды жоспарлай аласыз.")
                }}
              >
                <ClipboardList className="h-4 w-4" />
                Контент жоспары
              </Button>
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:text-destructive"
                onClick={handleCleanupDuplicates}
              >
                <Trash2 className="h-4 w-4" />
                Дубликаттарды жою
              </Button>
              <Button
                variant="default"
                className="gap-2 bg-primary"
                onClick={async () => {
                  if (!confirm("Mock мәліметтерді базаға импорттауға сенімдісіз бе? Барлық бастапқы материалдар (фильмдер, кітаптар, ойындар) базаға сақталады.")) return
                  
                  setIsLoading(true)
                  try {
                    const res = await fetch("/api/import-mock-data", {
                      method: "POST",
                    })
                    
                    // Response мәтінін алу
                    const text = await res.text()
                    
                    // Бос response-ті тексеру
                    let result: any = {}
                    try {
                      result = text ? JSON.parse(text) : {}
                    } catch (parseError) {
                      console.error("JSON парсинг қатесі:", parseError)
                      console.error("Response мәтіні:", text)
                      alert(`❌ Серверден дұрыс жауап алынбады.\n\nResponse: ${text.substring(0, 100)}...\n\nБазамен байланысты тексеріңіз.`)
                      setIsLoading(false)
                      return
                    }
                    
                    if (res.ok) {
                      if (result.imported > 0) {
                        alert(`${result.message}\n\n✅ Импортталған: ${result.imported}\n⏭️ Өткізілген: ${result.skipped || 0}${result.errors && result.errors.length > 0 ? `\n\n❌ Қателер: ${result.errors.length}` : ""}`)
                      } else {
                        alert(result.message || "Импорттау аяқталды. Материалдар қазірдің өзінде базада бар.")
                      }
                      await loadData()
                    } else {
                      alert(`❌ Импорттау қатесі: ${result.error || "Белгісіз қате"}\n\nБазамен байланысты тексеріңіз.`)
                    }
                  } catch (error) {
                    console.error("Импорттау қатесі:", error)
                    const errorMsg = error instanceof Error ? error.message : "Белгісіз қате"
                    alert(`❌ Импорттау қатесі: ${errorMsg}\n\nБазамен байланысты тексеріңіз.`)
                  } finally {
                    setIsLoading(false)
                  }
                }}
              >
                <ClipboardList className="h-4 w-4" />
                Mock мәліметтерді импорттау
              </Button>
              <Button
                className="gap-2"
                onClick={() => {
                  // Жылдам қосу - фильм қосу формасын ашу
                  handleAdd("movie")
                }}
              >
                <Plus className="h-4 w-4" />
                Жылдам қосу
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map(({ title, value, change, icon: Icon, style }) => (
              <div
                key={title}
                className="rounded-2xl border border-border/50 bg-background/70 p-5 shadow-sm transition hover:neon-glow"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{title}</p>
                  <div className={cn("rounded-full p-2", style)}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
                <p className="text-xs text-primary/80 mt-2">{change}</p>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Пайдаланушылар
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              Таңдаулылар
            </TabsTrigger>
            <TabsTrigger value="movies" className="gap-2">
              <Film className="h-4 w-4" />
              Фильмдер
            </TabsTrigger>
            <TabsTrigger value="books" className="gap-2">
              <Book className="h-4 w-4" />
              Кітаптар
            </TabsTrigger>
            <TabsTrigger value="games" className="gap-2">
              <Gamepad2 className="h-4 w-4" />
              Ойындар
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-muted-foreground">
                Барлығы {users.length} пайдаланушы · Әкімшілер: {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
            <UsersTable users={users} />
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-muted-foreground">
                Барлығы {favorites.length} таңдаулы · {favorites.filter((f) => f.media).length} материал
              </p>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/70">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Материал</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Пайдаланушы ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Қосылған уақыты</th>
                    </tr>
                  </thead>
                  <tbody>
                    {favorites.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          Таңдаулылар табылмады
                        </td>
                      </tr>
                    ) : (
                      favorites.map((fav) => (
                        <tr key={fav.id} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="px-4 py-3">
                            {fav.media ? (
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{fav.media.title}</span>
                                <span className="text-xs text-muted-foreground">({fav.media.type})</span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Материал табылмады ({fav.mediaId})</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{fav.userId}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(fav.createdAt).toLocaleDateString("kk-KZ", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="movies" className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-muted-foreground">
                Соңғы 30 күнде {movies.length} фильм қосылды · Ең жоғары рейтинг:{" "}
                <span className="font-medium text-foreground">
                  {movies.length > 0
                    ? movies.reduce((top, item) => (item.rating > top ? item.rating : top), 0)
                    : "—"}
                </span>
              </p>
              <Button onClick={() => handleAdd("movie")} className="gap-2">
                <Plus className="h-4 w-4" />
                Фильм қосу
              </Button>
            </div>
            <AdminTable items={movies} onEdit={handleEdit} onDelete={(id) => handleDelete(id, "movie")} />
          </TabsContent>

          <TabsContent value="books" className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-muted-foreground">
                Қазіргі таңда {books.length} кітап белсенді · Орташа жыл:{" "}
                <span className="font-medium text-foreground">
                  {books.length > 0
                    ? Math.round(books.reduce((acc, item) => acc + item.year, 0) / books.length)
                    : "—"}
                </span>
              </p>
              <Button onClick={() => handleAdd("book")} className="gap-2">
                <Plus className="h-4 w-4" />
                Кітап қосу
              </Button>
            </div>
            <AdminTable items={books} onEdit={handleEdit} onDelete={(id) => handleDelete(id, "book")} />
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-muted-foreground">
                {games.length} ойын белсенді · Соңғы релиз:{" "}
                <span className="font-medium text-foreground">
                  {games.length > 0 ? Math.max(...games.map((game) => game.year)) : "—"}
                </span>
              </p>
              <Button onClick={() => handleAdd("game")} className="gap-2">
                <Plus className="h-4 w-4" />
                Ойын қосу
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
