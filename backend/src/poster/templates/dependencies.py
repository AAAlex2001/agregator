from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db
from src.poster.templates.repository import TemplateRepository
from src.poster.templates.usecases.delete_template import DeleteTemplateUseCase
from src.poster.templates.usecases.list_templates import ListTemplatesUseCase
from src.poster.templates.usecases.save_template import SaveTemplateUseCase


def get_list_templates_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ListTemplatesUseCase:
    """Собирает сценарий списка шаблонов."""
    return ListTemplatesUseCase(TemplateRepository(db))


def get_save_template_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> SaveTemplateUseCase:
    """Собирает сценарий сохранения шаблона."""
    return SaveTemplateUseCase(TemplateRepository(db))


def get_delete_template_usecase(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> DeleteTemplateUseCase:
    """Собирает сценарий удаления шаблона."""
    return DeleteTemplateUseCase(TemplateRepository(db))
