from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.subscription import require_active_subscription
from schemas.hazard import (
    HazardCalculateRequest,
    HazardCalculateResponse,
    HazardCatalogResponse,
)
from services.hazard import (
    BuildHazardReportUseCase,
    CalculateHazardUseCase,
    GetHazardCatalogUseCase,
    HazardRepository,
)

router = APIRouter(prefix="/hazard", tags=["hazard"])


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
    user_id: int = Depends(require_active_subscription),
) -> HazardCalculateResponse:
    "Расчёт показателей опасности. Только по активной подписке."
    return await CalculateHazardUseCase(HazardRepository(db)).execute(request)


@router.post("/report", response_class=Response)
async def download_hazard_report(
    request: HazardCalculateRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(require_active_subscription),
) -> Response:
    "PDF-отчёт об оценке опасности аварий. Только по активной подписке."
    pdf_bytes = await BuildHazardReportUseCase(HazardRepository(db)).execute(request)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": 'inline; filename="hazard-report.pdf"'},
    )
