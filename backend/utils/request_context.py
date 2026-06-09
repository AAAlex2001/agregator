"Контекст запроса: request_id для трассировки логов между хэндлером и фоновыми задачами."
from contextvars import ContextVar

request_id_var: ContextVar[str | None] = ContextVar("request_id", default=None)
