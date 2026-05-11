from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from schemas.report import ReportListItemResponse, ReportListResponse
from services.reports import (
    BuildReportPdfUseCase,
    ListReportsUseCase,
    ReportListItem,
    ReportRepository,
)
from services.reports.use_cases.build_report_pdf import (
    expert_full_name,
    format_date,
    format_sum,
)


router = APIRouter(prefix="/reports", tags=["reports"])


def build_repo(db: AsyncSession) -> ReportRepository:
    return ReportRepository(db)


@router.get("/", response_model=ReportListResponse)
async def list_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    use_case = ListReportsUseCase(build_repo(db))
    items, has_more = await use_case.execute(user_id, skip, limit)
    return ReportListResponse(
        items=[serialize_item(item) for item in items],
        has_more=has_more,
    )


@router.get("/{order_id}/pdf")
async def download_report_pdf(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    use_case = BuildReportPdfUseCase(build_repo(db))
    pdf_bytes = await use_case.execute(order_id, user_id)
    filename = f"report-{order_id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{filename}"'},
    )


def serialize_item(item: ReportListItem) -> ReportListItemResponse:
    order = item.order
    response = item.accepted_response
    return ReportListItemResponse(
        order_id=order.id,
        order_public_id=order.public_id,
        title=order.title,
        customer_company=order.company or "",
        order_sum=format_sum(order.sum_amount),
        completed_at=order.updated_at.strftime("%d.%m.%Y") if order.updated_at else "",
        participants_count=len(order.responses or []),
        winner_name=expert_full_name(response) if response else "—",
        winner_sum=format_sum(response.proposed_sum_amount) if response else "—",
        winner_deadline=format_date(response.proposed_deadline) if response else "—",
    )
