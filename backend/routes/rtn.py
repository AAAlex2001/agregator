"Публичные ручки каталога «Ростехнадзор отвечает»: таксономия, список, деталка, похожие."

from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from schemas.rtn import (
    ClarificationStatusDto,
    DocumentTypeDto,
    RtnDetailDto,
    RtnListDto,
    RtnListFiltersQuery,
    RtnListItemDto,
    RtnTaxonomyDto,
)
from services.rtn import RtnRepository
from services.rtn.taxonomy import build_taxonomy
from services.rtn.use_cases.get_clarification import GetRtnClarificationUseCase
from services.rtn.use_cases.list_clarifications import ListRtnClarificationsUseCase
from services.rtn.use_cases.list_related_clarifications import ListRelatedRtnClarificationsUseCase

router = APIRouter(tags=["rtn"])


@router.get("/public/rtn/taxonomy", response_model=RtnTaxonomyDto)
async def get_taxonomy() -> RtnTaxonomyDto:
    "Справочник фильтров каталога: значения + подписи на русском. Статичен, грузится один раз."
    return RtnTaxonomyDto(**build_taxonomy())


@router.get("/public/rtn/clarifications", response_model=RtnListDto)
async def list_clarifications(
    search: str | None = Query(None),
    document_type: list[DocumentTypeDto] = Query([]),
    status_value: list[ClarificationStatusDto] = Query([], alias="status"),
    oversight_area: list[str] = Query([]),
    industry: list[str] = Query([]),
    activity: list[str] = Query([]),
    object_type: list[str] = Query([]),
    published_from: date | None = Query(None),
    published_to: date | None = Query(None),
    limit: int = Query(12, ge=1, le=120),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> RtnListDto:
    "Список разъяснений: быстрый поиск + фильтры по всем измерениям таксономии."
    filters_query = RtnListFiltersQuery(
        search=search,
        document_types=document_type,
        statuses=status_value,
        oversight_areas=oversight_area,
        industries=industry,
        activities=activity,
        object_types=object_type,
        published_from=published_from,
        published_to=published_to,
    )
    use_case = ListRtnClarificationsUseCase(RtnRepository(db))
    return await use_case.execute(filters_query, skip=offset, limit=limit)


@router.get("/public/rtn/clarifications/{slug}", response_model=RtnDetailDto)
async def get_clarification(slug: str, db: AsyncSession = Depends(get_db)) -> RtnDetailDto:
    "Полная карточка разъяснения; 404 если не найдена или не опубликована."
    return await GetRtnClarificationUseCase(RtnRepository(db)).execute(slug)


@router.get("/public/rtn/clarifications/{slug}/related", response_model=list[RtnListItemDto])
async def list_related_clarifications(
    slug: str,
    limit: int = Query(4, ge=1, le=12),
    db: AsyncSession = Depends(get_db),
) -> list[RtnListItemDto]:
    "Блок «Смотрите также»: похожие разъяснения по тегам и отрасли."
    return await ListRelatedRtnClarificationsUseCase(RtnRepository(db)).execute(slug, limit)
