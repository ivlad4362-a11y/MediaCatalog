export type MediaType = "movie" | "book" | "game"

export interface MediaItem {
  id: string
  title: string
  description: string
  coverImage: string
  type: MediaType
  rating: number
  year: number
  genre: string[]
  popularity: number
  releatedItems?: string[]
  watchUrl?: string
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  rating: number
  createdAt: string
}
