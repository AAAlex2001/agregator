# Load tests

Набор покрывает:

1. регистрацию с темпом 10 пользователей в секунду
2. авторизацию с темпом 10 пользователей в секунду
3. создание заявок с темпом 10 заявок в секунду
4. отклики на заявки с темпом 10 откликов в секунду
5. изменение профиля с темпом 10 изменений в секунду
6. чаты с темпом 10 пользовательских сценариев в секунду
7. изменение заявки заказчиком и изменение состояния проекта экспертом с темпом 10 в секунду на каждую сторону

По умолчанию тесты направлены в `https://plus-resurs.com/api`.

Дефолтный прогон теперь короче и безопаснее для прод-сервера: `10 rps`, `5 секунд`, максимум `10` одновременных запросов, timeout запроса `10 секунд`.

Тесты с откликами, чатами и сценарием эксперта требуют доступ к БД, потому что баланс экспертов поднимается напрямую в `users.balance`.

Запуск:

```powershell
pytest test --run-load
```

Запуск с параметрами:

```powershell
pytest test --run-load --load-base-url https://plus-resurs.com --load-db-url postgresql+asyncpg://user:pass@host:5432/db --load-rate 10 --load-duration 10
```

Если запуск идёт внутри Docker-контейнера backend, после изменения зависимостей нужно пересобрать образ:

```bash
docker compose build backend
docker compose up -d backend
docker compose exec backend sh -lc "cd /app && python -m pytest test --run-load"
```

Полезные опции:

```text
--load-base-url              базовый домен, можно передавать без /api
--load-db-url                строка подключения к PostgreSQL
--load-rate                  интенсивность в запросах или сценариях в секунду
--load-duration              длительность каждого сценария в секундах
--load-timeout               timeout одного HTTP-запроса
--load-max-concurrency       лимит одновременно выполняемых запросов
--load-expert-balance-rub    стартовый баланс эксперта в рублях
--load-order-budget-rub      бюджет тестовой заявки в рублях
--load-max-failures          допустимое число ошибок в сценарии
--load-disable-ssl-verify    отключить проверку сертификата
```

Переменные окружения:

```text
LOAD_BASE_URL
LOAD_DB_URL
DATABASE_URL
```
