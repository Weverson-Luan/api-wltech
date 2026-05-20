# API WL Tech

API REST com **Fastify**, **TypeScript**, **Drizzle ORM** e **PostgreSQL** (via Docker).

## Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js    | 20+           |
| pnpm       | 9+            |
| Docker     | Para o banco  |

---

## 1. Configuração inicial

```bash
pnpm install
cp .env.example .env
```

Conteúdo padrão do `.env`:

```env
DATABASE_URL=postgresql://wltech:wltech@localhost:5432/wltech
PORT=3333
HOST=0.0.0.0
JWT_SECRET=altere-para-um-segredo-forte-em-producao
JWT_EXPIRES_IN=7d
```

> O `.env` não é versionado.

---

## 2. Banco de dados (PostgreSQL + Docker)

```bash
pnpm docker:up
```

| Configuração | Valor padrão |
|--------------|--------------|
| Host         | `localhost:5432` |
| Banco        | `wltech` |
| Usuário/senha| `wltech` / `wltech` |
| Driver       | `pg` |
| ORM          | Drizzle |

### Resetar o banco local

```bash
pnpm docker:down
docker volume rm api-wltech_postgres_data 2>/dev/null || true
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
| `pnpm db:migrate` | Aplica migrations pendentes |
| `pnpm db:push` | Sincroniza schema direto no Postgres (dev) |
| `pnpm db:studio` | UI para inspecionar dados |
| `pnpm docker:up` | Sobe PostgreSQL |
| `pnpm docker:down` | Para PostgreSQL |

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
| `pnpm db:migrate` | Executa migrations |
| `pnpm db:push` | Sincroniza schema no PostgreSQL |
| `pnpm db:seed` | Popula dados de desenvolvimento |
| `pnpm db:studio` | Abre Drizzle Studio |
| `pnpm docker:up` | Sobe PostgreSQL |
| `pnpm docker:down` | Para PostgreSQL |

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

Confirme que o container está rodando (`pnpm docker:up`) e que `DATABASE_URL` no `.env` usa `postgresql://wltech:wltech@localhost:5432/wltech`.

### Migration desatualizada após pull

```bash
pnpm db:migrate
pnpm db:seed
```
