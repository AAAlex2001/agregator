"""DTO лабораторных исследований: анкета исполнителя и поля заявки."""
from pydantic import BaseModel, ConfigDict, Field


class LaboratoryProfileInput(BaseModel):
    """Анкета исполнителя лабораторных исследований."""
    accreditation_area: str = Field("", max_length=5000)
    comment: str = Field("", max_length=5000)


class LaboratoryProfileResponse(BaseModel):
    """Анкета исполнителя лабораторных исследований в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    accreditation_area: str = ""
    comment: str = ""


class LaboratoryOrderDetailsInput(BaseModel):
    """Поля заявки на проведение лабораторных исследований."""
    equipment_requirements: str = Field("", max_length=5000)


class LaboratoryOrderDetailsResponse(BaseModel):
    """Поля лабораторной заявки в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    equipment_requirements: str = ""
