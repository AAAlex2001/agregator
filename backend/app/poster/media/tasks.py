"""Фоновая очистка забытых файлов редактора. Файлы постов и черновиков не трогает."""

import asyncio
import logging
from datetime import UTC, datetime, timedelta

from app.core.database import SessionLocal
from app.poster.media.services.repo import PostMediaRepository
from app.poster.media.services.storage import remove_file

logger = logging.getLogger(__name__)

BATCH_SIZE = 100
FILE_TTL = timedelta(days=1)
INTERVAL_SECONDS = 3600


async def delete_expired_media() -> None:
    """Удаляет порцию свободных файлов старше суток: сначала записи, после коммита — файлы."""

    expired_before = datetime.now(UTC) - FILE_TTL

    async with SessionLocal() as db, db.begin():
        paths = await PostMediaRepository(db).delete_expired(expired_before, BATCH_SIZE)

    for path in paths:
        try:
            await asyncio.to_thread(remove_file, path)
        except OSError:
            logger.exception("Не удалось удалить временный файл публикации: %s", path)

    if paths:
        logger.info("Удалено временных файлов публикаций: %d", len(paths))


async def run_media_cleanup_loop() -> None:
    """Чистит раз в час. Параллельные процессы не берут одни и те же записи."""

    while True:
        try:
            await delete_expired_media()
        except Exception:
            logger.exception("Ошибка очистки файлов публикаций")

        await asyncio.sleep(INTERVAL_SECONDS)
