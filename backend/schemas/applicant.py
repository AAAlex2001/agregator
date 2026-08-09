"""Общий блок «Сведения о заявителе» в полях заявок направлений."""
from pydantic import BaseModel, ConfigDict, Field


class ApplicantDetailsInput(BaseModel):
    """Заявитель из формы заявки: ФИО и контакты обязательны, остальное — по желанию."""
    applicant_full_name: str = Field(..., min_length=1, max_length=300)
    applicant_position: str = Field("", max_length=200)
    applicant_organization: str = Field("", max_length=500)
    applicant_inn: str = Field("", pattern=r"^$|^\d{10}$|^\d{12}$")
    applicant_phone: str = Field(..., min_length=5, max_length=30)
    applicant_email: str = Field(..., min_length=5, max_length=320)


class ApplicantDetailsResponse(BaseModel):
    """Заявитель в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    applicant_full_name: str = ""
    applicant_position: str = ""
    applicant_organization: str = ""
    applicant_inn: str = ""
    applicant_phone: str = ""
    applicant_email: str = ""
