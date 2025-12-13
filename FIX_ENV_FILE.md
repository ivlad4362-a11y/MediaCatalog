# .env.local файлын дұрыстау

## 🔍 Мәселе

`.env.local` файлында `DATABASE_URL` дұрыс емес:
- Парольде `@` символы бар (`Jansaya31-@`) - оны URL encode ету керек
- База аты `Mediacatalog` (үлкен әріппен) - `mediacatalog` (кіші әріппен) болуы керек

## ✅ Дұрыс .env.local файлы

```env
# База деректері конфигурациясы

# ЕСКЕРТУ: your_password орнына өз PostgreSQL пароліңізді қойыңыз!
DATABASE_URL="postgresql://postgres:Jansaya31-%40@localhost:5432/mediacatalog?schema=public"

# JWT Secret (кемінде 32 таңба болуы керек)
# ЕСКЕРТУ: Production-да міндетті түрде өзгертіңіз!
JWT_SECRET="your-secret-key-change-in-production-min-32-chars-long-please-change"

# Next.js Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production-min-32-chars-long-please-change"
```

## 🔧 Негізгі өзгерістер

1. **Парольдегі `@` символын `%40` деп өзгертіңіз:**
   - Ескі: `Jansaya31-@`
   - Жаңа: `Jansaya31-%40`

2. **База атын кіші әріппен жазыңыз:**
   - Ескі: `Mediacatalog`
   - Жаңа: `mediacatalog`

## 📋 Толық дұрыс .env.local файлы

`.env.local` файлын ашып, мына мазмұнды қойыңыз:

```env
# База деректері конфигурациясы
DATABASE_URL="postgresql://postgres:Jansaya31-%40@localhost:5432/mediacatalog?schema=public"

# JWT Secret
JWT_SECRET="your-secret-key-change-in-production-min-32-chars-long-please-change"

# Next.js Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production-min-32-chars-long-please-change"

# Firebase Configuration (опционал)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

## ⚠️ Ескертулер

1. **`@` символын `%40` деп encode ету керек** - URL-де `@` символы арнайы мағынаға ие
2. **База аты кіші әріппен болуы керек** - `mediacatalog`
3. **Файлды сақтағаннан кейін** PowerShell-ді қайта ашыңыз

## 🎯 Келесі қадамдар

1. `.env.local` файлын дұрыстаңыз
2. Файлды сақтаңыз
3. PowerShell-ді қайта ашыңыз
4. Базаны құрыңыз:

```powershell
npm run db:push
```

5. Админ рөлін қосыңыз:

```powershell
npm run make-admin admin@example0.com
```





