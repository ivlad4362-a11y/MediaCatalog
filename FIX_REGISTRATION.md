# Тіркелу қатесін түзету

## Мүмкін себептер:

1. **Базаға қосылу қатесі** - PostgreSQL базасына қосыла алмайды
2. **Кесте құрылмаған** - `users` кестесі жоқ
3. **Prisma Client жаңартылмаған** - Prisma Client ескі нұсқа

## Шешу жолдары:

### 1. Базаға қосылуды тексеру

`.env.local` файлында `DATABASE_URL` дұрыс екенін тексеріңіз:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/MediaCatalog?schema=public"
```

### 2. Кестені құру

VS Code-та SQLTools плагині арқылы `database/auth_schema.sql` файлын орындаңыз.

Немесе терминал арқылы:

```bash
psql -U postgres -d MediaCatalog -f database/auth_schema.sql
```

### 3. Prisma Client-ті жаңарту

```bash
npm run db:generate
```

### 4. Базаны тексеру

```sql
-- Кесте бар ма?
SELECT * FROM users;

-- Кесте құрылымы
\d users
```

### 5. Егер базаға қосылу қатесі болса

Мок мәліметтерге қайта ауыстыруға болады:

```typescript
// app/api/auth/register/route.ts
import { createUser, getUserByEmail } from "@/lib/auth-mock" // auth-mock пайдалану
```

## Терминалда қатені көру

Сервер іске қосылғанда (`npm run dev`), терминалда қателер көрінеді:

```
Тіркелу қатесі: PrismaClientKnownRequestError: ...
```

## Браузер консольінде қатені көру

F12 → Console табында:

```
Failed to load resource: the server responded with a status of 500
```

Network табында қате детальдарын көре аласыз.





















