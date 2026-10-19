"""ИИ-помощник автора поста."""

from fastapi import APIRouter, Depends

from app.auth.sessions.dependencies import require_user
from app.poster.ai.dependencies import get_write_post_usecase
from app.poster.ai.schemas import AssistantAnswerSchema, AssistantRequestSchema
from app.poster.ai.services.usecases.write_post import WritePostUseCase
from models.account import Account

router = APIRouter()


@router.post("/assistant")
async def write_with_ai(
    payload: AssistantRequestSchema,
    user: Account = Depends(require_user),
    usecase: WritePostUseCase = Depends(get_write_post_usecase),
) -> AssistantAnswerSchema:
    """Пишет пост по просьбе автора или переделывает текущий текст."""

    html = await usecase.execute(user=user, instruction=payload.instruction, html=payload.html)

    return AssistantAnswerSchema(html=html)
