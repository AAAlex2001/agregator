"""Запросы к аккаунтам, приглашениям и фонду программы."""

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.account import Account
from models.referral import Referral, ReferralCampaign, ReferralStatus
from schemas.referral import ReferralCounts

CAMPAIGN_ID = 1


class ReferralRepository:
    """Работает с данными в общей транзакции запроса."""

    def __init__(self, db: AsyncSession) -> None:
        """Создаёт репозиторий приглашений."""
        self.db = db

    async def find_account(self, user_id: int) -> Account | None:
        """Возвращает аккаунт с сохранёнными анкетами или None, если аккаунта нет."""
        query = select(Account).where(Account.id == user_id).execution_options(populate_existing=True)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def find_inviter(self, public_id: str) -> Account | None:
        """Возвращает владельца реферальной ссылки по публичному UUID или None."""
        query = select(Account).where(Account.public_id == public_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def find_accounts_by_email(self, email: str) -> list[Account]:
        """Возвращает аккаунты с нормализованным email среди всех ролей."""
        query = select(Account).where(func.lower(Account.email) == email)
        result = await self.db.execute(query)
        return list(result.scalars())

    async def find_by_email(self, email: str) -> Referral | None:
        """Возвращает приглашение по первоначальному email, включая удалённые аккаунты."""
        query = select(Referral).where(Referral.invited_email == email)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def find_for_invited(self, user_id: int) -> Referral | None:
        """Возвращает актуальное приглашение аккаунта или None при регистрации без ссылки."""
        query = (
            select(Referral).where(Referral.invited_id == user_id).execution_options(populate_existing=True)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_campaign(self, for_update: bool = False) -> ReferralCampaign:
        """Возвращает фонд программы. for_update=True блокирует строку до конца транзакции."""
        query = select(ReferralCampaign).where(ReferralCampaign.id == CAMPAIGN_ID)

        if for_update:
            query = query.with_for_update().execution_options(populate_existing=True)

        result = await self.db.execute(query)
        return result.scalar_one()

    async def count_by_status(self, user_id: int) -> ReferralCounts:
        """Возвращает ReferralCounts со счётчиками приглашений исполнителя по каждому статусу."""
        query = (
            select(Referral.status, func.count(Referral.id))
            .where(Referral.inviter_id == user_id)
            .group_by(Referral.status)
        )
        result = await self.db.execute(query)
        counts = ReferralCounts()

        for referral_status, count in result.all():
            if referral_status == ReferralStatus.PENDING:
                counts.pending_count = count
            elif referral_status == ReferralStatus.REWARDED:
                counts.rewarded_count = count
            elif referral_status == ReferralStatus.POOL_EXHAUSTED:
                counts.pool_exhausted_count = count
            elif referral_status == ReferralStatus.REJECTED:
                counts.rejected_count = count

        return counts

    async def add(self, referral: Referral) -> None:
        """Добавляет приглашение и сохраняет изменения в текущей транзакции."""
        self.db.add(referral)
        await self.db.flush()

    async def flush(self) -> None:
        """Отправляет накопленные изменения сессии в БД без коммита."""
        await self.db.flush()
