"""Что Telegram знает о чате: вид, название, участники и права бота."""

from dataclasses import dataclass
from typing import Any

from app.core.telegram import TelegramApi
from app.poster.channels.models import ChannelKind, PosterChannel

ADMIN_STATUSES = {"creator", "administrator"}
GONE_STATUSES = {"left", "kicked"}


@dataclass(frozen=True)
class ChatInfo:
    """Свежие сведения о чате."""

    kind: str
    title: str
    username: str | None
    members_count: int | None
    can_post: bool

    def apply_to(self, channel: PosterChannel) -> None:
        """Переносит сведения в подключение и помечает его действующим."""

        channel.kind = self.kind
        channel.title = self.title
        channel.username = self.username
        channel.members_count = self.members_count
        channel.can_post = self.can_post
        channel.is_active = True


def bot_can_post(kind: str, member: dict[str, Any]) -> bool:
    """В канале бот публикует как администратор с правом постов, в группе — как администратор."""

    if member.get("status") != "administrator":
        return False

    if kind == ChannelKind.CHANNEL:
        return bool(member.get("can_post_messages"))

    return True


class TelegramChats:
    """Запросы к Bot API о чатах."""

    def __init__(self, api: TelegramApi) -> None:
        self.api = api

    async def inspect(self, chat_id: int) -> ChatInfo | None:
        """Сведения о чате или None, если бот его не видит."""

        chat = await self.api.call("getChat", {"chat_id": chat_id})
        if not chat.ok:
            return None

        bot = await self.api.call("getChatMember", {"chat_id": chat_id, "user_id": self.api.bot_id})
        members = await self.api.call("getChatMemberCount", {"chat_id": chat_id})
        kind = chat.result["type"]

        return ChatInfo(
            kind=kind,
            title=chat.result.get("title", ""),
            username=chat.result.get("username"),
            members_count=members.result,
            can_post=bot.ok and bot_can_post(kind, bot.result),
        )

    async def is_admin(self, chat_id: int, telegram_user_id: int) -> bool:
        """Пользователь — создатель или администратор чата."""

        member = await self.api.call("getChatMember", {"chat_id": chat_id, "user_id": telegram_user_id})

        return member.ok and member.result.get("status") in ADMIN_STATUSES

    async def leave(self, chat_id: int) -> None:
        """Бот выходит из чата."""

        await self.api.call("leaveChat", {"chat_id": chat_id})
