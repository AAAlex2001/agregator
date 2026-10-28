from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.poster.templates.models import PostTemplate


class TemplateRepository:
    """Читает и записывает шаблоны постов."""

    def __init__(self, db: AsyncSession) -> None:
        """Запоминает сессию базы данных."""
        self.db = db

    async def list_for_owner(self, owner_id: int) -> list[PostTemplate]:
        """Возвращает шаблоны автора, новые первыми."""
        query = (
            select(PostTemplate)
            .where(PostTemplate.owner_id == owner_id)
            .order_by(PostTemplate.created_at.desc())
        )
        result = await self.db.execute(query)

        return list(result.scalars())

    async def count_for_owner(self, owner_id: int) -> int:
        """Считает шаблоны автора."""
        query = select(func.count()).where(PostTemplate.owner_id == owner_id)
        result = await self.db.execute(query)

        return result.scalar_one()

    async def get_for_owner(self, template_id: int, owner_id: int) -> PostTemplate | None:
        """Возвращает шаблон автора по id или None, если его нет или он чужой."""
        query = select(PostTemplate).where(
            PostTemplate.id == template_id,
            PostTemplate.owner_id == owner_id,
        )
        result = await self.db.execute(query)

        return result.scalar_one_or_none()

    async def add(self, template: PostTemplate) -> None:
        """Сохраняет новый шаблон в базе."""
        self.db.add(template)
        await self.db.flush()

    async def delete(self, template: PostTemplate) -> None:
        """Удаляет шаблон из базы."""
        await self.db.delete(template)
        await self.db.flush()
