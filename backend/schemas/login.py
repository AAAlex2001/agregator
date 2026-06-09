from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from models.user import UserRole


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


class UserResponse(BaseModel):
    "Минимальная карточка пользователя после входа."
    id: int
    role: str
    inn: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class RoleChoiceResponse(BaseModel):
    "Возвращается когда пользователь имеет несколько подходящих ролей и нужно выбрать."
    detail: str = "Выберите роль для входа"
    available_roles: list[UserRole]


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
