from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.subscription import require_expert_subscription
from models.lining import LiningReport
from schemas.lining import (
    LiningCatalogResponse,
    LiningReportItem,
    LiningReportListResponse,
    LiningReportRequest,
)
from services.lining import (
    BuildLiningReportUseCase,
    CalculateLiningUseCase,
    GetLiningCatalogUseCase,
    LiningRepository,
)

router = APIRouter(prefix="/lining", tags=["lining"])


def pdf_response(pdf_bytes: bytes, report_id: int) -> Response:
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="lining-report-{report_id}.pdf"'},
    )


@router.get("/catalog", response_model=LiningCatalogResponse)
async def get_catalog(
    profile: str = Query("rudnik"),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> LiningCatalogResponse:
    "Справочник инструмента: факторы, элементы крепи, категории повреждений, экспертные критерии."
    return await GetLiningCatalogUseCase(LiningRepository(db)).execute(profile)


@router.post("/report", response_model=LiningReportItem)
async def create_report(
    request: LiningReportRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(require_expert_subscription),
) -> LiningReportItem:
    "Считает показатели и сохраняет отчёт в историю. PDF собирается при просмотре из истории."
    repo = LiningRepository(db)
    result = await CalculateLiningUseCase(repo).execute(request)
    blocks = [
        {"group": block.group, "title": block.title, "value": block.value, "category": block.category}
        for block in [result.r0, *result.blocks]
    ]
    header = {
        "author": request.author,
        "intro_line1": request.intro_line1,
        "intro_line2": request.intro_line2,
        "intro_line3": request.intro_line3,
        "justification": request.justification,
        "manufacturer": request.manufacturer,
    }
    report = await repo.save_report(LiningReport(
        expert_id=user_id,
        name=request.report_name,
        selections=request.selections,
        element_categories=request.element_categories,
        expert_scores=request.expert_scores,
        service_life_years=request.service_life_years,
        header=header,
        blocks=blocks,
        overall_r=result.overall_r,
        overall_category=result.overall_r_category,
        final_capital=result.final_capital,
        final_emergency=result.final_emergency,
    ))
    return LiningReportItem.model_validate(report)


@router.get("/reports", response_model=LiningReportListResponse)
async def list_reports(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(require_expert_subscription),
) -> LiningReportListResponse:
    "История отчётов эксперта."
    reports = await LiningRepository(db).list_reports(user_id)
    return LiningReportListResponse(items=[LiningReportItem.model_validate(report) for report in reports])


@router.get("/reports/{report_id}/pdf", response_class=Response)
async def download_saved_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(require_expert_subscription),
) -> Response:
    "Пересобирает и отдаёт PDF сохранённого отчёта."
    repo = LiningRepository(db)
    report = await repo.get_report(report_id, user_id)
    if report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Отчёт не найден")
    request = LiningReportRequest(
        selections=report.selections,
        element_categories=report.element_categories,
        expert_scores=report.expert_scores,
        service_life_years=report.service_life_years,
        report_name=report.name,
        **(report.header or {}),
    )
    pdf_bytes = await BuildLiningReportUseCase(repo).execute(request)
    return pdf_response(pdf_bytes, report.id)
