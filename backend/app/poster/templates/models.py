"""Шаблоны текста поста: сохранить заготовку и вставить её в новый пост."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.base import Base

MAX_TEMPLATE_TITLE = 100


class PostTemplate(Base):
    """Шаблон автора: название и текст из редактора."""

    __tablename__ = "post_templates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"),
        index=True,
    )
    title: Mapped[str] = mapped_column(String(MAX_TEMPLATE_TITLE))
    html: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
