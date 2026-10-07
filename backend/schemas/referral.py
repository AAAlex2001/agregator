"""Данные реферальной программы для личного кабинета. Суммы — в плюсах (внутренних баллах)."""

from pydantic import BaseModel


class ReferralOverview(BaseModel):
    """Персональная ссылка, бонусы и результат приглашений."""

    referral_url: str
    reward_points: int
    balance_points: int
    pool_total_points: int
    pool_remaining_points: int
    accepting_referrals: bool
    invited_count: int
    pending_count: int
    rewarded_count: int
    pool_exhausted_count: int
    rejected_count: int
