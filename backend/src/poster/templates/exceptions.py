from src.core.errors import AppError


class TemplateNotFoundError(AppError):
    """Шаблона нет или он чужой."""

    status_code = 404
    message = "Шаблон не найден"


class TooManyTemplatesError(AppError):
    """У автора уже 50 шаблонов."""

    message = "Шаблонов уже 50 — удалите ненужные"


class EmptyTemplateError(AppError):
    """В шаблоне нет видимого текста."""

    message = "Напишите текст, чтобы сохранить его шаблоном"
