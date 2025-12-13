# Docker арқылы Сайтқа Кіру - Жедел Шешу

## 🚀 Жедел шешу (3 қадам)

### 1. Контейнерлерді қайта құру

```bash
docker-compose down
docker-compose build --no-cache app
docker-compose up -d
```

### 2. Логтарды көру

```bash
docker-compose logs -f app
```

### 3. Браузерде ашу

```
http://localhost:3000
```

---

## 🔍 Егер жұмыс істемесе - диагностикалау

### 1. Контейнерлердің статусын тексеру

```bash
docker-compose ps
```

**Күтілетін нәтиже:**
```
NAME                  STATUS
mediacatalog-db       Up (healthy)
mediacatalog-app      Up (healthy)
```

### 2. Порт мәселелерін тексеру

```bash
# Windows
netstat -ano | findstr :3000

# Егер порт бос емес болса, басқа порт пайдалану
# .env файлында: APP_PORT=3001
```

### 3. Логтарда қателерді іздеу

```bash
docker-compose logs app | findstr /i "error fail exit"
```

---

## ⚡ PowerShell скрипті (Windows)

```powershell
# docker-start-fix.ps1 файлын орындау
.\docker-start-fix.ps1
```

---

## 📋 Тексеру тізімі

- [ ] Docker Desktop іске қосылған ба?
- [ ] Контейнерлер жұмыс істеп тұрған ба? (`docker-compose ps`)
- [ ] Порт 3000 бос ма?
- [ ] Логтарда қателер бар ма? (`docker-compose logs app`)
- [ ] Браузерде `http://localhost:3000` ашылған ба?

---

## 🐛 Жиі кездесетін қателер

### 1. "Port 3000 is already allocated"
**Шешу:**
```bash
# Басқа порт пайдалану
# .env файлында немесе docker-compose.yml-да:
APP_PORT=3001
```

### 2. "Cannot connect to Docker daemon"
**Шешу:** Docker Desktop іске қосылғанын тексеру

### 3. "server.js file not found"
**Шешу:**
```bash
docker-compose build --no-cache app
docker-compose up -d
```

### 4. "Database connection error"
**Шешу:**
```bash
# База контейнерінің жұмыс істеп тұрғанын тексеру
docker-compose ps postgres
docker-compose logs postgres
```

---

**Дата:** 2024
**Статус:** Жедел шешу нұсқаулығы дайын ✅

