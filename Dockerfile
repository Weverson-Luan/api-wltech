# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS dev
COPY tsconfig.json tsconfig.node.json drizzle.config.ts ./
COPY drizzle ./drizzle
COPY src ./src

EXPOSE 3333

CMD ["pnpm", "dev"]

FROM deps AS build
COPY tsconfig.json tsconfig.node.json drizzle.config.ts ./
COPY drizzle ./drizzle
COPY src ./src
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production

RUN apk add --no-cache wget \
  && addgroup -S app && adduser -S app -G app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist

USER app

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT:-3333}/health" || exit 1

CMD ["node", "dist/server.js"]
