"""Данные реферальной программы для личного кабинета. Суммы — в копейках."""

from pydantic import BaseModel


class ReferralOverview(BaseModel):
    """Персональная ссылка, бонусы и результат приглашений."""

    referral_url: str
    reward_kopecks: int
    balance_kopecks: int
    accepting_referrals: bool
    invited_count: int
    pending_count: int
    rewarded_count: int
    pool_exhausted_count: int
    rejected_count: int
