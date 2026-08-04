"""DTO лабораторных исследований: анкета исполнителя и поля заявки."""
from pydantic import BaseModel, ConfigDict, Field


class LaboratoryProfileInput(BaseModel):
    """Анкета исполнителя лабораторных исследований."""
    accreditation_area: str = Field("", max_length=5000)
    comment: str = Field("", max_length=5000)


class LaboratoryProfileResponse(LaboratoryProfileInput):
    """Анкета исполнителя лабораторных исследований в ответе API."""
    model_config = ConfigDict(from_attributes=True)


class LaboratoryOrderDetailsInput(BaseModel):
    """Поля заявки на проведение лабораторных исследований."""
    equipment_requirements: str = Field("", max_length=5000)


class LaboratoryOrderDetailsResponse(LaboratoryOrderDetailsInput):
    """Поля лабораторной заявки в ответе API."""
    model_config = ConfigDict(from_attributes=True)
