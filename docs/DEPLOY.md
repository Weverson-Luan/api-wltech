# Tutorial: deploy da API WLTech em uma VPS

Guia passo a passo para subir a API + PostgreSQL em qualquer VPS Ubuntu/Debian, com Docker, persistência de dados e deploy automático via GitHub Actions.

**Tempo estimado:** 30–60 minutos (primeira vez)

---

## O que você vai ter no final

| Item | Valor padrão |
|------|--------------|
| API (após Parte 8) | `https://api.wltech.tech` |
| Health check | `https://api.wltech.tech/health` |
| API (só na VPS) | `http://127.0.0.1:13333` (Nginx faz o proxy) |
| PostgreSQL | só dentro do Docker (não exposto no host) |
| Deploy automático | push na branch `main` |

---

## Pré-requisitos

- VPS com Ubuntu 22.04+ ou Debian 12+
- Acesso SSH (usuário com `sudo`)
- Repositório no GitHub: `Weverson-Luan/api-wltech`
- No seu Mac: Git, opcionalmente Node/pnpm para dev local

---

## Parte 1 — Preparar a VPS

### 1.1 Conectar na VPS

```bash
ssh SEU_USUARIO@IP_DA_VPS
```

Exemplo: `ssh luandev@srv1965901.hostinger.com` ou `ssh luandev@203.0.113.10`

### 1.2 Instalar Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

**Desconecte e reconecte** no SSH para o grupo `docker` valer.

Teste:

```bash
docker run hello-world
```

### 1.3 Criar pasta do projeto

Escolha um caminho e use **sempre o mesmo** (importante para o GitHub Actions):

```bash
sudo mkdir -p /opt/workspace/api-wltech
sudo chown $USER:$USER /opt/workspace/api-wltech
```

> Outro caminho comum: `/opt/api-wltech`. Se usar outro, anote — você precisará configurar `APP_DIR` no GitHub Actions (Parte 4).

### 1.4 Firewall

Na primeira subida (antes do Nginx), libere SSH. A porta `13333` **não** precisa ficar pública — a API sobe só em `127.0.0.1`. Com HTTPS (Parte 8), libere `80` e `443`:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

> Se ainda tiver regra antiga `13333/tcp` aberta para o mundo, remova após o Nginx: `sudo ufw delete allow 13333/tcp`.

---

## Parte 2 — Clonar o projeto e configurar ambiente

### 2.1 Clonar o repositório

```bash
cd /opt/workspace/api-wltech
git clone https://github.com/Weverson-Luan/api-wltech.git .
```

### 2.2 Criar `.env.production`

```bash
cp .env.production.example .env.production
nano .env.production
```

Preencha com valores **reais**. Exemplo:

```env
NODE_ENV=production

POSTGRES_USER=wltech
POSTGRES_PASSWORD=MinhaSenhaForte123!
POSTGRES_DB=wltech

# Host "postgres" = nome do serviço Docker (NÃO use localhost aqui)
DATABASE_URL=postgresql://wltech:MinhaSenhaForte123!@postgres:5432/wltech

PORT=3333
HOST=0.0.0.0
API_PORT=13333

JWT_SECRET=cole-aqui-um-segredo-com-pelo-menos-32-caracteres
JWT_EXPIRES_IN=7d

API_IMAGE=ghcr.io/weverson-luan/api-wltech:latest
```

Gerar `JWT_SECRET`:

```bash
openssl rand -base64 48
```

**Regra crítica:** a senha em `POSTGRES_PASSWORD` deve ser **igual** à senha dentro de `DATABASE_URL`. Se mudar uma, mude a outra.

### 2.3 Variáveis explicadas

| Variável | O que é |
|----------|---------|
| `POSTGRES_PASSWORD` | Senha do banco (gravada na 1ª criação do volume) |
| `DATABASE_URL` | URL que a API usa para conectar (`@postgres:5432`) |
| `API_PORT` | Porta só em localhost na VPS (padrão `13333`; Nginx faz proxy) |
| `JWT_SECRET` | Segredo JWT — mínimo 32 caracteres em produção |
| `API_IMAGE` | Imagem Docker no GHCR (Actions atualiza no deploy) |

---

## Parte 3 — Primeiro deploy manual

### 3.1 Comando correto do Docker Compose

**Errado** (trata o arquivo como nome de serviço):

```bash
docker compose up -d docker-compose.prod.yml   # NÃO USE
```

**Certo** — sempre use `-f` para o arquivo e `--env-file` para produção:

