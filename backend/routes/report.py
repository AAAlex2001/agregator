from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.order import OrderCard, OrderListResponse
from services.reports import (
    BuildReportPdfUseCase,
    ListReportsUseCase,
    ReportRepository,
)

router = APIRouter(prefix="/reports", tags=["reports"])


def build_repo(db: AsyncSession) -> ReportRepository:
    return ReportRepository(db)


@router.get("/", response_model=OrderListResponse)
async def list_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> OrderListResponse:
    "Список архивных заказов пользователя для отчётов."
    use_case = ListReportsUseCase(build_repo(db))
    items, has_more = await use_case.execute(user_id, skip, limit)
    return OrderListResponse(
        items=[
            OrderCard.from_archived_order(item.order, item.accepted_response, False)
            for item in items
        ],
        has_more=has_more,
    )


@router.get("/{order_id}/pdf", response_class=Response)
async def download_report_pdf(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> Response:
    "Скачать PDF-отчёт по архивному заказу. Возвращает бинарь, не JSON."
    use_case = BuildReportPdfUseCase(build_repo(db))
    pdf_bytes = await use_case.execute(order_id, user_id)
    filename = f"report-{order_id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{filename}"'},
    )
