from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.chat import ExpertRoomBan, ExpertRoomMessage
from models.session import Session
from models.user import User


class ExpertRoomRepository:
    "Все обращения к БД по общему чату экспертов."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_active_session(self, session_id: str) -> Session | None:
        session = (
            await self.db.execute(
                select(Session).where(Session.session_id == session_id)
            )
        ).scalars().first()
        if session is None:
            return None
        now = datetime.now(timezone.utc)
        if now > session.max_expires_at or now > session.expires_at:
            return None
        return session

    async def find_user(self, user_id: int) -> User | None:
        return (
            await self.db.execute(select(User).where(User.id == user_id))
        ).scalars().first()

    async def is_banned(self, user_id: int) -> bool:
        ban_id = (
            await self.db.execute(
                select(ExpertRoomBan.id).where(ExpertRoomBan.user_id == user_id)
            )
        ).scalar_one_or_none()
        return ban_id is not None

    async def find_ban(self, user_id: int) -> ExpertRoomBan | None:
        return (
            await self.db.execute(
                select(ExpertRoomBan).where(ExpertRoomBan.user_id == user_id)
            )
        ).scalars().first()

    async def list_messages(
        self, before_id: int | None, limit: int
    ) -> list[ExpertRoomMessage]:
        query = (
            select(ExpertRoomMessage)
            .options(selectinload(ExpertRoomMessage.sender))
            .order_by(ExpertRoomMessage.id.desc())
            .limit(limit + 1)
        )
        if before_id is not None:
            query = query.where(ExpertRoomMessage.id < before_id)
        return list((await self.db.execute(query)).scalars().all())

    async def add_message(self, message: ExpertRoomMessage) -> None:
        self.db.add(message)
        await self.db.flush()
