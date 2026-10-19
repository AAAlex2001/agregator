"""Предпросмотр поста в Telegram."""

from fastapi import APIRouter, Depends

from app.auth.sessions.dependencies import require_user
from app.poster.delivery.schemas import TelegramPreviewRequestSchema, TelegramPreviewSchema
from app.poster.delivery.services.telegram_markup import length_limit, telegram_length, to_telegram
from app.poster.publications.services.text import clean_html

router = APIRouter(prefix="/poster", tags=["poster"], dependencies=[Depends(require_user)])


@router.post("/telegram-preview")
async def preview_telegram(payload: TelegramPreviewRequestSchema) -> TelegramPreviewSchema:
    """Текст поста так, как его покажет Telegram, и сколько символов осталось."""

    text = to_telegram(clean_html(payload.html))

    return TelegramPreviewSchema(
        html=text,
        length=telegram_length(text),
        limit=length_limit(payload.media_count),
    )
