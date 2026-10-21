"""Аудиторы и руководители групп. Аудитор — эксперт с анкетой «Аудит СУПБ», руководителя назначает админ."""

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.blitz.audit.models import AuditLead
from models.account import Account, UserRole
from models.audit import ExpertAuditProfile
from models.expert import Expert


class AuditRepository:
    """Доступ к анкетам аудиторов и списку руководителей групп."""

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

    async def lead_ids(self) -> set[int]:
        """Аккаунты руководителей групп."""

        return set(await self.db.scalars(select(AuditLead.account_id)))

    async def is_lead(self, account_id: int) -> bool:
        """Руководит ли эксперт аудиторскими группами."""

        return await self.db.get(AuditLead, account_id) is not None

    async def list_leads(self) -> list[Account]:
        """Руководители групп: им приходят новые заявки на аудит."""

        stmt = (
            select(Account)
            .join(AuditLead, AuditLead.account_id == Account.id)
            .where(Account.is_active.is_(True))
        )

        return list(await self.db.scalars(stmt))

    async def set_lead(self, account_id: int, lead: bool) -> None:
        """Назначить или снять руководителя группы."""

        current = await self.db.get(AuditLead, account_id)

        if lead and current is None:
            self.db.add(AuditLead(account_id=account_id))

        if not lead and current is not None:
            await self.db.delete(current)

        await self.db.flush()
