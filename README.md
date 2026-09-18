# API WL Tech

API REST com **Fastify**, **TypeScript**, **Drizzle ORM** e **PostgreSQL** (via Docker).

## Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js    | 20+           |
| pnpm       | 9+            |
| Docker     | Para o banco  |

### Deploy em produção (VPS + GitHub Actions)

Deploy automático via GitHub Actions — **tutorial passo a passo:** **[docs/DEPLOY.md](docs/DEPLOY.md)** (replicável em qualquer VPS)

| Ambiente | Compose | Porta API |
|----------|---------|-----------|
| Dev local | `docker-compose.yml` | `3333` |
| Produção (VPS) | `docker-compose.prod.yml` | `13333` só em localhost; público via Nginx `https://api.wltech.tech` |

**Fluxo:** push na `main` → GitHub Actions builda a imagem → publica no GHCR → faz SSH na VPS → sobe API + Postgres.

**HTTPS:** veja [docs/DEPLOY.md — Parte 8](docs/DEPLOY.md) (Nginx + Let's Encrypt / Certbot).

**Secrets necessários no GitHub** (Settings → Secrets → Actions):

| Secret | O que é |
|--------|---------|
| `VPS_HOST` | IP da VPS |
| `VPS_USER` | usuário SSH (ex.: `deploy`) |
| `VPS_SSH_KEY` | chave privada para SSH |
| `VPS_GHCR_TOKEN` | (opcional) PAT se o pacote GHCR for privado |

---

## 1. Configuração inicial

```bash
pnpm install
cp .env.example .env
```

Conteúdo padrão do `.env`:

```env
POSTGRES_PORT=5433
DATABASE_URL=postgresql://wltech:wltech@localhost:5433/wltech
PORT=3333
HOST=0.0.0.0
JWT_SECRET=altere-para-um-segredo-forte-em-producao
JWT_EXPIRES_IN=7d
```

> O `.env` não é versionado.

### `DATABASE_URL`: `localhost` vs `postgres`

| Onde você roda | Host correto | Exemplo |
|----------------|--------------|---------|
| Mac — `pnpm db:migrate`, `db:seed`, `db:studio`, DBeaver | `localhost` + `POSTGRES_PORT` | `postgresql://wltech:wltech@localhost:5433/wltech` |
| Container `api` (Docker) | `postgres` | definido no `docker-compose.yml` |
| VPS (produção) | `postgres` | definido no `docker-compose.prod.yml` |

Se `pnpm db:migrate` falhar com host `postgres` no `.env`, troque para `localhost` ou use:

```bash
pnpm db:migrate:docker
```

---

## 2. Docker (API + PostgreSQL)

Sobe API e banco juntos:

```bash
pnpm docker:up
```

| Serviço | URL / porta |
|---------|-------------|
| API     | http://localhost:3333 |
| Postgres| `localhost:5433` (porta `POSTGRES_PORT`, para DBeaver/migrate no host) |
| Banco   | `wltech` |
| Usuário/senha | `wltech` / `wltech` |

A API no Docker usa hot reload (`tsx watch`) com `./src` montado como volume.

Logs da API:

```bash
pnpm docker:logs
```

### Resetar o banco local

```bash
pnpm docker:down
docker volume rm api-wltech-dev_postgres_data 2>/dev/null || true
pnpm docker:up
pnpm db:migrate
pnpm db:seed
```

---

## 3. Migrations (Drizzle)

O schema fica em `src/db/schema/`. As migrations SQL geradas ficam em `drizzle/`.

### Fluxo recomendado (com migrations versionadas)

**1. Altere o schema** em `src/db/schema/` (ex.: `roles.ts`, `users.ts`).

**2. Gere a migration:**

```bash
pnpm db:generate
```

**3. Aplique no banco:**

```bash
pnpm db:migrate
```

### Drizzle Studio

```bash
pnpm db:studio
```

### Resumo dos comandos

| Comando | Quando usar |
|---------|-------------|
| `pnpm db:generate` | Depois de mudar o schema — gera SQL em `drizzle/` |
| `pnpm db:migrate` | Aplica migrations pendentes (no Mac, exige `@localhost` no `.env`) |
| `pnpm db:migrate:docker` | Aplica migrations dentro do container `api` |
| `pnpm db:push` | Sincroniza schema direto no Postgres (dev) |
| `pnpm db:studio` | UI para inspecionar dados |
| `pnpm docker:up` | Sobe API + PostgreSQL |
| `pnpm docker:down` | Para API + PostgreSQL |
| `pnpm docker:logs` | Logs da API em tempo real |

---

## 4. Seed (dados de desenvolvimento)

```bash
pnpm db:seed
```

| E-mail | Senha | Role |
|--------|-------|------|
| admin@wltech.dev | dev123 | admin |
| manager@wltech.dev | dev123 | manager |
| user@wltech.dev | dev123 | user |

**Orçamentos de exemplo** (3 registros — `FoodFlow`, `Clínica Online`, `Loja VIP`).

---

## 5. Rodar o projeto

### Setup completo (primeira vez)

Cria/atualiza tabelas e popula o seed:

```bash
pnpm setup
```

Equivalente manual:

```bash
pnpm docker:up
pnpm db:migrate
pnpm db:seed
```

### Desenvolvimento (hot reload)

Com Docker (recomendado):

```bash
pnpm docker:up
```

Ou direto no host:

```bash
pnpm dev
```

API em: **http://localhost:3333**

### Produção (build)

```bash
pnpm build
pnpm start
```

---

## 6. Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Health check |
| GET | `/roles` | Lista todas as roles |
| GET | `/users` | Lista usuários com nome da role |
| GET | `/budgets` | Lista orçamentos de clientes |
| POST | `/budgets` | Cria solicitação de orçamento |

```bash
curl http://localhost:3333/health
curl http://localhost:3333/roles
curl http://localhost:3333/users
curl http://localhost:3333/budgets
```

---

## 7. Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Servidor em modo watch |
| `pnpm build` | Compila TypeScript para `dist/` |
| `pnpm start` | Roda `dist/server.js` |
| `pnpm setup` | `docker:up` + `db:migrate` + `db:seed` |
| `pnpm db:generate` | Gera migration a partir do schema |
| `pnpm db:migrate` | Executa migrations no host (`@localhost` no `.env`) |
| `pnpm db:migrate:docker` | Executa migrations dentro do Docker |
| `pnpm db:push` | Sincroniza schema no PostgreSQL |
| `pnpm db:seed` | Popula dados de desenvolvimento |
| `pnpm db:studio` | Abre Drizzle Studio |
| `pnpm docker:up` | Sobe API + PostgreSQL |
| `pnpm docker:down` | Para API + PostgreSQL |
| `pnpm docker:logs` | Logs da API em tempo real |

---

## 9. Estrutura do projeto

Imports usam o alias `@/` apontando para `src/` (ex.: `@/lib/errors/app-error.js`). No build, `tsc-alias` reescreve os caminhos para o `dist/`.

```
.
├── docker-compose.yml      # PostgreSQL
├── drizzle.config.ts
├── drizzle/                # Migrations SQL
├── .env.example
└── src/
    ├── server.ts
    └── db/
        ├── index.ts
        ├── seed.ts
        └── schema/
            ├── roles.ts
            ├── users.ts
            ├── budgets.ts
            └── index.ts
    └── routes/
        ├── index.ts
        ├── health.ts
        ├── roles.ts
        ├── users.ts
        └── budgets.ts
    └── lib/
        └── validators/
            ├── brazilian-phone.ts
            └── budget.ts
```

---

## 10. Problemas comuns

### `DATABASE_URL is not set`

```bash
cp .env.example .env
```

### Seed ou migration falha após mudar schema

```bash
pnpm docker:up
pnpm db:migrate
pnpm db:seed
```

### Postgres não conecta

Confirme que o container está rodando (`pnpm docker:up`) e que `DATABASE_URL` no `.env` usa a mesma porta de `POSTGRES_PORT` (ex.: `@localhost:5433`).

### `pnpm db:migrate` falha silenciosamente (exit code 1)

Causa comum: `.env` com `@postgres:5432`. O host `postgres` só existe **dentro** da rede Docker.

Correção:

```bash
# Opção A — ajuste o .env para localhost
POSTGRES_PORT=5433
DATABASE_URL=postgresql://wltech:wltech@localhost:5433/wltech

# Opção B — rode migrate dentro do container
pnpm db:migrate:docker
```

### Migration desatualizada após pull

```bash
pnpm db:migrate
pnpm db:seed
```
