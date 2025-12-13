"use client"

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="space-y-2 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="aspect-[2/3] skeleton rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 skeleton rounded w-3/4" />
            <div className="h-3 skeleton rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="w-[200px] overflow-hidden border-border/50 rounded-lg">
      <div className="aspect-[2/3] skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-3 skeleton rounded w-2/3" />
        <div className="flex gap-2">
          <div className="h-5 skeleton rounded w-16" />
          <div className="h-5 skeleton rounded w-16" />
        </div>
      </div>
    </div>
  )
}


