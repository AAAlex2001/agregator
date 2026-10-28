from src.poster.delivery.telegram_text import length_limit, telegram_length, to_telegram_html
from src.poster.posts.schemas import TelegramPreviewRequest, TelegramPreviewResponse
from src.poster.posts.text import clean_html


class PreviewTelegramUseCase:
    """Предпросмотр поста в редакторе: как он будет выглядеть в Telegram."""

    async def execute(self, *, data: TelegramPreviewRequest) -> TelegramPreviewResponse:
        """Переводит текст в разметку Telegram и считает, сколько он занимает из лимита."""
        telegram_html = to_telegram_html(clean_html(data.html))

        return TelegramPreviewResponse(
            html=telegram_html,
            length=telegram_length(telegram_html),
            limit=length_limit(data.media_count),
        )
