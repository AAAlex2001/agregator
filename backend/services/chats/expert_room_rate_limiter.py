import time
from collections import deque

from fastapi import HTTPException, status


RATE_LIMIT_WINDOW_SECONDS = 10.0
RATE_LIMIT_MAX_PER_WINDOW = 5


class ExpertRoomRateLimiter:
    "Sliding window: не больше N сообщений за окно от одного эксперта."

    def __init__(self) -> None:
        self.buckets: dict[int, deque[float]] = {}

    def check(self, user_id: int) -> None:
        now = time.monotonic()
        bucket = self.buckets.get(user_id)
        if bucket is None:
            bucket = deque(maxlen=RATE_LIMIT_MAX_PER_WINDOW)
            self.buckets[user_id] = bucket

        while bucket and now - bucket[0] > RATE_LIMIT_WINDOW_SECONDS:
            bucket.popleft()

        if len(bucket) >= RATE_LIMIT_MAX_PER_WINDOW:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Слишком много сообщений. Подождите немного.",
            )

        bucket.append(now)


expert_room_rate_limiter = ExpertRoomRateLimiter()
