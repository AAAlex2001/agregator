"""Ошибки комментариев."""

from app.core.errors import AppError


class CommentNotFoundError(AppError):
    """Комментария нет, он чужой или к другому посту."""

    status_code = 404
    message = "Комментарий не найден"
