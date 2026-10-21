"""Работа по заявке: замечания, исправления, заключение и приёмка."""

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.auth.sessions.dependencies import require_user
from app.blitz.orders.dependencies import get_locked_order
from app.blitz.orders.models import BlitzOrder, ConclusionResult
from app.blitz.orders.schemas import OrderSchema
from app.blitz.orders.services.presenter import details
from app.blitz.work.dependencies import (
    get_accept_work_usecase,
    get_mark_conclusion_ready_usecase,
    get_send_conclusion_usecase,
    get_send_remarks_usecase,
    get_send_revision_usecase,
)
from app.blitz.work.services.usecases.accept_work import AcceptWorkUseCase
from app.blitz.work.services.usecases.mark_conclusion_ready import MarkConclusionReadyUseCase
from app.blitz.work.services.usecases.send_conclusion import SendConclusionUseCase
from app.blitz.work.services.usecases.send_remarks import SendRemarksUseCase
from app.blitz.work.services.usecases.send_revision import SendRevisionUseCase
from models.account import Account

router = APIRouter(tags=["blitz"])


@router.post("/orders/{order_id}/remarks")
async def send_remarks(
    text: str = Form("", max_length=5000),
    files: list[UploadFile] = File(default=[]),
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: SendRemarksUseCase = Depends(get_send_remarks_usecase),
) -> OrderSchema:
    """Эксперт отправляет замечания по документации."""

    return details(await usecase.execute(user, order, text, files), user)


@router.post("/orders/{order_id}/revision")
async def send_revision(
    text: str = Form("", max_length=5000),
    files: list[UploadFile] = File(default=[]),
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: SendRevisionUseCase = Depends(get_send_revision_usecase),
) -> OrderSchema:
    """Заказчик отправляет исправленную документацию."""

    return details(await usecase.execute(user, order, text, files), user)


@router.post("/orders/{order_id}/conclusion-ready")
async def mark_conclusion_ready(
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: MarkConclusionReadyUseCase = Depends(get_mark_conclusion_ready_usecase),
) -> OrderSchema:
    """Эксперт сообщает, что заключение готово."""

    return details(await usecase.execute(user, order), user)


@router.post("/orders/{order_id}/conclusion")
async def send_conclusion(
    result: ConclusionResult | None = Form(None),
    files: list[UploadFile] = File(default=[]),
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: SendConclusionUseCase = Depends(get_send_conclusion_usecase),
) -> OrderSchema:
    """Исполнитель отправляет подписанное заключение или отчёт об аудите."""

    return details(await usecase.execute(user, order, result, files), user)


@router.post("/orders/{order_id}/accept-work")
async def accept_work(
    order: BlitzOrder = Depends(get_locked_order),
    user: Account = Depends(require_user),
    usecase: AcceptWorkUseCase = Depends(get_accept_work_usecase),
) -> OrderSchema:
    """Заказчик принимает работу."""

    return details(await usecase.execute(user, order), user)
