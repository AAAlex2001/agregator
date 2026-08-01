"""Направления: список доступных роли, анкеты и справочники.

У каждой пары «направление × роль» свой эндпоинт со своей схемой — контракт виден
в OpenAPI, а не прячется за общим словарём. Механика записи общая: роуты собирают
зависимости и зовут одни и те же use case, конкретную схему выбирает реестр по ключу.
"""
from fastapi import APIRouter, Body, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from models.order import OrderWorkType
from schemas.directions import (
    AuditProfileInput,
    AuditProfileResponse,
    CadastralProfileInput,
    CadastralProfileResponse,
    CustomerAuditProfileInput,
    CustomerAuditProfileResponse,
    DirectionCatalogsResponse,
    DirectionDocumentDelete,
    DirectionDocumentsResponse,
    DirectionSummary,
    ExpertiseExpertProfileInput,
    ExpertiseExpertProfileResponse,
    ForensicProfileInput,
    ForensicProfileResponse,
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


async def read_profile(db: AsyncSession, user_id: int, key: str) -> object:
    "Читает анкету направления; конкретную схему ответа объявляет роут."
    return await GetDirectionProfileUseCase(build_validator(db)).execute(user_id, key)


async def write_profile(db: AsyncSession, user_id: int, key: str, payload: object) -> object:
    "Пишет анкету направления; поля уже проверены схемой роута."
    repo = DirectionsRepository(db)
    use_case = UpsertDirectionProfileUseCase(repo, DirectionsValidator(repo))
    return await use_case.execute(user_id, key, payload.model_dump())


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


@router.get("/expertise/profile", response_model=ExpertiseExpertProfileResponse)
async def get_expertise_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    "Анкета исполнителя по экспертизе промышленной безопасности."
    return await read_profile(db, user_id, OrderWorkType.EXPERTISE.value)


@router.put("/expertise/profile", response_model=ExpertiseExpertProfileResponse)
async def update_expertise_profile(
    payload: ExpertiseExpertProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    "Сохраняет удостоверения исполнителя по экспертизе промышленной безопасности."
    return await write_profile(db, user_id, OrderWorkType.EXPERTISE.value, payload)


@router.get(
    "/audit-supb/profile",
    response_model=AuditProfileResponse | CustomerAuditProfileResponse,
)
async def get_audit_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    "Анкета по аудиту СУПБ: у исполнителя и заказчика она разная."
    return await read_profile(db, user_id, OrderWorkType.AUDIT_SUPB.value)


@router.put("/audit-supb/expert/profile", response_model=AuditProfileResponse)
async def update_audit_expert_profile(
    payload: AuditProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    "Сохраняет анкету исполнителя по аудиту СУПБ: аудитор или инспекционный орган."
    return await write_profile(db, user_id, OrderWorkType.AUDIT_SUPB.value, payload)


@router.put("/audit-supb/customer/profile", response_model=CustomerAuditProfileResponse)
async def update_audit_customer_profile(
    payload: CustomerAuditProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    "Сохраняет анкету заказчика по аудиту СУПБ: должность и лицензия на ОПО."
    return await write_profile(db, user_id, OrderWorkType.AUDIT_SUPB.value, payload)


@router.get("/cadastral/profile", response_model=CadastralProfileResponse)
async def get_cadastral_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    "Анкета кадастрового инженера."
    return await read_profile(db, user_id, OrderWorkType.CADASTRAL.value)


@router.put("/cadastral/profile", response_model=CadastralProfileResponse)
async def update_cadastral_profile(
    payload: CadastralProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    "Сохраняет анкету кадастрового инженера."
    return await write_profile(db, user_id, OrderWorkType.CADASTRAL.value, payload)


@router.get("/forensic/profile", response_model=ForensicProfileResponse)
async def get_forensic_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    "Анкета специалиста по судебной экспертизе."
    return await read_profile(db, user_id, OrderWorkType.FORENSIC.value)


@router.put("/forensic/profile", response_model=ForensicProfileResponse)
async def update_forensic_profile(
    payload: ForensicProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    "Сохраняет анкету специалиста по судебной экспертизе."
    return await write_profile(db, user_id, OrderWorkType.FORENSIC.value, payload)


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
