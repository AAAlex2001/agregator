"""
Модели контента лендинга — редактируются из админки.
"""
from sqlalchemy import Column, Integer, String, Text, Enum as SAEnum
from sqlalchemy.dialects.postgresql import JSONB

from models.base import Base


class LandingHero(Base):
    __tablename__ = "landing_hero"

    id = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False, default="")
    subtitle = Column(Text, nullable=False, default="")
    button_text = Column(String(200), nullable=False, default="")

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
        SAEnum("client", "expert", name="landingsteprole"),
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
