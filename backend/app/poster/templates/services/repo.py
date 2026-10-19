"""Запросы к шаблонам."""

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.poster.templates.models import PostTemplate


class TemplateRepository:
    """Доступ к таблице post_templates."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_for_owner(self, owner_id: int) -> list[PostTemplate]:
        """Шаблоны автора, новые первыми."""

        stmt = (
            select(PostTemplate)
            .where(PostTemplate.owner_id == owner_id)
            .order_by(PostTemplate.created_at.desc(), PostTemplate.id.desc())
        )
        templates = await self.db.scalars(stmt)

        return list(templates)

    async def count_for_owner(self, owner_id: int) -> int:
        """Сколько шаблонов у автора."""

        stmt = select(func.count()).where(PostTemplate.owner_id == owner_id)

        return await self.db.scalar(stmt) or 0

    async def get_for_owner(self, template_id: int, owner_id: int) -> PostTemplate | None:
        """Свой шаблон по id или None."""

        stmt = select(PostTemplate).where(
            PostTemplate.id == template_id,
            PostTemplate.owner_id == owner_id,
        )

        return await self.db.scalar(stmt)

    async def add(self, template: PostTemplate) -> PostTemplate:
        """Сохраняет шаблон."""

        self.db.add(template)
        await self.db.flush()
        await self.db.refresh(template)

        return template

    async def delete(self, template: PostTemplate) -> None:
        """Удаляет шаблон."""

        await self.db.delete(template)
        await self.db.flush()
