"""Ошибки подключения каналов. Тексты видит пользователь на сайте или в боте."""

from app.core.errors import AppError


class ChannelNotFoundError(AppError):
    """Подключения нет или оно чужое."""

    status_code = 404
    message = "Канал не найден"


class TelegramNotLinkedError(AppError):
    """Telegram того, кто подключает чат, не привязан к аккаунту сайта."""

    message = "Сначала нажмите «Подключить канал» на сайте и откройте бота по той ссылке"


class NotChatAdminError(AppError):
    """Подключает не администратор чата."""

    status_code = 403
    message = "Подключить чат может только его администратор"


class BotNotInChatError(AppError):
    """Бота нет в чате, Telegram о чате ничего не говорит."""

    message = "Добавьте бота в чат администратором и попробуйте снова"
