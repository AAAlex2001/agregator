import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.session import Session
from models.user import User, UserRole
from schemas.login import UserLogin
from utils.passwords import verify_password

SESSION_TTL_DAYS = 7
SESSION_MAX_DAYS = 14


class LoginService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return await verify_password(plain_password, hashed_password)

    async def get_user_by_email_and_role(self, email: str, role: UserRole) -> User | None:
        query = select(User).where(User.email == email, User.role == role)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_user_by_phone_and_role(self, phone: str, role: UserRole) -> User | None:
        query = select(User).where(User.phone == phone, User.role == role)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def authenticate_user(self, data: UserLogin) -> User:
        user = None
        if data.email:
            user = await self.get_user_by_email_and_role(data.email, data.role)
        elif data.phone:
            user = await self.get_user_by_phone_and_role(data.phone, data.role)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )

        if not await self.verify_password(data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный пароль",
            )
        return user

    async def create_session(self, user_id: int) -> Session:
        now = datetime.now(timezone.utc)
        session = Session(
            session_id=str(uuid.uuid4()),
            user_id=user_id,
            expires_at=now + timedelta(days=SESSION_TTL_DAYS),
            max_expires_at=now + timedelta(days=SESSION_MAX_DAYS),
        )
        self.db.add(session)
        await self.db.flush()
        return session

    async def refresh_session(self, session_id: str) -> Session:
        result = await self.db.execute(select(Session).where(Session.session_id == session_id))
        session = result.scalar_one_or_none()
        if not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Сессия не найдена",
            )

        now = datetime.now(timezone.utc)
        if now > session.max_expires_at:
            await self.db.execute(delete(Session).where(Session.id == session.id))
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Сессия истекла",
            )

        if session.expires_at < now:
            next_expires = now + timedelta(days=SESSION_TTL_DAYS)
            session.expires_at = min(next_expires, session.max_expires_at)
        return session

    async def logout_session(self, session_id: str | None) -> None:
        if session_id:
            await self.db.execute(delete(Session).where(Session.session_id == session_id))
