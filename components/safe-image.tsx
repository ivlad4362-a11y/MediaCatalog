"use client"

import { useState } from "react"
import Image from "next/image"

interface SafeImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function SafeImage({ src, alt, fill, width, height, className, priority }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || "/placeholder.svg")
  const [hasError, setHasError] = useState(false)

  // Сурет жолын тексеру және дұрыс емес болса placeholder пайдалану
  // Егер сурет жоқ болса немесе қате болса, placeholder пайдалану
  // Жоқ суреттердің тізімі
  const missingImages = ["lotr-book-cover.jpg", "1984-book-cover.jpg", "matrix-poster.jpg"]
  const imageName = src?.split("/").pop() || ""
  const isMissing = missingImages.includes(imageName)
  
  const finalSrc = hasError || !src || src === "/placeholder.jpg" || src.includes("404") || isMissing 
    ? "/placeholder.svg" 
    : imgSrc

  if (fill) {
    return (
      <Image
        src={finalSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        unoptimized
        onError={() => {
          if (!hasError) {
            setHasError(true)
          }
        }}
      />
    )
  }

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
      onError={() => {
        if (!hasError) {
          setHasError(true)
        }
      }}
    />
  )
}

