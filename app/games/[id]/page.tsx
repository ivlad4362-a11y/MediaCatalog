import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { MediaDetail } from "@/components/media-detail"
import { notFound } from "next/navigation"

const gameData: Record<string, any> = {
  "2": {
    id: "2",
    title: "The Witcher 3: Wild Hunt",
    description:
      "As war rages on throughout the Northern Realms, you take on the greatest contract of your life — tracking down the Child of Prophecy, a living weapon that can alter the shape of the world. The Witcher 3: Wild Hunt is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.",
    coverImage: "/witcher-3-inspired-cover.png",
    type: "game" as const,
    rating: 9.3,
    year: 2015,
    genre: ["RPG", "Adventure", "Fantasy"],
    popularity: 98,
  },
  "5": {
    id: "5",
    title: "Elden Ring",
    description:
      "THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. A vast world where open fields with a variety of situations and huge dungeons with complex and three-dimensional designs are seamlessly connected.",
    coverImage: "/generic-fantasy-game-cover.png",
    type: "game" as const,
    rating: 9.1,
    year: 2022,
    genre: ["RPG", "Action", "Fantasy"],
    popularity: 96,
  },
}

export default function GameDetailPage({ params }: { params: { id: string } }) {
  const game = gameData[params.id]

  if (!game) {
    notFound()
  }

  const relatedGames = [
    {
      id: "7",
      title: "Baldurs Gate 3",
      coverImage: "/fantasy-rpg-cover.png",
      rating: 9.4,
    },
    {
      id: "12",
      title: "Red Dead Redemption 2",
      coverImage: "/red-dead-redemption-2.jpg",
      rating: 9.7,
    },
    {
      id: "15",
      title: "God of War",
      coverImage: "/god-of-war-game-cover.jpg",
      rating: 9.5,
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MediaDetail item={game} relatedItems={relatedGames} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
