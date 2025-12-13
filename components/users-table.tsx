"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SafeImage } from "@/components/safe-image"
import { KeyRound } from "lucide-react"

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
  passwordHash?: string
  createdAt?: string
}

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [changingPasswordFor, setChangingPasswordFor] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("kk-KZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch {
      return dateString
    }
  }

  const handleChangePassword = async (email: string) => {
    if (!newPassword || newPassword.length < 4) {
      alert("Пароль кемінде 4 символ болуы керек")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      })

      // Response мәтінін алу
      const text = await res.text()
      
      // Бос response-ті тексеру
      let result
      try {
        result = text ? JSON.parse(text) : {}
      } catch (parseError) {
        console.error("JSON парсинг қатесі:", parseError)
        alert("Серверден дұрыс жауап алынбады. Пароль өзгертілмеген болуы мүмкін.")
        setIsLoading(false)
        return
      }

      if (res.ok) {
        alert(
          result.message || "Пароль сәтті өзгертілді!\n\n" +
          "Ескерту: " + email + " пайдаланушысы енді жаңа парольмен кіре алады."
        )
        setChangingPasswordFor(null)
        setNewPassword("")
        // Бетті жаңарту
        window.location.reload()
      } else {
        alert(result.error || "Парольді өзгерту қатесі")
      }
    } catch (error) {
      console.error("Парольді өзгерту қатесі:", error)
      alert("Парольді өзгерту қатесі: " + (error instanceof Error ? error.message : "Белгісіз қате"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Сурет</TableHead>
            <TableHead>Аты</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Пароль</TableHead>
            <TableHead>Рөлі</TableHead>
            <TableHead>Тіркелген күні</TableHead>
            <TableHead className="w-[120px]">Әрекеттер</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                Пайдаланушылар табылмады.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <SafeImage
                      src={user.image || "/placeholder-user.jpg"}
                      alt={user.name || user.email}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{user.name || user.email.split("@")[0]}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  {user.passwordHash ? (
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono break-all max-w-xs inline-block">
                      {user.passwordHash.substring(0, 30)}...
                    </code>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "outline"} className="text-xs">
                    {user.role === "admin" ? "Әкімші" : "Пайдаланушы"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <Dialog open={changingPasswordFor === user.email} onOpenChange={(open) => {
                    if (!open) {
                      setChangingPasswordFor(null)
                      setNewPassword("")
                    } else {
                      setChangingPasswordFor(user.email)
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <KeyRound className="h-3 w-3" />
                        Парольді өзгерту
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Парольді өзгерту</DialogTitle>
                        <DialogDescription>
                          {user.email} пайдаланушысының паролін өзгерту
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Жаңа пароль</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Кемінде 4 символ"
                            minLength={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setChangingPasswordFor(null)
                            setNewPassword("")
                          }}
                          disabled={isLoading}
                        >
                          Болдырмау
                        </Button>
                        <Button
                          onClick={() => handleChangePassword(user.email)}
                          disabled={isLoading || !newPassword || newPassword.length < 4}
                        >
                          {isLoading ? "Сақталуда..." : "Сақтау"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
