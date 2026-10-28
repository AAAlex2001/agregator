# Архитектура бэкенда (src)

Новый код бэкенда живёт в `backend/src`. Старый код (`app/`, `models/`, `services/`, `routes/`) переписывается сюда фича за фичей и потом удаляется. Код в `src` никогда не импортирует старый код.

Главная цель — код, который начинающий разработчик читает сверху вниз без прыжков по файлам: простые классы, понятные имена, никаких хитростей.

## 1. Фичи и лестница фич

```
src/
  core/           общая техника: настройки, база, ошибки, клиенты Telegram и ИИ
  accounts/       аккаунты пользователей (таблица accounts)
  auth/           кто вошёл: сессии и токен админки
  notifications/  уведомления в личном кабинете
  poster/         публикации
  support/        обращения в поддержку
  tests/          тесты на настоящей базе
  worker.py       фоновые задачи
```

Фичи стоят лесенкой. Фича импортирует только тех, кто ниже:

```
core ← accounts ← (auth, notifications) ← (poster, support) ← tests
```

Обратно — никогда. Если нижней фиче вдруг «нужно» что-то от верхней, смотри раздел 6.

## 2. Устройство подфичи

Большая фича делится на подфичи, маленькая (support) сама является подфичей. Внутри всегда одни и те же файлы:

```
poster/reactions/
  routes.py          адреса API: принять запрос → вызвать один сценарий → вернуть ответ
  dependencies.py    сборка сценариев: get_<действие>_usecase
  schemas.py         что приходит (<Действие>Request) и что уходит (<Что>Response)
  models.py          таблицы
  repository.py      класс <Что>Repository: простые запросы к своим таблицам
  exceptions.py      ошибки подфичи
  usecases/
    like_post.py     класс LikePostUseCase с методом execute
    unlike_post.py
    count_view.py
```

По необходимости добавляются:

- `internal_routes.py` — адреса админки (за токеном `X-Internal-Token`);
- `tasks.py` — фоновые задачи для worker;
- помощник с понятным именем, если он нужен нескольким сценариям: `storage.py`, `publisher.py`, `prompt.py`, `checks.py`.

Папок `services/`, файлов `events.py`, `subscribers.py`, `utils.py`, `helpers.py` нет.

## 3. Путь запроса

```
routes → dependencies → UseCase.execute() → Repository → база
```

Пример целиком — лайк поста.

Роут только принимает запрос и вызывает один сценарий:

```python
@router.post("/{post_id}/like", response_model=LikesResponse)
async def like_post(
    post_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[LikePostUseCase, Depends(get_like_post_usecase)],
) -> LikesResponse:
    """Ставит лайк посту."""
    return await usecase.execute(user=user, post_id=post_id)
```

Зависимость собирает сценарий из репозиториев:

```python
def get_like_post_usecase(db: Annotated[AsyncSession, Depends(get_db)]) -> LikePostUseCase:
    """Собирает сценарий лайка."""
    notify = NotifyPostActivityUseCase(NotificationRepository(db), AccountRepository(db))

    return LikePostUseCase(ReactionRepository(db), PostRepository(db), notify)
```

Сценарий читается как список шагов:

```python
async def execute(self, *, user: Account, post_id: int) -> LikesResponse:
    """Ставит лайк, прибавляет счётчик и уведомляет автора. Повторный лайк ничего не меняет."""
    post = await self.posts.get_published(post_id)

    if post is None:
        raise PostNotFoundError()

    if not await self.reactions.like(user.id, post.id):
        return LikesResponse(likes_count=post.likes_count, liked=True)

    likes_count = await self.posts.change_likes_count(post.id, 1)
    await self.notify.execute(recipient_id=post.author_id, actor=user, kind="like", post_id=post.id)

    return LikesResponse(likes_count=likes_count, liked=True)
```

Репозиторий делает простой запрос:

