import hashlib
import os
from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile, status

from utils.filenames import sanitize_filename

ALLOWED_TYPES = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
}
MAX_RECEIPT_SIZE = 8 * 1024 * 1024
CHUNK_SIZE = 1024 * 1024


class ContactReceiptStorage:
    def __init__(self, root: Path | None = None) -> None:
        configured = os.getenv("CONTACT_RECEIPT_STORAGE")
        self.root = root or Path(configured or "/app/private_uploads/contact_receipts")

    async def save(self, deal_public_id: str, upload: UploadFile) -> dict[str, str | int]:
        original_name = sanitize_filename(upload.filename, fallback="receipt")
        extension = Path(original_name).suffix.lower()
        expected_type = ALLOWED_TYPES.get(extension)
        if expected_type is None or upload.content_type != expected_type:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Допустимые форматы чека: PDF, JPG, PNG, WEBP",
            )

        directory = self.root / deal_public_id
        directory.mkdir(parents=True, exist_ok=True)
        generated_name = f"{uuid4().hex}{extension}"
        path = directory / generated_name
        digest = hashlib.sha256()
        total = 0
        first_bytes = b""

        try:
            async with aiofiles.open(path, "wb") as handle:
                while chunk := await upload.read(CHUNK_SIZE):
                    if not first_bytes:
                        first_bytes = chunk[:16]
                    total += len(chunk)
                    if total > MAX_RECEIPT_SIZE:
                        raise HTTPException(
                            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail="Размер чека не должен превышать 8 МБ",
                        )
                    digest.update(chunk)
                    await handle.write(chunk)
            self.validate_signature(extension, first_bytes)
        except Exception:
            path.unlink(missing_ok=True)
            raise

        return {
            "storage_key": f"{deal_public_id}/{generated_name}",
            "original_name": original_name,
            "content_type": expected_type,
            "size_bytes": total,
            "sha256": digest.hexdigest(),
        }

    def resolve(self, storage_key: str) -> Path:
        candidate = (self.root / storage_key).resolve()
        root = self.root.resolve()
        if root not in candidate.parents or not candidate.is_file():
            raise FileNotFoundError(storage_key)
        return candidate

    @staticmethod
    def validate_signature(extension: str, data: bytes) -> None:
        valid = (
            (extension == ".pdf" and data.startswith(b"%PDF-"))
            or (extension in {".jpg", ".jpeg"} and data.startswith(b"\xff\xd8\xff"))
            or (extension == ".png" and data.startswith(b"\x89PNG\r\n\x1a\n"))
            or (extension == ".webp" and data.startswith(b"RIFF") and data[8:12] == b"WEBP")
        )
        if not valid:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Содержимое файла не соответствует его формату",
            )
