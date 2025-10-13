"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { MediaItem, MediaType } from "@/lib/types"

interface AdminFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: MediaItem) => void
  item: MediaItem | null
  type: MediaType
}

export function AdminForm({ isOpen, onClose, onSave, item, type }: AdminFormProps) {
  const [formData, setFormData] = useState<Partial<MediaItem>>({
    title: "",
    description: "",
    coverImage: "",
    type: type,
    rating: 0,
    year: new Date().getFullYear(),
    genre: [],
    popularity: 0,
  })
  const [genreInput, setGenreInput] = useState("")

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({
        title: "",
        description: "",
        coverImage: "",
        type: type,
        rating: 0,
        year: new Date().getFullYear(),
        genre: [],
        popularity: 0,
      })
    }
  }, [item, type])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as MediaItem)
  }

  const addGenre = () => {
    if (genreInput.trim() && !formData.genre?.includes(genreInput.trim())) {
      setFormData({
        ...formData,
        genre: [...(formData.genre || []), genreInput.trim()],
      })
      setGenreInput("")
    }
  }

  const removeGenre = (genre: string) => {
    setFormData({
      ...formData,
      genre: formData.genre?.filter((g) => g !== genre) || [],
    })
  }

  const typeNames = {
    movie: "фильм",
    book: "книгу",
    game: "игру",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? "Редактировать" : "Добавить"} {typeNames[type]}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">URL обложки</Label>
            <Input
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="/path/to/image.jpg"
              required
            />
            {formData.coverImage && (
              <div className="relative w-32 h-48 rounded overflow-hidden border border-border">
                <img
                  src={formData.coverImage || "/placeholder.svg"}
                  alt="Предпросмотр"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Год</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Рейтинг (0-10)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number.parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="popularity">Популярность (0-100)</Label>
            <Input
              id="popularity"
              type="number"
              min="0"
              max="100"
              value={formData.popularity}
              onChange={(e) => setFormData({ ...formData, popularity: Number.parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Жанры</Label>
            <div className="flex gap-2">
              <Input
                id="genre"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addGenre()
                  }
                }}
                placeholder="Добавь жанр и нажми Enter"
              />
              <Button type="button" onClick={addGenre} variant="outline">
                Добавить
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.genre?.map((genre) => (
                <Badge key={genre} variant="secondary" className="gap-1">
                  {genre}
                  <button type="button" onClick={() => removeGenre(genre)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">{item ? "Обновить" : "Создать"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
