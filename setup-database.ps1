# PostgreSQL базасын құру скрипті

Write-Host "PostgreSQL базасын құру..." -ForegroundColor Cyan

# PostgreSQL-ге байланысу
$env:PGPASSWORD = "Jansaya31-"

# Базаны құру
Write-Host "`nБазаны құру..." -ForegroundColor Yellow
psql -U postgres -c "CREATE DATABASE mediacatalog;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ База құрылды!" -ForegroundColor Green
} else {
    Write-Host "⚠️ База қазірдің өзінде бар немесе қате орын алды" -ForegroundColor Yellow
}

Write-Host "`nКелесі қадамдар:" -ForegroundColor Cyan
Write-Host "1. npm run db:generate" -ForegroundColor White
Write-Host "2. npm run db:push" -ForegroundColor White
Write-Host "3. npm run dev" -ForegroundColor White












