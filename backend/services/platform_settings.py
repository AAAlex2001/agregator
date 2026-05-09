"""
Сервис доступа к глобальным настройкам платформы (singleton-строка).
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.platform_settings import PlatformSettings


class PlatformSettingsService:
    "Читает singleton-строку настроек. Если её нет, считаем что платный режим включён (бэк-совместимо)."

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self) -> PlatformSettings:
        row = (
            await self.db.execute(select(PlatformSettings).limit(1))
        ).scalar_one_or_none()
        if row is None:
            return PlatformSettings(id=1, paid_responses_enabled=True)
        return row

    async def is_paid_responses_enabled(self) -> bool:
        return (await self.get()).paid_responses_enabled
