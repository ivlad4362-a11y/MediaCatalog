import { NextResponse } from "next/server"
import { removeDuplicates } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"

// Дубликаттарды жою
export async function POST() {
  const authResult = await requireAdmin()
  if (authResult) return authResult

  try {
    const result = await removeDuplicates()
    
    if (result.removed === 0) {
      return NextResponse.json({ 
        message: "Дубликаттар табылмады",
        removed: 0,
        duplicates: []
      })
    }

    return NextResponse.json({ 
      message: `${result.removed} дубликат жойылды`,
      removed: result.removed,
      duplicates: result.duplicates
    })
  } catch (error) {
    console.error("Дубликаттарды жою қатесі:", error)
    const errorMessage = error instanceof Error ? error.message : "Дубликаттарды жою қатесі"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

