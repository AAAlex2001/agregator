"""DTO судебной экспертизы: анкета эксперта и поля заявки."""
from pydantic import BaseModel, ConfigDict, Field, model_validator

from models.forensic import ForensicWorkplaceKind
from schemas.applicant import ApplicantDetailsInput, ApplicantDetailsResponse
from schemas.common import DirectionFileSchema


class ForensicProfileInput(BaseModel):
    """Анкета судебного эксперта из формы регистрации или кабинета."""
    education: str = Field("", max_length=5000)
    extra_education: str = Field("", max_length=5000)
    has_similar_experience: bool = False
    has_degree: bool = False
    degree: str = Field("", max_length=300)
    city: str = Field("", max_length=200)
    workplace_kind: ForensicWorkplaceKind = ForensicWorkplaceKind.INDIVIDUAL
    workplace_name: str = Field("", max_length=500)

    @model_validator(mode="after")
    def degree_requires_flag(self) -> "ForensicProfileInput":
        """Учёная степень указывается только вместе с ответом «да»."""
        if self.has_degree and not self.degree.strip():
            raise ValueError("Укажите учёную степень")
        if not self.has_degree:
            self.degree = ""
        return self


class ForensicProfileResponse(BaseModel):
    """Анкета судебного эксперта в ответе API: с приложенными файлами."""
    model_config = ConfigDict(from_attributes=True)

    education: str = ""
    extra_education: str = ""
    has_similar_experience: bool = False
    has_degree: bool = False
    degree: str = ""
    city: str = ""
    workplace_kind: ForensicWorkplaceKind = ForensicWorkplaceKind.INDIVIDUAL
    workplace_name: str = ""
    education_diploma: DirectionFileSchema | None = None
    documents: list[DirectionFileSchema] = Field(default_factory=list)


class ForensicOrderDetailsInput(ApplicantDetailsInput):
    """Поля заявки на судебную экспертизу: заявитель, объект, требования, сроки."""
    expertise_purpose: str = Field(..., min_length=1, max_length=5000)
    government_body: str = Field(..., min_length=1, max_length=500)
    city: str = Field(..., min_length=1, max_length=200)
    education_requirement: str = Field("", max_length=5000)
    extra_requirements: str = Field("", max_length=5000)
    similar_experience_required: bool = False
    duration: str = Field("", max_length=200)


class ForensicOrderDetailsResponse(ApplicantDetailsResponse):
    """Поля судебной заявки в ответе API."""
    expertise_purpose: str
    government_body: str
    city: str
    education_requirement: str
    extra_requirements: str
    similar_experience_required: bool = False
    duration: str
