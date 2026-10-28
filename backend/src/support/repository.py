from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from src.support.models import Ticket


class TicketRepository:
    """Читает и записывает обращения в поддержку."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def get_for_user(self, ticket_id: int, user_id: int) -> Ticket | None:
        """Возвращает обращение пользователя вместе с перепиской или None."""
        query = select(Ticket).where(Ticket.id == ticket_id, Ticket.user_id == user_id)
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def list_for_user(self, user_id: int, skip: int, limit: int) -> list[Ticket]:
        """Возвращает обращения пользователя: недавно изменённые первыми."""
        query = (
            select(Ticket)
            .where(Ticket.user_id == user_id)
            .order_by(Ticket.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)

        return list(result.scalars())

    async def next_id(self) -> int:
        """Берёт id для нового обращения заранее: по нему строятся номер и папка для файлов."""
        result = await self.db.execute(text("SELECT nextval('support_tickets_id_seq')"))

        return result.scalar_one()

    async def add(self, ticket: Ticket) -> None:
        """Сохраняет новое обращение вместе с первым сообщением в базе."""
        self.db.add(ticket)
        await self.db.flush()

    async def save(self) -> None:
        """Сохраняет изменения обращений в базе."""
        await self.db.flush()
