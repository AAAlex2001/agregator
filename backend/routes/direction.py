"""Направления: список доступных роли, анкеты и справочники.

Роуты универсальные — новое направление добавляется записью в реестре,
без единого нового эндпоинта.
"""
from typing import Any

from fastapi import APIRouter, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.directions import DirectionCatalogsResponse, DirectionSummary
from services.directions import (
    DirectionsRepository,
    DirectionsValidator,
    GetDirectionProfileUseCase,
    ListRoleDirectionsUseCase,
    UpsertDirectionProfileUseCase,
)
from services.directions.catalogs import build_direction_catalogs

router = APIRouter(prefix="/directions", tags=["directions"])


def build_validator(db: AsyncSession) -> DirectionsValidator:
    return DirectionsValidator(DirectionsRepository(db))


@router.get("/catalogs", response_model=DirectionCatalogsResponse)
async def get_catalogs() -> DirectionCatalogsResponse:
    "Справочники анкет направлений: аттестации, НОК, области аккредитации."
    return build_direction_catalogs()


@router.get("", response_model=list[DirectionSummary])
async def list_directions(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> list[DirectionSummary]:
    "Направления, доступные роли текущего пользователя, и заполненность анкет."
    return await ListRoleDirectionsUseCase(build_validator(db)).execute(user_id)


@router.get("/{direction_key}/profile")
async def get_direction_profile(
    direction_key: str,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> dict[str, Any]:
    "Анкета направления для роли текущего пользователя."
    profile = await GetDirectionProfileUseCase(build_validator(db)).execute(user_id, direction_key)
    return profile.model_dump(mode="json")


@router.put("/{direction_key}/profile")
async def update_direction_profile(
    direction_key: str,
    payload: dict[str, Any] = Body(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> dict[str, Any]:
    "Создаёт или обновляет анкету направления; поля проверяются схемой из реестра."
    repo = DirectionsRepository(db)
    use_case = UpsertDirectionProfileUseCase(repo, DirectionsValidator(repo))
    profile = await use_case.execute(user_id, direction_key, payload)
    await db.commit()
    return profile.model_dump(mode="json")
