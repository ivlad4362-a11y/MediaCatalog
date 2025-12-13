"use client"

import { useEffect } from "react"

export function ErrorHandler() {
  useEffect(() => {
    // Тек клиент-жағында жұмыс істеу
    if (typeof window === "undefined") {
      return
    }

    // Unhandled promise rejection-дарды басқару
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Event объектісін дұрыс өңдеу
      const error = event.reason
      
      // Error объектісін дұрыс көрсету
      if (error instanceof Error) {
        console.error("Unhandled promise rejection:", error.message, error.stack)
      } else if (typeof error === "string") {
        console.error("Unhandled promise rejection:", error)
      } else if (error && typeof error === "object") {
        // Event объектісін дұрыс өңдеу
        try {
          const errorString = error.toString ? error.toString() : String(error)
          console.error("Unhandled promise rejection:", errorString)
        } catch {
          console.error("Unhandled promise rejection: [Unknown error]")
        }
      } else {
        console.error("Unhandled promise rejection: [Unknown error]")
      }
      
      // Event-ті тоқтатпау - қатені браузерге жіберу (Next.js өзі басқарады)
    }

    // Глобалды қателерді басқару
    const handleError = (event: ErrorEvent) => {
      // Тек шынайы қателерді көрсету
      if (event.error && event.error instanceof Error) {
        console.error("Global error:", event.error.message, event.filename, event.lineno)
      }
      // Event-ті тоқтатпау - қатені браузерге жіберу
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleError)
    }
  }, [])

  return null
}

