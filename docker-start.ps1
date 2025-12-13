# Docker бастау скрипті (PowerShell)
# Windows үшін

Write-Host "🚀 MediaCatalog Docker басталуда..." -ForegroundColor Cyan

# .env файлын тексеру
if (-not (Test-Path .env)) {
    Write-Host "⚠️  .env файлы табылмады!" -ForegroundColor Yellow
    Write-Host "📝 .env.example файлын .env ретінде көшіріп, мәндерді толтырыңыз" -ForegroundColor Yellow
    exit 1
}

# Docker Compose арқылы іске қосу
Write-Host "📦 Контейнерлерді іске қосу..." -ForegroundColor Cyan
docker-compose up -d

# База дайын болғанша күту
Write-Host "⏳ База дайындалуда..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Миграцияларды орындау
Write-Host "🔄 База миграцияларын орындау..." -ForegroundColor Cyan
docker-compose exec -T app npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Миграция қатесі (мүмкін бұрын орындалған)" -ForegroundColor Yellow
}

# Prisma клиентін generate ету
Write-Host "🔧 Prisma клиентін дайындау..." -ForegroundColor Cyan
docker-compose exec -T app npx prisma generate

Write-Host ""
Write-Host "✅ Дайын! Сайт http://localhost:3000 адресінде ашылады" -ForegroundColor Green
Write-Host ""
Write-Host "Пайдалы командалар:" -ForegroundColor Cyan
Write-Host "  - Логтарды көру: docker-compose logs -f"
Write-Host "  - Тоқтату: docker-compose down"
Write-Host "  - Prisma Studio: docker-compose exec app npx prisma studio"





