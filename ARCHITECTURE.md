# Архитектура проекта MediaCatalog

## Обзор

MediaCatalog - это веб-приложение для каталогизации и просмотра фильмов, книг и игр, построенное на Next.js 15 с использованием App Router, Prisma ORM и PostgreSQL.

---

## Архитектура бэкенда

### 1. Общая архитектурная модель: Layered Architecture (многослойная)

Проект использует многослойную архитектуру с четким разделением ответственности:

```
┌─────────────────────────────────────┐
│   Presentation Layer (API Routes)   │  app/api/*
├─────────────────────────────────────┤
│   Service Layer (Business Logic)    │  lib/db.ts, lib/auth.ts
├─────────────────────────────────────┤
│   Data Access Layer (ORM)           │  Prisma Client
├─────────────────────────────────────┤
│   Database Layer                    │  PostgreSQL
└─────────────────────────────────────┘
         ↓ (fallback)
┌─────────────────────────────────────┐
│   Mock/Fallback Layer               │  lib/db-mock.ts
└─────────────────────────────────────┘
```

### 2. Технологический стек

- **Framework**: Next.js 15 с App Router
- **ORM**: Prisma 5.20
- **Database**: PostgreSQL
- **Authentication**: JWT (jose)
- **Type Safety**: TypeScript

### 3. Структура слоев

#### Слой 1: API Routes (Presentation Layer)

```
app/api/
├── movies/route.ts      → GET, POST, PUT, DELETE
├── books/route.ts       → GET, POST, PUT, DELETE
├── games/route.ts       → GET, POST, PUT, DELETE
├── auth/
│   ├── login/route.ts
│   ├── register/route.ts
│   ├── me/route.ts
│   └── logout/route.ts
├── favorites/route.ts
├── comments/route.ts
└── search/route.ts
```

**Особенности:**
- RESTful API с использованием стандартных HTTP методов
- Каждый route - отдельный файл
- Обработка запросов через named exports (GET, POST, PUT, DELETE)

#### Слой 2: Service Layer (Business Logic)

```
lib/
├── db.ts              → Работа с медиа-данными
├── auth.ts            → Аутентификация пользователей
├── auth-helpers.ts     → Middleware для проверки прав
└── types.ts           → TypeScript типы
```

**Основные функции в `lib/db.ts`:**
- `getMediaItems()` - получение с fallback механизмом
- `getMediaItem()` - получение одного элемента
- `createMediaItem()` - создание с валидацией дубликатов
- `updateMediaItem()` - обновление
- `deleteMediaItem()` - удаление
- `searchMediaItems()` - поиск

#### Слой 3: Data Access Layer (Prisma ORM)

```typescript
// Singleton pattern для Prisma Client
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
```

**Особенности:**
- Singleton pattern для Prisma Client
- Автоматическая типизация через Prisma schema
- Связи через relations (MediaGenre, Genre)

#### Слой 4: Fallback/Mock Layer

```typescript
// lib/db-mock.ts
export const mockMovies: MediaItem[]
export const mockBooks: MediaItem[]
export const mockGames: MediaItem[]
```

**Особенности:**
- Fallback механизм при ошибках БД
- Файловое хранилище (`.mock-media.json`)
- Автоматическое восстановление при ошибках

### 4. Паттерны проектирования

#### 1. Repository Pattern
```typescript
// lib/db.ts - абстракция доступа к данным
export async function getMediaItems(type?: "movie" | "book" | "game")
export async function createMediaItem(item: MediaItem)
```

#### 2. Middleware Pattern
```typescript
// lib/auth-helpers.ts
export async function requireAdmin(): Promise<{ user: AuthUser } | NextResponse>
```

**Использование:**
```typescript
const authResult = await requireAdmin()
if (authResult instanceof NextResponse) {
  return authResult // 401 или 403
}
```

#### 3. Singleton Pattern
```typescript
// Prisma Client - один экземпляр на приложение
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}
```

