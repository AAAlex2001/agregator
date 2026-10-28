from src.accounts.models import Account
from src.poster.posts.text import check_text_length, clean_html, plain_text
from src.poster.templates.exceptions import EmptyTemplateError, TooManyTemplatesError
from src.poster.templates.models import MAX_TEMPLATES, PostTemplate
from src.poster.templates.repository import TemplateRepository
from src.poster.templates.schemas import SaveTemplateRequest, TemplateResponse


class SaveTemplateUseCase:
    """Сохранение текста из редактора шаблоном."""

    def __init__(self, templates: TemplateRepository) -> None:
        """Принимает репозиторий шаблонов."""
        self.templates = templates

    async def execute(self, *, user: Account, data: SaveTemplateRequest) -> TemplateResponse:
        """Чистит текст так же, как у поста, и сохраняет его шаблоном. Шаблонов — не больше 50."""
        html = clean_html(data.html)
        check_text_length(html)

        if not plain_text(html):
            raise EmptyTemplateError()

        if await self.templates.count_for_owner(user.id) >= MAX_TEMPLATES:
            raise TooManyTemplatesError()

        template = PostTemplate(owner_id=user.id, title=data.title.strip(), html=html)
        await self.templates.add(template)

        return TemplateResponse.model_validate(template)
