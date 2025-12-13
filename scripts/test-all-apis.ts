/**
 * Барлық API-ларды тексеру скрипті
 * 
 * Пайдалану:
 * npx tsx scripts/test-all-apis.ts
 */

import { readFileSync, existsSync } from "fs"
import { resolve } from "path"

// .env.local файлын жүктеу
const envPath = resolve(process.cwd(), ".env.local")
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8")
  envContent.split("\n").forEach((line) => {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      const match = trimmedLine.match(/^([^=:#]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        let value = match[2].trim()
        if (!value) return
        value = value.replace(/^["']|["']$/g, "")
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    }
  })
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

interface TestResult {
  name: string
  method: string
  url: string
  status: "✅" | "❌" | "⚠️"
  message: string
  requiresAuth?: boolean
}

async function testAPI(method: string, url: string, options: RequestInit = {}): Promise<TestResult> {
  try {
    const response = await fetch(url, {
      method,
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    const status = response.ok ? "✅" : response.status === 401 ? "⚠️" : "❌"
    const message = response.ok
      ? `OK (${response.status})`
      : response.status === 401
      ? "Кіру қажет (401)"
      : `Қате (${response.status})`

    return {
      name: `${method} ${url}`,
      method,
      url,
      status,
      message,
    }
  } catch (error) {
    return {
      name: `${method} ${url}`,
      method,
      url,
      status: "❌",
      message: error instanceof Error ? error.message : "Қосылу қатесі",
    }
  }
}

async function testAllAPIs() {
  console.log("🧪 Барлық API-ларды тексеру басталды...\n")
  console.log("=".repeat(70))

  const results: TestResult[] = []

  // 1. Аутентификация API-лары
  console.log("\n🔐 Аутентификация API-лары:")
  console.log("-".repeat(70))

  results.push(await testAPI("GET", `${BASE_URL}/api/auth/me`))
  results.push(await testAPI("POST", `${BASE_URL}/api/auth/logout`))

  // 2. Медиа API-лары (ашық)
  console.log("\n📚 Медиа API-лары (ашық):")
  console.log("-".repeat(70))

  results.push(await testAPI("GET", `${BASE_URL}/api/movies`))
  results.push(await testAPI("GET", `${BASE_URL}/api/books`))
  results.push(await testAPI("GET", `${BASE_URL}/api/games`))
  results.push(await testAPI("GET", `${BASE_URL}/api/search?q=test`))

  // 3. Пікірлер API-лары
  console.log("\n💬 Пікірлер API-лары:")
  console.log("-".repeat(70))

  results.push(await testAPI("GET", `${BASE_URL}/api/comments?mediaId=1`))

  // 4. Таңдаулылар API-лары (аутентификация қажет)
  console.log("\n❤️ Таңдаулылар API-лары (аутентификация қажет):")
  console.log("-".repeat(70))

  results.push(await testAPI("GET", `${BASE_URL}/api/favorites`))

  // 5. Админ API-лары (админ қажет)
  console.log("\n👑 Админ API-лары (админ қажет):")
  console.log("-".repeat(70))

  results.push(await testAPI("GET", `${BASE_URL}/api/users`))
  results.push(await testAPI("POST", `${BASE_URL}/api/movies`, { body: JSON.stringify({}) }))
  results.push(await testAPI("POST", `${BASE_URL}/api/books`, { body: JSON.stringify({}) }))
  results.push(await testAPI("POST", `${BASE_URL}/api/games`, { body: JSON.stringify({}) }))

  // Нәтижелерді көрсету
  console.log("\n" + "=".repeat(70))
  console.log("📊 Нәтижелер:")
  console.log("=".repeat(70))

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.status} ${result.name}`)
    console.log(`   ${result.message}`)
    if (result.requiresAuth) {
      console.log(`   ⚠️ Аутентификация қажет`)
    }
    console.log()
  })

  // Статистика
  const success = results.filter((r) => r.status === "✅").length
  const warning = results.filter((r) => r.status === "⚠️").length
  const error = results.filter((r) => r.status === "❌").length

  console.log("=".repeat(70))
  console.log(`✅ Сәтті: ${success}`)
  console.log(`⚠️ Аутентификация қажет: ${warning}`)
  console.log(`❌ Қателер: ${error}`)
  console.log(`📊 Барлығы: ${results.length}`)
  console.log("=".repeat(70))

  if (error === 0) {
    console.log("\n✨ Барлық API-лар дұрыс жұмыс істейді!")
  } else {
    console.log(`\n⚠️ ${error} API қатесі бар.`)
  }
}

testAllAPIs()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Қате:", error)
    process.exit(1)
  })












