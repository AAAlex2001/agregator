"""Реестр направлений: единственное место, где перечислено, какие направления есть.

Новое направление = модели профиля/деталей + схемы + одна запись здесь.
"""
from dataclasses import dataclass

from pydantic import BaseModel

from models.direction_profile import ExpertCadastralProfile, ExpertForensicProfile
from models.order import OrderWorkType
from models.order_details import OrderCadastralDetails, OrderForensicDetails
from schemas.directions import (
    CadastralOrderDetailsInput,
    CadastralOrderDetailsResponse,
    CadastralProfileInput,
    CadastralProfileResponse,
    ForensicOrderDetailsInput,
    ForensicOrderDetailsResponse,
    ForensicProfileInput,
    ForensicProfileResponse,
)


@dataclass(frozen=True)
class Direction:
    "Описание направления: модели и схемы профиля исполнителя и деталей заявки."
    key: str
    title: str
    profile_model: type
    profile_attribute: str
    profile_input_schema: type[BaseModel]
    profile_response_schema: type[BaseModel]
    details_model: type
    details_attribute: str
    details_input_schema: type[BaseModel]
    details_response_schema: type[BaseModel]


DIRECTIONS: tuple[Direction, ...] = (
    Direction(
        key=OrderWorkType.CADASTRAL.value,
        title="Кадастровые работы",
        profile_model=ExpertCadastralProfile,
        profile_attribute="cadastral_profile",
        profile_input_schema=CadastralProfileInput,
        profile_response_schema=CadastralProfileResponse,
        details_model=OrderCadastralDetails,
        details_attribute="cadastral_details",
        details_input_schema=CadastralOrderDetailsInput,
        details_response_schema=CadastralOrderDetailsResponse,
    ),
    Direction(
        key=OrderWorkType.FORENSIC.value,
        title="Судебная экспертиза",
        profile_model=ExpertForensicProfile,
        profile_attribute="forensic_profile",
        profile_input_schema=ForensicProfileInput,
        profile_response_schema=ForensicProfileResponse,
        details_model=OrderForensicDetails,
        details_attribute="forensic_details",
        details_input_schema=ForensicOrderDetailsInput,
        details_response_schema=ForensicOrderDetailsResponse,
    ),
)

DIRECTIONS_BY_KEY: dict[str, Direction] = {direction.key: direction for direction in DIRECTIONS}


def get_direction(key: str) -> Direction | None:
    "Возвращает направление по ключу (значению OrderWorkType) или None."
    return DIRECTIONS_BY_KEY.get(key)
