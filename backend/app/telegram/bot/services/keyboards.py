"""Кнопки бота «Подключить канал» и «Подключить группу».

Telegram показывает в них только чаты, где пользователь администратор,
и сам добавляет туда бота с нужными правами.
"""

from typing import Any

CHANNEL_REQUEST_ID = 1
GROUP_REQUEST_ID = 2

RIGHT_NAMES = [
    "is_anonymous",
    "can_manage_chat",
    "can_delete_messages",
    "can_manage_video_chats",
    "can_restrict_members",
    "can_promote_members",
    "can_change_info",
    "can_invite_users",
    "can_post_stories",
    "can_edit_stories",
    "can_delete_stories",
    "can_post_messages",
    "can_edit_messages",
    "can_pin_messages",
]


def admin_rights(*granted: str) -> dict[str, bool]:
    """Права администратора: все обязательные поля Telegram, включены только перечисленные."""

    return {name: name in granted for name in RIGHT_NAMES}


def chat_button(text: str, request_id: int, is_channel: bool, rights: dict[str, bool]) -> dict[str, Any]:
    """Кнопка выбора чата: и у пользователя, и у бота должны быть эти права."""

    return {
        "text": text,
        "request_chat": {
            "request_id": request_id,
            "chat_is_channel": is_channel,
            "user_administrator_rights": rights,
            "bot_administrator_rights": rights,
            "request_title": True,
            "request_username": True,
        },
    }


CHANNEL_RIGHTS = admin_rights("can_post_messages", "can_edit_messages", "can_delete_messages")
GROUP_RIGHTS = admin_rights("can_delete_messages", "can_pin_messages")

CONNECT_KEYBOARD = {
    "keyboard": [
        [chat_button("📢 Подключить канал", CHANNEL_REQUEST_ID, True, CHANNEL_RIGHTS)],
        [chat_button("👥 Подключить группу", GROUP_REQUEST_ID, False, GROUP_RIGHTS)],
    ],
    "resize_keyboard": True,
}
