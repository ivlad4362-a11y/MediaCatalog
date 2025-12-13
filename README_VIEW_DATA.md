# Кестелердегі мәліметтерді көру

## 1. PostgreSQL терминалы арқылы

### Базаға кіру:
```bash
psql -U postgres -d mediacatalog
```

### Негізгі SQL сұраулар:

#### Барлық кестелерді көру:
```sql
\dt
```

#### Жанрларды көру:
```sql
SELECT * FROM genres;
```

#### Медиа элементтерін көру:
```sql
SELECT * FROM media_items;
```

#### Пікірлерді көру:
```sql
SELECT * FROM comments;
```

#### Медиа элементтерін жанрларымен көру:
```sql
SELECT 
    m.title,
    m.type,
    array_agg(g.name) as genres
FROM media_items m
LEFT JOIN media_genres mg ON m.id = mg.media_id
LEFT JOIN genres g ON mg.genre_id = g.id
GROUP BY m.id, m.title, m.type;
```

### SQL файлын орындау:
```bash
psql -U postgres -d mediacatalog -f database/view_data.sql
```

## 2. Prisma Studio арқылы (графикалық интерфейс)

### Prisma Studio-ды іске қосу:
```bash
npm run db:studio
```

### Браузерде ашу:
1. Терминалда `http://localhost:5555` адресін көресіз
2. Браузерде ашыңыз
3. Барлық кестелерді көре аласыз
4. Мәліметтерді өзгертуге, қосуға, жоюға болады

## 3. Код арқылы (Node.js/Next.js)

### Мәліметтерді алу мысалы:
```typescript
import { prisma } from "@/lib/db"

// Барлық фильмдерді алу
const movies = await prisma.mediaItem.findMany({
  where: { type: "movie" },
  include: {
    genres: {
      include: {
        genre: true,
      },
    },
  },
})

// Барлық жанрларды алу
const genres = await prisma.genre.findMany()

// Пікірлерді алу
const comments = await prisma.comment.findMany({
  include: {
    media: true,
  },
})
```

## 4. API арқылы

### Браузерде немесе Postman-де:

#### Барлық фильмдерді алу:
```
GET http://localhost:3000/api/movies
```

#### Барлық кітаптарды алу:
```
GET http://localhost:3000/api/books
```

#### Барлық ойындарды алу:
```
GET http://localhost:3000/api/games
```

#### Іздеу:
```
GET http://localhost:3000/api/search?q=inception
```

## 5. pgAdmin арқылы (графикалық интерфейс)

1. pgAdmin-ды ашыңыз
2. PostgreSQL серверіне қосылыңыз
3. `mediacatalog` базасын таңдаңыз
4. Schemas → public → Tables
5. Кестелерді оң жақ батырмамен басып "View/Edit Data" → "All Rows" таңдаңыз

## Пайдалы SQL командалар

```sql
-- Кестелер тізімін көру
\dt

-- Кесте структурасын көру
\d media_items

-- Мәліметтер санын көру
SELECT COUNT(*) FROM media_items;

-- Тек бірнеше бағанды көру
SELECT id, title, rating FROM media_items;

-- Шарт бойынша іздеу
SELECT * FROM media_items WHERE rating > 9.0;

-- Сұрыптау
SELECT * FROM media_items ORDER BY rating DESC;

-- Шығу
\q
```

## Кеңейтілген сұраулар

`database/view_data.sql` файлында көптеген пайдалы сұраулар бар:
- Статистика
- Жанрлар бойынша топтау
- Пікірлер саны
- Орташа рейтинг
- Ең танымал медиа элементтер

Оны орындау үшін:
```bash
psql -U postgres -d mediacatalog -f database/view_data.sql
```























