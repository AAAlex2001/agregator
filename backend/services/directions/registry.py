"""Реестр направлений — единственное место, где описано, какие направления есть.

Анкеты направлений живут в собственных срезах services/<key>; реестру осталась
привязка полей заявки: модель деталей, атрибут заказа и схемы валидации.
Новое направление = модели + схемы + свой срез + одна запись здесь.
"""
from dataclasses import dataclass

from pydantic import BaseModel

from models.audit import OrderAuditDetails
from models.base import Base
from models.cadastral import OrderCadastralDetails
from models.forensic import OrderForensicDetails
from models.laboratory import OrderLaboratoryDetails
from models.order import OrderWorkType
from models.research import OrderResearchDetails
from schemas.audit import AuditOrderDetailsInput, AuditOrderDetailsResponse
from schemas.cadastral import CadastralOrderDetailsInput, CadastralOrderDetailsResponse
from schemas.forensic import ForensicOrderDetailsInput, ForensicOrderDetailsResponse
from schemas.laboratory import LaboratoryOrderDetailsInput, LaboratoryOrderDetailsResponse
from schemas.research import ResearchOrderDetailsInput, ResearchOrderDetailsResponse


@dataclass(frozen=True)
class Direction:
    "Направление: ключ, название и дополнительные поля заявки, если они есть."
    key: str
    title: str
    details_model: type[Base] | None = None
    details_attribute: str | None = None
    details_input_schema: type[BaseModel] | None = None
    details_response_schema: type[BaseModel] | None = None

    @property
    def has_details(self) -> bool:
        "Есть ли у направления дополнительные поля заявки."
        return self.details_model is not None


DIRECTIONS: tuple[Direction, ...] = (
    Direction(
        key=OrderWorkType.EXPERTISE.value,
        title="Экспертиза промышленной безопасности",
    ),
    Direction(
        key=OrderWorkType.AUDIT_SUPB.value,
        title="Аудит СУПБ",
        details_model=OrderAuditDetails,
        details_attribute="audit_details",
        details_input_schema=AuditOrderDetailsInput,
        details_response_schema=AuditOrderDetailsResponse,
    ),
    Direction(
        key=OrderWorkType.CADASTRAL.value,
        title="Кадастровые работы",
        details_model=OrderCadastralDetails,
        details_attribute="cadastral_details",
        details_input_schema=CadastralOrderDetailsInput,
        details_response_schema=CadastralOrderDetailsResponse,
    ),
    Direction(
        key=OrderWorkType.FORENSIC.value,
        title="Судебная экспертиза",
        details_model=OrderForensicDetails,
        details_attribute="forensic_details",
        details_input_schema=ForensicOrderDetailsInput,
        details_response_schema=ForensicOrderDetailsResponse,
    ),
    Direction(
        key=OrderWorkType.RESEARCH.value,
        title="Научно-исследовательские работы",
        details_model=OrderResearchDetails,
        details_attribute="research_details",
        details_input_schema=ResearchOrderDetailsInput,
        details_response_schema=ResearchOrderDetailsResponse,
    ),
    Direction(
        key=OrderWorkType.LABORATORY.value,
        title="Лабораторные исследования",
        details_model=OrderLaboratoryDetails,
        details_attribute="laboratory_details",
        details_input_schema=LaboratoryOrderDetailsInput,
        details_response_schema=LaboratoryOrderDetailsResponse,
    ),
)

DIRECTIONS_BY_KEY: dict[str, Direction] = {direction.key: direction for direction in DIRECTIONS}


def get_direction(key: str) -> Direction | None:
    "Возвращает направление по ключу (значению OrderWorkType) или None."
    return DIRECTIONS_BY_KEY.get(key)
