"""Ссылка на бота: привязать Telegram и подключить каналы."""

from fastapi import APIRouter, Depends

from app.auth.sessions.dependencies import require_user
from app.telegram.link.dependencies import get_create_link_usecase
from app.telegram.link.schemas import TelegramLinkSchema
from app.telegram.link.services.usecases.create_link import CreateLinkUseCase
from models.account import Account

router = APIRouter(prefix="/telegram", tags=["telegram"])


@router.post("/link")
async def create_link(
    user: Account = Depends(require_user),
    usecase: CreateLinkUseCase = Depends(get_create_link_usecase),
) -> TelegramLinkSchema:
    """Одноразовая ссылка на бота на 15 минут."""

    url = await usecase.execute(user=user)

    return TelegramLinkSchema(url=url)
