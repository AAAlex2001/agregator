"""Ошибки обращений в поддержку."""

from app.core.errors import AppError


class SupportError(AppError):
    """Ошибка обращения в поддержку."""


class TicketNotFoundError(SupportError):
    """Обращения нет или оно чужое."""

    status_code = 404
    message = "Обращение не найдено"


class TicketClosedError(SupportError):
    """В закрытое обращение писать нельзя."""

    status_code = 409
    message = "Обращение закрыто. Создайте новое."


class EmptyReplyError(SupportError):
    """Ответ без текста и без файлов."""

    status_code = 400
    message = "Введите сообщение или прикрепите файл"


class AttachmentError(SupportError):
    """Файлов слишком много или они неподходящего формата."""

    status_code = 400
