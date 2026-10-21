"""Аудиторы — активные эксперты с анкетой «Аудит СУПБ»: они берут заявки на аудит и входят в группы."""

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.account import Account, UserRole
from models.audit import ExpertAuditProfile
from models.expert import Expert


class AuditRepository:
    """Доступ к анкетам аудиторов."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    def auditors(self) -> Select[tuple[Account]]:
        """Запрос активных экспертов с анкетой аудитора."""

        return (
            select(Account)
            .join(Expert, Expert.account_id == Account.id)
            .join(ExpertAuditProfile, ExpertAuditProfile.expert_id == Expert.id)
            .where(Account.role == UserRole.EXPERT, Account.is_active.is_(True))
        )

    async def list_auditors(self) -> list[Account]:
        """Активные эксперты с анкетой аудитора по алфавиту."""

        stmt = self.auditors().order_by(Account.last_name, Account.first_name)

        return list(await self.db.scalars(stmt))

    async def get_auditor(self, account_id: int) -> Account | None:
        """Аудитор по id или None."""

        return await self.db.scalar(self.auditors().where(Account.id == account_id))

    async def is_auditor(self, account_id: int) -> bool:
        """Есть ли у эксперта анкета аудитора."""

        return await self.get_auditor(account_id) is not None
