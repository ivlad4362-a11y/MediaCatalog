import { NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename)
    const filePath = join(process.cwd(), "app", "api", "books", filename)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "Файл табылмады" }, { status: 404 })
    }

    const fileBuffer = readFileSync(filePath)
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Файлды оқу қатесі:", error)
    return NextResponse.json({ error: "Файлды оқу қатесі" }, { status: 500 })
  }
}

