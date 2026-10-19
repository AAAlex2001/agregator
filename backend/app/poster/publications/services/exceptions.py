"""Ошибки публикаций."""

from app.core.errors import AppError


class PostNotFoundError(AppError):
    """Публикации нет, она чужая или ещё не опубликована."""

    status_code = 404
    message = "Публикация не найдена"


class EmptyPostError(AppError):
    """В посте нет ни текста, ни файлов."""

    message = "Напишите текст, добавьте фото или видео"


class PostTextTooLongError(AppError):
    """Текст публикации длиннее лимита."""


class PostMediaUnavailableError(AppError):
    """Файл из формы нельзя прикрепить: его нет, он чужой или занят другим постом."""

    message = "Файл не найден, загрузите его заново"


class RepostNotEditableError(AppError):
    """Репост нельзя изменить — только удалить."""

    message = "Репост нельзя изменить, его можно только удалить"


class NoPublicationTargetError(AppError):
    """Не выбрано, где публиковать."""

    message = "Выберите, где опубликовать: на сайте или в Telegram-каналах"


class ChannelUnavailableError(AppError):
    """Канала нет, он чужой или бот не может в него публиковать."""

    message = "В выбранный канал нельзя опубликовать: проверьте права бота на странице «Каналы и группы»"


class TelegramTextTooLongError(AppError):
    """Текст не помещается в сообщение или подпись Telegram."""


class SentMediaLockedError(AppError):
    """Фото и видео уже вышедшего в Telegram поста изменить нельзя."""

    message = "Пост уже вышел в Telegram: фото и видео в нём изменить нельзя, только текст"
