# PostgreSQL базасын орнату және пайдалану

## 1. PostgreSQL орнату

### Windows:
1. PostgreSQL-ді жүктеп алыңыз: https://www.postgresql.org/download/windows/
2. Орнатыңыз және парольді есте сақтаңыз

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

### Linux:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## 2. Базаны құру

PostgreSQL-ге кіріңіз:
```bash
psql -U postgres
```

Базаны құрыңыз:
```sql
CREATE DATABASE mediacatalog;
\q
```

## 3. База схемасын орнату

### Нұсқа 1: SQL скриптімен (тез)
```bash
psql -U postgres -d mediacatalog -f database/schema.sql
```

### Нұсқа 2: Prisma-мен (ұсынылады)
```bash
# 1. Тәуелділіктерді орнату
npm install

# 2. .env файлын құру
cp .env.example .env
# .env файлында DATABASE_URL-ді өзгертіңіз

# 3. Prisma клиентін генерациялау
npm run db:generate

# 4. Базаны құру (миграция)
npm run db:push
```

## 4. Базаны басқару

### Prisma Studio (графикалық интерфейс):
```bash
npm run db:studio
```
Браузерде `http://localhost:5555` ашылады

### Миграциялар:
```bash
# Жаңа миграция құру
npm run db:migrate

# Базаны жаңарту
npm run db:push
```

## 5. Базаны тексеру

```bash
psql -U postgres -d mediacatalog
```

SQL сұраулар:
```sql
-- Барлық медиа элементтерін көру
SELECT * FROM media_items;

-- Жанрларды көру
SELECT * FROM genres;

-- Медиа элементтерін жанрларымен көру
SELECT m.*, array_agg(g.name) as genres
FROM media_items m
LEFT JOIN media_genres mg ON m.id = mg.media_id
LEFT JOIN genres g ON mg.genre_id = g.id
GROUP BY m.id;
```

## 6. .env файлын құру

`.env` файлын түбірде құрыңыз:
```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/mediacatalog"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**Ескерту:** `your_password` орнына өз пароліңізді қойыңыз!

## 7. Серверді іске қосу

```bash
npm run dev
```

Сайт енді PostgreSQL базасын пайдаланады!

## Кестелер

1. **genres** - Жанрлар тізімі
2. **media_items** - Медиа элементтері (фильмдер, кітаптар, ойындар)
3. **media_genres** - Медиа мен жанрлардың байланысы (many-to-many)
4. **comments** - Пікірлер

## Көмек керек пе?

Егер қателер болса:
- PostgreSQL сервері іске қосылғанын тексеріңіз
- DATABASE_URL дұрыс екенін тексеріңіз
- База құрылғанын тексеріңіз























