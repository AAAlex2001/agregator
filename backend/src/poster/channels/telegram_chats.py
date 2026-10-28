from dataclasses import dataclass
from typing import Any

from src.core.telegram import TelegramClient
from src.poster.channels.models import ChannelKind, PosterChannel


@dataclass
class ChatInfo:
    """Что Telegram знает о чате прямо сейчас."""

    kind: str
    title: str
    username: str | None
    members_count: int
    can_post: bool

    def copy_to(self, channel: PosterChannel) -> None:
        """Записывает свежие сведения в подключение и отмечает, что бот в чате."""
        channel.kind = self.kind
        channel.title = self.title
        channel.username = self.username
        channel.members_count = self.members_count
        channel.can_post = self.can_post
        channel.is_active = True


class TelegramChats:
    """Спрашивает у Telegram о чатах: что это за чат и какие права у бота."""

    def __init__(self, telegram: TelegramClient) -> None:
        """Запоминает клиент бота."""
        self.telegram = telegram

    async def read(self, chat_id: int) -> ChatInfo:
        """Возвращает сведения о чате. Если бот чат не видит — TelegramError."""
        chat = await self.telegram.call("getChat", {"chat_id": chat_id})
        bot = await self.telegram.call(
            "getChatMember",
            {"chat_id": chat_id, "user_id": self.telegram.bot_id},
        )
        members_count = await self.telegram.call("getChatMemberCount", {"chat_id": chat_id})

        return ChatInfo(
            kind=chat["type"],
            title=chat.get("title", ""),
            username=chat.get("username"),
            members_count=members_count,
            can_post=bot_can_post(chat["type"], bot),
        )

    async def leave(self, chat_id: int) -> None:
        """Бот выходит из чата."""
        await self.telegram.call("leaveChat", {"chat_id": chat_id})


def bot_can_post(kind: str, bot: dict[str, Any]) -> bool:
    """Бот публикует, только если он администратор. В канале ему ещё нужно право на посты."""
    if bot["status"] != "administrator":
        return False

    if kind == ChannelKind.CHANNEL:
        return bot.get("can_post_messages", False)

    return True
