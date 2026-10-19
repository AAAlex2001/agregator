"""Ошибки файлов поста."""

from app.core.errors import AppError


class PostMediaNotFoundError(AppError):
    """Удаляемого файла нет, он чужой или уже привязан к посту."""

    status_code = 404
    message = "Файл не найден"


class TooManyPostMediaError(AppError):
    """Загружено слишком много файлов, ещё не привязанных к посту."""

    message = "Слишком много загруженных файлов. Опубликуйте пост или удалите лишние"


class UploadError(AppError):
    """Файл не подходит: неверный формат или превышен размер."""
