from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.expert import ExpertListResponse, ExpertMapItem, ExpertMapResponse, ExpertSummary
from schemas.order import OrderListResponse, OrderResponse
from services.experts import (
    ExpertsRepository,
    GetExpertSummaryUseCase,
    ListExpertOrdersHistoryUseCase,
    ListExpertsMapUseCase,
    ListExpertsUseCase,
)
from services.experts.repository import (
    SORT_BY_COMPLETED_ORDERS,
    SORT_BY_RATING,
    SORT_BY_REVIEW_COUNT,
    SORT_DIR_ASC,
    SORT_DIR_DESC,
    ExpertSummaryRow,
)

router = APIRouter(tags=["experts"])


ALLOWED_SORT_BY = {SORT_BY_RATING, SORT_BY_COMPLETED_ORDERS, SORT_BY_REVIEW_COUNT}
ALLOWED_SORT_DIR = {SORT_DIR_ASC, SORT_DIR_DESC}


def build_repo(db: AsyncSession) -> ExpertsRepository:
    return ExpertsRepository(db)


def build_expert_summary(item: ExpertSummaryRow) -> ExpertSummary:
    last_order_payload = None
    if item.last_order is not None:
        last_order_payload = OrderResponse.from_archived_order(
            item.last_order, item.last_order_response, has_review=False
        )
    return ExpertSummary(
        public_id=item.public_id,
        full_name=item.full_name,
        avatar_url=item.avatar_url,
        rating=item.rating,
        review_count=item.review_count,
        completed_orders_count=item.completed_orders_count,
        joined_at=item.joined_at,
        last_order=last_order_payload,
    )


@router.get("/experts", response_model=ExpertListResponse)
async def list_experts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    q: str | None = Query(None, max_length=200),
    sort_by: str = Query(SORT_BY_RATING),
    sort_dir: str = Query(SORT_DIR_DESC),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ExpertListResponse:
    "Список карточек экспертов с агрегированной статистикой. Только эксперты с отзывами."
    safe_sort_by = sort_by if sort_by in ALLOWED_SORT_BY else SORT_BY_RATING
    safe_sort_dir = sort_dir if sort_dir in ALLOWED_SORT_DIR else SORT_DIR_DESC
    use_case = ListExpertsUseCase(build_repo(db))
    items, has_more = await use_case.execute(skip, limit, q, safe_sort_by, safe_sort_dir)
    return ExpertListResponse(
        items=[build_expert_summary(item) for item in items],
        has_more=has_more,
    )


@router.get("/experts/map", response_model=ExpertMapResponse)
async def list_experts_map(
    db: AsyncSession = Depends(get_db),
) -> ExpertMapResponse:
    "Активные эксперты с координатами базирования — публичные точки на карте (лендинг и создание заказа)."
    rows = await ListExpertsMapUseCase(build_repo(db)).execute()
    return ExpertMapResponse(
        items=[
            ExpertMapItem(
                public_id=row.public_id,
                full_name=row.full_name,
                avatar_url=row.avatar_url,
                rating=row.rating,
                city=row.city,
                lat=row.lat,
                lng=row.lng,
                travels_to_other_regions=row.travels_to_other_regions,
                areas=row.areas,
                objects=row.objects,
                categories=row.categories,
                phone=row.phone,
                email=row.email,
            )
            for row in rows
        ]
    )


@router.get("/experts/{public_id}/summary", response_model=ExpertSummary)
async def get_expert_summary(
    public_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ExpertSummary:
    "Карточка одного эксперта по public_id."
    use_case = GetExpertSummaryUseCase(build_repo(db))
    summary = await use_case.execute(public_id)
    return build_expert_summary(summary)


@router.get("/experts/{public_id}/orders", response_model=OrderListResponse)
async def list_expert_orders_history(
    public_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> OrderListResponse:
    "История выполненных заказов эксперта: ARCHIVED, исполнитель — этот эксперт."
    use_case = ListExpertOrdersHistoryUseCase(build_repo(db))
    items, has_more = await use_case.execute(public_id, skip, limit)
    return OrderListResponse(
        items=[
            OrderResponse.from_archived_order(item.order, item.accepted_response, has_review=False)
            for item in items
        ],
        has_more=has_more,
    )
