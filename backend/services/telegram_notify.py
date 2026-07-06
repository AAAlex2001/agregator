"Сервисный модуль: telegram_notify (отправка сообщений пользователю ботом)."
import asyncio
import logging

import httpx

from config import telegram_config

logger = logging.getLogger(__name__)

SEND_RETRIES = 3


async def send_telegram_message(chat_id: int, text: str) -> None:
    "Шлёт сообщение через Telegram Bot API с ретраями. Ошибки доставки только в лог."
    token = telegram_config.telegram_bot_token
    if not token:
        logger.warning("TELEGRAM_BOT_TOKEN не задан — Telegram-уведомление chat_id=%s пропущено", chat_id)
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }
    proxy = telegram_config.telegram_proxy or None
    route = "proxy" if proxy else "direct"
    timeout = httpx.Timeout(10.0, connect=5.0)
    for attempt in range(1, SEND_RETRIES + 1):
        try:
            async with httpx.AsyncClient(timeout=timeout, proxy=proxy) as client:
                await client.post(url, json=payload)
            return
        except (httpx.ConnectError, httpx.ConnectTimeout) as error:
            logger.warning(
                "Telegram: попытка %s (%s) не удалась, chat_id=%s: %s",
                attempt,
                route,
                chat_id,
                type(error).__name__,
            )
            if attempt == SEND_RETRIES:
                return
            await asyncio.sleep(0.5 * attempt)
        except Exception:
            logger.exception("Не удалось отправить Telegram-уведомление chat_id=%s", chat_id)
            return