#### 4. Fallback Pattern
```typescript
try {
  return await prisma.mediaItem.findMany(...)
} catch (error) {
  // Fallback на mock данные
  const { mockMovies } = await import("./db-mock")
  return mockMovies
}
```

#### 5. Strategy Pattern
Разные стратегии для разных типов медиа (movie/book/game), но единый интерфейс.

### 5. Аутентификация и авторизация

**Архитектура:**
```
JWT Token (Cookie) → auth-helpers.ts → checkAuth() → getUserById()
```

**Flow:**
1. Клиент отправляет запрос с cookie `auth-token`
2. `checkAuth()` проверяет JWT токен
3. `requireAdmin()` проверяет роль пользователя
4. Доступ к защищенным endpoints

### 6. Обработка ошибок

**Многоуровневая обработка:**
```typescript
try {
  // Основная логика
} catch (error) {
  if (isConnectionError) {
    // Fallback на mock
  } else {
    // Логирование и возврат ошибки
  }
}
```

### 7. Типизация

- TypeScript типы (`lib/types.ts`)
- Prisma типы (автогенерация)
- Строгая типизация на всех слоях

### 8. Преимущества архитектуры

1. ✅ **Разделение ответственности** - каждый слой решает свою задачу
2. ✅ **Тестируемость** - слои изолированы
3. ✅ **Масштабируемость** - легко добавлять новые endpoints
4. ✅ **Отказоустойчивость** - fallback на mock данные
5. ✅ **Типобезопасность** - TypeScript + Prisma
6. ✅ **Гибкость** - можно менять БД без изменения бизнес-логики

### 9. Структура запроса

```
Client Request
    ↓
API Route (app/api/movies/route.ts)
    ↓
Auth Middleware (requireAdmin)
    ↓
Service Layer (lib/db.ts)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
    ↓ (при ошибке)
Mock Data (lib/db-mock.ts)
```

---

## Архитектура фронтенда

### 1. Общая архитектурная модель: Component-Based Architecture + Server/Client Components

Проект использует гибридную архитектуру Next.js App Router с разделением на Server и Client Components:

```
┌─────────────────────────────────────────┐
│   Server Components (Pages)            │  app/*/page.tsx
│   - Data Fetching                       │
│   - SEO                                 │
│   - Initial Render                      │
├─────────────────────────────────────────┤
│   Client Components (Interactivity)     │  components/*.tsx ("use client")
│   - State Management                    │
│   - User Interactions                   │
│   - Browser APIs                        │
├─────────────────────────────────────────┤
│   UI Components (Reusable)             │  components/ui/*
│   - Design System                       │
│   - Styling                             │
└─────────────────────────────────────────┘
```

### 2. Технологический стек

- **Framework**: Next.js 15 с App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI (через shadcn/ui)
- **State Management**: Локальное состояние (useState, useEffect)
- **Data Fetching**: Fetch API + Server Components
- **Routing**: File-based routing (Next.js App Router)
- **Theme**: next-themes (dark/light mode)

### 3. Структура проекта

```
app/                          → Pages (Server Components)
├── page.tsx                  → Главная страница
├── layout.tsx                → Root layout
├── movies/
│   ├── page.tsx              → Список фильмов
│   └── [id]/page.tsx         → Детали фильма
├── books/
│   ├── page.tsx
│   └── [id]/page.tsx
├── games/
│   ├── page.tsx
│   └── [id]/page.tsx
└── admin/
    └── page.tsx              → Админ панель (Client Component)

components/                    → Компоненты
├── ui/                       → Базовые UI компоненты (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── header.tsx                → Header (Client Component)
├── footer.tsx                → Footer
├── media-detail.tsx          → Детали медиа (Client Component)
├── media-carousel.tsx        → Карусель (Client Component)
├── catalog-grid.tsx          → Сетка каталога (Client Component)
├── search-bar.tsx            → Поиск (Client Component)
└── admin-form.tsx            → Форма админа (Client Component)
```

### 4. Архитектурные паттерны

#### 1. Server/Client Components Pattern

