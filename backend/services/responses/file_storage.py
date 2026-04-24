from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status

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

BACKEND_ROOT = Path(__file__).resolve().parents[2]


class ResponseFileStorage:
    "Сохраняет файлы откликов на диск. Никакой работы с БД."

    async def save(self, response_id: int, files: list[UploadFile]) -> list[str]:
        upload_dir = BACKEND_ROOT / "uploads" / "responses" / str(response_id)
        upload_dir.mkdir(parents=True, exist_ok=True)

        saved: list[str] = []
        for file in files:
            saved.append(await self.save_one(upload_dir, file, response_id))
        return saved

    async def save_one(
        self, upload_dir: Path, file: UploadFile, response_id: int
    ) -> str:
        extension = Path(file.filename or "").suffix.lower()
        self.ensure_extension_allowed(extension)

        generated_name = f"{uuid4().hex}{extension}"
        full_path = upload_dir / generated_name
        async with aiofiles.open(full_path, "wb") as handle:
            while chunk := await file.read(UPLOAD_CHUNK_SIZE):
                await handle.write(chunk)

        return f"/uploads/responses/{response_id}/{generated_name}"

    @staticmethod
    def ensure_extension_allowed(extension: str) -> None:
        if extension in ALLOWED_EXTENSIONS:
            return
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Допустимые форматы: PDF, JPEG, JPG, PNG, DOC, DOCX, XLS, XLSX",
        )
