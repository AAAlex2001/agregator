"""DTO лабораторных исследований: анкета исполнителя и поля заявки."""
from pydantic import BaseModel, ConfigDict, Field

from schemas.applicant import ApplicantDetailsInput, ApplicantDetailsResponse


class LaboratoryProfileInput(BaseModel):
    """Анкета исполнителя лабораторных исследований."""
    accreditation_area: str = Field("", max_length=5000)
    comment: str = Field("", max_length=5000)


class LaboratoryProfileResponse(BaseModel):
    """Анкета исполнителя лабораторных исследований в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    accreditation_area: str = ""
    comment: str = ""


class LaboratoryOrderDetailsInput(ApplicantDetailsInput):
    """Поля заявки на проведение лабораторных исследований."""
    equipment_requirements: str = Field("", max_length=5000)


class LaboratoryOrderDetailsResponse(ApplicantDetailsResponse):
    """Поля лабораторной заявки в ответе API."""
    equipment_requirements: str = ""
