#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/api-wltech}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-.env.production}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:${API_PORT:-13333}/health}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-30}"
SLEEP_SECONDS="${SLEEP_SECONDS:-2}"

cd "${APP_DIR}"

if [ -d .git ]; then
  git pull --ff-only origin main
fi

if [ ! -f "${ENV_FILE}" ]; then
  echo "Missing ${ENV_FILE} in ${APP_DIR}"
  exit 1
fi

OVERRIDE_API_IMAGE="${API_IMAGE:-}"

# shellcheck disable=SC1090
set -a
source "${ENV_FILE}"
set +a

if [ -n "${OVERRIDE_API_IMAGE}" ]; then
  API_IMAGE="${OVERRIDE_API_IMAGE}"
fi

export API_IMAGE

if [ -n "${GHCR_TOKEN:-}" ] && [ -n "${REGISTRY:-ghcr.io}" ]; then
  echo "${GHCR_TOKEN}" | docker login "${REGISTRY}" \
    --username "${GHCR_USERNAME:-github}" \
    --password-stdin
fi

PREVIOUS_IMAGE="$(docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" images -q api 2>/dev/null | head -n 1 || true)"

echo "[deploy] Pulling image ${API_IMAGE}"
docker pull "${API_IMAGE}"
API_IMAGE="${API_IMAGE}" \
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" pull postgres

echo "[deploy] Ensuring postgres is up"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d postgres

echo "[deploy] Waiting for postgres health"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d --wait postgres

echo "[deploy] Updating API"
API_IMAGE="${API_IMAGE}" \
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d api

echo "[deploy] Waiting for health check at ${HEALTH_URL}"
attempt=1
while [ "${attempt}" -le "${MAX_ATTEMPTS}" ]; do
  if curl -fsS "${HEALTH_URL}" >/dev/null; then
    echo "[deploy] Health check passed"
    docker image prune -f >/dev/null 2>&1 || true
    exit 0
  fi

  echo "[deploy] Attempt ${attempt}/${MAX_ATTEMPTS} failed, retrying..."
  attempt=$((attempt + 1))
  sleep "${SLEEP_SECONDS}"
done

echo "[deploy] Health check failed, attempting rollback"
if [ -n "${PREVIOUS_IMAGE}" ]; then
  docker tag "${PREVIOUS_IMAGE}" "${API_IMAGE}" || true
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d api || true
fi

exit 1
