import logging
import os
import uuid
from time import time

import redis.asyncio as redis

log = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

RATE_LIMIT_LUA = """
local now = tonumber(ARGV[1])
local cutoff = tonumber(ARGV[2])
local max_calls = tonumber(ARGV[3])
local ttl = tonumber(ARGV[4])
local member = ARGV[5]
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', cutoff)
local count = redis.call('ZCARD', KEYS[1])
if count >= max_calls then
    return 0
end
redis.call('ZADD', KEYS[1], now, member)
redis.call('EXPIRE', KEYS[1], ttl)
return 1
"""


class RedisSlidingWindow:
    "Sliding-window лимитер на Redis ZSET. Атомарность через Lua, кросс-репликовый."

    def __init__(self) -> None:
        self.client: redis.Redis | None = None
        self.script = None

    async def start(self) -> None:
        "Поднимает Redis-клиент и регистрирует Lua-скрипт. Идемпотентна."
        if self.client is not None:
            return
        try:
            self.client = redis.from_url(
                REDIS_URL,
                decode_responses=True,
                health_check_interval=30,
                socket_keepalive=True,
                retry_on_timeout=True,
            )
            await self.client.ping()
            self.script = self.client.register_script(RATE_LIMIT_LUA)
            log.info("redis_sliding_window: started")
        except Exception:
            log.exception("redis_sliding_window: failed to start, rate-limit will fail-open")
            self.client = None
            self.script = None

    async def stop(self) -> None:
        "Закрывает Redis-клиент. Идемпотентна."
        if self.client is None:
            return
        try:
            await self.client.aclose()
        except Exception:
            log.exception("redis_sliding_window: aclose failed")
        self.client = None
        self.script = None
        log.info("redis_sliding_window: stopped")

    async def is_allowed(self, key: str, max_calls: int, window_seconds: float) -> bool:
        "True — попытка разрешена. False — лимит превышен. Fail-open при недоступности Redis."
        if self.script is None:
            return True
        now = time()
        cutoff = now - window_seconds
        ttl = int(window_seconds) + 1
        member = f"{now}:{uuid.uuid4().hex}"
        try:
            result = await self.script(keys=[key], args=[now, cutoff, max_calls, ttl, member])
        except Exception:
            log.exception("redis_sliding_window: is_allowed failed key=%s", key)
            return True
        return bool(int(result))

    async def seconds_until_free(self, key: str, window_seconds: float) -> int:
        "Сколько секунд осталось до освобождения самого старого слота. Минимум 1."
        if self.client is None:
            return 1
        try:
            result = await self.client.zrange(key, 0, 0, withscores=True)
        except Exception:
            log.exception("redis_sliding_window: seconds_until_free failed key=%s", key)
            return 1
        if not result:
            return 1
        oldest_score = float(result[0][1])
        remaining = oldest_score + window_seconds - time()
        return max(1, int(remaining))


redis_sliding_window = RedisSlidingWindow()