**Server Components (по умолчанию):**
```typescript
// app/page.tsx - Server Component
export default async function HomePage() {
  const allMedia = await getMediaData() // Fetch на сервере
  return <MediaCarousel items={allMedia} />
}
```

**Client Components (с "use client"):**
```typescript
// components/media-carousel.tsx
"use client"
export function MediaCarousel({ items }: Props) {
  const [scrollPosition, setScrollPosition] = useState(0)
  // Интерактивность
}
```

#### 2. Component Composition Pattern

Композиция компонентов:
```typescript
<Header />
<Hero />
<SearchBar />
<MediaCarousel title="..." items={...} />
<Footer />
```

#### 3. Presentational/Container Pattern (частично)

**Presentational Components:**
- `MediaCarousel` - только отображение данных
- `CatalogGrid` - только отображение сетки
- `SafeImage` - обертка для изображений

**Container Components:**
- `app/admin/page.tsx` - управление состоянием и логикой
- `app/page.tsx` - получение данных и передача в компоненты

#### 4. Props Drilling Pattern

Данные передаются через props:
```typescript
<MediaDetail item={item} relatedItems={relatedItems} />
```

#### 5. Local State Management Pattern

Локальное состояние через React Hooks:
```typescript
const [isFavorite, setIsFavorite] = useState(false)
const [comments, setComments] = useState([])
const [user, setUser] = useState(null)
```

#### 6. Custom Hooks Pattern (частично)

Использование стандартных хуков:
```typescript
useEffect(() => {
  fetchUser()
  const interval = setInterval(fetchUser, 5000)
  return () => clearInterval(interval)
}, [])
```

#### 7. Client-Side Storage Pattern

localStorage для персистентности:
```typescript
// Комментарии
localStorage.setItem(`comments_${item.id}`, JSON.stringify(comments))

// Избранное
localStorage.setItem("favorites", JSON.stringify(favorites))
```

### 5. Управление состоянием

**Архитектура: Distributed State (распределенное состояние)**

```
┌─────────────────────────────────────┐
│   Server State                     │
│   - API Responses                  │
│   - Server Components Data         │
└─────────────────────────────────────┘
         ↓ (fetch)
┌─────────────────────────────────────┐
│   Component State                   │
│   - useState() в компонентах       │
│   - Локальное состояние             │
└─────────────────────────────────────┘
         ↓ (persist)
┌─────────────────────────────────────┐
│   Browser Storage                   │
│   - localStorage (комментарии)      │
│   - Cookies (auth-token)            │
└─────────────────────────────────────┘
```

**Особенности:**
- ❌ Нет глобального state management (Redux, Zustand)
- ✅ Каждый компонент управляет своим состоянием
- ✅ Данные передаются через props
- ✅ localStorage для персистентности

### 6. Data Fetching Strategy

#### Server-Side Fetching (Server Components)
```typescript
// app/page.tsx
async function getMediaData() {
  const [moviesRes, booksRes, gamesRes] = await Promise.all([
    fetch(`${baseUrl}/api/movies`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/books`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/games`, { cache: "no-store" }),
  ])
  // ...
}
```

#### Client-Side Fetching (Client Components)
```typescript
// components/header.tsx
const fetchUser = async () => {
  const res = await fetch("/api/auth/me")
  const data = await res.json()
  setUser(data.user)
}
```

### 7. Роутинг

**File-Based Routing (Next.js App Router):**
```
app/
├── page.tsx              → /
├── movies/
│   ├── page.tsx          → /movies
│   └── [id]/page.tsx     → /movies/:id
├── books/
│   ├── page.tsx          → /books
│   └── [id]/page.tsx     → /books/:id
└── admin/
    └── page.tsx          → /admin
```

### 8. UI Component Architecture

**Design System: shadcn/ui (Radix UI + Tailwind)**

