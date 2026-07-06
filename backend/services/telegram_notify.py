"Сервисный модуль: telegram_notify (отправка сообщений пользователю ботом)."
import asyncio
import logging

import httpx

from config import telegram_config

logger = logging.getLogger(__name__)

SEND_RETRIES = 3


async def send_telegram_message(chat_id: int, text: str) -> None:
    "Шлёт сообщение через Telegram Bot API с ретраями и обработкой 429. Ошибки доставки только в лог."
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
    timeout = httpx.Timeout(10.0, connect=5.0)
    for attempt in range(1, SEND_RETRIES + 1):
        try:
            async with httpx.AsyncClient(timeout=timeout, proxy=proxy) as client:
                response = await client.post(url, json=payload)
        except httpx.HTTPError as error:
            logger.warning("Telegram: попытка %s не удалась, chat_id=%s: %s", attempt, chat_id, type(error).__name__)
            if attempt == SEND_RETRIES:
                return
            await asyncio.sleep(0.5 * attempt)
            continue
        if response.status_code == 200:
            return
        if response.status_code == 429 and attempt < SEND_RETRIES:
            try:
                delay = float(response.json()["parameters"]["retry_after"])
            except Exception:
                delay = 3.0
            logger.warning("Telegram: 429 для chat_id=%s, повтор через %.0f с", chat_id, delay)
            await asyncio.sleep(min(delay, 30.0))
            continue
        logger.warning("Telegram: ошибка %s для chat_id=%s: %s", response.status_code, chat_id, response.text[:200])
        return
