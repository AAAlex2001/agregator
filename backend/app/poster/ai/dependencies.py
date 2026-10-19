"""ИИ-помощник: фабрика сценария с клиентом модели из настроек."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.ai import AiClient
from app.core.config import Settings, get_settings
from app.core.database import get_db
from app.poster.ai.services.repo import AiRequestRepository
from app.poster.ai.services.usecases.write_post import WritePostUseCase


def get_write_post_usecase(
    db: AsyncSession = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> WritePostUseCase:
    """Сценарий ИИ-помощника."""

    ai = AiClient(settings.proxyapi_key, settings.ai_base_url, settings.ai_model)

    return WritePostUseCase(ai, AiRequestRepository(db), settings.ai_requests_per_hour)
