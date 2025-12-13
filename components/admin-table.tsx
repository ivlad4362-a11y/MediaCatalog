"use client"

import { Pencil, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/safe-image"
import type { MediaItem } from "@/lib/types"

interface AdminTableProps {
  items: MediaItem[]
  onEdit: (item: MediaItem) => void
  onDelete: (id: string) => void
}

export function AdminTable({ items, onEdit, onDelete }: AdminTableProps) {
  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Мұқаба</TableHead>
            <TableHead>Атауы</TableHead>
            <TableHead>Жылы</TableHead>
            <TableHead>Рейтинг</TableHead>
            <TableHead>Жанр</TableHead>
            <TableHead className="text-right">Әрекеттер</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Элементтер табылмады. Бастау үшін бірінші элементті қосыңыз.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="relative w-12 h-16 rounded overflow-hidden">
                    <SafeImage src={item.coverImage || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.year}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{item.rating}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.genre.slice(0, 2).map((genre) => (
                      <Badge key={genre} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Өңдеу</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Жою</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
