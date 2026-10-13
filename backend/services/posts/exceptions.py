"""Ошибки публикаций.

У каждой свой HTTP-код и текст для пользователя — их отдаёт общий обработчик.
"""

import math


class PostError(Exception):
    """Ошибка сценария публикаций, которую видит пользователь."""

    status_code = 422
    message = "Не удалось выполнить действие"

    def __init__(self, message: str | None = None) -> None:
        super().__init__(message or self.message)
        self.headers: dict[str, str] = {}


class PostNotFoundError(PostError):
    """Публикации нет, она чужая или ещё не опубликована."""

    status_code = 404
    message = "Публикация не найдена"


class CommentNotFoundError(PostError):
    """Комментария нет или он к другому посту."""

    status_code = 404
    message = "Комментарий не найден"


class AuthorNotFoundError(PostError):
    """Автора нет или его учётная запись отключена."""

    status_code = 404
    message = "Автор не найден"


class ReportNotFoundError(PostError):
    """Жалобы нет."""

    status_code = 404
    message = "Жалоба не найдена"


class SelfFollowError(PostError):
    """Подписка на самого себя."""

    message = "Нельзя подписаться на себя"


class EmptyPostError(PostError):
    """В посте нет ни текста, ни файлов."""

    message = "Напишите текст, добавьте фото или видео"


class PostTextTooLongError(PostError):
    """Текст публикации длиннее лимита."""


class PostMediaNotFoundError(PostError):
    """Удаляемого файла нет, он чужой или уже привязан к посту."""

    status_code = 404
    message = "Файл не найден"


class PostMediaUnavailableError(PostError):
    """Файл из формы поста нельзя прикрепить: его нет, он чужой или занят другим постом."""

    message = "Файл не найден, загрузите его заново"


class TooManyPostMediaError(PostError):
    """Загружено слишком много файлов, ещё не привязанных к посту."""

    message = "Слишком много загруженных файлов. Опубликуйте пост или удалите лишние"


class UploadError(PostError):
    """Файл не подходит: неверный формат или превышен размер."""


class RepostNotEditableError(PostError):
    """Репост нельзя изменить — только удалить."""

    message = "Репост нельзя изменить, его можно только удалить"


class TooManyAiRequestsError(PostError):
    """Лимит запросов к ИИ на час исчерпан."""

    status_code = 429

    def __init__(self, retry_after: int) -> None:
        minutes = math.ceil(retry_after / 60)
        super().__init__(f"Лимит запросов к ИИ исчерпан. Попробуйте через {minutes} мин")
        self.retry_after = retry_after
        self.headers = {"Retry-After": str(retry_after)}


class AiUnavailableError(PostError):
    """Модель не ответила или ответила пустым текстом."""

    status_code = 503
    message = "ИИ-помощник сейчас не отвечает. Попробуйте ещё раз чуть позже"
