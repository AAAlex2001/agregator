#!/usr/bin/env bash
# Деплой production на сервере. Запускается из CI или вручную.
# Предполагается, что cwd = корень репозитория и git уже синхронизирован
# с origin/main (workflow делает git fetch && git reset --hard перед вызовом).

set -euo pipefail

echo "==> alembic: применить миграции (если есть новые)"
docker compose run --rm backend alembic upgrade head

echo "==> docker: rebuild + restart"
docker compose up -d --build --remove-orphans

echo "==> nginx: restart чтобы подхватить новые IP контейнеров"
docker compose restart nginx

echo "==> docker: prune dangling images"
docker image prune -f

echo "==> done"
docker compose ps
