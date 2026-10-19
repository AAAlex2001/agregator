"""Апдейт от Telegram: /start со ссылкой, выбранный чат, изменение прав бота, смена id группы."""

from typing import Any

from app.core.errors import AppError
from app.core.telegram import TelegramApi
from app.poster.channels.services.exceptions import BotNotInChatError
from app.poster.channels.services.repo import ChannelRepository
from app.poster.channels.services.telegram_chats import GONE_STATUSES, TelegramChats
from app.poster.channels.services.usecases.connect_channel import ConnectChannelUseCase, ConnectResult
from app.poster.channels.services.usecases.update_chat_access import UpdateChatAccessUseCase
from app.telegram.bot.services import texts
from app.telegram.bot.services.keyboards import CONNECT_KEYBOARD
from app.telegram.link.services.usecases.link_account import LinkAccountUseCase

START = "/start"


class HandleUpdateUseCase:
    """Раздаёт апдейт сценариям. Ошибки сценариев бот пересказывает пользователю."""

    def __init__(
        self,
        api: TelegramApi,
        link: LinkAccountUseCase,
        connect: ConnectChannelUseCase,
        access: UpdateChatAccessUseCase,
        channels: ChannelRepository,
        chats: TelegramChats,
    ) -> None:
        self.api = api
        self.link = link
        self.connect = connect
        self.access = access
        self.channels = channels
        self.chats = chats

    async def execute(self, update: dict[str, Any]) -> None:
        """Сообщение в личке или в группе либо изменение прав бота в чате."""

        if "message" in update:
            await self.on_message(update["message"])

        if "my_chat_member" in update:
            await self.on_bot_member(update["my_chat_member"])

    async def on_message(self, message: dict[str, Any]) -> None:
        """Группа стала супергруппой, выбран чат кнопкой или пришла команда /start."""

        if "migrate_to_chat_id" in message:
            await self.channels.move_chat(message["chat"]["id"], message["migrate_to_chat_id"])
            return

        if message["chat"]["type"] != "private":
            return

        user_id = message["from"]["id"]

        if "chat_shared" in message:
            await self.on_chat_shared(user_id, message["chat_shared"]["chat_id"])
            return

        text = message.get("text", "")
        if text.startswith(START):
            await self.on_start(user_id, text.removeprefix(START).strip())

    async def on_start(self, user_id: int, token: str) -> None:
        """По ссылке с сайта Telegram привязывается к аккаунту и появляются кнопки выбора чата."""

        if not token:
            await self.reply(user_id, texts.GREETING, CONNECT_KEYBOARD)
            return

        account = await self.link.execute(token, user_id)
        if account is None:
            await self.reply(user_id, texts.LINK_EXPIRED)
            return

        await self.reply(user_id, texts.LINKED, CONNECT_KEYBOARD)

    async def on_chat_shared(self, user_id: int, chat_id: int) -> None:
        """Чат выбран кнопкой. Если бот ещё не добавлен, подключит апдейт my_chat_member."""

        try:
            result = await self.connect.execute(user_id, chat_id)
        except BotNotInChatError:
            return
        except AppError as error:
            await self.reply(user_id, str(error))
            return

        await self.report(user_id, result)

    async def on_bot_member(self, member: dict[str, Any]) -> None:
        """Бота добавили, повысили, понизили или удалили. Чужой чат без подключений бот покидает."""

        chat = member["chat"]
        if chat["type"] == "private":
            return

        status = member["new_chat_member"]["status"]
        await self.access.execute(chat["id"], status)
        if status in GONE_STATUSES:
            return

        user_id = member["from"]["id"]
        try:
            result = await self.connect.execute(user_id, chat["id"])
        except AppError:
            await self.leave_if_unused(chat["id"])
            return

        await self.report(user_id, result)

    async def leave_if_unused(self, chat_id: int) -> None:
        """Бот выходит из чата, который никто не подключил."""

        if await self.channels.count_by_chat(chat_id) == 0:
            await self.chats.leave(chat_id)

    async def report(self, user_id: int, result: ConnectResult) -> None:
        """Сообщает о подключении один раз и о нехватке прав — каждый раз."""

        if result.became_ready:
            await self.reply(user_id, texts.connected(result.channel))
        elif not result.channel.can_post:
            await self.reply(user_id, texts.connected_without_rights(result.channel))

    async def reply(self, user_id: int, text: str, keyboard: dict[str, Any] | None = None) -> None:
        """Сообщение в личку пользователю."""

        payload: dict[str, Any] = {"chat_id": user_id, "text": text, "parse_mode": "HTML"}
        if keyboard is not None:
            payload["reply_markup"] = keyboard

        await self.api.call("sendMessage", payload)
