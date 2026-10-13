"""Удаляет забытые файлы редактора; файлы опубликованных постов и черновиков не трогает."""

import asyncio
import logging
from datetime import UTC, datetime, timedelta

from database.database import AsyncSessionLocal
from services.posts.repo import PostMediaRepository
from services.posts.uploads import remove_file

logger = logging.getLogger(__name__)

BATCH_SIZE = 100
FILE_TTL = timedelta(days=1)
INTERVAL_SECONDS = 3600


async def cleanup_post_media() -> None:
    """Удаляет порцию свободных файлов старше суток: сначала записи, после коммита — файлы."""

    async with AsyncSessionLocal() as db, db.begin():
        paths = await PostMediaRepository(db).delete_expired(datetime.now(UTC) - FILE_TTL, BATCH_SIZE)
    for path in paths:
        try:
            await asyncio.to_thread(remove_file, path)
        except OSError:
            logger.exception("Не удалось удалить временный файл публикации: %s", path)
    if paths:
        logger.info("Удалено временных файлов публикаций: %d", len(paths))


async def run_post_media_cleanup_loop() -> None:
    """Чистит временные файлы раз в час; параллельные процессы не берут одни и те же записи."""

    while True:
        try:
            await cleanup_post_media()
        except Exception:
            logger.exception("Ошибка очистки файлов публикаций")
        await asyncio.sleep(INTERVAL_SECONDS)
