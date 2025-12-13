# Next.js Font Manifest қатесін шешу

## 🔍 Мәселе

```
Error: ENOENT: no such file or directory, open 
'C:\Android\MediaCatalog\.next\server\next-font-manifest.json'
```

## ✅ Шешім

### 1️⃣ Серверді тоқтату

PowerShell-де:

```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 2️⃣ .next папкасын жою

```powershell
Remove-Item -Path .next -Recurse -Force
```

### 3️⃣ Cache папкасын жою (қажет болса)

```powershell
Remove-Item -Path node_modules\.cache -Recurse -Force
```

### 4️⃣ Сайтты қайта іске қосу

```powershell
npm run dev
```

---

## 🔧 Толық тексеру тізбегі

### Барлық қадамдарды бірден орындау:

```powershell
# 1. Серверді тоқтату
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. .next папкасын жою
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue

# 3. Cache папкасын жою
Remove-Item -Path node_modules\.cache -Recurse -Force -ErrorAction SilentlyContinue

# 4. Сайтты қайта іске қосу
npm run dev
```

---

## ⚠️ Ескертулер

1. **Build уақыты** - Бірінші рет іске қосылғанда build біраз уақыт алуы мүмкін
2. **Порт** - Сервер `http://localhost:3000` адресінде іске қосылады
3. **Қателер** - Егер қателер болса, терминалда көрсетіледі

---

## 🔍 Егер мәселелер жалғаса

### 1. node_modules папкасын қайта орнату:

```powershell
# node_modules жою
Remove-Item -Path node_modules -Recurse -Force

# Dependencies қайта орнату
npm install
```

### 2. Prisma клиентін қайта generate ету:

```powershell
npm run db:generate
```

### 3. Базаны құру:

```powershell
npm run db:push
```

---

## ✅ Нәтиже

Сервер қайта іске қосылғанда сайт жұмыс істеуі керек!

Егер әлі де қателер болса, терминалда қандай қателер көрсетілгенін тексеріңіз.





