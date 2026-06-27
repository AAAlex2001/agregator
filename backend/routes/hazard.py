from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.subscription import require_expert_subscription
from models.hazard import HazardReport
from schemas.hazard import (
    HazardCalculateRequest,
    HazardCalculateResponse,
    HazardCatalogResponse,
    HazardReportItem,
    HazardReportListResponse,
    HazardReportRequest,
)
from services.hazard import (
    BuildHazardReportUseCase,
    CalculateHazardUseCase,
    GetHazardCatalogUseCase,
    HazardRepository,
)

router = APIRouter(prefix="/hazard", tags=["hazard"])


def pdf_response(pdf_bytes: bytes, report_id: int) -> Response:
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="hazard-report-{report_id}.pdf"'},
    )


@router.get("/catalog", response_model=HazardCatalogResponse)
async def get_catalog(
    profile: str = Query("rudnik"),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> HazardCatalogResponse:
    "Справочник факторов профиля для формы расчёта."
    return await GetHazardCatalogUseCase(HazardRepository(db)).execute(profile)


@router.post("/calculate", response_model=HazardCalculateResponse)
async def calculate_hazard(
    request: HazardCalculateRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(require_expert_subscription),
) -> HazardCalculateResponse:
    "Расчёт показателей опасности. Эксперт с активной подпиской."
    return await CalculateHazardUseCase(HazardRepository(db)).execute(request)


@router.post("/report", response_class=Response)
async def create_report(
    request: HazardReportRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(require_expert_subscription),
) -> Response:
    "Сохраняет отчёт в историю и возвращает PDF."
    repo = HazardRepository(db)
    result = await CalculateHazardUseCase(repo).execute(request)
    report = await repo.save_report(HazardReport(
        expert_id=user_id,
        name=request.report_name,
        profile=request.profile,
        selections=request.selections,
        overall_r=result.overall_r,
        overall_category=result.overall_r_category,
    ))
    pdf_bytes = await BuildHazardReportUseCase(repo).execute(request)
    return pdf_response(pdf_bytes, report.id)


@router.get("/reports", response_model=HazardReportListResponse)
async def list_reports(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(require_expert_subscription),
) -> HazardReportListResponse:
    "История отчётов эксперта."
    reports = await HazardRepository(db).list_reports(user_id)
    return HazardReportListResponse(items=[HazardReportItem.model_validate(report) for report in reports])


@router.get("/reports/{report_id}/pdf", response_class=Response)
async def download_saved_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(require_expert_subscription),
) -> Response:
    "Пересобирает и отдаёт PDF сохранённого отчёта."
    repo = HazardRepository(db)
    report = await repo.get_report(report_id, user_id)
    if report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Отчёт не найден")
    request = HazardReportRequest(profile=report.profile, selections=report.selections, report_name=report.name)
    pdf_bytes = await BuildHazardReportUseCase(repo).execute(request)
    return pdf_response(pdf_bytes, report.id)
