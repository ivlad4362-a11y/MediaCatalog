# Бэкэндке Docker қосу нұсқаулығы

## 🎯 Мақсат

Бэкэндке Docker қосу - PostgreSQL базасы мен Next.js қолданбасын Docker контейнерлерінде іске қосу.

## 📋 Дайындалған файлдар

1. **`Dockerfile`** - Next.js қолданбасы үшін multi-stage build
2. **`docker-compose.yml`** - PostgreSQL + Next.js app оркестрациясы
3. **`.dockerignore`** - Docker build-ке қажетсіз файлдарды елемеу
4. **`docker-start.ps1`** - Windows PowerShell үшін бастау скрипті

## 🚀 Қалай пайдалануға болады

### 1️⃣ Docker Desktop-ты іске қосу

1. **Docker Desktop-ты бастаңыз** (Start менюден)
2. **Трейде Docker иконкасы көрінуі керек** 🐳
3. **Бірнеше секунд күтіңіз** (Docker жүктелуі керек)

### 2️⃣ .env файлын жасау

Проект түбінде `.env` файлын жасаңыз:

```env
# Database Configuration
POSTGRES_USER=mediacatalog
POSTGRES_PASSWORD=mediacatalog123
POSTGRES_DB=mediacatalog
POSTGRES_PORT=5432

# Application Configuration
APP_PORT=3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production-min-32-chars
JWT_SECRET=your-secret-key-change-in-production-min-32-chars
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Firebase Configuration (опционал)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 3️⃣ Docker Compose арқылы іске қосу

**Әдіс 1: Автоматты скрипт (ұсынылады)**

```powershell
.\docker-start.ps1
```

**Әдіс 2: Қолмен командалар**

```powershell
# Контейнерлерді іске қосу
docker-compose up -d

# Логтарды көру
docker-compose logs -f

# Тоқтату
docker-compose down
```

### 4️⃣ Сайтты ашу

Браузерде ашыңыз: **http://localhost:3000**

---

## 📋 Пайдалы командалар

### Контейнерлерді басқару

```powershell
# Барлық контейнерлерді көру
docker ps

# Контейнерлерді тоқтату
docker-compose down

# Контейнерлерді қайта іске қосу
docker-compose restart

# Контейнерлерді жою (деректер сақталады)
docker-compose down

# Контейнерлерді жою + деректерді жою
docker-compose down -v
```

### Логтар

```powershell
# Барлық логтар
docker-compose logs

# Тек app логтары
docker-compose logs app

# Real-time логтар
docker-compose logs -f app

# Соңғы 100 жол
docker-compose logs --tail=100 app
```

### База деректерін басқару

```powershell
# PostgreSQL контейнеріне кіру
docker exec -it mediacatalog-db psql -U mediacatalog -d mediacatalog

# Базаны көру
docker-compose exec postgres psql -U mediacatalog -d mediacatalog -c "\dt"

# Prisma Studio іске қосу
docker-compose exec app npx prisma studio
# Содан кейін браузерде http://localhost:5555 ашыңыз
```

### Build жаңарту

```powershell
# Код өзгерген кезде қайта build ету
docker-compose build

# Build және іске қосу
docker-compose up -d --build
```

---

## 🔧 Мәселелерді шешу

### Порт бос емес

```powershell
# .env файлында басқа портты пайдалану
APP_PORT=3001
```

### Базаға қосылу мәселесі

```powershell
# База контейнерін қайта іске қосу
docker-compose restart postgres

# База логтарын көру
docker-compose logs postgres
```

### Build қателері

```powershell
# Кэшті тазалап қайта build ету
docker-compose build --no-cache
docker-compose up -d --build
```

### Next.js font manifest қатесі

```powershell
# Контейнерді қайта build ету
docker-compose build --no-cache
docker-compose up -d --build
```

---

## 🎉 Дайын!

Егер барлығы дұрыс жұмыс істесе, сайт http://localhost:3000 адресінде ашылады!

## 📚 Қосымша ресурстар

- [Docker документациясы](https://docs.docker.com/)
- [Docker Compose документациясы](https://docs.docker.com/compose/)
- [Next.js Docker документациясы](https://nextjs.org/docs/deployment#docker-image)





