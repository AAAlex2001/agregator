from fastapi import HTTPException, Request, status

from utils.redis_sliding_window import redis_sliding_window


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limit(scope: str, max_calls: int, window_seconds: float):
    "Фабрика FastAPI-зависимости: ограничивает scope до N вызовов за окно для одного IP."

    async def dependency(request: Request) -> None:
        key = f"rl:http:{scope}:{client_ip(request)}"
        if await redis_sliding_window.is_allowed(key, max_calls, window_seconds):
            return
        retry_after = await redis_sliding_window.seconds_until_free(key, window_seconds)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Слишком много запросов. Попробуйте позже.",
            headers={"Retry-After": str(retry_after)},
        )

    return dependency
