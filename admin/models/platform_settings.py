"""
Глобальные настройки платформы — синглтон, редактируется из админки.
"""
from sqlalchemy import Boolean
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class PlatformSettings(Base):
    "Singleton row (id=1)."
    __tablename__ = "platform_settings"

    id: Mapped[int] = mapped_column(primary_key=True)
    paid_responses_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    paid_tools_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    def __str__(self) -> str:
        return "Настройки платформы"
