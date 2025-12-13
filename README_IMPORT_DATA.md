# Деректерді базаға сақтау нұсқауы

Бұл нұсқау `lib/db-mock.ts` файлындағы барлық мок деректерді базаға сақтауға көмектеседі.

## Алдын ала талаптар

1. PostgreSQL базасы қосылған болуы керек
2. `.env` файлында `DATABASE_URL` орнатылған болуы керек
3. База схемасы орындалған болуы керек (`database/schema.sql`)

## Деректерді сақтау әдістері

### 1-ші әдіс: Node.js скрипті (Ұсынылады)

```bash
# tsx пакетін орнату (егер жоқ болса)
npm install -D tsx

# Деректерді импорттау
npm run import-data
```

Бұл скрипт барлық мок деректерді базаға сақтайды:
- 3 фильм (Inception, Breaking Bad, Oppenheimer)
- 1 кітап (Dune)
- 1 ойын (The Witcher 3)
- Қосымша 3 фильм, 2 кітап, 4 ойын

### 2-ші әдіс: SQL скрипті

```bash
# PostgreSQL-ге қосылып, SQL скриптті орындау
psql -U your_username -d your_database -f database/insert_all_mock_data.sql
```

Немесе pgAdmin немесе басқа клиент арқылы `database/insert_all_mock_data.sql` файлын орындаңыз.

## Деректерді тексеру

Деректер сақталғаннан кейін, мына сұраулар арқылы тексеруге болады:

```sql
-- Барлық медиа элементтерін көру
SELECT type, COUNT(*) as count 
FROM media_items 
GROUP BY type;

-- Барлық жанрларды көру
SELECT g.name, COUNT(mg.media_id) as media_count
FROM genres g
LEFT JOIN media_genres mg ON g.id = mg.genre_id
GROUP BY g.name
ORDER BY media_count DESC;
```

## API-ларды базадан оқитындай ету

Қазіргі уақытта API-лар `lib/db-mock.ts` пайдаланып тұр. Базадан оқитындай ету үшін:

1. `app/api/movies/route.ts` файлында:
   ```typescript
   // Ескі:
   import { getMediaItems } from "@/lib/db-mock"
   
   // Жаңа:
   import { getMediaItems } from "@/lib/db"
   ```

2. Сол сияқты `app/api/books/route.ts` және `app/api/games/route.ts` файлдарын да өзгертіңіз.

3. `app/api/search/route.ts` файлын да өзгертіңіз.

## Ескерту

- Егер база қосылмаған болса, API-лар әлі де `db-mock.ts` пайдаланады
- Деректер сақталғаннан кейін, серверді қайта іске қосыңыз
- Барлық деректер `ON CONFLICT DO UPDATE` арқылы сақталады, сондықтан қайта орындау қауіпсіз

## Қосымша деректер қосу

Жаңа деректер қосу үшін:

1. `scripts/import-mock-data.ts` файлына жаңа элементтерді қосыңыз
2. Скриптті қайта орындаңыз: `npm run import-data`

Немесе:

1. `database/insert_all_mock_data.sql` файлына SQL INSERT сұрауларын қосыңыз
2. SQL скриптті қайта орындаңыз



















