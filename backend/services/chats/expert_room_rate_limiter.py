from fastapi import HTTPException, status

from utils.sliding_window import SlidingWindow


RATE_LIMIT_WINDOW_SECONDS = 10.0
RATE_LIMIT_MAX_PER_WINDOW = 5


class ExpertRoomRateLimiter:
    "Sliding window: не больше N сообщений за окно от одного эксперта."

    def __init__(self) -> None:
        self.window = SlidingWindow()

    def check(self, user_id: int) -> None:
        key = str(user_id)
        if self.window.is_allowed(key, RATE_LIMIT_MAX_PER_WINDOW, RATE_LIMIT_WINDOW_SECONDS):
            return
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Слишком много сообщений. Подождите немного.",
        )


expert_room_rate_limiter = ExpertRoomRateLimiter()
