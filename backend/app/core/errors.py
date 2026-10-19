"""Ошибки сценариев. У каждой свой HTTP-код и текст — их отдаёт общий обработчик."""

from fastapi import Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    """Ошибка сценария, которую видит пользователь."""

    status_code = 422
    message = "Не удалось выполнить действие"

    def __init__(self, message: str | None = None) -> None:
        super().__init__(message or self.message)
        self.headers: dict[str, str] = {}


async def app_error_handler(request: Request, error: AppError) -> JSONResponse:
    """Ошибка сценария — в ответ с её кодом, текстом и заголовками. FastAPI передаёт и запрос."""

    return JSONResponse(
        {"detail": str(error)},
        status_code=error.status_code,
        headers=error.headers,
    )
