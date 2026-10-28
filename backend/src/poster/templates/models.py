from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.core.base import Base, utc_now

MAX_TEMPLATE_TITLE = 100
MAX_TEMPLATES = 50


class PostTemplate(Base):
    """Шаблон автора: название и заготовка текста поста."""

    __tablename__ = "post_templates"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(MAX_TEMPLATE_TITLE))
    html: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
