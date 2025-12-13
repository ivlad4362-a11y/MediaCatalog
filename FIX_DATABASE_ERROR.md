# Базаға байланыс қатесін шешу

## 🔍 Мәселе

```
Authentication failed against database server at `localhost`, 
the provided database credentials for `(not available)` are not valid.
```

## ✅ Шешім

### 1️⃣ .env.local файлын тексеру

`.env.local` файлында `DATABASE_URL` болуы керек.

**Файлды ашыңыз:** `.env.local` (проект түбінде)

**Мына мәліметтерді қосыңыз:**

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
```

### 2️⃣ PostgreSQL сервері іске қосылғанын тексеру

PostgreSQL сервері іске қосылған болуы керек.

**Windows-та тексеру:**
```powershell
# PostgreSQL сервисі жұмыс істеп тұрғанын тексеру
Get-Service -Name postgresql*
```

**Егер PostgreSQL орнатылмаған болса:**
- PostgreSQL орнатыңыз: https://www.postgresql.org/download/windows/
- Немесе басқа база қолданыңыз (SQLite, MySQL, т.б.)

### 3️⃣ DATABASE_URL дұрыс екенін тексеру

`.env.local` файлында мына форматта болуы керек:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

**Мысал:**
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/mediacatalog?schema=public"
```

### 4️⃣ Базаны құру

Егер база әлі құрылмаған болса:

```powershell
# Prisma арқылы базаны құру
npm run db:push
```

Немесе:

```powershell
# Миграцияларды орындау
npm run db:migrate
```

---

## 🔧 Толық тексеру тізбегі

### 1. .env.local файлын жасау/тексеру

Проект түбінде `.env.local` файлын ашыңыз (немесе жасаңыз):

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/mediacatalog?schema=public"
```

**Ескерту:** 
- `postgres` - PostgreSQL пайдаланушы аты
- `yourpassword` - PostgreSQL паролі
- `mediacatalog` - База аты

### 2. PostgreSQL серверінің жұмыс істеп тұрғанын тексеру

```powershell
# PostgreSQL сервисі
Get-Service -Name postgresql*
```

Егер сервис жұмыс істемесе, іске қосыңыз.

### 3. Базаға байланысты тексеру

```powershell
# Prisma Studio арқылы
npm run db:studio
```

Браузерде `http://localhost:5555` адресін ашып, базаға байланыс бар ма тексеріңіз.

### 4. Админ рөлін қосу

База жұмыс істеп тұрғаннан кейін:

```powershell
npm run make-admin admin@example0.com
```

---

## 📋 Мысал .env.local файлы

```env
# Database
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/mediacatalog?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Firebase (опционал)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
```

---

## ⚠️ Ескертулер

1. **PostgreSQL орнатылған болуы керек** - Егер жоқ болса, орнатыңыз
2. **DATABASE_URL дұрыс болуы керек** - `.env.local` файлында
3. **База құрылған болуы керек** - `npm run db:push` арқылы
4. **PostgreSQL сервері іске қосылған болуы керек**

---

## ❓ Көмек

### PostgreSQL орнатылмаған

1. PostgreSQL жүктеп алыңыз: https://www.postgresql.org/download/windows/
2. Орнатыңыз
3. Парольді есте сақтаңыз
4. `.env.local` файлында `DATABASE_URL`-ді дұрыс енгізіңіз

### База құрылмаған

```powershell
# Базаны құру
npm run db:push
```

### Сервер іске қосылмаған

Windows Services арқылы PostgreSQL сервисін іске қосыңыз.





