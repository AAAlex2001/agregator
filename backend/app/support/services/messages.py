"""Сообщение пользователя в обращении."""

from datetime import UTC, datetime

from app.support.models import SupportTicketMessage, TicketMessageAuthor
from models.account import Account


def author_name(user: Account) -> str:
    """Имя и фамилия, без них — почта, без почты — номер аккаунта."""

    full_name = " ".join(part for part in (user.first_name, user.last_name) if part)

    return full_name or user.email or f"Account #{user.id}"


def user_message(
    user: Account,
    text: str,
    attachments: list[dict[str, str]],
) -> SupportTicketMessage:
    """Новое сообщение от имени пользователя."""

    return SupportTicketMessage(
        author_kind=TicketMessageAuthor.USER,
        author_user_id=user.id,
        author_name=author_name(user),
        text=text,
        attachments=attachments,
        created_at=datetime.now(UTC),
    )
