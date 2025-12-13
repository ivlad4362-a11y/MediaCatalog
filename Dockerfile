# Multi-stage build для backend (восстановлён оригинал)

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./
# Увеличиваем таймаут npm и настраиваем для работы с прокси
RUN npm config set fetch-timeout 300000 && \
  npm config set fetch-retries 5 && \
  npm config set fetch-retry-mintimeout 20000
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --legacy-peer-deps || npm install --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables для build
ENV NEXT_TELEMETRY_DISABLED 1

# Prisma generate (build кезінде, бірақ DATABASE_URL қажет емес)
# Build кезінде Prisma generate орындалады, бірақ runtime-да да қажет болуы мүмкін
RUN if [ -f prisma/schema.prisma ]; then \
      ./node_modules/.bin/prisma generate || npx prisma generate || echo "Prisma generate skipped (will run at runtime)"; \
    fi

# Build Next.js
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# wget қосылу (healthcheck үшін)
RUN apk add --no-cache wget

# OpenSSL уже включен в node:20-alpine базовый образ

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем только необходимые файлы с правильными правами
# Next.js standalone output структурасы: .next/standalone/ папкасында барлық қажетті файлдар
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma клиентін көшіру (база деректерімен жұмыс үшін)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

# Убедимся, что все файлы имеют правильные права доступа
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Next.js standalone output: server.js файлы .next/standalone/ түбінде болады
# Копирлегеннен кейін ол /app/server.js болуы керек
# Егер ол жерде болмаса, .next/standalone/app/server.js болуы мүмкін
WORKDIR /app

# Next.js standalone output құрылымын тексеру және server.js файлын іске қосу
CMD ["sh", "-c", "if [ -f server.js ]; then exec node server.js; elif [ -f app/server.js ]; then exec node app/server.js; else echo 'ҚАТЕ: server.js файлы табылмады!'; echo 'Файлдар тізімі:'; ls -la /app/ 2>&1; echo ''; echo 'Іздеу:'; find /app -name 'server.js' -type f 2>&1; exit 1; fi"]


