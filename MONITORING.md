# Мониторинг сервиса (Prometheus + Grafana + k6)

В проект добавлен полный мониторинг в отдельных контейнерах:

- `prometheus` - сбор метрик
- `grafana` - графики и дашборды
- `cadvisor` - метрики контейнеров Docker
- `node-exporter` - метрики хоста
- `k6` - контейнер для нагрузочных тестов
- `backend` - отдает бизнес-метрики по эндпоинтам в `/metrics`

## Что уже измеряется по API

Для каждого HTTP-эндпоинта собираются:

- общее число запросов
- успешные/неуспешные
- статус-коды
- причина неуспеха (`HTTP 4xx/5xx` и тип исключения)
- длительность запросов (гистограмма + p95)

Важно: в метриках есть `endpoint_ru` - понятные русские названия эндпоинтов.

## Быстрый запуск

1. Создайте (или дополните) файл `.env` в корне:

```env
POSTGRES_PASSWORD=your_strong_password
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=change_me_now
GRAFANA_ROOT_URL=http://176.57.215.114:3000
K6_BASE_URL=http://176.57.215.114

# Производительность backend
WEB_CONCURRENCY=2
UVICORN_TIMEOUT_KEEP_ALIVE=10
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=20
DB_POOL_TIMEOUT=30
DB_POOL_RECYCLE=1800
DB_COMMAND_TIMEOUT=30
```

2. Поднимите все контейнеры:

```bash
docker compose up -d --build
```

3. Проверьте, что API отдает метрики:

```bash
curl http://176.57.215.114:8000/metrics
```

4. Откройте сервисы:

- Grafana: `http://176.57.215.114:3000`
- Prometheus: `http://176.57.215.114:9090`

Дашборд импортируется автоматически:
`Agregator - Мониторинг сервиса (RU)`.

## Как запускать нагрузку через k6

Контейнер `k6` уже поднят вместе с системой. Запуск теста:

```bash
docker compose exec k6 k6 run /scripts/smoke.js
```

Если нужно запустить на другом домене:

```bash
docker compose exec -e BASE_URL=http://176.57.215.114 k6 k6 run /scripts/smoke.js
```

## Какие графики есть в Grafana

- запросов за сутки
- запросов за час
- успешность API (5 минут)
- p95 задержки
- успешные/неуспешные в реальном времени
- топ эндпоинтов по RPS
- таблица успех/неуспех по каждому эндпоинту
- таблица причин ошибок по эндпоинтам
- CPU хоста
- память контейнеров

## Что можно донастроить дальше

- алерты в Telegram/Email (Grafana Alerting)
- отдельный дашборд для БД (PostgreSQL exporter)
- более детальные k6-сценарии для `login/orders/payments/chat`

## Максимальная производительность: чек-лист

### 1) Рекомендуемые значения `.env` (сервер ~1 vCPU / ~2 GB RAM)

```env
WEB_CONCURRENCY=2
UVICORN_TIMEOUT_KEEP_ALIVE=10

DB_POOL_SIZE=15
DB_MAX_OVERFLOW=10
DB_POOL_TIMEOUT=30
DB_POOL_RECYCLE=1800
DB_COMMAND_TIMEOUT=30
```

### 2) Применить изменения

```bash
docker compose up -d --build postgres backend
```

### 3) Для уже существующей БД включить `pg_stat_statements` вручную

При существующем `postgres_data` init-скрипты не запускаются повторно, поэтому один раз выполните:

```bash
docker compose exec postgres psql -U agregator -d agregator_db -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"
```

### 4) Получить топ медленных SQL и точечно ускорять

```bash
docker compose exec postgres psql -U agregator -d agregator_db -c "
SELECT
  round(total_exec_time::numeric, 2) AS total_ms,
  calls,
  round((total_exec_time / calls)::numeric, 2) AS mean_ms,
  rows,
  query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
"
```

После этого оптимизация делается по факту: `EXPLAIN (ANALYZE, BUFFERS)` на самых дорогих запросах.
