"""
Глобальные настройки платформы — синглтон, редактируется из админки.
"""
from sqlalchemy import Boolean, Column, Integer

from models.base import Base


class PlatformSettings(Base):
    "Singleton row (id=1)."
    __tablename__ = "platform_settings"

    id = Column(Integer, primary_key=True)
    paid_responses_enabled = Column(Boolean, nullable=False, default=True)

    def __str__(self):
        return "Настройки платформы"
