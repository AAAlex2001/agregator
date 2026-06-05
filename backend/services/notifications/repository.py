"Repository: доступ к БД для notifications."
from datetime import datetime

from sqlalchemy import delete as sa_delete
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from models.notification import Notification
from models.user import User
from utils.pagination import paginate_with_has_more


class NotificationRepository:
    "Все обращения к БД по уведомлениям и счётчику непрочитанных у пользователя."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add(self, entity: Notification) -> None:
        "Добавляет сущность в сессию."
        self.db.add(entity)

    async def flush(self) -> None:
        "Сбрасывает накопленные изменения в БД."
        await self.db.flush()

    async def find_by_id_for_user(self, notification_id: int, user_id: int) -> Notification | None:
        "Ищет сущность по заданным параметрам."
        query = select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == user_id,
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_for_user(
        self, user_id: int, limit: int, offset: int
    ) -> tuple[list[Notification], bool]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        query = (
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc(), Notification.id.desc())
        )
        return await paginate_with_has_more(self.db, query, offset, limit)

    async def get_unread_count(self, user_id: int) -> int:
        "Возвращает запрошенную сущность."
        query = select(User.notification_unread_count).where(User.id == user_id)
        return int((await self.db.execute(query)).scalar_one_or_none() or 0)

    async def increment_unread(self, user_id: int) -> None:
        "Публичный метод сервисного слоя."
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(notification_unread_count=User.notification_unread_count + 1)
        )

    async def decrement_unread(self, user_id: int, amount: int = 1) -> None:
        "Публичный метод сервисного слоя."
        if amount <= 0:
            return
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(
                notification_unread_count=func.greatest(
                    User.notification_unread_count - amount, 0
                )
            )
        )

    async def mark_one_read(
        self, notification_id: int, user_id: int, read_at: datetime
    ) -> bool:
        "Возвращает True, если запись была изменена (была непрочитанной)."
        result = await self.db.execute(
            update(Notification)
            .where(
                Notification.id == notification_id,
                Notification.user_id == user_id,
                Notification.is_read == False,  # noqa: E712
            )
            .values(is_read=True, read_at=read_at)
            .returning(Notification.id)
        )
        return result.scalar_one_or_none() is not None

    async def mark_all_read(self, user_id: int, read_at: datetime) -> int:
        "Возвращает количество переведённых в прочитанные строк."
        result = await self.db.execute(
            update(Notification)
            .where(
                Notification.user_id == user_id,
                Notification.is_read == False,  # noqa: E712
            )
            .values(is_read=True, read_at=read_at)
        )
        return int(result.rowcount or 0)  # type: ignore[attr-defined]

    async def delete_all(self, user_id: int) -> int:
        "Удаляет все уведомления пользователя; возвращает число удалённых строк."
        result = await self.db.execute(
            sa_delete(Notification).where(Notification.user_id == user_id)
        )
        return int(result.rowcount or 0)  # type: ignore[attr-defined]

    async def reset_unread(self, user_id: int) -> None:
        "Сбрасывает состояние к значению по умолчанию."
        await self.db.execute(
            update(User).where(User.id == user_id).values(notification_unread_count=0)
        )

    async def delete(self, notification_id: int, user_id: int) -> bool | None:
        "True/False = была ли строка непрочитанной до удаления; None = строки нет."
        result = await self.db.execute(
            sa_delete(Notification)
            .where(
                Notification.id == notification_id,
                Notification.user_id == user_id,
            )
            .returning(Notification.is_read)
        )
        row = result.first()
        if row is None:
            return None
        return bool(row[0])
