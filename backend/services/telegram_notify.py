"Сервисный модуль: telegram_notify (отправка сообщений пользователю ботом)."
import logging

import httpx

from config import telegram_config

logger = logging.getLogger(__name__)


async def send_telegram_message(chat_id: int, text: str) -> None:
    "Шлёт сообщение пользователю через Telegram Bot API. Ошибки доставки только в лог."
    token = telegram_config.telegram_bot_token
    if not token:
        return
    try:
        # IPv4 Bot API режет РКН → форсим IPv6 (адрес резолвится динамически по DNS).
        transport = httpx.AsyncHTTPTransport(local_address="::")
        async with httpx.AsyncClient(timeout=10.0, transport=transport) as client:
            await client.post(
                f"https://api.telegram.org/bot{token}/sendMessage",
                json={
                    "chat_id": chat_id,
                    "text": text,
                    "parse_mode": "HTML",
                    "disable_web_page_preview": True,
                },
            )
    except Exception:
        logger.exception("Не удалось отправить Telegram-уведомление chat_id=%s", chat_id)
