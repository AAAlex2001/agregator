from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import UploadFile

from src.core.config import UPLOADS_DIR
from src.support.exceptions import FileTooLargeError, TooManyFilesError, WrongFileTypeError

MAX_FILES = 6
MAX_FILE_SIZE = 100 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".jpeg", ".jpg", ".png", ".doc", ".docx", ".xls", ".xlsx"}


class TicketFiles:
    """Файлы, приложенные к сообщениям обращения. Лежат в uploads/support/<id обращения>/."""

    def check(self, files: list[UploadFile]) -> list[UploadFile]:
        """Убирает пустые поля формы и проверяет количество, формат и размер файлов до сохранения."""
        chosen_files = [file for file in files if file.filename]

        if len(chosen_files) > MAX_FILES:
            raise TooManyFilesError()

        for file in chosen_files:
            if Path(file.filename or "").suffix.lower() not in ALLOWED_EXTENSIONS:
                raise WrongFileTypeError()

            if (file.size or 0) > MAX_FILE_SIZE:
                raise FileTooLargeError()

        return chosen_files

    async def save(self, ticket_id: int, files: list[UploadFile]) -> list[dict[str, str]]:
        """Сохраняет файлы на диск и возвращает их имена и адреса для сообщения."""
        folder = UPLOADS_DIR / "support" / str(ticket_id)
        folder.mkdir(parents=True, exist_ok=True)
        attachments = []

        for file in files:
            content = await file.read()
            original_name = Path(file.filename or "file").name
            stored_name = f"{uuid4().hex}{Path(original_name).suffix.lower()}"

            async with aiofiles.open(folder / stored_name, "wb") as stored_file:
                await stored_file.write(content)

            attachments.append(
                {"name": original_name, "url": f"/uploads/support/{ticket_id}/{stored_name}"}
            )

        return attachments
