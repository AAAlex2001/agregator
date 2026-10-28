from src.core.errors import AppError


class PostNotFoundError(AppError):
    """Поста нет, он чужой или ещё не опубликован: для пользователя это одно и то же."""

    status_code = 404
    message = "Публикация не найдена"


class PostTextTooLongError(AppError):
    """Видимый текст поста длиннее 5000 символов."""

    message = "Текст длиннее 5000 символов"


class EmptyPostError(AppError):
    """В посте нет ни текста, ни фото или видео, ни опроса."""

    message = "Напишите текст, добавьте фото, видео или опрос"


class NoPublicationTargetError(AppError):
    """Не выбрано, где публиковать: ни сайт, ни каналы."""

    message = "Выберите, где опубликовать: на сайте или в каналах"


class MediaNotFoundError(AppError):
    """Файла из формы нет, он чужой или уже прикреплён к другому посту."""

    message = "Файл не найден, загрузите его заново"


class ChannelUnavailableError(AppError):
    """Бот не может публиковать в одном из выбранных каналов."""

    message = "В один из выбранных каналов бот не может публиковать. Обновите канал"


class TelegramTextTooLongError(AppError):
    """Текст не влезает в лимит Telegram. Текст ошибки — с лимитом и длиной."""



class ButtonsInAlbumError(AppError):
    """Кнопки выбраны у поста с несколькими фото или видео."""

    message = "Кнопки нельзя прикрепить к посту с несколькими фото или видео"


class SentMediaChangedError(AppError):
    """В посте, который уже вышел в Telegram, поменяли фото или видео."""

    message = "Пост уже вышел в Telegram: фото и видео в нём менять нельзя"


class ScheduleInPastError(AppError):
    """Отложенная публикация назначена на прошедшее время."""

    message = "Время публикации уже прошло"


class ReplyTargetError(AppError):
    """Ответить в Telegram пытаются на чужой, свой же или неопубликованный пост."""

    message = "Ответить можно только на свой другой опубликованный пост"


class RepostNotEditableError(AppError):
    """Репост пытаются изменить как обычный пост."""

    message = "Репост нельзя изменить"


class MediaTooLargeError(AppError):
    """Файл больше допустимого размера. Текст ошибки — с лимитом."""



class WrongMediaTypeError(AppError):
    """Файл — не фото и не видео подходящего формата."""

    message = "Можно загрузить фото JPEG, PNG, WebP или видео MP4, MOV"


class TooManyUploadsError(AppError):
    """У автора уже 30 загруженных файлов, не прикреплённых к посту."""

    message = "Слишком много загруженных файлов без поста. Опубликуйте или удалите их"


class MediaNotOwnedError(AppError):
    """Файла нет, он чужой или уже прикреплён к посту."""

    status_code = 404
    message = "Файл не найден"
