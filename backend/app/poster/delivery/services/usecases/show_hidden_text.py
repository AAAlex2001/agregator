"""Нажатие на скрытую кнопку под постом: подписчику — текст, остальным — приглашение."""

from typing import Any

from app.core.telegram import TelegramApi
from app.poster.delivery.options import ButtonKind, TelegramButton, TelegramOptions
from app.poster.delivery.services.telegram_payloads import parse_hidden_callback
from app.poster.publications.services.repo import PostRepository

MEMBER_STATUSES = {"creator", "administrator", "member", "restricted"}
SUBSCRIBERS_ONLY = "Текст видят только подписчики. Подпишитесь и нажмите ещё раз"
BUTTON_GONE = "Кнопка больше не работает"


class ShowHiddenTextUseCase:
    """Отвечает всплывающим окном на нажатие скрытой кнопки."""

    def __init__(self, posts: PostRepository, api: TelegramApi) -> None:
        self.posts = posts
        self.api = api

    async def execute(self, callback: dict[str, Any]) -> None:
        """Кнопки уже нет — так и пишет. Иначе проверяет, подписан ли нажавший."""

        button = await self.find_button(callback.get("data", ""))
        text = BUTTON_GONE

        if button is not None:
            chat_id = callback["message"]["chat"]["id"]
            is_member = await self.is_member(chat_id, callback["from"]["id"])
            text = button.value if is_member else button.alt or SUBSCRIBERS_ONLY

        await self.api.call(
            "answerCallbackQuery",
            {"callback_query_id": callback["id"], "text": text, "show_alert": True},
        )

    async def find_button(self, data: str) -> TelegramButton | None:
        """Скрытая кнопка поста по данным нажатия или None."""

        parsed = parse_hidden_callback(data)
        if parsed is None:
            return None

        post_id, row, column = parsed
        post = await self.posts.get_by_id(post_id)
        if post is None:
            return None

        buttons = TelegramOptions.of(post.telegram).buttons
        if row >= len(buttons) or column >= len(buttons[row]):
            return None

        button = buttons[row][column]

        return button if button.kind == ButtonKind.HIDDEN else None

    async def is_member(self, chat_id: int, user_id: int) -> bool:
        """Нажавший состоит в канале или группе."""

        member = await self.api.call("getChatMember", {"chat_id": chat_id, "user_id": user_id})

        return member.ok and member.result.get("status") in MEMBER_STATUSES
