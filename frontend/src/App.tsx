import axios from "axios"
import { useCallback, useEffect, useMemo, useState } from "react"

import { MediaGrid } from "./components/MediaGrid"
// import { MediaFilters, MediaFiltersState } from "./components/MediaFilters"
// import { AuthDialog } from "./components/AuthDialog"
// import { FeaturedRow } from "./components/FeaturedRow"
// import { useAuth } from "./context/AuthContext"

// Бұл файл әлі толық емес, негізгі құрылым ғана
export default function App() {
  // Мысал мәліметтер
  const mockItems = [
    {
      id: "1",
      title: "Inception",
      description: "Арман әлемі арқылы құпия ақпарат ұрлайтын ұры туралы",
      coverImage: "/inception-movie-poster.png",
      type: "movie" as const,
      rating: 8.8,
      year: 2010,
      popularity: 95,
      genre: ["Ғылыми фантастика", "Триллер"],
    },
  ]

  return (
    <div>
      <h1>MediaCatalog</h1>
      <MediaGrid items={mockItems} />
    </div>
  )
}

