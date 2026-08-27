"""DTO заявок с публичных страниц сайта."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from services.directions.registry import DIRECTIONS


class LeadCreate(BaseModel):
    "Заявка, отправленная посетителем из формы в статье."
    direction: str = Field(..., max_length=50)
    name: str = Field(..., min_length=2, max_length=200)
    phone: str = Field(..., min_length=6, max_length=50)
    email: str = Field("", max_length=255)
    company: str = Field("", max_length=300)
    inn: str = Field("", max_length=20)
    region: str = Field("", max_length=200)
    work_kinds: str = Field("", max_length=1000)
    object_name: str = Field("", max_length=500)
    task: str = Field(..., min_length=5, max_length=4000)
    deadline: str = Field("", max_length=100)
    budget: str = Field("", max_length=100)
    source_url: str = Field("", max_length=500)

    @field_validator("direction")
    @classmethod
    def validate_direction(cls, value: str) -> str:
        if value not in {direction.key for direction in DIRECTIONS}:
            raise ValueError("Неизвестное направление работ")
        return value


class LeadOut(BaseModel):
    "Заявка в ответе админского API."
    model_config = ConfigDict(from_attributes=True)

    id: int
    direction: str
    name: str
    phone: str
    email: str
    company: str
    inn: str
    region: str
    work_kinds: str
    object_name: str
    task: str
    deadline: str
    budget: str
    source_url: str
    comment: str
    status: str
    created_at: datetime
    updated_at: datetime


class LeadListOut(BaseModel):
    "Список заявок для админки."
    items: list[LeadOut]
    total: int


class LeadUpdate(BaseModel):
    "Изменение статуса и заметки менеджера."
    status: str | None = None
    comment: str | None = Field(None, max_length=4000)
