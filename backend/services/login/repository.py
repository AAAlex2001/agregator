"Repository: доступ к БД для login."
import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from models.session import Session
from models.user import User, UserRole

SESSION_TTL_DAYS = 7
SESSION_MAX_DAYS = 14
SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * SESSION_MAX_DAYS


class LoginRepository:
    "Все обращения к БД для логина и работы с сессиями."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def find_user_by_id(self, user_id: int) -> User | None:
        "Ищет сущность по заданным параметрам."
        return (
            await self.db.execute(select(User).where(User.id == user_id))
        ).scalars().first()

    async def find_users_by_email(self, email: str) -> list[User]:
        "Ищет сущность по заданным параметрам."
        result = await self.db.execute(select(User).where(User.email == email))
        return list(result.scalars().all())

    async def find_users_by_phone(self, phone: str) -> list[User]:
        "Ищет сущность по заданным параметрам."
        result = await self.db.execute(select(User).where(User.phone == phone))
        return list(result.scalars().all())

    async def find_users_by_inn(self, inn: str) -> list[User]:
        "Ищет сущность по заданным параметрам."
        result = await self.db.execute(select(User).where(User.inn == inn))
        return list(result.scalars().all())

    async def find_user_by_telegram_id(self, telegram_id: int) -> User | None:
        "Ищет пользователя по привязанному Telegram ID; при нескольких ролях — последнего активного."
        return (
            await self.db.execute(
                select(User)
                .where(User.telegram_id == telegram_id)
                .order_by(User.updated_at.desc())
            )
        ).scalars().first()

    async def set_telegram_id(self, user_id: int, telegram_id: int) -> None:
        "Привязывает Telegram ко всем ролям пользователя (User-записи одного email); у другого пользователя привязка снимается."
        user = await self.find_user_by_id(user_id)
        if user is None:
            return
        owners = (
            await self.db.execute(select(User).where(User.telegram_id == telegram_id))
        ).scalars().all()
        for owner in owners:
            if owner.email is None or user.email is None or owner.email != user.email:
                owner.telegram_id = None
        if user.email:
            siblings = (
                await self.db.execute(select(User).where(User.email == user.email))
            ).scalars().all()
            for sibling in siblings:
                sibling.telegram_id = telegram_id
        else:
            user.telegram_id = telegram_id
        await self.db.flush()

    async def find_user_by_email_and_role(self, email: str, role: UserRole) -> User | None:
        "Ищет сущность по заданным параметрам."
        return (
            await self.db.execute(
                select(User).where(User.email == email, User.role == role)
            )
        ).scalars().first()

    async def list_other_role_users_by_email(self, email: str, exclude_user_id: int) -> list[User]:
        "Возвращает список сущностей с пагинацией/фильтрами."
        if not email:
            return []
        result = await self.db.execute(
            select(User).where(User.email == email, User.id != exclude_user_id)
        )
        return list(result.scalars().all())

    async def add_session(self, user_id: int) -> Session:
        "Добавляет связанные данные."
        now = datetime.now(UTC)
        session = Session(
            session_id=str(uuid.uuid4()),
            user_id=user_id,
            expires_at=now + timedelta(days=SESSION_TTL_DAYS),
            max_expires_at=now + timedelta(days=SESSION_MAX_DAYS),
        )
        self.db.add(session)
        await self.db.flush()
        return session

    async def find_session_with_user(self, session_id: str) -> Session | None:
        "Ищет сущность по заданным параметрам."
        return (
            await self.db.execute(
                select(Session)
                .options(selectinload(Session.user))
                .where(Session.session_id == session_id)
            )
        ).scalar_one_or_none()

    async def delete_session_by_id(self, session_id_pk: int) -> None:
        "Удаляет сущность."
        await self.db.execute(delete(Session).where(Session.id == session_id_pk))

    async def delete_session_by_uuid(self, session_id: str) -> None:
        "Удаляет сущность."
        await self.db.execute(delete(Session).where(Session.session_id == session_id))
