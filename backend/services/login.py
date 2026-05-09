import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from models.session import Session
from models.user import User
from schemas.login import UserLogin
from utils.passwords import verify_password

SESSION_TTL_DAYS = 7
SESSION_MAX_DAYS = 14


class LoginService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def validate_contact(self, email: str | None, phone: str | None, inn: str | None) -> None:
        if not email and not phone and not inn:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Необходимо указать email, телефон или ИНН",
            )

    def validate_inn_format(self, inn: str | None) -> None:
        if not inn:
            return
        if not inn.isdigit() or len(inn) not in {10, 12}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="ИНН должен содержать 10 или 12 цифр",
            )

    async def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return await verify_password(plain_password, hashed_password)

    async def get_users_by_email(self, email: str) -> list[User]:
        query = select(User).where(User.email == email)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_users_by_phone(self, phone: str) -> list[User]:
        query = select(User).where(User.phone == phone)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_users_by_inn(self, inn: str) -> list[User]:
        query = select(User).where(User.inn == inn)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def authenticate_user(self, data: UserLogin) -> User:
        self.validate_contact(data.email, data.phone, data.inn)
        self.validate_inn_format(data.inn)

        candidates: list[User] = []

        if data.email:
            candidates = await self.get_users_by_email(data.email)
        elif data.inn:
            candidates = await self.get_users_by_inn(data.inn)
        elif data.phone:
            candidates = await self.get_users_by_phone(data.phone)

        if not candidates:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )

        matched_users: list[User] = []
        for candidate in candidates:
            if await self.verify_password(data.password, candidate.password):
                matched_users.append(candidate)

        if not matched_users:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный пароль",
            )

        if data.role is not None:
            matched_users = [u for u in matched_users if u.role == data.role]
            if not matched_users:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Под этими данными нет аккаунта с указанной ролью",
                )

        if len(matched_users) > 1:
            available = sorted({u.role.value for u in matched_users})
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "code": "role_choice_required",
                    "message": "Выберите роль для входа",
                    "available_roles": available,
                },
            )

        user = matched_users[0]
        if not user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "code": "email_not_verified",
                    "message": "Подтвердите почту — код был отправлен при регистрации",
                    "email": user.email,
                    "role": user.role.value,
                },
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

    async def refresh_session(self, session_id: str | None) -> Session:
        if not session_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Необходима авторизация",
            )
        result = await self.db.execute(
            select(Session)
            .options(selectinload(Session.user))
            .where(Session.session_id == session_id)
        )
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

    async def get_user_by_id(self, user_id: int) -> User:
        user = (
            await self.db.execute(select(User).where(User.id == user_id))
        ).scalars().first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Сессия истекла",
            )
        return user

    async def list_other_role_users_by_email(self, email: str, exclude_user_id: int) -> list[User]:
        if not email:
            return []
        query = select(User).where(User.email == email, User.id != exclude_user_id)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def switch_role(
        self,
        current_user_id: int,
        target_role,
        password: str,
        current_session_id: str | None,
    ) -> Session:
        current_user = await self.get_user_by_id(current_user_id)
        if not current_user.email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Переключение ролей доступно только для аккаунтов с привязанным email",
            )
        if target_role == current_user.role:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Вы уже в этой роли",
            )

        target = (
            await self.db.execute(
                select(User).where(
                    User.email == current_user.email,
                    User.role == target_role,
                )
            )
        ).scalars().first()
        if target is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Аккаунт с такой ролью не найден на этом email",
            )

        if not await self.verify_password(password, target.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный пароль",
            )

        if not target.email_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "code": "email_not_verified",
                    "message": "Подтвердите почту для этой роли",
                    "email": target.email,
                    "role": target.role.value,
                },
            )

        await self.logout_session(current_session_id)
        return await self.create_session(target.id)
