# Docker және База Деректері Түзетулері

## ✅ Орындалған түзетулер

### 1. **База деректері схемасын дұрыстау** ✅

#### Проблема:
- `database/schema.sql` файлында `watch_url` бағанасы жоқ (Prisma schema-да бар)
- `database/schema.sql` файлында `favorites` кестесі жоқ (Prisma schema-да бар)
- `database/auth_schema.sql` файлы Docker-да инициализациялауға қосылмаған

#### Шешу:
- ✅ `watch_url` бағанасы `media_items` кестесіне қосылды
- ✅ `favorites` кестесі қосылды (Prisma schema-мен сәйкес)
- ✅ `favorites` кестесі үшін индекстер қосылды
- ✅ `auth_schema.sql` файлы Docker инициализациясына қосылды

**Өзгерістер:**
```sql
-- database/schema.sql файлына қосылды:
-- 1. watch_url бағанасы
watch_url VARCHAR(500),

-- 2. favorites кестесі
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    media_id VARCHAR(50) NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, media_id)
);

-- 3. Индекстер
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_media_id ON favorites(media_id);
```

**docker-compose.yml өзгерісі:**
```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
  - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql:ro
  - ./database/auth_schema.sql:/docker-entrypoint-initdb.d/02-auth-schema.sql:ro  # ✅ Қосылды
```

---

### 2. **Docker конфигурациясы** ✅

#### Тексеру:
- ✅ DATABASE_URL дұрыс бапталған
- ✅ Backend контейнерінде Prisma миграциялары дұрыс орындалады
- ✅ Контейнерлер арасындағы байланыс дұрыс (желі арқылы)

**DATABASE_URL формат:**
```
postgresql://mediacatalog:mediacatalog123@postgres:5432/mediacatalog?schema=public
```

**Backend командасы:**
```bash
cd /app && npx prisma generate && npx prisma migrate deploy && node server.js
```

---

### 3. **База деректері инициализациясы** ✅

#### Тексеру:
- ✅ SQL схемалар дұрыс ретте орындалады:
  1. `01-schema.sql` - негізгі медиа схемасы
  2. `02-auth-schema.sql` - аутентификация схемасы
- ✅ Prisma миграциялары орындалады (`prisma migrate deploy`)
- ✅ Prisma клиенті generate болады (`prisma generate`)

---

## 📋 База деректері схемасы сәйкестігі

### Prisma Schema ↔ SQL Schema

| Prisma Model | SQL Table | Статус |
|-------------|-----------|--------|
| `Genre` | `genres` | ✅ Сәйкес |
| `MediaItem` | `media_items` | ✅ Сәйкес (watch_url қосылды) |
| `MediaGenre` | `media_genres` | ✅ Сәйкес |
| `Comment` | `comments` | ✅ Сәйкес |
| `Favorite` | `favorites` | ✅ Сәйкес (қосылды) |
| `User` | `users` | ✅ Сәйкес (auth_schema.sql) |
| `Account` | `accounts` | ✅ Сәйкес (auth_schema.sql) |
| `Session` | `sessions` | ✅ Сәйкес (auth_schema.sql) |
| `VerificationToken` | `verification_tokens` | ✅ Сәйкес (auth_schema.sql) |

---

## 🔧 Docker-да база деректерін қолдану

### 1. База деректерін құру (бірінші рет)
```bash
# Контейнерлерді іске қосу
docker-compose up -d postgres

# База деректерінің дайын болғанын күту (10-15 секунд)
sleep 15

# Backend контейнерін іске қосу (Prisma миграцияларын орындайды)
docker-compose up -d backend
```

### 2. База деректерін тексеру
```bash
# PostgreSQL контейнеріне қосылу
docker-compose exec postgres psql -U mediacatalog -d mediacatalog

# Кестелерді көру
\dt

# Бір кестені көру
SELECT * FROM media_items LIMIT 5;
SELECT * FROM favorites LIMIT 5;
SELECT * FROM users LIMIT 5;

# Шығу
\q
```

### 3. База деректерін қайта құру
```bash
# Контейнерлерді тоқтату
docker-compose down

# База деректері томын жою (МАҢЫЗДЫ: барлық деректер жоғалады!)
docker volume rm mediacatalog_postgres_data

# Қайта құру
docker-compose up -d postgres
sleep 15
docker-compose up -d backend
```

---

## 🐛 Мәселелерді диагностикалау

### Егер база деректерімен байланыс қатесі болса:

1. **PostgreSQL контейнерінің жұмыс істеп тұрғанын тексеру:**
   ```bash
   docker-compose ps postgres
   docker-compose logs postgres
   ```

2. **База деректеріне қосылуды тексеру:**
   ```bash
   docker-compose exec postgres psql -U mediacatalog -d mediacatalog -c "SELECT 1;"
   ```

3. **Prisma клиентінің generate болғанын тексеру:**
   ```bash
   docker-compose exec backend ls -la node_modules/.prisma/client
   ```

4. **Миграциялардың орындалғанын тексеру:**
   ```bash
   docker-compose exec backend npx prisma migrate status
   ```

5. **База схемасын тексеру:**
   ```bash
   docker-compose exec backend npx prisma db pull
   ```

---

## ✅ Тексеру тізімі

- [x] `watch_url` бағанасы `media_items` кестесінде бар
- [x] `favorites` кестесі қосылды
- [x] `favorites` кестесі үшін индекстер қосылды
- [x] `auth_schema.sql` Docker инициализациясына қосылды
- [x] DATABASE_URL дұрыс бапталған
- [x] Prisma schema мен SQL schema сәйкес
- [x] Backend контейнерінде Prisma миграциялары дұрыс орындалады

---

## 📝 Түзетілген файлдар

1. ✅ `database/schema.sql` - `watch_url` бағанасы және `favorites` кестесі қосылды
2. ✅ `docker-compose.yml` - `auth_schema.sql` инициализациясына қосылды

---

**Дата:** 2024
**Статус:** Барлық Docker және база деректері мәселелері түзетілді ✅

