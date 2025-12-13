# API Endpoints Documentation

## Барлық API Endpoint-тер тізімі

### 1. Media Endpoints (Материалдар)

#### `/api/movies` - Фильмдер
- **GET** - Барлық фильмдерді алу
- **POST** - Жаңа фильм қосу (тек админ)
- **PUT** - Фильмді өзгерту (тек админ)
- **DELETE** - Фильмді жою (тек админ)

#### `/api/books` - Кітаптар
- **GET** - Барлық кітаптарды алу
- **POST** - Жаңа кітап қосу (тек админ)
- **PUT** - Кітапты өзгерту (тек админ)
- **DELETE** - Кітапты жою (тек админ)

#### `/api/games` - Ойындар
- **GET** - Барлық ойындарды алу
- **POST** - Жаңа ойын қосу (тек админ)
- **PUT** - Ойынды өзгерту (тек админ)
- **DELETE** - Ойынды жою (тек админ)

### 2. Search Endpoint (Іздеу)

#### `/api/search`
- **GET** - Материалдарды іздеу
  - Query параметрі: `?q=search_term`

### 3. Comments Endpoint (Пікірлер)

#### `/api/comments`
- **GET** - Пікірлерді алу
  - Query параметрі: `?mediaId=item_id`
- **POST** - Жаңа пікір қосу
  - Body: `{ mediaId, content, userId, userName, userAvatar, rating }`

### 4. Admin Endpoints (Әкімші)

#### `/api/import-mock-data`
- **POST** - Mock мәліметтерді базаға импорттау (тек админ)

#### `/api/reorganize-media`
- **POST** - Материалдарды қалпына келтіру (тек админ)

#### `/api/cleanup-duplicates`
- **POST** - Дубликаттарды жою (тек админ)

### 5. User Management Endpoints (Пайдаланушыларды басқару)

#### `/api/users`
- **GET** - Барлық пайдаланушыларды алу (тек админ)

#### `/api/users/change-password`
- **POST** - Пайдаланушы паролін өзгерту (тек админ)
  - Body: `{ email, newPassword }`

#### `/api/users/make-admin`
- **POST** - Пайдаланушыны админ қылу (тек админ)
  - Body: `{ email }`

### 6. Authentication Endpoints (Аутентификация)

#### `/api/auth/login`
- **POST** - Кіру
  - Body: `{ email, password }`

#### `/api/auth/register`
- **POST** - Тіркелу
  - Body: `{ email, password, name? }`

#### `/api/auth/logout`
- **POST** - Шығу

#### `/api/auth/me`
- **GET** - Ағымдағы пайдаланушыны алу

---

## Барлығы: 15 API Endpoint

### Media: 3 endpoint × 4 метод = 12 endpoint
### Search: 1 endpoint
### Comments: 1 endpoint
### Admin: 3 endpoint
### User Management: 3 endpoint
### Authentication: 4 endpoint

**Жалпы: 24 API endpoint (әр endpoint әртүрлі HTTP методтарды қолданады)**


















