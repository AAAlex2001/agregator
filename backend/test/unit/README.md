# Unit-тесты

Быстрые, без БД — на моках. Проверяют логику use case'ов и хелперов.

## Запуск

Из папки `backend/` внутри контейнера бэкенда или локально с установленными `requirements.txt`:

```bash
docker compose exec backend pytest test/unit -v
```

Или локально:
```bash
cd backend
pytest test/unit -v
```

Нагрузочные тесты (`test_load_api.py`) НЕ подтягиваются в unit-прогоне — они требуют флага `--run-load`.

## Что покрывают

- `test_email_dispatcher.py` — фильтр `EmailDispatcher.can_send` по флагам уведомлений.
- `test_send_chat_message_email.py` — триггер email-уведомления чата с учётом online-статуса.
- `test_update_response_status_bidding.py` — веерная рассылка «win/lost» при выборе исполнителя.
- `test_chat_formatter.py` — форматирование превью/counterpart для списка чатов.
