import { prisma } from "./db"
import bcrypt from "bcryptjs"
import type { User } from "@prisma/client"

export interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
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
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  })
}

// Пайдаланушыны ID бойынша табу
export async function getUserById(id: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
    },
  })

  return user
}

// Жаңа пайдаланушыны қосу
export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<AuthUser> {
  try {
    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        passwordHash,
        role: "user",
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
      },
    })

    return user
  } catch (error) {
    console.error("createUser қатесі:", error)
    throw error
  }
}

// Логин (email және пароль бойынша)
export async function loginUser(email: string, password: string): Promise<AuthUser | null> {
  const user = await getUserByEmail(email)

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.passwordHash)

  if (!isValid) {
    return null
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
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
      },
    })

    return user
  } catch (error) {
    console.error("updateUserRole қатесі:", error)
    return null
  }
}



