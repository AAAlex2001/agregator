from src.core.errors import AppError


class CommentNotFoundError(AppError):
    """Комментария нет, он чужой или под другим постом."""

    status_code = 404
    message = "Комментарий не найден"