Структура:
```
components/ui/              → Базовые компоненты
├── button.tsx              → Переиспользуемые UI элементы
├── card.tsx
├── dialog.tsx
└── ...

components/                 → Композитные компоненты
├── media-carousel.tsx      → Использует ui/card, ui/button
├── catalog-grid.tsx        → Использует ui/card, ui/select
└── ...
```

### 9. Стилизация

**Tailwind CSS + CSS Variables:**
```typescript
// Использование Tailwind классов
className="container mx-auto px-4 py-12"

// Кастомные классы
className="neon-glow hover:scale-105"
```

**Theme System:**
```typescript
// next-themes для dark/light mode
<ThemeProvider attribute="class" defaultTheme="dark">
```

### 10. Особенности архитектуры

#### Преимущества:
1. ✅ **Производительность** - Server Components уменьшают JS bundle
2. ✅ **SEO** - Server-side rendering
3. ✅ **Простота** - нет сложного state management
4. ✅ **Масштабируемость** - компонентная структура
5. ✅ **Типобезопасность** - TypeScript

#### Особенности:
1. ✅ **Гибридный подход** - Server + Client Components
2. ✅ **Минималистичное состояние** - только локальное
3. ✅ **Композиция компонентов** - переиспользование
4. ✅ **Изоляция UI** - отдельная папка `ui/`

### 11. Паттерны взаимодействия

```
User Action
    ↓
Client Component (Event Handler)
    ↓
API Call (fetch)
    ↓
State Update (useState)
    ↓
Re-render
    ↓
UI Update
```

**Пример:**
```typescript
const handleAddComment = async () => {
  // 1. API call
  await fetch("/api/comments", { method: "POST", ... })
  
  // 2. Local state update
  setComments([...comments, newComment])
  
  // 3. localStorage persistence
  localStorage.setItem(`comments_${item.id}`, JSON.stringify(comments))
}
```

---

## Связь между бэкендом и фронтендом

### Data Flow

```
Frontend (Server Component)
    ↓ fetch()
API Route (app/api/movies/route.ts)
    ↓
Service Layer (lib/db.ts)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
    ↓ (fallback)
Mock Data (lib/db-mock.ts)
    ↓
Response (JSON)
    ↓
Frontend (Component)
```

### Типизация

**Общие типы:**
```typescript
// lib/types.ts
export interface MediaItem {
  id: string
  title: string
  description: string
  coverImage: string
  type: MediaType
  rating: number
  year: number
  genre: string[]
  popularity: number
  watchUrl?: string
}
```

**Использование:**
- Бэкенд: `lib/db.ts` возвращает `MediaItem[]`
- Фронтенд: компоненты принимают `MediaItem`
- API: возвращает JSON с типом `MediaItem[]`

---

## Итоговая архитектура

### Бэкенд использует:
- ✅ **Layered Architecture** (многослойная)
- ✅ **Repository Pattern**
- ✅ **Middleware Pattern**
- ✅ **Fallback Pattern**
- ✅ **Singleton Pattern**

### Фронтенд использует:
- ✅ **Component-Based Architecture**
- ✅ **Server/Client Components Pattern**
- ✅ **Composition Pattern**
- ✅ **Local State Management**
- ✅ **Props Drilling**
- ✅ **File-Based Routing**
- ✅ **Design System** (shadcn/ui)

### Общие принципы:
- ✅ **Типобезопасность** - TypeScript на всех уровнях
- ✅ **Разделение ответственности** - четкие границы
- ✅ **Отказоустойчивость** - fallback механизмы
- ✅ **Масштабируемость** - легко расширять
- ✅ **Производительность** - оптимизация на всех уровнях

---

## Заключение

Архитектура проекта обеспечивает:
- 🎯 **Чистый код** - понятная структура
- 🧪 **Легкое тестирование** - изолированные слои
- 🚀 **Отказоустойчивость** - fallback механизмы
- 🔒 **Типобезопасность** - TypeScript + Prisma
- 📈 **Масштабируемость** - легко добавлять функционал

Это современный подход для Next.js приложений с акцентом на надежность, производительность и поддерживаемость кода.

