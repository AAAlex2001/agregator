"""Направления: список доступных роли, анкеты и справочники.

Роуты универсальные — новое направление добавляется записью в реестре,
без единого нового эндпоинта.
"""
from typing import Any

from fastapi import APIRouter, Body, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from schemas.directions import (
    DirectionCatalogsResponse,
    DirectionDocumentDelete,
    DirectionDocumentsResponse,
    DirectionSummary,
)
from services.directions import (
    DeleteDirectionDocumentUseCase,
    DirectionsRepository,
    DirectionsValidator,
    GetDirectionProfileUseCase,
    ListRoleDirectionsUseCase,
    UploadDirectionDocumentUseCase,
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
    return profile.model_dump(mode="json")


@router.post(
    "/{direction_key}/documents",
    response_model=DirectionDocumentsResponse,
    dependencies=[Depends(rate_limit("direction_documents", max_calls=10, window_seconds=60))],
)
async def upload_direction_document(
    direction_key: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DirectionDocumentsResponse:
    "Прикладывает документ к анкете направления и возвращает обновлённый список."
    repo = DirectionsRepository(db)
    use_case = UploadDirectionDocumentUseCase(repo, DirectionsValidator(repo))
    documents = await use_case.execute(user_id, direction_key, file)
    return DirectionDocumentsResponse(documents=documents)


@router.delete("/{direction_key}/documents", response_model=DirectionDocumentsResponse)
async def delete_direction_document(
    direction_key: str,
    payload: DirectionDocumentDelete = Body(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DirectionDocumentsResponse:
    "Убирает документ из анкеты направления и возвращает обновлённый список."
    repo = DirectionsRepository(db)
    use_case = DeleteDirectionDocumentUseCase(repo, DirectionsValidator(repo))
    documents = await use_case.execute(user_id, direction_key, payload.url)
    return DirectionDocumentsResponse(documents=documents)
