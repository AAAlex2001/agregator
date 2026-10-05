"""Сборка зависимостей рефералки на одной сессии БД."""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from config import email_config
from database.database import get_db
from services.referrals import (
    BonusRepository,
    GetReferralOverviewUseCase,
    ReferralRepository,
    ReferralValidator,
    RegisterReferralUseCase,
    RewardReferralUseCase,
)


def get_referral_repository(db: AsyncSession = Depends(get_db)) -> ReferralRepository:
    """Создаёт репозиторий приглашений для текущего запроса."""
    return ReferralRepository(db)


def get_bonus_repository(db: AsyncSession = Depends(get_db)) -> BonusRepository:
    """Создаёт репозиторий бонусов в общей транзакции запроса."""
    return BonusRepository(db)


def get_referral_validator(
    repo: ReferralRepository = Depends(get_referral_repository),
) -> ReferralValidator:
    """Создаёт валидатор условий реферальной программы."""
    return ReferralValidator(repo)


def get_register_referral_use_case(
    repo: ReferralRepository = Depends(get_referral_repository),
    validator: ReferralValidator = Depends(get_referral_validator),
) -> RegisterReferralUseCase:
    """Собирает сценарий привязки приглашённого при регистрации."""
    return RegisterReferralUseCase(repo, validator)


def get_reward_referral_use_case(
    repo: ReferralRepository = Depends(get_referral_repository),
    validator: ReferralValidator = Depends(get_referral_validator),
    bonuses: BonusRepository = Depends(get_bonus_repository),
) -> RewardReferralUseCase:
    """Собирает сценарий начисления бонуса."""
    return RewardReferralUseCase(repo, validator, bonuses)


def get_referral_overview_use_case(
    repo: ReferralRepository = Depends(get_referral_repository),
    validator: ReferralValidator = Depends(get_referral_validator),
    bonuses: BonusRepository = Depends(get_bonus_repository),
) -> GetReferralOverviewUseCase:
    """Собирает сценарий чтения реферального блока."""
    return GetReferralOverviewUseCase(repo, validator, bonuses, email_config.public_base_url)
