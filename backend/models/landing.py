"""
Модели контента лендинга — редактируются из админки.
"""
from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import JSONB

from models.base import Base


class LandingHero(Base):
    __tablename__ = "landing_hero"

    id = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False, default="")
    subtitle = Column(Text, nullable=False, default="")
    button_text = Column(String(200), nullable=False, default="")
    bullets = Column(JSONB, nullable=False, default=list)

    def __str__(self):
        return "Hero"


class LandingSectionHeader(Base):
    __tablename__ = "landing_section_headers"

    id = Column(Integer, primary_key=True)
    block_key = Column(String(64), nullable=False, unique=True, index=True)
    title = Column(Text, nullable=False, default="")
    subtitle = Column(Text, nullable=False, default="")

    def __str__(self):
        return f"Header: {self.block_key}"


class LandingStep(Base):
    __tablename__ = "landing_steps"

    id = Column(Integer, primary_key=True)
    block = Column(
        SAEnum("how_it_works", "key_advantages", name="landingstepblock"),
        nullable=False,
        index=True,
    )
    role = Column(
        SAEnum("client", "expert", "license_holder", name="landingsteprole"),
        nullable=False,
        index=True,
    )
    position = Column(Integer, nullable=False, default=0)
    title = Column(String(500), nullable=False, default="")
    description = Column(Text, nullable=False, default="")
    sub_description = Column(Text, nullable=False, default="")
    icon = Column(String(200), nullable=False, default="")

    def __str__(self):
        return f"{self.block}/{self.role}/{self.position} {self.title}"


class LandingOrderExample(Base):
    __tablename__ = "landing_orders_examples"

    id = Column(Integer, primary_key=True)
    position = Column(Integer, nullable=False, default=0)
    title = Column(Text, nullable=False, default="")
    price = Column(String(100), nullable=False, default="")
    description = Column(Text, nullable=False, default="")

    def __str__(self):
        return self.title or f"Order #{self.id}"


class LandingAdvantage(Base):
    __tablename__ = "landing_advantages"

    id = Column(Integer, primary_key=True)
    position = Column(Integer, nullable=False, default=0)
    title = Column(String(500), nullable=False, default="")
    description = Column(Text, nullable=False, default="")
    icon_key = Column(
        SAEnum("diploma", "quick", "search", "comment", name="landingadvantageicon"),
        nullable=False,
    )
    photo = Column(String(200), nullable=False, default="")

    def __str__(self):
        return self.title or f"Advantage #{self.id}"


class LandingIndustry(Base):
    __tablename__ = "landing_industries"

    id = Column(Integer, primary_key=True)
    position = Column(Integer, nullable=False, default=0)
    title = Column(String(500), nullable=False, default="")
    descriptions = Column(JSONB, nullable=False, default=list)
    photo = Column(String(200), nullable=False, default="")

    def __str__(self):
        return self.title or f"Industry #{self.id}"


class LandingReview(Base):
    __tablename__ = "landing_reviews"

    id = Column(Integer, primary_key=True)
    position = Column(Integer, nullable=False, default=0)
    reviewer = Column(String(200), nullable=False, default="")
    reviewer_position = Column(String(500), nullable=False, default="")
    text = Column(Text, nullable=False, default="")
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    def __str__(self):
        return self.reviewer or f"Review #{self.id}"


class LandingFaq(Base):
    __tablename__ = "landing_faq"

    id = Column(Integer, primary_key=True)
    position = Column(Integer, nullable=False, default=0)
    question = Column(Text, nullable=False, default="")
    answer = Column(Text, nullable=False, default="")

    def __str__(self):
        return self.question[:60] or f"FAQ #{self.id}"


class LandingPricingContent(Base):
    "Тексты pricing-секции на лендинге (singleton). Сами тарифы лежат в pricing_plans."
    __tablename__ = "landing_pricing_content"

    id = Column(Integer, primary_key=True)
    expert_title = Column(Text, nullable=False, default="")
    expert_subtitle = Column(Text, nullable=False, default="")
    expert_footnote = Column(Text, nullable=False, default="")
    customer_title = Column(Text, nullable=False, default="")
    customer_subtitle = Column(Text, nullable=False, default="")
    customer_headline = Column(Text, nullable=False, default="")
    customer_features = Column(JSONB, nullable=False, default=list)
    customer_footnote = Column(Text, nullable=False, default="")
    customer_cta_label = Column(String(200), nullable=False, default="")
    customer_cta_href = Column(String(500), nullable=False, default="")
    license_holder_title = Column(Text, nullable=False, default="")
    license_holder_subtitle = Column(Text, nullable=False, default="")
    license_holder_headline = Column(Text, nullable=False, default="")
    license_holder_features = Column(JSONB, nullable=False, default=list)
    license_holder_footnote = Column(Text, nullable=False, default="")
    license_holder_cta_label = Column(String(200), nullable=False, default="")
    license_holder_cta_href = Column(String(500), nullable=False, default="")

    def __str__(self):
        return "Pricing content"
