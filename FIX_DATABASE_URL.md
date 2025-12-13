# DATABASE_URL қатесін шешу

## 🔍 Мәселе

```
Authentication failed against database server at `localhost`, 
the provided database credentials for `(not available)` are not valid.
```

## ✅ Шешім

### 1️⃣ .env.local файлын ашып, DATABASE_URL тексеру

`.env.local` файлын ашыңыз (проект түбінде):

```powershell
notepad .env.local
```

### 2️⃣ DATABASE_URL дұрыс форматта болуы керек

**Дұрыс формат:**

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"
```

**Мысал:**

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/mediacatalog?schema=public"
```

**Мұнда:**
- `postgres` - PostgreSQL пайдаланушы аты (әдетте `postgres`)
- `mypassword` - PostgreSQL паролі (орнату кезінде қойған пароль)
- `localhost` - Хост (әдетте `localhost`)
- `5432` - Порт (әдетте `5432`)
- `mediacatalog` - База аты

### 3️⃣ PostgreSQL сервері іске қосылғанын тексеру

**Windows Services арқылы:**

1. `Win + R` басыңыз
2. `services.msc` енгізіп, Enter басыңыз
3. `postgresql` деп іздеңіз
4. Сервисті табып, оң батырмамен басып "Start" таңдаңыз

**PowerShell арқылы:**

```powershell
# PostgreSQL сервисін табу
Get-Service -Name *postgresql*

# Сервисті іске қосу (сервис атауын өзгертіңіз)
Start-Service postgresql-x64-16
```

### 4️⃣ Базаны құру

`.env.local` файлында `DATABASE_URL` дұрыс екенін тексергеннен кейін:

```powershell
npm run db:push
```

---

## 📋 Толық мысал .env.local файлы

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mediacatalog?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production-min-32-chars"

# Firebase Configuration (опционал)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

**Ескерту:** `YOUR_PASSWORD` орнына PostgreSQL орнату кезінде қойған парольді енгізіңіз!

---

## 🔧 PostgreSQL орнатылмаған болса

### PostgreSQL орнату:

1. **PostgreSQL жүктеп алыңыз:**
   - https://www.postgresql.org/download/windows/
   - Немесе: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

2. **Орнатыңыз:**
   - Setup wizard-ты іске қосыңыз
   - Портты `5432` деп қалдырыңыз (дефолт)
   - **Парольді есте сақтаңыз!** (мысалы: `postgres123`)
   - База атын `mediacatalog` деп қалдырыңыз

3. **.env.local файлында DATABASE_URL-ді дұрыс енгізіңіз:**

```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/mediacatalog?schema=public"
```

---

## ⚠️ Ескертулер

1. **Пароль дұрыс болуы керек** - PostgreSQL орнату кезінде қойған парольді пайдаланыңыз
2. **Порт дұрыс болуы керек** - Әдетте `5432`
3. **База аты дұрыс болуы керек** - `mediacatalog`
4. **PostgreSQL сервері іске қосылған болуы керек**

---

## 🎯 Тест

`.env.local` файлын дұрыс енгізгеннен кейін:

```powershell
# Базаға байланысты тексеру
npm run db:push

# Егер сәтті болса, админ рөлін қосу
npm run make-admin admin@example0.com
```

---

## ❓ Көмек

### Парольді ұмытып қалдыңыз

1. PostgreSQL сервисін тоқтатыңыз
2. `pg_hba.conf` файлын ашыңыз (PostgreSQL орнату папкасында)
3. Аутентификацияны `trust` деп өзгертіңіз
4. Сервисті қайта іске қосыңыз
5. Парольді өзгертіңіз

Немесе PostgreSQL-ді қайта орнатыңыз.

### Порт бос емес

Егер порт `5432` бос емес болса, `.env.local` файлында басқа портты пайдаланыңыз:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/mediacatalog?schema=public"
```





