"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogIn, UserPlus, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
}

export function AuthDialog() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const router = useRouter()

  // Пайдаланушыны алу
  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (!res.ok) {
        setUser(null)
        return
      }
      const data = await res.json()
      setUser(data.user)
    } catch (error) {
      // Қатені консольда көрсетпеу (қалыпты жағдай)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setUser(data.user)
        setIsOpen(false)
        router.refresh()
      } else {
        // 401 қатесін қалыпты жағдай ретінде қарастыру
        alert(data.error || "Email немесе пароль дұрыс емес")
      }
    } catch (error) {
      // Сеть қатесін ғана көрсету
      alert("Серверге қосылу қатесі. Интернет байланысын тексеріңіз.")
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Тіркелу сәтті өтті! Енді кіруге болады.")
        setActiveTab("login")
        // Автоматты логин
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        const loginData = await loginRes.json()
        if (loginRes.ok) {
          setUser(loginData.user)
          setIsOpen(false)
          router.refresh()
        }
      } else {
        alert(data.error || "Тіркелу қатесі")
      }
    } catch (error) {
      console.error("Тіркелу қатесі:", error)
      alert("Тіркелу қатесі")
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Шығу қатесі:", error)
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="transition-all hover:neon-glow" disabled>
        <User className="h-5 w-5" />
      </Button>
    )
  }

  if (user) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="transition-all hover:neon-glow cursor-pointer"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
              <AvatarFallback>{user.name?.[0] || user.email[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Профиль</DialogTitle>
            <DialogDescription>{user.email}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
                <AvatarFallback className="text-lg">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user.name || "Пайдаланушы"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.role === "admin" && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                    Әкімші
                  </span>
                )}
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Шығу
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="transition-all hover:neon-glow cursor-pointer"
        >
          <User className="h-5 w-5" />
          <span className="sr-only">Кіру</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Кіру немесе тіркелу</DialogTitle>
          <DialogDescription>Аккаунтыңызға кіріңіз немесе жаңа аккаунт құрыңыз</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="gap-2">
              <LogIn className="h-4 w-4" />
              Кіру
            </TabsTrigger>
            <TabsTrigger value="register" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Тіркелу
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Кіру
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Аты-жөні</Label>
                <Input id="register-name" name="name" type="text" placeholder="Атыңыз" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="Кемінде 6 таңба"
                  minLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Тіркелу
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

