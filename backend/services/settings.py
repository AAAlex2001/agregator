from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.user import User
from schemas.settings import EmailPreferences, UserSettingsResponse
from utils.passwords import hash_password


AVATAR_ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
AVATAR_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png"}
AVATAR_MAX_SIZE = 5 * 1024 * 1024
UPLOAD_CHUNK_SIZE = 1024 * 1024


class SettingsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_or_404(self, user_id: int) -> User:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        return user

    async def ensure_unique_phone(self, phone: str, user_id: int) -> None:
        existing = await self.db.execute(
            select(User).where(User.phone == phone, User.id != user_id)
        )
        if existing.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот номер телефона уже используется",
            )

    async def ensure_unique_email(self, email: str, user_id: int) -> None:
        existing = await self.db.execute(
            select(User).where(User.email == email, User.id != user_id)
        )
        if existing.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот email уже используется",
            )

    async def ensure_unique_inn(self, inn: str, user_id: int) -> None:
        existing = await self.db.execute(
            select(User).where(User.inn == inn, User.id != user_id)
        )
        if existing.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот ИНН уже используется",
            )

    async def update_password(self, user_id: int, new_password: str) -> None:
        user = await self.get_user_or_404(user_id)
        user.password = await hash_password(new_password)
        await self.db.flush()

    async def upload_avatar(self, user_id: int, file: UploadFile) -> User:
        user = await self.get_user_or_404(user_id)
        filename = file.filename or ""
        extension = Path(filename).suffix.lower()
        content_type = (file.content_type or "").lower()

        if extension not in AVATAR_ALLOWED_EXTENSIONS or (content_type and content_type not in AVATAR_ALLOWED_CONTENT_TYPES):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Можно загрузить только JPG или PNG размером до 5 МБ",
            )

        upload_dir = Path(__file__).resolve().parents[1] / "uploads" / "avatars" / str(user_id)
        upload_dir.mkdir(parents=True, exist_ok=True)

        generated_name = f"{uuid4().hex}{extension}"
        file_path = upload_dir / generated_name
        previous_avatar_path: Path | None = None

        if user.avatar_url and user.avatar_url.startswith(f"/uploads/avatars/{user_id}/"):
            previous_avatar_path = Path(__file__).resolve().parents[1] / user.avatar_url.lstrip("/")

        total_size = 0

        try:
            async with aiofiles.open(file_path, "wb") as output:
                while chunk := await file.read(UPLOAD_CHUNK_SIZE):
                    total_size += len(chunk)

                    if total_size > AVATAR_MAX_SIZE:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Размер фото не должен превышать 5 МБ",
                        )

                    await output.write(chunk)
        except HTTPException:
            file_path.unlink(missing_ok=True)
            raise
        finally:
            await file.close()

        user.avatar_url = f"/uploads/avatars/{user_id}/{generated_name}"
        await self.db.flush()

        if previous_avatar_path and previous_avatar_path.exists() and previous_avatar_path != file_path:
            previous_avatar_path.unlink(missing_ok=True)

        return user

    async def update_email_preferences(self, user_id: int, patch: dict) -> User:
        user = await self.get_user_or_404(user_id)
        for field, value in patch.items():
            setattr(user, field, value)
        await self.db.flush()
        return user

    @staticmethod
    def to_response(user: User) -> UserSettingsResponse:
        return UserSettingsResponse(
            id=user.id,
            inn=user.inn,
            company_data=user.company_data if isinstance(user.company_data, dict) else None,
            email=user.email,
            email_verified=bool(user.email_verified),
            phone=user.phone,
            avatar_url=user.avatar_url,
            first_name=user.first_name,
            last_name=user.last_name,
            rating=float(user.rating) if user.rating is not None else None,
            review_count=user.review_count or 0,
            role=user.role.value,
            email_preferences=EmailPreferences.model_validate(user),
        )
