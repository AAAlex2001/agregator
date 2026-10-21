"""Заявка кандидата в конкурсную комиссию с сайта."""

from fastapi import APIRouter, Depends

from app.commission.dependencies import get_submit_application_usecase
from app.commission.schemas import ApplicationCreateSchema
from app.commission.services.usecases.submit_application import SubmitApplicationUseCase

router = APIRouter(prefix="/commission", tags=["commission"])


@router.post("/applications", status_code=201)
async def submit_application(
    data: ApplicationCreateSchema,
    usecase: SubmitApplicationUseCase = Depends(get_submit_application_usecase),
) -> None:
    """Кандидат оставляет контакты и аттестации. Ответ придёт ему на почту."""

    await usecase.execute(data)
