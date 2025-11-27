"""
Модели пользователя
"""
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, BigInteger, Enum, CheckConstraint
from sqlalchemy.orm import relationship

from models.base import Base


class UserRole(str, PyEnum):
    """Роли пользователей в системе"""
    CUSTOMER = "CUSTOMER"
    EXPERT = "EXPERT"


class User(Base):
    """Пользователь системы"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(Enum(UserRole),  nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "(email IS NOT NULL OR phone IS NOT NULL)",
            name="user_email_or_phone_required"
        ),
    )

    password_reset_codes = relationship(
        "PasswordResetCode",
        back_populates="user",
        cascade="all, delete-orphan"
    )
