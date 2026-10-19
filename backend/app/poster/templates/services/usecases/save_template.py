"""Сохранение текста шаблоном."""

from app.poster.publications.services.text import check_text_length, clean_html, plain_text
from app.poster.templates.models import PostTemplate
from app.poster.templates.services.exceptions import EmptyTemplateError, TooManyTemplatesError
from app.poster.templates.services.repo import TemplateRepository
from models.account import Account

MAX_TEMPLATES = 50


class SaveTemplateUseCase:
    """Чистит текст как у поста и сохраняет его шаблоном автора."""

    def __init__(self, templates: TemplateRepository) -> None:
        self.templates = templates

    async def execute(self, user: Account, title: str, html: str) -> PostTemplate:
        """Пустой текст — EmptyTemplateError, больше 50 шаблонов — TooManyTemplatesError."""

        cleaned = clean_html(html)
        check_text_length(cleaned)
        if not plain_text(cleaned):
            raise EmptyTemplateError

        if await self.templates.count_for_owner(user.id) >= MAX_TEMPLATES:
            raise TooManyTemplatesError

        return await self.templates.add(PostTemplate(owner_id=user.id, title=title, html=cleaned))
