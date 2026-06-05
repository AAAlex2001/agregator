"POST-роут загрузки изображения для статьи (раздел редактора блога/новостей)."

from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from starlette.requests import Request

ARTICLE_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
ARTICLE_MAX_IMAGE_SIZE = 20 * 1024 * 1024
ARTICLE_UPLOADS_ROOT = Path("/app/uploads/articles")


def setup(app: FastAPI) -> None:
    "Регистрирует роуты раздела статей в переданном приложении FastAPI."

    @app.post("/admin-actions/articles/upload-image", name="article_upload_image")
    async def article_upload_image(request: Request, file: UploadFile = File(...)) -> dict[str, Any]:
        if not request.session.get("authenticated", False):
            raise HTTPException(status_code=401, detail="Не авторизован")

        extension = Path(file.filename or "").suffix.lower()
        if extension not in ARTICLE_IMAGE_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Недопустимое расширение")

        ARTICLE_UPLOADS_ROOT.mkdir(parents=True, exist_ok=True)
        generated_name = f"{uuid4().hex}{extension}"
        full_path = ARTICLE_UPLOADS_ROOT / generated_name

        total = 0
        with open(full_path, "wb") as out:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                total += len(chunk)
                if total > ARTICLE_MAX_IMAGE_SIZE:
                    out.close()
                    full_path.unlink(missing_ok=True)
                    raise HTTPException(status_code=413, detail="Файл слишком большой")
                out.write(chunk)

        return {"url": f"/uploads/articles/{generated_name}"}
