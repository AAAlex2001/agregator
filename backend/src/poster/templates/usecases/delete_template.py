from src.accounts.models import Account
from src.poster.templates.exceptions import TemplateNotFoundError
from src.poster.templates.repository import TemplateRepository


class DeleteTemplateUseCase:
    """Удаление своего шаблона."""

    def __init__(self, templates: TemplateRepository) -> None:
        """Принимает репозиторий шаблонов."""
        self.templates = templates

    async def execute(self, *, user: Account, template_id: int) -> None:
        """Удаляет шаблон пользователя."""
        template = await self.templates.get_for_owner(template_id, user.id)

        if template is None:
            raise TemplateNotFoundError()

        await self.templates.delete(template)
