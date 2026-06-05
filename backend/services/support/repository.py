"Repository: доступ к БД для support."
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.support_ticket import SupportTicket, SupportTicketMessage
from utils.pagination import paginate_with_has_more


class SupportRepository:
    "Все SQL-запросы по тикетам поддержки. Никакой бизнес-логики."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, ticket_id: int) -> SupportTicket | None:
        "Возвращает сущность по идентификатору."
        query = (
            select(SupportTicket)
            .options(selectinload(SupportTicket.messages))
            .where(SupportTicket.id == ticket_id)
        )
        return (await self.db.execute(query)).scalars().first()

    async def get_for_user(self, ticket_id: int, user_id: int) -> SupportTicket | None:
        "Возвращает запрошенную сущность."
        query = (
            select(SupportTicket)
            .options(selectinload(SupportTicket.messages))
            .where(SupportTicket.id == ticket_id, SupportTicket.user_id == user_id)
        )
        return (await self.db.execute(query)).scalars().first()

    async def list_for_user(
        self, user_id: int, skip: int, limit: int
    ) -> tuple[list[SupportTicket], bool]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        list_query = (
            select(SupportTicket)
            .where(SupportTicket.user_id == user_id)
            .order_by(SupportTicket.updated_at.desc())
        )
        return await paginate_with_has_more(self.db, list_query, skip, limit)

    async def latest_number_int(self) -> int:
        "Публичный метод сервисного слоя."
        query = select(func.max(SupportTicket.id))
        return (await self.db.execute(query)).scalar() or 0

    async def add(self, entity: SupportTicket) -> None:
        "Добавляет сущность в сессию."
        self.db.add(entity)

    async def add_message(self, message: SupportTicketMessage) -> None:
        "Добавляет связанные данные."
        self.db.add(message)

    async def flush(self) -> None:
        "Сбрасывает накопленные изменения в БД."
        await self.db.flush()
