# Бэкенд пен фронтенд байланысын тексеру

## Қазіргі жағдай

### ✅ Байланысқан!

**Фронтенд:**
- `app/page.tsx` - API-ға fetch арқылы сұрау жасайды
- `app/movies/page.tsx`, `app/books/page.tsx`, `app/games/page.tsx` - API-дан мәліметтерді алады
- `components/auth-dialog.tsx` - Аутентификация API-сын пайдаланады
- `components/search-bar.tsx` - Іздеу API-сын пайдаланады
- `app/admin/page.tsx` - CRUD операцияларын API арқылы орындайды

**Бэкенд:**
- `app/api/movies/route.ts` - Фильмдер API
- `app/api/books/route.ts` - Кітаптар API
- `app/api/games/route.ts` - Ойындар API
- `app/api/search/route.ts` - Іздеу API
- `app/api/auth/*/route.ts` - Аутентификация API

**Мәліметтер:**
- Қазір **мок мәліметтер** пайдаланылады (`lib/db-mock.ts`, `lib/auth-mock.ts`)
- Мәліметтер файлда сақталады (`.mock-users.json`)
- Сервер қайта іске қосылғанда да сақталады

## Байланысты тексеру жолдары

### 1. Браузерде тексеру

#### Network Tab арқылы:

1. Браузерде **F12** басыңыз
2. **Network** (Желі) табын ашыңыз
3. Бетті жаңартыңыз (F5)
4. API сұрауларын көре аласыз:
   - `api/movies` - Фильмдер
   - `api/books` - Кітаптар
   - `api/games` - Ойындар
   - `api/auth/me` - Пайдаланушы

**Мысал:**
```
GET /api/movies → 200 OK
GET /api/books → 200 OK
GET /api/games → 200 OK
```

#### Console арқылы:

1. **Console** табын ашыңыз
2. Мына команданы орындаңыз:

```javascript
// API-ға сұрау жасау
fetch('/api/movies')
  .then(res => res.json())
  .then(data => console.log('Фильмдер:', data))
```

### 2. Терминалда тексеру

#### Сервер логтарын көру:

Сервер іске қосылғанда терминалда мынаны көре аласыз:

```
GET /api/movies 200 in 45ms
GET /api/books 200 in 32ms
GET /api/games 200 in 28ms
```

### 3. Браузерде тікелей тексеру

#### API эндпоинттерін ашу:

Браузерде мына адрестерді ашыңыз:

```
http://localhost:3000/api/movies
http://localhost:3000/api/books
http://localhost:3000/api/games
http://localhost:3000/api/search?q=inception
```

**Нәтиже:** JSON мәліметтер көрінуі керек

### 4. Код арқылы тексеру

#### Фронтенд компоненттерінде:

```typescript
// app/page.tsx
async function getMediaData() {
  const res = await fetch('/api/movies')  // ← API-ға сұрау
  const movies = await res.json()         // ← Жауап алу
  return movies
}
```

#### Бэкенд API маршруттарында:

```typescript
// app/api/movies/route.ts
export async function GET() {
  const movies = await getMediaItems("movie")  // ← Мәліметтерді алу
  return NextResponse.json(movies)             // ← JSON қайтару
}
```

## Байланыс қалай жұмыс істейді

### 1. Пайдаланушы бетті ашады
```
Браузер → http://localhost:3000
```

### 2. Фронтенд API-ға сұрау жасайды
```javascript
fetch('/api/movies')
```

### 3. Next.js API маршруты сұрауды қабылдайды
```
app/api/movies/route.ts → GET функциясы
```

### 4. API мәліметтерді алады
```typescript
const movies = await getMediaItems("movie")
```

### 5. JSON жауап қайтарады
```typescript
return NextResponse.json(movies)
```

### 6. Фронтенд мәліметтерді көрсетеді
```typescript
const movies = await res.json()
// UI-да көрсету
```

## Тексеру мысалдары

### Мысал 1: Фильмдерді алу

**Браузерде:**
```
http://localhost:3000/api/movies
```

**Нәтиже:**
```json
[
  {
    "id": "1",
    "title": "Inception",
    "type": "movie",
    "rating": 8.8,
    ...
  }
]
```

### Мысал 2: Іздеу

**Браузерде:**
```
http://localhost:3000/api/search?q=inception
```

**Нәтиже:**
```json
[
  {
    "id": "1",
    "title": "Inception",
    ...
  }
]
```

### Мысал 3: Тіркелу

**Браузер консольінде:**
```javascript
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123',
    name: 'Тест'
  })
})
.then(res => res.json())
.then(data => console.log(data))
```

## Байланыс жұмыс істемейтін жағдайлар

### 1. Сервер іске қосылмаған
**Белгі:** `Failed to fetch` қатесі
**Шешу:** `npm run dev` орындаңыз

### 2. API маршруты жоқ
**Белгі:** `404 Not Found` қатесі
**Шешу:** `app/api/movies/route.ts` файлы бар екенін тексеріңіз

### 3. Мәліметтер функциясы қате
**Белгі:** `500 Internal Server Error` қатесі
**Шешу:** Терминалда қатені көру және түзету

## Қорытынды

✅ **Байланысқан!**

- Фронтенд API-ға сұрау жасайды
- Бэкенд API жауап қайтарады
- Мәліметтер JSON форматында алмасады
- Барлық CRUD операциялары жұмыс істейді

**Қазір мок мәліметтер пайдаланылады**, бірақ байланыс толық жұмыс істейді. Келешекте PostgreSQL базасын қосқанда, тек `lib/db-mock` орнына `lib/db` қойып, байланыс бұзылмайды.























