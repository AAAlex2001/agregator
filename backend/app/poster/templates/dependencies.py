"""Шаблоны: репозиторий, фабрика сценария и свой шаблон по id."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.sessions.dependencies import require_user
from app.core.database import get_db
from app.poster.templates.models import PostTemplate
from app.poster.templates.services.exceptions import TemplateNotFoundError
from app.poster.templates.services.repo import TemplateRepository
from app.poster.templates.services.usecases.save_template import SaveTemplateUseCase
from models.account import Account


def get_template_repository(db: AsyncSession = Depends(get_db)) -> TemplateRepository:
    """Шаблоны с сессией текущего запроса."""

    return TemplateRepository(db)


def get_save_template_usecase(
    templates: TemplateRepository = Depends(get_template_repository),
) -> SaveTemplateUseCase:
    """Сценарий сохранения шаблона."""

    return SaveTemplateUseCase(templates)


async def get_own_template(
    template_id: int,
    user: Account = Depends(require_user),
    templates: TemplateRepository = Depends(get_template_repository),
) -> PostTemplate:
    """Свой шаблон по id из пути. Чужой выглядит как несуществующий — 404."""

    template = await templates.get_for_owner(template_id, user.id)
    if template is None:
        raise TemplateNotFoundError

    return template
