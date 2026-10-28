from fastapi import Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    """Ошибка, текст которой видит пользователь."""

    status_code = 400
    message = "Не удалось выполнить действие"

    def __init__(self, message: str | None = None) -> None:
        """Запоминает текст ошибки. Без текста остаётся текст по умолчанию из класса."""
        if message is not None:
            self.message = message

        super().__init__(self.message)


async def app_error_handler(request: Request, error: AppError) -> JSONResponse:
    """Превращает AppError в ответ: {"detail": "текст ошибки"} с кодом ошибки."""
    return JSONResponse({"detail": error.message}, status_code=error.status_code)
