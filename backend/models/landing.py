"""
Модели контента лендинга — редактируются из админки.
"""
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from models.base import Base


class LandingHero(Base):
    """Hero-блок лендинга."""
    __tablename__ = "landing_hero"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(Text, nullable=False, default="")
    subtitle: Mapped[str] = mapped_column(Text, nullable=False, default="")
    button_text: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    bullets: Mapped[list[Any]] = mapped_column(JSONB, nullable=False, default=list)

    def __str__(self) -> str:
        return "Hero"


class LandingSectionHeader(Base):
    """Заголовок секции лендинга."""
    __tablename__ = "landing_section_headers"

    id: Mapped[int] = mapped_column(primary_key=True)
    block_key: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True)
    title: Mapped[str] = mapped_column(Text, nullable=False, default="")
    subtitle: Mapped[str] = mapped_column(Text, nullable=False, default="")

    def __str__(self) -> str:
        return f"Header: {self.block_key}"


class LandingStep(Base):
    """Шаг блока «как это работает» / «ключевые преимущества» по ролям."""
    __tablename__ = "landing_steps"

    id: Mapped[int] = mapped_column(primary_key=True)
    block: Mapped[str] = mapped_column(
        SAEnum("how_it_works", "key_advantages", name="landingstepblock"),
        nullable=False,
        index=True,
    )
    role: Mapped[str] = mapped_column(
        SAEnum("client", "expert", "license_holder", name="landingsteprole"),
        nullable=False,
        index=True,
    )
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    title: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    sub_description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    icon: Mapped[str] = mapped_column(String(200), nullable=False, default="")

    def __str__(self) -> str:
        return f"{self.block}/{self.role}/{self.position} {self.title}"


class LandingOrderExample(Base):
    """Пример заказа в одноимённом блоке лендинга."""
    __tablename__ = "landing_orders_examples"

    id: Mapped[int] = mapped_column(primary_key=True)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    title: Mapped[str] = mapped_column(Text, nullable=False, default="")
    price: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")

    def __str__(self) -> str:
        return self.title or f"Order #{self.id}"


class LandingAdvantage(Base):
    """Преимущество в одноимённом блоке лендинга."""
    __tablename__ = "landing_advantages"

    id: Mapped[int] = mapped_column(primary_key=True)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    title: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    icon_key: Mapped[str] = mapped_column(
        SAEnum("diploma", "quick", "search", "comment", name="landingadvantageicon"),
        nullable=False,
    )
    photo: Mapped[str] = mapped_column(String(200), nullable=False, default="")

    def __str__(self) -> str:
        return self.title or f"Advantage #{self.id}"


class LandingIndustry(Base):
    """Отрасль в блоке отраслей лендинга."""
    __tablename__ = "landing_industries"

    id: Mapped[int] = mapped_column(primary_key=True)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    title: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    descriptions: Mapped[list[Any]] = mapped_column(JSONB, nullable=False, default=list)
    photo: Mapped[str] = mapped_column(String(200), nullable=False, default="")

    def __str__(self) -> str:
        return self.title or f"Industry #{self.id}"


class LandingReview(Base):
    """Отзыв на лендинге."""
    __tablename__ = "landing_reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    reviewer: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    reviewer_position: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    def __str__(self) -> str:
        return self.reviewer or f"Review #{self.id}"


class LandingFaq(Base):
    """FAQ-запись на лендинге."""
    __tablename__ = "landing_faq"

    id: Mapped[int] = mapped_column(primary_key=True)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    question: Mapped[str] = mapped_column(Text, nullable=False, default="")
    answer: Mapped[str] = mapped_column(Text, nullable=False, default="")

    def __str__(self) -> str:
        return self.question[:60] or f"FAQ #{self.id}"


class LandingPricingContent(Base):
    "Тексты pricing-секции на лендинге (singleton). Сами тарифы лежат в pricing_plans."
    __tablename__ = "landing_pricing_content"

    id: Mapped[int] = mapped_column(primary_key=True)
    expert_title: Mapped[str] = mapped_column(Text, nullable=False, default="")
    expert_subtitle: Mapped[str] = mapped_column(Text, nullable=False, default="")
    expert_footnote: Mapped[str] = mapped_column(Text, nullable=False, default="")
    customer_title: Mapped[str] = mapped_column(Text, nullable=False, default="")
    customer_subtitle: Mapped[str] = mapped_column(Text, nullable=False, default="")
    customer_headline: Mapped[str] = mapped_column(Text, nullable=False, default="")
    customer_features: Mapped[list[Any]] = mapped_column(JSONB, nullable=False, default=list)
    customer_footnote: Mapped[str] = mapped_column(Text, nullable=False, default="")
    customer_cta_label: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    customer_cta_href: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    license_holder_title: Mapped[str] = mapped_column(Text, nullable=False, default="")
    license_holder_subtitle: Mapped[str] = mapped_column(Text, nullable=False, default="")
    license_holder_headline: Mapped[str] = mapped_column(Text, nullable=False, default="")
    license_holder_features: Mapped[list[Any]] = mapped_column(JSONB, nullable=False, default=list)
    license_holder_footnote: Mapped[str] = mapped_column(Text, nullable=False, default="")
    license_holder_cta_label: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    license_holder_cta_href: Mapped[str] = mapped_column(String(500), nullable=False, default="")

    def __str__(self) -> str:
        return "Pricing content"
