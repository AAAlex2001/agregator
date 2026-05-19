from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.expert import ExpertListResponse, ExpertSummary
from schemas.order import OrderListResponse, OrderResponse
from services.experts import (
    ExpertsRepository,
    GetExpertSummaryUseCase,
    ListExpertOrdersHistoryUseCase,
    ListExpertsUseCase,
)

router = APIRouter(tags=["experts"])


def build_repo(db: AsyncSession) -> ExpertsRepository:
    return ExpertsRepository(db)


@router.get("/experts", response_model=ExpertListResponse)
async def list_experts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    q: str | None = Query(None, max_length=200),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ExpertListResponse:
    "Список карточек экспертов с агрегированной статистикой. Только для авторизованных."
    use_case = ListExpertsUseCase(build_repo(db))
    items, has_more = await use_case.execute(skip, limit, q)
    return ExpertListResponse(
        items=[ExpertSummary(**vars(item)) for item in items],
        has_more=has_more,
    )


@router.get("/experts/{public_id}/summary", response_model=ExpertSummary)
async def get_expert_summary(
    public_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ExpertSummary:
    "Карточка одного эксперта по public_id (имя, аватар, рейтинг, отзывы, выполненные заказы)."
    use_case = GetExpertSummaryUseCase(build_repo(db))
    summary = await use_case.execute(public_id)
    return ExpertSummary(**vars(summary))


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
