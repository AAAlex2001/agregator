from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status

from utils.filenames import sanitize_filename

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".jpeg",
    ".jpg",
    ".png",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
}
UPLOAD_CHUNK_SIZE = 1024 * 1024
MAX_FILE_SIZE = 100 * 1024 * 1024
MAX_FILES = 6

BACKEND_ROOT = Path(__file__).resolve().parents[2]


class SupportFileStorage:
    "Сохраняет файлы тикетов поддержки на диск."

    async def save(self, ticket_id: int, files: list[UploadFile]) -> list[dict]:
        if not files:
            return []
        if len(files) > MAX_FILES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Можно прикрепить не больше {MAX_FILES} файлов",
            )

        upload_dir = BACKEND_ROOT / "uploads" / "support" / str(ticket_id)
        upload_dir.mkdir(parents=True, exist_ok=True)

        return [await self.save_one(upload_dir, file, ticket_id) for file in files]

    async def save_one(
        self, upload_dir: Path, file: UploadFile, ticket_id: int
    ) -> dict:
        original_name = file.filename or "file"
        extension = Path(original_name).suffix.lower()
        self.ensure_extension_allowed(extension)

        generated_name = f"{uuid4().hex}{extension}"
        full_path = upload_dir / generated_name

        total_size = 0
        async with aiofiles.open(full_path, "wb") as handle:
            while chunk := await file.read(UPLOAD_CHUNK_SIZE):
                total_size += len(chunk)
                if total_size > MAX_FILE_SIZE:
                    await handle.close()
                    full_path.unlink(missing_ok=True)
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Файл больше {MAX_FILE_SIZE // (1024 * 1024)} МБ не поддерживается",
                    )
                await handle.write(chunk)

        return {
            "name": sanitize_filename(original_name, fallback=generated_name),
            "url": f"/uploads/support/{ticket_id}/{generated_name}",
        }

    @staticmethod
    def ensure_extension_allowed(extension: str) -> None:
        if extension in ALLOWED_EXTENSIONS:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Допустимые форматы: PDF, JPEG, JPG, PNG, DOC, DOCX, XLS, XLSX",
        )
