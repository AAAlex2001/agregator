"Repository: каталог тегов статей."

from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.tag import Tag


class TagRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_all(self) -> list[Tag]:
        return list((await self.db.execute(select(Tag).order_by(Tag.name))).scalars().all())

    async def create(self, name: str) -> Tag:
        "Добавляет тег (повтор игнорируется) и возвращает его. Коммит — на стороне get_db."
        await self.db.execute(
            pg_insert(Tag).values(name=name).on_conflict_do_nothing(index_elements=[Tag.name])
        )
        return (await self.db.execute(select(Tag).where(Tag.name == name))).scalars().one()

    async def get_or_create_many(self, names: list[str]) -> list[Tag]:
        "Возвращает теги по именам, создавая отсутствующие. Дубликаты схлопываются."
        clean = list(dict.fromkeys(name.strip() for name in names if name.strip()))
        if not clean:
            return []
        await self.db.execute(
            pg_insert(Tag).values([{"name": name} for name in clean]).on_conflict_do_nothing(index_elements=[Tag.name])
        )
        return list((await self.db.execute(select(Tag).where(Tag.name.in_(clean)))).scalars().all())

    async def name_taken(self, name: str, exclude_id: int) -> bool:
        stmt = select(Tag.id).where(Tag.name == name, Tag.id != exclude_id).limit(1)
        return (await self.db.execute(stmt)).scalar_one_or_none() is not None

    async def rename(self, tag_id: int, new_name: str) -> Tag | None:
        "Переименовывает тег. Статьи ссылаются по id, поэтому новое имя видно везде автоматически."
        tag = (await self.db.execute(select(Tag).where(Tag.id == tag_id))).scalars().first()
        if tag is None:
            return None
        tag.name = new_name
        return tag

    async def delete(self, tag_id: int) -> None:
        await self.db.execute(delete(Tag).where(Tag.id == tag_id))
