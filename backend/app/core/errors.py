"""Ошибки сценариев. У каждой свой HTTP-код, текст и, если ошибка в поле, путь к нему."""

from fastapi import Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    """Ошибка сценария, которую видит пользователь."""

    status_code = 422
    message = "Не удалось выполнить действие"

    def __init__(self, message: str | None = None, field: str | None = None) -> None:
        super().__init__(message or self.message)
        self.field = field
        self.headers: dict[str, str] = {}


async def app_error_handler(request: Request, error: AppError) -> JSONResponse:
    """Ошибка сценария — в ответ с кодом, текстом, полем и заголовками. FastAPI передаёт и запрос."""

    body = {"detail": str(error), "field": error.field} if error.field else {"detail": str(error)}

    return JSONResponse(
        body,
        status_code=error.status_code,
        headers=error.headers,
    )
