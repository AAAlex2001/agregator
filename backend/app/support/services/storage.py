"""Вложения обращений: uploads/support/<id обращения>/."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import UploadFile

from app.core.uploads import display_name, remove_upload, save_upload

MAX_FILE_SIZE_MB = 100


class SupportFileStorage:
    """Сохраняет вложения сообщений поддержки."""

    @asynccontextmanager
    async def saved(
        self,
        ticket_id: int,
        uploads: list[UploadFile],
    ) -> AsyncIterator[list[dict[str, str]]]:
        """Файлы сохраняются на входе и удаляются, если блок внутри не выполнился."""

        attachments: list[dict[str, str]] = []

        try:
            for upload in uploads:
                url = await save_upload(upload, f"support/{ticket_id}", MAX_FILE_SIZE_MB)
                attachments.append({"name": display_name(upload), "url": url})

            yield attachments
        except Exception:
            for attachment in attachments:
                remove_upload(attachment["url"])

            raise
