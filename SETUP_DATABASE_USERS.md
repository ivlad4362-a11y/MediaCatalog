# База данныхқа тіркелген пайдаланушыларды сақтау

## ✅ Орындалған өзгерістер:

1. **API маршруттары базаға қосылды:**
   - `app/api/auth/register/route.ts` → `lib/auth` пайдаланады
   - `app/api/auth/login/route.ts` → `lib/auth` пайдаланады
   - `app/api/auth/me/route.ts` → `lib/auth` пайдаланады

2. **База данных кестесі:**
   - `users` кестесі Prisma схемасында бар
   - `database/auth_schema.sql` файлында SQL схемасы бар

## 📋 Базаға кестені құру:

### 1. PostgreSQL базасына қосылыңыз

VS Code-та SQLTools плагині арқылы немесе терминал арқылы:

```bash
psql -U postgres -d MediaCatalog
```

### 2. Кестені құру

`database/auth_schema.sql` файлын орындаңыз:

```sql
-- VS Code-та SQLTools плагині арқылы:
-- 1. database/auth_schema.sql файлын ашыңыз
-- 2. Барлық кодты таңдап, орындаңыз (F5 немесе Run Query)
```

Немесе терминал арқылы:

```bash
psql -U postgres -d MediaCatalog -f database/auth_schema.sql
```

### 3. Prisma Client-ті жаңарту

```bash
npm run db:generate
```

Немесе:

```bash
npx prisma generate
```

### 4. Базаны тексеру

```sql
-- Пайдаланушыларды көру
SELECT * FROM users;

-- Пайдаланушылар саны
SELECT COUNT(*) FROM users;
```

## 🔧 Баптаулар:

### `.env.local` файлында:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/MediaCatalog?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 📝 Пайдаланушылар кестесі құрылымы:

```sql
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    role VARCHAR(20) DEFAULT 'user',
    email_verified TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Тестілеу:

### 1. Тіркелу (PowerShell):

```powershell
$body = @{
    email = "test@example.com"
    password = "test123"
    name = "Тест Пайдаланушы"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content
```

### 2. Кіру:

```powershell
$body = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content
```

### 3. Базада тексеру:

```sql
SELECT id, email, name, role, created_at FROM users;
```

## ⚠️ Ескертулер:

1. **Пароль хештелуі:** Парольдер `bcrypt` арқылы хештеледі
2. **JWT токен:** Кіру кезінде JWT токен cookie-ге сақталады
3. **Роль:** Әдепкі рөл - `user`, `admin` рөлін қолмен қосу керек
4. **Email бірегей:** Бір email бойынша бір ғана пайдаланушы тіркелуге болады

## 🔄 Мок мәліметтерден базаға ауысу:

Қазір барлық API маршруттары `lib/auth` пайдаланады (мок мәліметтер емес).

Егер базаға қосылу қатесі болса, `.env.local` файлындағы `DATABASE_URL` дұрыс екенін тексеріңіз.





















