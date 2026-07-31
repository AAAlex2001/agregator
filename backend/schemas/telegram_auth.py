from pydantic import BaseModel, EmailStr, Field

from models.account import UserRole


class TelegramAuthRequest(BaseModel):
    "initData из Telegram WebApp."
    init_data: str = Field(..., min_length=1)


class TelegramLinkRequest(BaseModel):
    "Привязка Telegram к аккаунту по email+паролю."
    init_data: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=1)
    role: UserRole | None = None
