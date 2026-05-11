"""
Универсальный sliding-window лимитер: считает попытки за последние N секунд.
Используется в HTTP rate-limit зависимости и в use-case'ах с собственными ключами.
"""
from collections import defaultdict, deque
from time import monotonic
from typing import Deque


class SlidingWindow:
    "Хранит таймстампы попыток на ключ и проверяет, не превышен ли лимит за окно."

    def __init__(self) -> None:
        self.hits: dict[str, Deque[float]] = defaultdict(deque)

    def is_allowed(self, key: str, max_calls: int, window_seconds: float) -> bool:
        "True — попытка разрешена, добавлена в окно. False — лимит превышен."
        now = monotonic()
        cutoff = now - window_seconds
        queue = self.hits[key]

        while queue and queue[0] < cutoff:
            queue.popleft()

        if len(queue) >= max_calls:
            return False

        queue.append(now)
        return True

    def seconds_until_free(self, key: str, window_seconds: float) -> int:
        "Сколько секунд осталось до освобождения самого старого слота. Минимум 1."
        queue = self.hits.get(key)
        if not queue:
            return 1
        remaining = queue[0] + window_seconds - monotonic()
        return max(1, int(remaining))