```python
async def like(self, user_id: int, post_id: int) -> bool:
    """Ставит лайк. Возвращает True, если лайка раньше не было."""
    query = (
        insert(PostLike)
        .values(user_id=user_id, post_id=post_id)
        .on_conflict_do_nothing()
        .returning(PostLike.post_id)
    )
    result = await self.db.execute(query)

    return result.scalar_one_or_none() is not None
```

## 4. Правила по файлам

**routes.py**
- Каждый роут вызывает ровно один сценарий и возвращает его результат. Ни запросов в базу, ни проверок, ни `try`.
- Зависимости через `Annotated[...]`, у роута `response_model`.
- Тело запроса — параметр `data`. Форма с файлами — `data: Annotated[XRequest, Form()]`, файлы лежат внутри схемы.
- Адрес только для вошедших, но пользователь сценарию не нужен — `dependencies=[Depends(require_user)]` в декораторе.

**dependencies.py**
- Одна функция `get_<действие>_usecase` на сценарий: создаёт репозитории с сессией запроса и отдаёт сценарий.
- «Кто вошёл» берётся из `src.auth.sessions.dependencies`: `require_user` (только вошедшие) и `get_current_user` (гостю `None`).

**schemas.py**
- Вход — `<Действие>Request`, выход — `<Что>Response`.
- Если поля ответа не совпадают с моделью один в один — метод `from_<модель>`, в котором все поля перечислены явно. Без `**другая_схема.model_dump()`.

**models.py**
- Только таблицы. Имена таблиц, колонок и типов в базе — как в существующей базе.
- Время по умолчанию — `utc_now` из `src.core.base`.
- Связи между таблицами всегда `lazy="selectin"`: связанные данные подгружаются сразу, в асинхронном коде нет ловушек. Связь, которую мы не меняем через неё саму, — `viewonly=True`.

**repository.py**
- Один класс на таблицу или пару тесно связанных таблиц (`PostRepository`, `MediaRepository`).
- Запрос всегда так: `query = select(...)`, `result = await self.db.execute(query)`, затем `result.scalar_one_or_none()` или `list(result.scalars())`.
- `add`, `save`, `delete` делают только `flush`. Коммита в репозитории нет никогда.
- Повторы отсекает база: `insert(...).on_conflict_do_nothing()`.
- Счётчики меняются прямо в базе: `update(Post).values(likes_count=Post.likes_count + 1)`.
- Никаких блокировок (`with_for_update`).

**exceptions.py**
- Наследники `AppError` с `status_code` и `message`. Обработчик превращает их в ответ `{"detail": "текст"}`.

**usecases/<действие>.py**
- Один класс `<Действие>UseCase`. В `__init__` — репозитории и помощники, в `execute(self, *, ...)` — работа.
- Звёздочка в `execute` обязательна: аргументы передаются только по имени.
- Тело — шаги сверху вниз: достать → если не так, ошибка → изменить → сохранить → вернуть Response.
- Сценарий может вызвать сценарий нижней подфичи (`UpdatePostUseCase` вызывает `EditSentMessagesUseCase`).

**tasks.py**
- Обычная функция: открыть `async with SessionLocal() as db`, выполнить сценарий, `await db.commit()`.

## 5. Владельцы таблиц

У каждой таблицы один репозиторий-владелец. Кому нужна чужая таблица, тот берёт её репозиторий, а не пишет свой запрос.

- Аккаунты — только `AccountRepository` (`src/accounts`). Авторов постов, комментариев, жалоб достаёт он.
- Счётчики поста меняет `PostRepository`, даже если лайк ставят в `reactions`.

Внутри одной фичи можно присоединять чужие таблицы в запросе (лента читает посты вместе с лайками и подписками), но записывает в таблицу только её владелец.

## 6. Лестница внутри фичи и «что делать, если нужно наверх»

Лестница Постера:

```
channels ← delivery ← posts ← (reactions, follows, comments, templates, ai) ← (feed, reports)
```

