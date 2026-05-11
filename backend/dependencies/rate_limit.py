"""
HTTP rate-limiter под single-worker (WEB_CONCURRENCY=1).

Ключ = endpoint + IP клиента (x-forwarded-for уважается).
При исчерпании лимита отдаёт 429 Too Many Requests с заголовком Retry-After.
"""
from fastapi import HTTPException, Request, status

from utils.sliding_window import SlidingWindow


http_window = SlidingWindow()


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limit(scope: str, max_calls: int, window_seconds: float):
    "Фабрика FastAPI-зависимости: ограничивает scope до N вызовов за окно для одного IP."

    async def dependency(request: Request) -> None:
        key = f"{scope}:{client_ip(request)}"
        if http_window.is_allowed(key, max_calls, window_seconds):
            return
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Слишком много запросов. Попробуйте позже.",
            headers={"Retry-After": str(http_window.seconds_until_free(key, window_seconds))},
        )

    return dependency
