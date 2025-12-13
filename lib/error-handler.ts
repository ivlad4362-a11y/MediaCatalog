// Глобалды қателерді басқару

if (typeof window !== "undefined") {
  // Unhandled promise rejection-дарды басқару
  window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    // Event объектісін дұрыс өңдеу
    const error = event.reason
    
    // Error объектісін дұрыс көрсету
    if (error instanceof Error) {
      console.error("Unhandled promise rejection:", error.message, error.stack)
    } else if (typeof error === "string") {
      console.error("Unhandled promise rejection:", error)
    } else {
      console.error("Unhandled promise rejection:", JSON.stringify(error))
    }
    
    // Event-ті тоқтату (бұл қатені браузерге жібермейді)
    event.preventDefault()
  })

  // Глобалды қателерді басқару
  window.addEventListener("error", (event: ErrorEvent) => {
    console.error("Global error:", event.message, event.filename, event.lineno)
    // Event-ті тоқтату
    event.preventDefault()
  })
}












