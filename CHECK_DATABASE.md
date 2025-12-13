# Базаға байланыс қатесін тексеру және шешу

## 🔍 Мәселе

```
Authentication failed against database server at `localhost`, 
the provided database credentials for `(not available)` are not valid.
```

## ✅ Шешім қадамдары

### 1️⃣ .env.local файлын тексеру

`.env.local` файлын ашып, `DATABASE_URL` бар екенін тексеріңіз.

**Файл жолы:** `C:\Android\MediaCatalog\.env.local`

**Мына форматта болуы керек:**

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
```

**Мысал:**
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/mediacatalog?schema=public"
```

### 2️⃣ PostgreSQL сервері іске қосылғанын тексеру

PowerShell-де:

```powershell
# PostgreSQL сервисін тексеру
Get-Service -Name postgresql*

# Егер сервис жұмыс істемесе, іске қосу
Start-Service postgresql-x64-16
```

**Егер PostgreSQL орнатылмаған болса:**

1. PostgreSQL жүктеп алыңыз: https://www.postgresql.org/download/windows/
2. Орнатыңыз
3. Орнату кезінде парольді есте сақтаңыз
4. `.env.local` файлында `DATABASE_URL`-ді дұрыс енгізіңіз

### 3️⃣ Базаға тікелей байланысты тексеру

PowerShell-де:

```powershell
# PostgreSQL-ге тікелей байланысу (егер орнатылған болса)
psql -U postgres -h localhost
```

Егер қосыла алса, база жұмыс істеп тұр.

### 4️⃣ Prisma Studio арқылы тексеру

```powershell
npm run db:studio
```

Браузерде `http://localhost:5555` адресін ашып, базаға байланыс бар ма тексеріңіз.

---

## 🔧 Толық тексеру тізбегі

### 1. .env.local файлын тексеру

```powershell
# Файлды ашу
notepad .env.local
```

**Міндетті айнымалылар:**
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/mediacatalog?schema=public"
```

### 2. PostgreSQL серверінің жұмыс істеп тұрғанын тексеру

```powershell
# Сервисті тексеру
Get-Service -Name postgresql*

# Егер жұмыс істемесе, іске қосу
Start-Service postgresql-x64-16
```

### 3. Базаны құру

```powershell
# Базаны құру
npm run db:push

# Немесе миграцияларды орындау
npm run db:migrate
```

### 4. Админ рөлін қосу

База жұмыс істеп тұрғаннан кейін:

```powershell
npm run make-admin admin@example0.com
```

---

## 📋 Мысал .env.local файлы

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/mediacatalog?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"

# Firebase Configuration (опционал)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

---

## ⚠️ Ескертулер

1. **PostgreSQL орнатылған болуы керек** - Егер жоқ болса, орнатыңыз
2. **DATABASE_URL дұрыс болуы керек** - `.env.local` файлында
3. **PostgreSQL сервері іске қосылған болуы керек** - Windows Services арқылы
4. **База құрылған болуы керек** - `npm run db:push` арқылы

---

## ❓ Көмек

### PostgreSQL орнатылмаған

1. PostgreSQL жүктеп алыңыз: https://www.postgresql.org/download/windows/
2. Орнатыңыз (мысалы: PostgreSQL 16)
3. Орнату кезінде парольді есте сақтаңыз
4. `.env.local` файлында `DATABASE_URL`-ді дұрыс енгізіңіз:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mediacatalog?schema=public"
   ```

### База құрылмаған

```powershell
# Базаны құру
npm run db:push
```

### Сервер іске қосылмаған

Windows Services (services.msc) арқылы PostgreSQL сервисін іске қосыңыз.

---

## 🎯 Ең маңыздысы

1. ✅ **PostgreSQL орнатылған болуы керек**
2. ✅ **.env.local файлында DATABASE_URL дұрыс болуы керек**
3. ✅ **PostgreSQL сервері іске қосылған болуы керек**
4. ✅ **База құрылған болуы керек**

Осы қадамдарды орындағаннан кейін `npm run make-admin admin@example0.com` командасы жұмыс істейді!





