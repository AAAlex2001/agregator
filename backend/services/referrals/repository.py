"""Запросы к аккаунтам, приглашениям и фонду программы."""

from sqlalchemy import exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.account import Account
from models.referral import Referral, ReferralCampaign, ReferralStatus

CAMPAIGN_ID = 1


class ReferralRepository:
    """Работает с данными в общей транзакции запроса."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def find_account(self, user_id: int) -> Account | None:
        """Перечитывает аккаунт вместе с анкетами, чтобы проверка видела сохранённые данные."""
        query = select(Account).where(Account.id == user_id).execution_options(populate_existing=True)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def find_inviter(self, public_id: str) -> Account | None:
        """Возвращает владельца реферальной ссылки по публичному UUID."""
        result = await self.db.execute(select(Account).where(Account.public_id == public_id))
        return result.scalar_one_or_none()

    async def has_other_accounts(self, email: str, account_id: int) -> bool:
        """Проверяет, есть ли с этим email другие аккаунты в любой роли."""
        query = select(exists().where(func.lower(Account.email) == email.lower(), Account.id != account_id))
        result = await self.db.execute(query)
        return bool(result.scalar())

    async def find_by_email(self, email: str) -> Referral | None:
        """Возвращает приглашение по каноническому email, включая удалённые аккаунты."""
        result = await self.db.execute(select(Referral).where(Referral.invited_email == email))
        return result.scalar_one_or_none()

    async def find_for_invited(self, user_id: int) -> Referral | None:
        """Перечитывает приглашение аккаунта; None — регистрация без ссылки."""
        query = (
            select(Referral).where(Referral.invited_id == user_id).execution_options(populate_existing=True)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_campaign(self, for_update: bool = False) -> ReferralCampaign:
        """Возвращает фонд программы; for_update блокирует строку до конца транзакции."""
        query = select(ReferralCampaign).where(ReferralCampaign.id == CAMPAIGN_ID)
        if for_update:
            query = query.with_for_update().execution_options(populate_existing=True)
        result = await self.db.execute(query)
        return result.scalar_one()

    async def count_by_status(self, user_id: int) -> dict[ReferralStatus, int]:
        """Возвращает количество приглашений исполнителя по статусам."""
        query = (
            select(Referral.status, func.count(Referral.id))
            .where(Referral.inviter_id == user_id)
            .group_by(Referral.status)
        )
        result = await self.db.execute(query)
        return dict(result.tuples().all())

    async def add(self, referral: Referral) -> None:
        """Добавляет приглашение в текущую транзакцию."""
        self.db.add(referral)
        await self.db.flush()

    async def flush(self) -> None:
        """Отправляет накопленные изменения сессии в БД без коммита."""
        await self.db.flush()
