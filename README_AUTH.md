# Аутентификация жүйесі

## Орнату

### 1. Тәуелділіктерді орнату

```bash
npm install
```

Қосылған пакеттер:
- `bcryptjs` - парольдерді хештеу
- `jose` - JWT токендерді құру/тексеру
- `zod` - мәліметтерді валидациялау

### 2. Базаны жаңарту

```bash
# Prisma схемасын жаңарту
npm run db:push

# Немесе SQL скриптімен
psql -U postgres -d mediacatalog -f database/auth_schema.sql
```

### 3. .env файлына JWT_SECRET қосу

`.env` файлына мынаны қосыңыз:

```
JWT_SECRET=your-super-secret-key-change-in-production-min-32-characters
```

**Ескерту:** Production-да күшті кілт қолданыңыз!

## Пайдалану

### Кіру/Тіркелу

1. Сайттың жоғарғы оң жағындағы профиль батырмасын басыңыз
2. "Кіру" немесе "Тіркелу" табын таңдаңыз
3. Мәліметтерді енгізіп, батырманы басыңыз

### Тест пайдаланушылары

SQL скриптімен қосылған тест пайдаланушылары:

**Әкімші:**
- Email: `admin@mediacatalog.kz`
- Пароль: `test123` (production-да өзгертіңіз!)

**Пайдаланушы:**
- Email: `user@mediacatalog.kz`
- Пароль: `test123` (production-да өзгертіңіз!)

**Ескерту:** Тест парольдері production-да қауіпсіз емес! Өзгертіңіз!

## API Маршруттары

### POST `/api/auth/register`
Жаңа пайдаланушыны тіркеу

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Пайдаланушы аты"
}
```

**Response:**
```json
{
  "message": "Тіркелу сәтті өтті",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "Пайдаланушы аты"
  }
}
```

### POST `/api/auth/login`
Кіру

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Кіру сәтті өтті",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "Пайдаланушы аты",
    "role": "user"
  }
}
```

### POST `/api/auth/logout`
Шығу

### GET `/api/auth/me`
Ағымдағы пайдаланушыны алу

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "Пайдаланушы аты",
    "role": "user"
  }
}
```

## Кестелер

### `users`
- `id` - Пайдаланушы ID
- `email` - Email (unique)
- `name` - Аты-жөні
- `password_hash` - Хештелінген пароль
- `role` - Рөлі ('user' немесе 'admin')
- `created_at` - Құрылған уақыты

### `sessions`
- NextAuth.js үшін (келешекте пайдалануға болады)

### `accounts`
- NextAuth.js үшін (әлеуметтік желілер үшін)

## Қауіпсіздік

1. **Парольдер** bcrypt арқылы хештеледі
2. **JWT токендер** cookie-де сақталады (httpOnly)
3. **Валидация** zod арқылы орындалады
4. **Production-да** JWT_SECRET-ті күшті кілтпен ауыстырыңыз

## Келешектегі мүмкіндіктер

- Email верификациясы
- Парольді қалпына келтіру
- 2FA (екі факторлы аутентификация)
- әлеуметтік желілер арқылы кіру (Google, GitHub, т.б.)























