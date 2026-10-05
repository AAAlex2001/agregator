"""Данные реферальной программы для личного кабинета. Суммы — в копейках."""

from pydantic import BaseModel


class ReferralCounts(BaseModel):
    """Количество приглашений исполнителя по каждому статусу."""

    pending_count: int = 0
    rewarded_count: int = 0
    pool_exhausted_count: int = 0
    rejected_count: int = 0

    @property
    def total_count(self) -> int:
        """Возвращает общее количество приглашений во всех статусах."""
        return self.pending_count + self.rewarded_count + self.pool_exhausted_count + self.rejected_count


class ReferralOverview(BaseModel):
    """Персональная ссылка, бонусы и результат приглашений."""

    referral_code: str
    referral_url: str
    reward_kopecks: int
    balance_kopecks: int
    pool_total_kopecks: int
    pool_remaining_kopecks: int
    accepting_referrals: bool
    invited_count: int
    pending_count: int
    rewarded_count: int
    pool_exhausted_count: int
    rejected_count: int
    withdrawal_allowed: bool = False
