"""Привязка Telegram: репозиторий и фабрики сценариев."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.telegram import TelegramApi, get_telegram_api
from app.telegram.link.services.repo import TelegramLinkRepository
from app.telegram.link.services.usecases.create_link import CreateLinkUseCase


def get_link_repository(db: AsyncSession = Depends(get_db)) -> TelegramLinkRepository:
    """Ссылки на бота и привязки с сессией текущего запроса."""

    return TelegramLinkRepository(db)


def get_create_link_usecase(
    links: TelegramLinkRepository = Depends(get_link_repository),
    api: TelegramApi = Depends(get_telegram_api),
) -> CreateLinkUseCase:
    """Сценарий ссылки на бота."""

    return CreateLinkUseCase(links, api)
