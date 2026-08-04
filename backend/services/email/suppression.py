"Repository: глобальный стоп-лист адресов (отписки/жалобы). Любая рассылка обязана его исключать."

from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.email_suppression import EmailSuppression


def normalize_email(email: str) -> str:
    return email.strip().lower()


class SuppressionRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def add(self, email: str, reason: str = "unsubscribe") -> None:
        "Добавляет адрес в стоп-лист, повтор игнорируется. Коммит — на стороне вызывающего (get_db)."
        stmt = (
            pg_insert(EmailSuppression)
            .values(email=normalize_email(email), reason=reason)
            .on_conflict_do_nothing(index_elements=[EmailSuppression.email])
        )
        await self.db.execute(stmt)
