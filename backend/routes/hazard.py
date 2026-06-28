from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.subscription import consume_response_slot, require_expert_subscription
from models.hazard import HazardReport
from schemas.hazard import (
    HazardCatalogResponse,
    HazardReportItem,
    HazardReportListResponse,
    HazardReportRequest,
    HazardSaveCatalogRequest,
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
    "Справочник факторов эксперта (кастомный либо дефолтный)."
    return await GetHazardCatalogUseCase(HazardRepository(db)).execute(profile, user_id)


@router.put("/catalog", response_model=HazardCatalogResponse)
async def save_catalog(
    request: HazardSaveCatalogRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(require_expert_subscription),
) -> HazardCatalogResponse:
    "Сохраняет кастомный набор факторов эксперта и возвращает обновлённый справочник."
    repo = HazardRepository(db)
    factors = [
        {
            "code": factor.code,
            "group_code": factor.group,
            "name": factor.name,
            "max_score": factor.max_score,
            "default_value": factor.default_value,
            "options": [{"value": option.value, "label": option.label} for option in factor.options],
        }
        for factor in request.factors
    ]
    await repo.save_user_catalog(user_id, request.profile, factors)
    return await GetHazardCatalogUseCase(repo).execute(request.profile, user_id)


@router.delete("/catalog", response_model=HazardCatalogResponse)
async def reset_catalog(
    profile: str = Query("rudnik"),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(require_expert_subscription),
) -> HazardCatalogResponse:
    "Сбрасывает факторы эксперта к исходному справочнику."
    repo = HazardRepository(db)
    await repo.reset_user_catalog(user_id, profile)
    return await GetHazardCatalogUseCase(repo).execute(profile, user_id)


@router.post("/report", response_model=HazardReportItem)
async def create_report(
    request: HazardReportRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(require_expert_subscription),
) -> HazardReportItem:
    "Считает показатели и сохраняет отчёт в историю. PDF собирается при просмотре из истории."
    repo = HazardRepository(db)
    result = await CalculateHazardUseCase(repo).execute(request, user_id)
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
        "certificate": request.certificate,
        "manufacturer": request.manufacturer,
    }
    report = await repo.save_report(HazardReport(
        expert_id=user_id,
        name=request.report_name,
        profile=request.profile,
        selections=request.selections,
        header=header,
        excluded_groups=request.excluded_groups,
        blocks=blocks,
        overall_r=result.overall_r,
        overall_category=result.overall_r_category,
    ))
    await consume_response_slot(user_id, db)
    return HazardReportItem.model_validate(report)


@router.get("/reports", response_model=HazardReportListResponse)
async def list_reports(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> HazardReportListResponse:
    "История отчётов эксперта. Доступна без подписки."
    reports = await HazardRepository(db).list_reports(user_id)
    return HazardReportListResponse(items=[HazardReportItem.model_validate(report) for report in reports])


@router.get("/reports/{report_id}/pdf", response_class=Response)
async def download_saved_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> Response:
    "Пересобирает и отдаёт PDF сохранённого отчёта. Доступно без подписки."
    repo = HazardRepository(db)
    report = await repo.get_report(report_id, user_id)
    if report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Отчёт не найден")
    request = HazardReportRequest(
        profile=report.profile,
        selections=report.selections,
        excluded_groups=report.excluded_groups or [],
        report_name=report.name,
        **(report.header or {}),
    )
    pdf_bytes = await BuildHazardReportUseCase(repo).execute(request, user_id)
    return pdf_response(pdf_bytes, report.id)
