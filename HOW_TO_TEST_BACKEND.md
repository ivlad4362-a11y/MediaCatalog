# Бэкендті терминалда тексеру

## 1. PowerShell арқылы API-ға сұрау жасау

### Фильмдерді алу:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/movies" -Method GET | Select-Object -ExpandProperty Content
```

### Кітаптарды алу:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/books" -Method GET | Select-Object -ExpandProperty Content
```

### Ойындарды алу:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/games" -Method GET | Select-Object -ExpandProperty Content
```

### Іздеу:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/search?q=inception" -Method GET | Select-Object -ExpandProperty Content
```

## 2. JSON форматында көрсету

### Фильмдерді JSON форматында көрсету:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/movies" -Method GET
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Кітаптарды JSON форматында көрсету:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/books" -Method GET
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Ойындарды JSON форматында көрсету:
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/games" -Method GET
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

## 3. curl арқылы (егер қолжетімді болса)

### Фильмдерді алу:
```bash
curl http://localhost:3000/api/movies
```

### Кітаптарды алу:
```bash
curl http://localhost:3000/api/books
```

### Ойындарды алу:
```bash
curl http://localhost:3000/api/games
```

### Іздеу:
```bash
curl "http://localhost:3000/api/search?q=inception"
```

## 4. Сервер логтарын көру

Сервер іске қосылғанда (`npm run dev`), терминалда мынаны көре аласыз:

```
GET /api/movies 200 in 45ms
GET /api/books 200 in 32ms
GET /api/games 200 in 28ms
GET /api/search?q=inception 200 in 15ms
```

## 5. POST сұраулары (Тіркелу, Кіру)

### Тіркелу:
```powershell
$body = @{
    email = "test@example.com"
    password = "test123"
    name = "Тест"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content
```

### Кіру:
```powershell
$body = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content
```

### Пайдаланушыны алу:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/me" -Method GET | Select-Object -ExpandProperty Content
```

## 6. Браузерде тексеру

Браузерде мына адрестерді ашыңыз:

```
http://localhost:3000/api/movies
http://localhost:3000/api/books
http://localhost:3000/api/games
http://localhost:3000/api/search?q=inception
```

## 7. PowerShell функциясы (ыңғайлы)

PowerShell-да мына функцияны қосып, пайдалануға болады:

```powershell
function Test-API {
    param(
        [string]$Endpoint = "movies",
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    $uri = "http://localhost:3000/api/$Endpoint"
    $headers = @{"Content-Type" = "application/json"}
    
    if ($Body) {
        $bodyJson = $Body | ConvertTo-Json
        $response = Invoke-WebRequest -Uri $uri -Method $Method -Body $bodyJson -Headers $headers
    } else {
        $response = Invoke-WebRequest -Uri $uri -Method $Method
    }
    
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
}

# Пайдалану:
Test-API -Endpoint "movies"
Test-API -Endpoint "books"
Test-API -Endpoint "games"
Test-API -Endpoint "search?q=inception"
```

## 8. Барлық API эндпоинттерін тексеру

```powershell
$endpoints = @("movies", "books", "games", "search?q=test")

foreach ($endpoint in $endpoints) {
    Write-Host "`n=== Тестілеу: $endpoint ===" -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/$endpoint" -Method GET
        Write-Host "Статус: $($response.StatusCode)" -ForegroundColor Green
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3
    } catch {
        Write-Host "Қате: $_" -ForegroundColor Red
    }
}
```

## 9. Қателерді тексеру

### 404 қатесі (эндпоинт табылмады):
```powershell
try {
    Invoke-WebRequest -Uri "http://localhost:3000/api/notfound" -Method GET
} catch {
    Write-Host "Қате: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}
```

### 500 қатесі (сервер қатесі):
```powershell
try {
    Invoke-WebRequest -Uri "http://localhost:3000/api/movies" -Method GET
} catch {
    Write-Host "Қате: $($_.Exception.Message)" -ForegroundColor Red
}
```

## 10. Жауапты файлға сақтау

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/movies" -Method GET
$response.Content | Out-File -FilePath "movies.json" -Encoding UTF8
```

## Ескертулер:

1. **Сервер іске қосылған болуы керек**: `npm run dev`
2. **Порт дұрыс болуы керек**: `http://localhost:3000`
3. **JSON форматы**: PowerShell `ConvertFrom-Json` және `ConvertTo-Json` пайдаланады
4. **Қателер**: `try-catch` блогында қателерді басқаруға болады





















