"""
Сервис доступа к глобальным настройкам платформы (singleton-строка).
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.platform_settings import PlatformSettings

#123

class PlatformSettingsService:
    "Читает singleton-строку настроек. Если её нет, считаем что платный режим включён (бэк-совместимо)."

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get(self) -> PlatformSettings:
        "Публичный метод сервисного слоя."
        row = (
            await self.db.execute(select(PlatformSettings).limit(1))
        ).scalar_one_or_none()
        if row is None:
            return PlatformSettings(id=1, paid_responses_enabled=True, paid_tools_enabled=True)
        return row

    async def is_paid_responses_enabled(self) -> bool:
        "Платный режим откликов на заказы."
        return (await self.get()).paid_responses_enabled

    async def is_paid_tools_enabled(self) -> bool:
        "Платный доступ к инструментам эксперта (Оценка крепи / Оценка опасности)."
        return (await self.get()).paid_tools_enabled
