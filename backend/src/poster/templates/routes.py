from typing import Annotated

from fastapi import APIRouter, Depends, status

from src.accounts.models import Account
from src.auth.sessions.dependencies import require_user
from src.poster.templates.dependencies import (
    get_delete_template_usecase,
    get_list_templates_usecase,
    get_save_template_usecase,
)
from src.poster.templates.schemas import SaveTemplateRequest, TemplateResponse
from src.poster.templates.usecases.delete_template import DeleteTemplateUseCase
from src.poster.templates.usecases.list_templates import ListTemplatesUseCase
from src.poster.templates.usecases.save_template import SaveTemplateUseCase

router = APIRouter(prefix="/poster/templates", tags=["Шаблоны"])


@router.get("", response_model=list[TemplateResponse])
async def list_templates(
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[ListTemplatesUseCase, Depends(get_list_templates_usecase)],
) -> list[TemplateResponse]:
    """Возвращает мои шаблоны."""
    return await usecase.execute(user=user)


@router.post("", status_code=status.HTTP_201_CREATED, response_model=TemplateResponse)
async def save_template(
    data: SaveTemplateRequest,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[SaveTemplateUseCase, Depends(get_save_template_usecase)],
) -> TemplateResponse:
    """Сохраняет текст из редактора шаблоном."""
    return await usecase.execute(user=user, data=data)


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template_id: int,
    user: Annotated[Account, Depends(require_user)],
    usecase: Annotated[DeleteTemplateUseCase, Depends(get_delete_template_usecase)],
) -> None:
    """Удаляет мой шаблон."""
    await usecase.execute(user=user, template_id=template_id)
