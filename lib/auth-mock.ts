// Уақытша мок аутентификация (базасыз жұмыс істеу үшін)
import bcrypt from "bcryptjs"
import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"

export interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
}

interface MockUser {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
  passwordHash: string
}

const USERS_FILE = join(process.cwd(), ".mock-users.json")

// Мок пайдаланушыларды файлдан оқу
function loadUsers(): MockUser[] {
  try {
    if (existsSync(USERS_FILE)) {
      const data = readFileSync(USERS_FILE, "utf-8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Пайдаланушыларды жүктеу қатесі:", error)
  }
  return []
}

// Мок пайдаланушыларды файлға сақтау
function saveUsers(users: MockUser[]) {
  try {
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8")
  } catch (error) {
    console.error("Пайдаланушыларды сақтау қатесі:", error)
  }
}

// Бастапқы тест пайдаланушылар (пароль: test123)
const TEST_USERS: Omit<MockUser, "passwordHash">[] = [
  {
    id: "admin-1",
    email: "admin@mediacatalog.kz",
    name: "Әкімші",
    image: null,
    role: "admin",
  },
  {
    id: "user-1",
    email: "user@mediacatalog.kz",
    name: "Пайдаланушы",
    image: null,
    role: "user",
  },
]

// Бастапқы тест пайдаланушыларды инициализациялау
async function initializeTestUsers() {
  let mockUsers = loadUsers()

  if (mockUsers.length === 0) {
    const testPassword = "test123"
    const testPasswordHash = await bcrypt.hash(testPassword, 10)

    mockUsers = TEST_USERS.map((user) => ({
      ...user,
      passwordHash: testPasswordHash,
    }))

    saveUsers(mockUsers)
    console.log("Бастапқы тест пайдаланушылар қосылды")
  } else {
    // Егер пайдаланушылар бар болса, админ email-ін тексеру
    const adminUser = mockUsers.find((u) => u.email === "admin@mediacatalog.kz")
    if (adminUser && adminUser.role !== "admin") {
      adminUser.role = "admin"
      const index = mockUsers.findIndex((u) => u.id === adminUser.id)
      if (index !== -1) {
        mockUsers[index] = adminUser
        saveUsers(mockUsers)
        console.log("Админ пайдаланушысының рөлі орнатылды")
      }
    }
  }
}

// Инициализациялау (бір рет)
let initialized = false
if (!initialized) {
  initialized = true
  initializeTestUsers().catch(console.error)
}

// Парольді хештеу
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Парольді тексеру
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Пайдаланушыны email бойынша табу
export async function getUserByEmail(email: string): Promise<MockUser | null> {
  // Файлдан қайта жүктеу (егер басқа процесс өзгерткен болса)
  const mockUsers = loadUsers()
  return mockUsers.find((u) => u.email === email) || null
}

// Пайдаланушыны ID бойынша табу
export async function getUserById(id: string): Promise<AuthUser | null> {
  // Файлдан қайта жүктеу
  const mockUsers = loadUsers()
  const user = mockUsers.find((u) => u.id === id)
  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  }
}

// Жаңа пайдаланушыны қосу
export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<AuthUser> {
  // Файлдан қайта жүктеу
  let mockUsers = loadUsers()

  // Email бойынша тексеру
  const existing = mockUsers.find((u) => u.email === email)
  if (existing) {
    throw new Error("Бұл email бойынша пайдаланушы бар")
  }

  const passwordHash = await hashPassword(password)
  const id = Date.now().toString()

  const newUser: MockUser = {
    id,
    email,
    name: name || email.split("@")[0],
    image: null,
    passwordHash,
    role: "user",
  }

  mockUsers.push(newUser)
  saveUsers(mockUsers)

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    image: newUser.image,
    role: newUser.role,
  }
}

// Логин (email және пароль бойынша)
export async function loginUser(email: string, password: string): Promise<AuthUser | null> {
  // Файлдан қайта жүктеу
  const mockUsers = loadUsers()
  let user = mockUsers.find((u) => u.email === email)

  if (!user) {
    console.error(`Пайдаланушы табылмады: ${email}`)
    return null
  }

  const isValid = await verifyPassword(password, user.passwordHash)

  if (!isValid) {
    console.error(`Пароль дұрыс емес: ${email}`)
    return null
  }

  // Егер админ email болса, рөлін әрдайым админге орнату
  if (email === "admin@mediacatalog.kz") {
    if (user.role !== "admin") {
      user.role = "admin"
      const index = mockUsers.findIndex((u) => u.id === user!.id)
      if (index !== -1) {
        mockUsers[index] = user
        saveUsers(mockUsers)
        console.log("Админ пайдаланушысының рөлі орнатылды")
      }
    }
    // Әрдайым админ рөлін қайтару
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: "admin", // Әрдайым админ
    }
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  }
}

// Пайдаланушының рөлін өзгерту
export async function updateUserRole(email: string, role: "user" | "admin"): Promise<AuthUser | null> {
  let mockUsers = loadUsers()
  const user = mockUsers.find((u) => u.email === email)

  if (!user) {
    return null
  }

  user.role = role
  const index = mockUsers.findIndex((u) => u.id === user.id)
  if (index !== -1) {
    mockUsers[index] = user
    saveUsers(mockUsers)
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  }
}