```bash
cd /opt/workspace/api-wltech

docker compose -f docker-compose.prod.yml --env-file .env.production up -d postgres
```

Aguarde o Postgres ficar healthy:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production ps
```

### 3.2 Rodar migrations (obrigatório na 1ª vez)

Migrations **não** rodam automaticamente no deploy. Execute na VPS:

```bash
cd /opt/workspace/api-wltech

docker run --rm --network api-wltech_internal \
  -v "$(pwd):/app" -w /app \
  --env-file .env.production \
  node:22-alpine sh -c \
  "corepack enable && corepack prepare pnpm@11.1.2 --activate && pnpm install && pnpm db:migrate"
```

Saída esperada: `migrations applied successfully!`

> Sempre que houver nova migration no repositório (`drizzle/*.sql`), repita este passo após `git pull`.

### 3.3 Subir a API

**Opção A — build local na VPS** (antes do Actions estar configurado):

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

**Opção B — imagem do GHCR** (após Parte 4):

```bash
echo "SEU_PAT" | docker login ghcr.io -u SEU_USUARIO_GITHUB --password-stdin
docker compose -f docker-compose.prod.yml --env-file .env.production pull api
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

### 3.4 Validar

```bash
curl http://127.0.0.1:13333/health
```

Resposta esperada:

```json
{
  "success": true,
  "status_code": 200,
  "data": {
    "status": "ok",
    "database": "up",
    "api": "up"
  }
}
```

Do seu computador (só após a Parte 8 — Nginx + HTTPS):

```bash
curl https://api.wltech.tech/health
```

Antes do domínio, o health check público **não** fica disponível (a API escuta só em `127.0.0.1:13333`). Valide via SSH na VPS com o `curl` acima em `127.0.0.1`.

> Seed de desenvolvimento **não** roda em produção. Crie o primeiro usuário via `POST /register` ou endpoint de auth.

---

## Parte 4 — GitHub Actions (deploy automático)

### 4.1 Garantir que o código de deploy está na `main`

Estes arquivos precisam estar no GitHub:

- `.github/workflows/deploy.yml`
- `.github/workflows/ci.yml`
- `Dockerfile`, `docker-compose.prod.yml`
- `scripts/deploy.sh`

Faça commit e push na branch `main`.

### 4.2 Secrets no GitHub

Repositório → **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Obrigatório | Valor |
|--------|-------------|-------|
| `VPS_HOST` | Sim | IP ou hostname da VPS |
| `VPS_USER` | Sim | usuário SSH (`luandev`, `deploy`, etc.) |
| `VPS_SSH_KEY` | Sim | conteúdo completo da chave **privada** |
| `VPS_SSH_PORT` | Não | `22` (padrão) |
| `VPS_GHCR_TOKEN` | Recomendado | PAT com `read:packages` (ver abaixo) |

### 4.3 Criar chave SSH para o Actions

**No seu Mac:**

```bash
ssh-keygen -t ed25519 -C "github-actions-api-wltech" -f ~/.ssh/api-wltech-deploy -N ""
```

**Chave pública → VPS** (`~/.ssh/authorized_keys` do usuário de deploy):

```bash
cat ~/.ssh/api-wltech-deploy.pub
```

Na VPS:

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "COLE_A_CHAVE_PUBLICA_AQUI" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**Chave privada → GitHub** secret `VPS_SSH_KEY`:

```bash
cat ~/.ssh/api-wltech-deploy
```

Copie **todo** o conteúdo (incluindo `-----BEGIN` e `-----END`).

### 4.4 Criar `VPS_GHCR_TOKEN` (token do GitHub)

Necessário se a imagem no GHCR for **privada**.

1. Acesse: https://github.com/settings/tokens
2. **Generate new token** → **Fine-grained token** (ou Classic)
3. **Fine-grained:**
   - Repository: `Weverson-Luan/api-wltech`
   - Permissions → **Packages: Read**
4. **Classic:** marque apenas **`read:packages`**
5. Generate → copie o token
6. GitHub do repo → Secrets → `VPS_GHCR_TOKEN` = cole o token

**Alternativa:** após o primeiro build, torne o pacote público em **GitHub → Packages → api-wltech → Package settings → Change visibility → Public**.

### 4.5 Caminho do projeto (`APP_DIR`)

O workflow usa por padrão `/opt/api-wltech`. Se você clonou em outro lugar (ex.: `/opt/workspace/api-wltech`), adicione secret:

| Secret | Valor |
|--------|-------|
| `APP_DIR` | `/opt/workspace/api-wltech` |

E ajuste o workflow para passar `APP_DIR` no step SSH (ou exporte na VPS em `~/.bashrc`).

Por enquanto, na VPS você pode criar symlink:

```bash
sudo ln -s /opt/workspace/api-wltech /opt/api-wltech
```

### 4.6 Disparar deploy

- **Automático:** push na `main`
- **Manual:** GitHub → **Actions → Deploy to Production → Run workflow**

### 4.7 Fluxo do Actions

```mermaid
sequenceDiagram
  participant Dev as Developer
  participant GH as GitHubActions
  participant CR as ghcr.io
  participant VPS as VPS

  Dev->>GH: push main
  GH->>GH: docker build runner
  GH->>CR: push imagem :sha e :latest
  GH->>VPS: SSH scripts/deploy.sh
  VPS->>CR: docker pull
  VPS->>VPS: up postgres + api
  VPS->>VPS: curl /health
```

---

## Parte 5 — Comandos do dia a dia

Todos os comandos abaixo assumem:

```bash
cd /opt/workspace/api-wltech
export DC="docker compose -f docker-compose.prod.yml --env-file .env.production"
```

| Ação | Comando |
|------|---------|
| Ver status | `$DC ps` |
| Logs da API | `$DC logs -f api` |
| Logs do Postgres | `$DC logs -f postgres` |
| Reiniciar API | `$DC restart api` |
| Parar tudo | `$DC down` |
| Subir tudo | `$DC up -d` |
| Deploy manual (após Actions) | `chmod +x scripts/deploy.sh && ./scripts/deploy.sh` |

---

## Parte 6 — Replicar em outra VPS

Checklist para **qualquer** VPS nova:

1. [ ] Instalar Docker + usuário no grupo `docker`
2. [ ] Liberar portas `22`, `80` e `443` no firewall (não abra `13333` publicamente)
3. [ ] Clonar repo no caminho definido (`APP_DIR`)
4. [ ] Criar `.env.production` com senhas únicas para **esta** VPS
5. [ ] `docker compose -f docker-compose.prod.yml --env-file .env.production up -d postgres`
6. [ ] Rodar migrations (container one-off)
7. [ ] Subir API (`up -d` ou via Actions)
8. [ ] `curl http://127.0.0.1:13333/health`
9. [ ] Configurar Nginx + HTTPS (Parte 8) e validar `https://api.wltech.tech/health`
10. [ ] (Opcional) Atualizar secrets `VPS_HOST` / `VPS_SSH_KEY` se trocar de servidor

Cada VPS tem seu **próprio volume** `api-wltech_postgres_data` — dados não são compartilhados entre servidores.

---

## Parte 7 — Múltiplos projetos na mesma VPS

Para não conflitar com outros Docker:

| Projeto | `API_PORT` sugerida |
|---------|---------------------|
| api-wltech | `13333` |
| outro projeto | `13334`, `13335`, ... |

PostgreSQL deste projeto **não** publica porta no host. A API publica `API_PORT` **apenas em `127.0.0.1`** — o acesso externo é via Nginx (80/443).

---

## Parte 8 — Domínio e HTTPS (Nginx + Let's Encrypt)

Arquitetura:

```text
Cliente → https://api.wltech.tech:443 → Nginx (TLS) → 127.0.0.1:13333 → API Docker
```

Config versionada: [`deploy/nginx/api-wltech.conf`](../deploy/nginx/api-wltech.conf).

### 8.1 DNS

No Hostinger (domínio `wltech.tech` → **Gerenciar** → DNS), crie um registro **A** (e **AAAA** se tiver IPv6) apontando `api` / `api.wltech.tech` para o IP público da VPS.

Aguarde propagação:

```bash
dig +short api.wltech.tech
# deve retornar o IP da VPS
```

### 8.2 Garantir API só em localhost

Com o compose atualizado, recrie o serviço (se a API já estava publicada em `0.0.0.0:13333`):

```bash
cd /opt/workspace/api-wltech   # ou /opt/api-wltech
git pull
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
curl http://127.0.0.1:13333/health
```

### 8.3 Instalar Nginx e Certbot

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
sudo systemctl enable --now nginx
```

### 8.4 Bootstrap HTTP (primeiro certificado)

O arquivo completo do repo já espera os certificados em `/etc/letsencrypt/...`. Na **primeira** vez, use um site temporário só na porta 80 para o Certbot emitir o cert:

```bash
sudo tee /etc/nginx/sites-available/api-wltech >/dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name api.wltech.tech;

    location / {
        proxy_pass http://127.0.0.1:13333;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
```

Habilite o site:

```bash
sudo ln -sf /etc/nginx/sites-available/api-wltech /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Emita o certificado (o plugin do Nginx ajusta SSL automaticamente):

```bash
sudo certbot --nginx -d api.wltech.tech
```

Siga o prompt (e-mail, ToS). Valide:

```bash
curl https://api.wltech.tech/health
```

### 8.5 (Opcional) Alinhar com a config versionada do repo

Depois do Certbot, você pode substituir pelo arquivo do repositório (já com redirect HTTP→HTTPS, upstream e timeouts):

```bash
cd /opt/workspace/api-wltech
sudo cp deploy/nginx/api-wltech.conf /etc/nginx/sites-available/api-wltech
sudo nginx -t && sudo systemctl reload nginx
```

Confirme que os caminhos SSL batem com o domínio:

```bash
sudo ls /etc/letsencrypt/live/
```

### 8.6 Firewall definitivo

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw delete allow 13333/tcp 2>/dev/null || true
sudo ufw status
```

### 8.7 Renovação automática

O Certbot instala um timer/systemd. Teste:

```bash
sudo certbot renew --dry-run
```

### 8.8 Checklist HTTPS

- [ ] DNS aponta para a VPS
- [ ] `curl http://127.0.0.1:13333/health` OK na VPS
- [ ] Nginx ativo e site habilitado
- [ ] Certificado emitido (`certbot certificates`)
- [ ] `curl https://api.wltech.tech/health` OK de fora
- [ ] Porta `13333` **não** aberta no UFW para a internet

---

## Problemas comuns

### `no such service: docker-compose.prod.yml`

Você esqueceu o `-f`:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

### `database: down` no `/health`

- Senha diferente entre `POSTGRES_PASSWORD` e `DATABASE_URL`
- Volume criado com senha antiga → recrie o volume (apaga dados):

```bash
$DC down
docker volume rm api-wltech_postgres_data
$DC up -d postgres
# rode migrations de novo
```

### Actions falha: `Directory /opt/api-wltech not found`

Clone no caminho esperado ou configure `APP_DIR` / symlink (Parte 4.5).

### Actions falha no `docker pull`

- Configure `VPS_GHCR_TOKEN` com `read:packages`
- Ou torne o pacote GHCR público
- Faça login manual na VPS: `docker login ghcr.io`

### Actions falha: `Missing .env.production`

Crie o arquivo na VPS: `cp .env.production.example .env.production`

### Migrations pendentes após deploy

```bash
git pull
# rode o comando de migrate da Parte 3.2
$DC restart api
```

### Certbot / Nginx: `Connection refused` no proxy

A API precisa estar up em localhost:

```bash
curl http://127.0.0.1:13333/health
docker compose -f docker-compose.prod.yml --env-file .env.production ps
```

### Certbot falha na validação HTTP-01

- DNS ainda não aponta para a VPS (`dig +short api.wltech.tech`)
- Portas `80`/`443` bloqueadas no UFW ou no painel da Hostinger
- Site default do Nginx ainda ativo e capturando a porta 80

---

## Referência rápida — arquivos importantes

| Arquivo | Função |
|---------|--------|
| [`docker-compose.prod.yml`](../docker-compose.prod.yml) | Stack produção (API + Postgres) |
| [`.env.production`](../.env.production.example) | Segredos da VPS (não versionar) |
| [`deploy/nginx/api-wltech.conf`](../deploy/nginx/api-wltech.conf) | Reverse proxy Nginx + HTTPS |
| [`scripts/deploy.sh`](../scripts/deploy.sh) | Script usado pelo GitHub Actions |
| [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) | Pipeline CI/CD |

---

## Checklist final

**VPS:**
- [ ] Docker funcionando
- [ ] Repo clonado
- [ ] `.env.production` configurado
- [ ] Postgres up + migrations aplicadas
- [ ] API responde em `http://127.0.0.1:13333/health`
- [ ] Nginx + Certbot (Parte 8) e `https://api.wltech.tech/health`
- [ ] Portas `80`/`443` abertas; `13333` **não** pública

**GitHub:**
- [ ] Secrets configurados
- [ ] Push na `main` com arquivos de deploy
- [ ] Workflow **Deploy to Production** verde
