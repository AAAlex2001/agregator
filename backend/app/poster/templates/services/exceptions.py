"""Ошибки шаблонов."""

from app.core.errors import AppError


class TemplateNotFoundError(AppError):
    """Шаблона нет или он чужой."""

    status_code = 404
    message = "Шаблон не найден"


class TooManyTemplatesError(AppError):
    """Шаблонов больше лимита."""

    message = "Шаблонов уже 50 — удалите ненужные"


class EmptyTemplateError(AppError):
    """В шаблоне нет текста."""

    message = "Напишите текст, чтобы сохранить его шаблоном"
