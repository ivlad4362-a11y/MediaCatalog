# Docker Қателерін Диагностикалау Нұсқаулығы

## 🔍 Қателерді табу

### 1. Контейнерлердің статусын тексеру
```bash
docker-compose ps
```

### 2. Логтарды көру
```bash
# Барлық контейнерлердің логтарын көру
docker-compose logs

# Тек app контейнерінің логтарын көру
docker-compose logs app

# Соңғы 100 жолды көру
docker-compose logs --tail=100 app

# Real-time логтарды көру
docker-compose logs -f app
```

### 3. Контейнер ішіне кіру
```bash
# App контейнеріне кіру
docker-compose exec app sh

# Ішінде командаларды орындау:
ls -la /app/
ls -la /app/app/
cat /app/server.js 2>/dev/null || echo "server.js жоқ"
npx prisma --version
```

### 4. server.js файлын тексеру
```bash
# Файлды іздеу
docker-compose exec app find /app -name "server.js" -type f

# Файлдың бар екенін тексеру
docker-compose exec app test -f /app/server.js && echo "server.js бар" || echo "server.js жоқ"
docker-compose exec app test -f /app/app/server.js && echo "app/server.js бар" || echo "app/server.js жоқ"
```

### 5. Prisma клиентін тексеру
```bash
# Prisma клиентінің бар екенін тексеру
docker-compose exec app ls -la /app/node_modules/.prisma/client 2>/dev/null || echo "Prisma клиенті жоқ"

# Prisma generate орындау
docker-compose exec app npx prisma generate
```

### 6. База деректерімен байланысты тексеру
```bash
# Базаға қосылуды тексеру
docker-compose exec app npx prisma db pull

# Миграцияларды тексеру
docker-compose exec app npx prisma migrate status

# Миграцияларды орындау
docker-compose exec app npx prisma migrate deploy
```

### 7. Build қателерін тексеру
```bash
# Контейнерді қайта құрастыру
docker-compose build --no-cache app

# Build логтарын көру
docker-compose build app 2>&1 | tee build.log
```

## 🔧 Жедел шешулер

### Мәселе 1: server.js файлы табылмады
```bash
# Контейнерді қайта құрастыру
docker-compose down
docker-compose build --no-cache app
docker-compose up -d
```

### Мәселе 2: Prisma клиенті жоқ
```bash
# Prisma клиентін generate ету
docker-compose exec app npx prisma generate
```

### Мәселе 3: База деректерімен байланыс қатесі
```bash
# База контейнерінің жұмыс істеп тұрғанын тексеру
docker-compose ps postgres

# Базаға қосылуды тексеру
docker-compose exec postgres psql -U mediacatalog -d mediacatalog -c "SELECT 1;"

# Миграцияларды орындау
docker-compose exec app npx prisma migrate deploy
```

### Мәселе 4: Контейнер іске қосылмайды
```bash
# Контейнерді тоқтату
docker-compose down

# Контейнерлерді жою
docker-compose rm -f

# Қайта құру
docker-compose up -d --build
```

## 📋 Тексеру тізімі

- [ ] Контейнерлер жұмыс істеп тұрған ба? (`docker-compose ps`)
- [ ] Логтарда қателер бар ма? (`docker-compose logs app`)
- [ ] server.js файлы бар ма? (`docker-compose exec app ls -la /app/server.js`)
- [ ] Prisma клиенті бар ма? (`docker-compose exec app ls -la /app/node_modules/.prisma/client`)
- [ ] База деректерімен байланыс бар ма? (`docker-compose exec app npx prisma db pull`)

---

**Дата:** 2024
**Статус:** Диагностикалау нұсқаулығы дайын ✅

