"Repository: общий каталог тегов (переиспользуется статьями и разъяснениями РТН)."

from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.tag import Tag


class TagRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_all(self) -> list[Tag]:
        query = select(Tag).order_by(Tag.name)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create(self, name: str) -> Tag:
        "Добавляет тег (повтор игнорируется) и возвращает его. Коммит — на стороне get_db."
        insert_query = pg_insert(Tag).values(name=name).on_conflict_do_nothing(index_elements=[Tag.name])
        await self.db.execute(insert_query)

        query = select(Tag).where(Tag.name == name)
        result = await self.db.execute(query)
        return result.scalars().one()

    async def get_or_create_many(self, names: list[str]) -> list[Tag]:
        "Возвращает теги по именам, создавая отсутствующие. Дубликаты схлопываются."
        clean_names = list(dict.fromkeys(name.strip() for name in names if name.strip()))
        if not clean_names:
            return []

        insert_query = (
            pg_insert(Tag)
            .values([{"name": name} for name in clean_names])
            .on_conflict_do_nothing(index_elements=[Tag.name])
        )
        await self.db.execute(insert_query)

        query = select(Tag).where(Tag.name.in_(clean_names))
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def name_taken(self, name: str, exclude_id: int) -> bool:
        query = select(Tag.id).where(Tag.name == name, Tag.id != exclude_id).limit(1)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None

    async def rename(self, tag_id: int, new_name: str) -> Tag | None:
        "Переименовывает тег. Ссылаются по id, поэтому новое имя видно везде автоматически."
        query = select(Tag).where(Tag.id == tag_id)
        result = await self.db.execute(query)
        tag = result.scalars().first()
        if tag is None:
            return None

        tag.name = new_name
        return tag

    async def delete(self, tag_id: int) -> None:
        query = delete(Tag).where(Tag.id == tag_id)
        await self.db.execute(query)
