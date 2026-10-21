"""Заявки в конкурсную комиссию в API."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.commission.models import ApplicationStatus


class AttestationSchema(BaseModel):
    """Аттестация кандидата: область, объект экспертизы и категория."""

    area_code: str = Field(..., max_length=8, description="Область аттестации: «Э12»")
    object_code: str = Field(..., max_length=8, description="Объект экспертизы: «КЛ/ТП»")
    category: int = Field(..., ge=1, le=3, description="Категория эксперта")


class ApplicationCreateSchema(BaseModel):
    """Заявка кандидата."""

    full_name: str = Field(..., min_length=3, max_length=255, description="ФИО")
    phone: str = Field(..., min_length=5, max_length=32, description="Телефон")
    email: EmailStr = Field(..., description="Почта для ответа комиссии")
    attestations: list[AttestationSchema] = Field(..., min_length=1, max_length=30)
    message: str | None = Field(None, max_length=2000, description="О себе и опыте")


class ApplicationSchema(BaseModel):
    """Заявка кандидата с решением комиссии."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    phone: str
    email: str
    attestations: list[AttestationSchema]
    message: str | None
    status: ApplicationStatus
    decision: str | None
    created_at: datetime
    reviewed_at: datetime | None


class ApplicationPageSchema(BaseModel):
    """Страница заявок и сколько их всего."""

    items: list[ApplicationSchema]
    total: int


class ReviewSchema(BaseModel):
    """Решение комиссии и комментарий кандидату."""

    status: ApplicationStatus = Field(..., description="Новый статус заявки")
    decision: str | None = Field(None, max_length=2000, description="Комментарий кандидату")
