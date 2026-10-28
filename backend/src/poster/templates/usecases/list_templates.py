from src.accounts.models import Account
from src.poster.templates.repository import TemplateRepository
from src.poster.templates.schemas import TemplateResponse


class ListTemplatesUseCase:
    """Список своих шаблонов."""

    def __init__(self, templates: TemplateRepository) -> None:
        """Принимает репозиторий шаблонов."""
        self.templates = templates

    async def execute(self, *, user: Account) -> list[TemplateResponse]:
        """Возвращает шаблоны пользователя, новые первыми."""
        templates = await self.templates.list_for_owner(user.id)

        return [TemplateResponse.model_validate(template) for template in templates]