- Подфича импортирует подфичи ниже себя.
- Чужие `models.py` можно брать всем — для связей между таблицами.
- Подфичи одной ступени друг друга не импортируют.

Если нижней подфиче понадобилось что-то от верхней:

1. Обычно это нужно не ей, а экрану. Собирает верхняя: лайки и подписки к посту добавляет `feed`, а не `posts`.
2. Если это действие «сделал X → поменяй Y», его выполняет верхний сценарий: модерация поста живёт в `reports` и сама закрывает жалобы.
3. Если это и правда часть основы — переносим вниз и осознанно меняем лестницу.

Событий, подписчиков и обратных импортов нет.

## 7. Транзакции

- В запросе: `get_db` даёт одну сессию на запрос. Все репозитории сценария работают в ней. Коммит — один, после успешного ответа. Ошибка — откатывается всё.
- В worker: одна сессия на задачу, `commit` в конце. Отправка в Telegram — коммит после каждой доставки, чтобы упавшая не отправила остальные повторно.
- База откатывается, а внешний мир — нет: отправленное сообщение и удалённый файл не вернуть. Поэтому такие действия в сценарии идут последними, после всех проверок.

## 8. Worker

`src/worker.py` — отдельный процесс, который по расписанию делает работу, не привязанную к запросам: выпускает отложенные посты, отправляет их в каналы, удаляет по таймеру, убирает брошенные файлы.

```python
SCHEDULE = [
    (publish_scheduled_posts, 3),
    (send_ready_posts, 3),
    (delete_expired_messages, 60),
    (delete_unused_media, 3600),
]
```

Запуск — `python -m src.worker`. Worker всегда один: два отправили бы пост дважды. Сайт можно запускать в любом числе копий.

## 9. Код

- У каждой функции, метода и класса — подпись в одну строку по-русски: что делает («Возвращает пост по id или None.»).
- Имена по смыслу: `query`, `result`, `post`, `chosen_files`. Никогда `stmt`, `res`, `obj`, `tmp`, `item`, `due`.
- Строка — не длиннее 110 символов. `if` — всегда блоком. Вложенность — не глубже трёх.
- Без дженериков, `**kwargs: Any`, метапрограммирования, кешей, самописных контекстных менеджеров.
- Без лишней обработки: ловим только ту ошибку, с которой есть что делать (`suppress(TelegramError)`, если сообщение уже удалено).
- Только то, что вызывает сайт или бот. Ничего «на будущее».
- `ruff format` не запускать — только `ruff check`.

## 10. API и база не меняются

Фронт и данные уже живут. При переписывании сохраняются:

- адреса, параметры, поля запросов и ответов;
- таблицы, колонки и значения в базе;
- тексты ошибок, по которым фронт принимает решения.

Внутри — классы, шаги, имена — пишется заново. Схему базы меняет только новая миграция.

## 11. Проверки

Из папки `backend`:

```
python -m ruff check src
python -m mypy src --follow-imports=silent
python scripts/check_src_imports.py
python -m pytest src/tests
```

`check_src_imports.py` следит за правилами из этого документа: лестницы фич и подфич, владельцы таблиц, подписи у функций и классов, звёздочка в `execute`, длина строк.

Тестам нужна отдельная база. Адрес — в `backend/.env.test` (файл не попадает в git):

```
SRC_TEST_DATABASE_URL=postgresql+asyncpg://<пользователь>:<пароль>@localhost:5432/<имя>_test
```

Имя базы обязано заканчиваться на `_test`. Тесты сами создают базу, накатывают миграции и очищают данные.

## 12. Пока не сделано

- `src` ещё не подключён к `main.py`: сайт работает на старом коде.
- Список уведомлений на сайте и отметка «прочитано» — в старом коде.
- Перед переключением Постера нужна миграция: доставки со статусом `sending` → `pending`.
