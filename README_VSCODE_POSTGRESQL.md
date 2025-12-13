# Visual Studio Code-пен PostgreSQL байланыстыру

## 1. Керекті кеңейтулерді орнату

### SQLTools + PostgreSQL драйвері

1. VS Code-ды ашыңыз
2. Extensions (Ctrl+Shift+X) батырмасын басыңыз
3. Мына кеңейтулерді іздеп орнатыңыз:
   - **SQLTools** (mtxr.sqltools-driver-pg)
   - **SQLTools PostgreSQL/Cockroach Driver** (mtxr.sqltools-driver-pg)

### Орнату:
```
1. Extensions панелінде "SQLTools" іздеңіз
2. "SQLTools" (mtxr.sqltools-driver-pg) орнатыңыз
3. "SQLTools PostgreSQL/Cockroach Driver" орнатыңыз
4. VS Code-ды қайта іске қосыңыз
```

## 2. Базаға байланысу

### Нұсқа 1: VS Code Settings арқылы (автоматты)

`.vscode/settings.json` файлында байланыс параметрлері бар. Парольді өзгертіңіз:

```json
{
  "sqltools.connections": [
    {
      "name": "MediaCatalog PostgreSQL",
      "driver": "PostgreSQL",
      "server": "localhost",
      "port": 5432,
      "database": "mediacatalog",
      "username": "postgres",
      "password": "your_password_here"  // <-- Мұнда парольді қойыңыз
    }
  ]
}
```

### Нұсқа 2: SQLTools панелі арқылы (қолмен)

1. VS Code-да **Command Palette** ашыңыз (Ctrl+Shift+P)
2. `SQLTools: Add New Connection` таңдаңыз
3. Мына мәліметтерді енгізіңіз:
   - **Connection Name**: `MediaCatalog PostgreSQL`
   - **Server**: `localhost`
   - **Port**: `5432`
   - **Database**: `mediacatalog`
   - **Username**: `postgres`
   - **Password**: өз пароліңізді енгізіңіз
   - **Driver**: `PostgreSQL`

## 3. Байланысты пайдалану

### Байланысу:
1. VS Code-да сол жақта **SQLTools** панелін ашыңыз (белгіше иконкасы)
2. "MediaCatalog PostgreSQL" байланысын табыңыз
3. Оң жақ батырмамен басып **"Connect"** таңдаңыз
4. Парольді енгізіңіз (егер сұралса)

### SQL сұрауларды орындау:
1. Жаңа файл ашыңыз (Ctrl+N)
2. Тілді "SQL" ретінде таңдаңыз (төменгі оң жақта)
3. SQL сұрау жазыңыз:
   ```sql
   SELECT * FROM media_items;
   ```
4. Сұрауды таңдап, **Ctrl+Shift+E** басыңыз (немесе оң жақ батырма → "Run Selected Query")
5. Нәтижелер төменде көрінеді

## 4. Кестелерді көру

### SQLTools Explorer панелінде:
1. Сол жақта **SQLTools** панелін ашыңыз
2. Байланысты кеңейтіңіз
3. **Schemas** → **public** → **Tables** ашыңыз
4. Кестелерді көре аласыз:
   - `genres`
   - `media_items`
   - `media_genres`
   - `comments`

### Кесте мәліметтерін көру:
1. Кестені оң жақ батырмамен басыңыз
2. **"Show Table Records"** таңдаңыз
3. Барлық мәліметтер көрінеді

## 5. Пайдалы SQL сұраулар

### Барлық кестелерді көру:
```sql
SELECT * FROM genres;
SELECT * FROM media_items;
SELECT * FROM media_genres;
SELECT * FROM comments;
```

### Медиа элементтерін жанрларымен көру:
```sql
SELECT 
    m.id,
    m.title,
    m.type,
    array_agg(g.name) as genres
FROM media_items m
LEFT JOIN media_genres mg ON m.id = mg.media_id
LEFT JOIN genres g ON mg.genre_id = g.id
GROUP BY m.id, m.title, m.type
ORDER BY m.title;
```

### Статистика:
```sql
SELECT 
    'genres' as table_name, COUNT(*) as count FROM genres
UNION ALL
SELECT 'media_items', COUNT(*) FROM media_items
UNION ALL
SELECT 'media_genres', COUNT(*) FROM media_genres
UNION ALL
SELECT 'comments', COUNT(*) FROM comments;
```

## 6. Бағдарламалық түрде байланысу (опционал)

### .env файлында:
```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/mediacatalog"
```

### Кодта пайдалану:
```typescript
import { prisma } from "@/lib/db"

// Мәліметтерді алу
const movies = await prisma.mediaItem.findMany()
```

## 7. Мәселелерді шешу

### Байланыс қатесі:
- PostgreSQL сервері іске қосылғанын тексеріңіз
- Пароль дұрыс екенін тексеріңіз
- Порт 5432 екенін тексеріңіз

### SQLTools көрінбейді:
- VS Code-ды қайта іске қосыңыз
- Кеңейтулер орнатылғанын тексеріңіз

### Пароль еске түспейді:
- `.vscode/settings.json` файлында парольді қойыңыз
- Немесе әр рет енгізіңіз

## 8. Қосымша мүмкіндіктер

### SQL файлын тікелей орындау:
1. `database/view_data.sql` файлын ашыңыз
2. Барлық сұрауды таңдаңыз (Ctrl+A)
3. **Ctrl+Shift+E** басыңыз

### Нәтижелерді экспорттау:
- Нәтижелер панелінде оң жақ батырмамен басып "Export Results" таңдаңыз
- CSV, JSON немесе Excel форматында сақтауға болады

## Пайдалы батырмалар

- **Ctrl+Shift+P**: Command Palette
- **Ctrl+Shift+E**: SQL сұрауды орындау
- **Ctrl+Shift+X**: Extensions панелі

## Кеңейтулер тізімі

1. **SQLTools** (mtxr.sqltools-driver-pg)
2. **SQLTools PostgreSQL/Cockroach Driver** (mtxr.sqltools-driver-pg)

Орнату:
```
Extensions → "SQLTools" іздеу → Орнату
```























