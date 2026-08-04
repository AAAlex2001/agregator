from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from models.account import UserRole


class UserLogin(BaseModel):
    "Payload входа: один из идентификаторов (email/phone/inn) + пароль и опциональная роль."
    email: EmailStr | None = Field(None, description="Почта пользователя")
    phone: str | None = Field(None, description="Номер телефона пользователя", min_length=10, max_length=20)
    inn: str | None = Field(None, description="ИНН пользователя")
    password: str = Field(..., description="Пароль пользователя", min_length=1)
    role: UserRole | None = Field(
        None,
        description="Если на одни данные зарегистрировано несколько ролей — указать какую использовать",
    )


class LoginUserResponse(BaseModel):
    "Минимальная карточка пользователя после входа."
    id: int
    role: str
    inn: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AvailableRoleItem(BaseModel):
    "Одна из доступных ролей пользователя с признаком подтверждения email."
    role: UserRole
    email_verified: bool


class AvailableRolesResponse(BaseModel):
    "Список ролей, доступных пользователю для входа."
    roles: list[AvailableRoleItem]


class SwitchRoleRequest(BaseModel):
    "Payload смены активной роли с подтверждением паролем."
    role: UserRole
    password: str = Field(..., min_length=6)
