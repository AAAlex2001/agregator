from src.core.errors import AppError


class TicketNotFoundError(AppError):
    """Обращения нет или оно чужое: для пользователя это одно и то же."""

    status_code = 404
    message = "Обращение не найдено"


class TicketClosedError(AppError):
    """В закрытое обращение пытаются написать."""

    status_code = 409
    message = "Обращение закрыто. Создайте новое."


class EmptyReplyError(AppError):
    """В ответе нет ни текста, ни файлов."""

    message = "Введите сообщение или прикрепите файл"


class TooManyFilesError(AppError):
    """Файлов больше шести."""

    message = "Можно прикрепить не больше 6 файлов"


class WrongFileTypeError(AppError):
    """Файл неподходящего формата."""

    message = "Допустимые форматы: PDF, JPEG, JPG, PNG, DOC, DOCX, XLS, XLSX"


class FileTooLargeError(AppError):
    """Файл больше 100 МБ."""

    message = "Файл больше 100 МБ не поддерживается"
