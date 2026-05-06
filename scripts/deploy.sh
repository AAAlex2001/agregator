#!/usr/bin/env bash
# Деплой production на сервере. Запускается из CI или вручную.
# Предполагается, что cwd = корень репозитория.

set -euo pipefail

echo "==> git: stash local changes (если что-то редактировалось вручную)"
git stash push --include-untracked --keep-index --quiet || true

echo "==> git: pull origin main"
git fetch --all --prune
git reset --hard origin/main

echo "==> alembic: применить миграции (если есть новые)"
docker compose run --rm backend alembic upgrade head

echo "==> docker: rebuild + restart"
docker compose up -d --build --remove-orphans

echo "==> docker: prune dangling images"
docker image prune -f

echo "==> done"
docker compose ps
