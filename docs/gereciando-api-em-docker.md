# Scripts para gerenciar api dentro do Docker


**Rodar migrations (VPS):**
```bash
cd /opt/api-wltech

docker run --rm --network api-wltech_internal \
  -v "$(pwd):/app" -w /app \
  --env-file .env.production \
  node:22-alpine sh -c \
  "corepack enable && corepack prepare pnpm@11.1.2 --activate && pnpm install && pnpm db:migrate"
```

**Rodar seed (VPS):**

```bash
docker run --rm --network api-wltech_internal \
  -v "$(pwd):/app" -w /app \
  --env-file .env.production \
  node:22-alpine sh -c \
  "corepack enable && corepack prepare pnpm@11.1.2 --activate && pnpm install && pnpm db:seed"
```


**Rodar migrations + seed de uma vez (VPS):**
```bash

docker run --rm --network api-wltech_internal \
  -v "$(pwd):/app" -w /app \
  --env-file .env.production \
  node:22-alpine sh -c \
  "corepack enable && corepack prepare pnpm@11.1.2 --activate && pnpm install && pnpm db:migrate && pnpm db:seed"
```


**Rodar para reniciar API (VPS):**
```bash
  docker compose -f docker-compose.prod.yml --env-file .env.production restart api
```

**Rodar migrations + seed de uma vez (VPS):**
```bash

```