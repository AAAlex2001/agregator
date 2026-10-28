import asyncio
import logging
from collections.abc import Awaitable, Callable

from src.poster.delivery.tasks import delete_expired_messages, send_ready_posts
from src.poster.posts.tasks import delete_unused_media, publish_scheduled_posts

logger = logging.getLogger(__name__)

SCHEDULE: list[tuple[Callable[[], Awaitable[None]], int]] = [
    (publish_scheduled_posts, 3),
    (send_ready_posts, 3),
    (delete_expired_messages, 60),
    (delete_unused_media, 3600),
]


async def run_every(task: Callable[[], Awaitable[None]], seconds: int) -> None:
    """Запускает задачу снова и снова с паузой. Если задача упала, пишет ошибку в лог."""
    while True:
        try:
            await task()
        except Exception:
            logger.exception("Фоновая задача %s упала", task.__name__)

        await asyncio.sleep(seconds)


async def main() -> None:
    """Запускает все фоновые задачи. Worker должен быть один: два отправили бы пост в канал дважды."""
    await asyncio.gather(*(run_every(task, seconds) for task, seconds in SCHEDULE))


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
