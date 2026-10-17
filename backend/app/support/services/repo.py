"""Запросы к обращениям в поддержку. Коммит делает сессия запроса."""

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.support.models import SupportTicket


class SupportRepository:
    """Доступ к таблицам support_tickets и support_ticket_messages."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_for_user(self, ticket_id: int, user_id: int) -> SupportTicket | None:
        """Обращение пользователя вместе с перепиской или None."""

        stmt = (
            select(SupportTicket)
            .options(selectinload(SupportTicket.messages))
            .where(SupportTicket.id == ticket_id, SupportTicket.user_id == user_id)
        )

        return await self.db.scalar(stmt)

    async def list_for_user(self, user_id: int, skip: int, limit: int) -> list[SupportTicket]:
        """Обращения пользователя, недавно изменённые первыми."""

        stmt = (
            select(SupportTicket)
            .where(SupportTicket.user_id == user_id)
            .order_by(SupportTicket.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        tickets = await self.db.scalars(stmt)

        return list(tickets)

    async def reserve_id(self) -> int:
        """Id будущего обращения: по нему сразу выдаются номер и папка для файлов."""

        return await self.db.scalar(text("SELECT nextval('support_tickets_id_seq')"))

    async def add(self, ticket: SupportTicket) -> None:
        """Записать новое обращение вместе с первым сообщением."""

        self.db.add(ticket)
        await self.db.flush()

    async def save(self) -> None:
        """Записать изменения обращения."""

        await self.db.flush()
