"""Реестр направлений: единственное место, где перечислено, какие направления есть.

Новое направление = модели профиля/деталей + схемы + одна запись здесь.
Анкета исполнителя опциональна: направление может состоять только из полей заявки.
"""
from dataclasses import dataclass

from pydantic import BaseModel

from models.direction_profile import ExpertCadastralProfile, ExpertForensicProfile
from models.order import OrderWorkType
from models.order_details import (
    OrderCadastralDetails,
    OrderForensicDetails,
    OrderLaboratoryDetails,
    OrderResearchDetails,
)
from schemas.directions import (
    CadastralOrderDetailsInput,
    CadastralOrderDetailsResponse,
    CadastralProfileInput,
    CadastralProfileResponse,
    ForensicOrderDetailsInput,
    ForensicOrderDetailsResponse,
    ForensicProfileInput,
    ForensicProfileResponse,
    LaboratoryOrderDetailsInput,
    LaboratoryOrderDetailsResponse,
    ResearchOrderDetailsInput,
    ResearchOrderDetailsResponse,
)


@dataclass(frozen=True)
class Direction:
    "Описание направления: модели и схемы деталей заявки и (опционально) анкеты исполнителя."
    key: str
    title: str
    details_model: type
    details_attribute: str
    details_input_schema: type[BaseModel]
    details_response_schema: type[BaseModel]
    profile_model: type | None = None
    profile_attribute: str | None = None
    profile_input_schema: type[BaseModel] | None = None
    profile_response_schema: type[BaseModel] | None = None

    @property
    def has_profile(self) -> bool:
        "Заполняет ли исполнитель анкету по этому направлению."
        return self.profile_model is not None


DIRECTIONS: tuple[Direction, ...] = (
    Direction(
        key=OrderWorkType.CADASTRAL.value,
        title="Кадастровые работы",
        details_model=OrderCadastralDetails,
        details_attribute="cadastral_details",
        details_input_schema=CadastralOrderDetailsInput,
        details_response_schema=CadastralOrderDetailsResponse,
        profile_model=ExpertCadastralProfile,
        profile_attribute="cadastral_profile",
        profile_input_schema=CadastralProfileInput,
        profile_response_schema=CadastralProfileResponse,
    ),
    Direction(
        key=OrderWorkType.FORENSIC.value,
        title="Судебная экспертиза",
        details_model=OrderForensicDetails,
        details_attribute="forensic_details",
        details_input_schema=ForensicOrderDetailsInput,
        details_response_schema=ForensicOrderDetailsResponse,
        profile_model=ExpertForensicProfile,
        profile_attribute="forensic_profile",
        profile_input_schema=ForensicProfileInput,
        profile_response_schema=ForensicProfileResponse,
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

PROFILE_DIRECTIONS: tuple[Direction, ...] = tuple(
    direction for direction in DIRECTIONS if direction.has_profile
)


def get_direction(key: str) -> Direction | None:
    "Возвращает направление по ключу (значению OrderWorkType) или None."
    return DIRECTIONS_BY_KEY.get(key)
