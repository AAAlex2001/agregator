from typing import Annotated

from fastapi import APIRouter, Depends

from src.accounts.models import Account
from src.auth.sessions.dependencies import require_user
from src.poster.ai.dependencies import get_write_post_usecase
from src.poster.ai.schemas import WriteWithAiRequest, WriteWithAiResponse
from src.poster.ai.usecases.write_post import WritePostUseCase

router = APIRouter(prefix="/posts", tags=["ИИ-помощник"])


@router.post("/assistant", response_model=WriteWithAiResponse)
async def write_with_ai(
    data: WriteWithAiRequest,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[WritePostUseCase, Depends(get_write_post_usecase)],
) -> WriteWithAiResponse:
    """Пишет пост по моей просьбе или переделывает текущий текст."""
    return await usecase.execute(user=user, data=data)
