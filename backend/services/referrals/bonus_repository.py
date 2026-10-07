"""Доступ к бонусному счёту и истории начислений."""

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.referral import BonusAccount, BonusTransaction


class BonusRepository:
    """Хранит бонусы, не принимает решения об условиях приглашения."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_balance(self, user_id: int) -> int:
        """Возвращает бонусный баланс в плюсах; ноль, если счёт ещё не создан."""
        query = select(BonusAccount.balance_points).where(BonusAccount.user_id == user_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() or 0

    async def get_account_for_update(self, user_id: int) -> BonusAccount:
        """Создаёт бонусный счёт при необходимости и блокирует его до конца транзакции."""
        statement = insert(BonusAccount).values(user_id=user_id, balance_points=0)
        statement = statement.on_conflict_do_nothing(index_elements=["user_id"])
        await self.db.execute(statement)

        query = (
            select(BonusAccount)
            .where(BonusAccount.user_id == user_id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        result = await self.db.execute(query)
        return result.scalar_one()

    async def add_transaction(self, transaction: BonusTransaction) -> None:
        """Сохраняет начисление в журнале вместе с изменением бонусного счёта."""
        self.db.add(transaction)
        await self.db.flush()
