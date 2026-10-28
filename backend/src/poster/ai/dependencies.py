from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.ai import AiClient, get_ai
from src.core.config import get_settings
from src.core.database import get_db
from src.poster.ai.repository import AiRequestRepository
from src.poster.ai.usecases.write_post import WritePostUseCase


def get_write_post_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
    ai: Annotated[AiClient, Depends(get_ai)],
) -> WritePostUseCase:
    """Собирает сценарий ИИ-помощника с лимитом запросов из настроек."""
    return WritePostUseCase(ai, AiRequestRepository(db), get_settings().ai_requests_per_hour)
