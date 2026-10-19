"""Бот на long polling. Запускается одним процессом: python -m app.telegram.bot.polling.

Telegram отдаёт апдейты только одному getUpdates, поэтому бот живёт в отдельном контейнере,
а не в репликах бэкенда. При старте webhook удаляется, если он был.
"""

import asyncio
import logging
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import SessionLocal
from app.core.telegram import TelegramApi, get_telegram_api
from app.poster.channels.services.repo import ChannelRepository
from app.poster.channels.services.telegram_chats import TelegramChats
from app.poster.channels.services.usecases.connect_channel import ConnectChannelUseCase
from app.poster.channels.services.usecases.update_chat_access import UpdateChatAccessUseCase
from app.poster.delivery.services.usecases.show_hidden_text import ShowHiddenTextUseCase
from app.poster.publications.services.repo import PostRepository
from app.telegram.bot.services.usecases.handle_update import HandleUpdateUseCase
from app.telegram.link.services.repo import TelegramLinkRepository
from app.telegram.link.services.usecases.link_account import LinkAccountUseCase

logger = logging.getLogger(__name__)

ALLOWED_UPDATES = ["message", "my_chat_member", "callback_query"]
WAIT_SECONDS = 25
RETRY_SECONDS = 5


def handle_update_usecase(db: AsyncSession, api: TelegramApi) -> HandleUpdateUseCase:
    """Сценарий апдейта со всеми его частями на одной сессии базы."""

    links = TelegramLinkRepository(db)
    channels = ChannelRepository(db)
    chats = TelegramChats(api)

    return HandleUpdateUseCase(
        api=api,
        link=LinkAccountUseCase(links),
        connect=ConnectChannelUseCase(channels, links, chats),
        access=UpdateChatAccessUseCase(channels, chats),
        hidden=ShowHiddenTextUseCase(PostRepository(db), api),
        channels=channels,
        chats=chats,
    )


async def handle(update: dict[str, Any], api: TelegramApi) -> None:
    """Один апдейт — одна транзакция. Сбой пишется в лог и не останавливает бота."""

    try:
        async with SessionLocal() as db, db.begin():
            await handle_update_usecase(db, api).execute(update)
    except Exception:
        logger.exception("Не удалось обработать апдейт %s", update.get("update_id"))


async def run_polling() -> None:
    """Удаляет webhook и забирает апдейты по очереди, пока процесс жив."""

    api = get_telegram_api()
    await api.call("deleteWebhook", {"drop_pending_updates": False})
    offset = 0

    while True:
        payload = {"offset": offset, "timeout": WAIT_SECONDS, "allowed_updates": ALLOWED_UPDATES}
        reply = await api.call("getUpdates", payload)

        if not reply.ok:
            logger.warning("getUpdates не удался: %s", reply.error)
            await asyncio.sleep(RETRY_SECONDS)
            continue

        for update in reply.result:
            offset = update["update_id"] + 1
            await handle(update, api)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    asyncio.run(run_polling())
