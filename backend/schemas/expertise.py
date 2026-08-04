"""DTO экспертизы промышленной безопасности: анкета исполнителя."""
from pydantic import BaseModel, ConfigDict, Field

from schemas.expert import ExpertCertificate


class ExpertiseProfileInput(BaseModel):
    """Анкета исполнителя по ЭПБ: удостоверения эксперта.

    Присутствие на карте сюда не входит: это настройка исполнителя, общая для всех
    направлений, и живёт в PUT /settings/expert-location.
    """
    certificates: list[ExpertCertificate] = Field(default_factory=list, max_length=200)


class ExpertiseProfileResponse(BaseModel):
    """Анкета исполнителя по ЭПБ в ответе API."""
    model_config = ConfigDict(from_attributes=True)

    certificates: list[ExpertCertificate] = Field(default_factory=list)
