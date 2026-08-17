"""DTO экологии: анкета эколога и поля заявки."""
from pydantic import BaseModel, ConfigDict, Field

from schemas.applicant import ApplicantDetailsInput, ApplicantDetailsResponse
from schemas.common import DirectionFileSchema


class EcologyCatalogOption(BaseModel):
    """Позиция справочника: код для хранения и название для интерфейса."""
    model_config = ConfigDict(from_attributes=True)

    code: str
    title: str


class EcologyCatalogsResponse(BaseModel):
    """Справочник направления: виды экологических работ."""
    work_types: list[EcologyCatalogOption]


class EcologyExpertProfileInput(BaseModel):
    """Анкета эколога."""
    work_types: list[str] = Field(default_factory=list, max_length=20)
    practical_skills: str = Field("", max_length=5000)


class EcologyExpertProfileResponse(BaseModel):
    """Анкета эколога в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    work_types: list[str] = Field(default_factory=list)
    practical_skills: str = ""
    documents: list[DirectionFileSchema] = Field(default_factory=list)


class EcologyOrderDetailsInput(ApplicantDetailsInput):
    """Поля заявки на экологическое сопровождение."""
    work_types: list[str] = Field(default_factory=list, max_length=20)


class EcologyOrderDetailsResponse(ApplicantDetailsResponse):
    """Поля заявки в ответе API."""
    work_types: list[str] = Field(default_factory=list)
