"""Свои шаблоны постов: список, сохранение, удаление."""

from fastapi import APIRouter, Depends, status

from app.auth.sessions.dependencies import require_user
from app.poster.templates.dependencies import (
    get_own_template,
    get_save_template_usecase,
    get_template_repository,
)
from app.poster.templates.models import PostTemplate
from app.poster.templates.schemas import TemplateSaveSchema, TemplateSchema
from app.poster.templates.services.repo import TemplateRepository
from app.poster.templates.services.usecases.save_template import SaveTemplateUseCase
from models.account import Account

router = APIRouter(prefix="/poster/templates", tags=["poster"])


@router.get("")
async def list_templates(
    user: Account = Depends(require_user),
    templates: TemplateRepository = Depends(get_template_repository),
) -> list[TemplateSchema]:
    """Свои шаблоны, новые первыми."""

    items = await templates.list_for_owner(user.id)

    return [TemplateSchema.model_validate(item) for item in items]


@router.post("", status_code=status.HTTP_201_CREATED)
async def save_template(
    payload: TemplateSaveSchema,
    user: Account = Depends(require_user),
    usecase: SaveTemplateUseCase = Depends(get_save_template_usecase),
) -> TemplateSchema:
    """Сохранить текст из редактора шаблоном."""

    template = await usecase.execute(user=user, title=payload.title, html=payload.html)

    return TemplateSchema.model_validate(template)


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template: PostTemplate = Depends(get_own_template),
    templates: TemplateRepository = Depends(get_template_repository),
) -> None:
    """Удалить свой шаблон."""

    await templates.delete(template)
