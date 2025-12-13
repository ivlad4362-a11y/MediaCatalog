# Docker арқылы сайтқа кіру мәселесін шешу скрипті

Write-Host "=== Docker арқылы Сайтқа Кіру Мәселесін Шешу ===" -ForegroundColor Cyan
Write-Host ""

# 1. Контейнерлердің статусын тексеру
Write-Host "1. Контейнерлердің статусын тексеру..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "2. Контейнерлерді тоқтату..." -ForegroundColor Yellow
docker-compose down

Write-Host ""
Write-Host "3. Контейнерлерді қайта құрастыру..." -ForegroundColor Yellow
docker-compose build --no-cache app

Write-Host ""
Write-Host "4. Контейнерлерді іске қосу..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "5. Контейнерлердің статусын тексеру..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
docker-compose ps

Write-Host ""
Write-Host "6. App контейнерінің логтарын көрсету (соңғы 50 жол)..." -ForegroundColor Yellow
docker-compose logs --tail=50 app

Write-Host ""
Write-Host "=== Аяқталды ===" -ForegroundColor Green
Write-Host ""
Write-Host "Сайтты браузерде ашу: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Логтарды real-time көру үшін: docker-compose logs -f app" -ForegroundColor Cyan

