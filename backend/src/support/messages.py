from datetime import UTC, datetime

from src.accounts.models import Account
from src.support.models import MessageAuthor, TicketMessage


def new_user_message(user: Account, text: str, attachments: list[dict[str, str]]) -> TicketMessage:
    """Создаёт сообщение от пользователя с его именем или почтой в подписи."""
    full_name = " ".join(part for part in (user.first_name, user.last_name) if part)

    return TicketMessage(
        author_kind=MessageAuthor.USER,
        author_user_id=user.id,
        author_name=full_name or user.email or f"Account #{user.id}",
        text=text,
        attachments=attachments,
        created_at=datetime.now(UTC),
    )
