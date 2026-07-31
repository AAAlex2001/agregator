"""DTO направлений: профили исполнителя и детали заявок."""
from datetime import date

from pydantic import BaseModel, Field, field_validator

from models.direction_profile import ForensicWorkplaceKind


class DirectionDocument(BaseModel):
    "Загруженный документ профиля направления: диплом, аттестат, курс."
    name: str = Field(..., min_length=1, max_length=300)
    url: str = Field(..., min_length=1, max_length=500)


class CadastralProfileInput(BaseModel):
    "Анкета кадастрового инженера."
    education: str = Field("", max_length=5000)
    registry_joined_at: date | None = None
    certificate_number: str | None = Field(None, max_length=100)
    registry_number: str | None = Field(None, max_length=100)
    equipment: str = Field("", max_length=5000)
    workplace: str = Field("", max_length=500)
    documents: list[DirectionDocument] = Field(default_factory=list)


class CadastralProfileResponse(CadastralProfileInput):
    "Анкета кадастрового инженера в ответе API."

    class Config:
        from_attributes = True


class ForensicProfileInput(BaseModel):
    "Анкета специалиста по судебной экспертизе."
    education: str = Field("", max_length=5000)
    similar_cases_experience: str = Field("", max_length=5000)
    workplace_kind: ForensicWorkplaceKind = ForensicWorkplaceKind.INDIVIDUAL
    workplace_name: str = Field("", max_length=500)
    documents: list[DirectionDocument] = Field(default_factory=list)


class ForensicProfileResponse(ForensicProfileInput):
    "Анкета судебного эксперта в ответе API."

    class Config:
        from_attributes = True


class CadastralOrderDetailsInput(BaseModel):
    "Дополнительные поля заявки на кадастровые работы."
    work_location: str = Field(..., min_length=1, max_length=500)


class CadastralOrderDetailsResponse(CadastralOrderDetailsInput):
    "Детали кадастровой заявки в ответе API."

    class Config:
        from_attributes = True


class ForensicOrderDetailsInput(BaseModel):
    "Дополнительные поля заявки на судебную экспертизу."
    government_body: str = Field(..., min_length=1, max_length=500)
    expert_requirements: str = Field(..., min_length=1, max_length=5000)
    subject_location: str = Field(..., min_length=1, max_length=500)


class ForensicOrderDetailsResponse(ForensicOrderDetailsInput):
    "Детали судебной заявки в ответе API."

    class Config:
        from_attributes = True


EXECUTOR_REQUIREMENT_HINTS: tuple[str, ...] = ("Звание", "Должность", "Стаж")


class ResearchOrderDetailsInput(BaseModel):
    "Дополнительные поля заявки на проведение НИР."
    executor_requirements: list[str] = Field(default_factory=list, max_length=20)
    needs_site_visit: bool = False

    @field_validator("executor_requirements")
    @classmethod
    def drop_blank_requirements(cls, value: list[str]) -> list[str]:
        "Пустые строки из динамического списка «добавить поле» не сохраняются."
        return [item.strip() for item in value if item.strip()]


class ResearchOrderDetailsResponse(ResearchOrderDetailsInput):
    "Детали заявки на НИР в ответе API."

    class Config:
        from_attributes = True


class LaboratoryOrderDetailsInput(BaseModel):
    "Дополнительные поля заявки на проведение лабораторных исследований."
    equipment_requirements: str = Field("", max_length=5000)


class LaboratoryOrderDetailsResponse(LaboratoryOrderDetailsInput):
    "Детали лабораторной заявки в ответе API."

    class Config:
        from_attributes = True


class DirectionSummary(BaseModel):
    "Направление в списке ЛК: ключ, название, заполнен ли профиль."
    key: str
    title: str
    profile_filled: bool
