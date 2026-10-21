"""Конкурсная комиссия в админке: заявки кандидатов, решение и удаление."""

from fastapi import APIRouter, Depends, Query, Response

from app.auth.internal.dependencies import require_internal_token
from app.commission.dependencies import (
    get_application,
    get_commission_repository,
    get_review_application_usecase,
)
from app.commission.models import ApplicationStatus, CommissionApplication
from app.commission.schemas import ApplicationPageSchema, ApplicationSchema, ReviewSchema
from app.commission.services.repo import CommissionRepository
from app.commission.services.usecases.review_application import ReviewApplicationUseCase

router = APIRouter(
    prefix="/internal/commission",
    tags=["admin-commission"],
    dependencies=[Depends(require_internal_token)],
)


@router.get("/applications")
async def list_applications(
    status: ApplicationStatus | None = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    applications: CommissionRepository = Depends(get_commission_repository),
) -> ApplicationPageSchema:
    """Заявки, новые первыми. Можно отфильтровать по статусу."""

    items, total = await applications.page(status, limit, offset)

    schemas = [ApplicationSchema.model_validate(item) for item in items]

    return ApplicationPageSchema(items=schemas, total=total)


@router.patch("/applications/{application_id}")
async def review_application(
    data: ReviewSchema,
    application: CommissionApplication = Depends(get_application),
    usecase: ReviewApplicationUseCase = Depends(get_review_application_usecase),
) -> ApplicationSchema:
    """Поменять статус и комментарий. Кандидат получит письмо, если статус изменился."""

    return ApplicationSchema.model_validate(await usecase.execute(application, data.status, data.decision))


@router.delete("/applications/{application_id}", status_code=204)
async def delete_application(
    application: CommissionApplication = Depends(get_application),
    applications: CommissionRepository = Depends(get_commission_repository),
) -> Response:
    """Удалить заявку."""

    await applications.delete(application)

    return Response(status_code=204)
