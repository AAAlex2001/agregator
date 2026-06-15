"POST-роуты загрузки медиа (изображение, видео) для редактора статьи."

from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from starlette.requests import Request

ARTICLE_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
ARTICLE_MAX_IMAGE_SIZE = 20 * 1024 * 1024
ARTICLE_VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov", ".m4v"}
ARTICLE_MAX_VIDEO_SIZE = 200 * 1024 * 1024
ARTICLE_UPLOADS_ROOT = Path("/app/uploads/articles")
ARTICLE_VIDEOS_ROOT = ARTICLE_UPLOADS_ROOT / "videos"


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

    @app.post("/admin-actions/articles/upload-video", name="article_upload_video")
    async def article_upload_video(request: Request, file: UploadFile = File(...)) -> dict[str, Any]:
        "Загружает видео для встраивания в статью. Возвращает публичный URL для тега <video>."
        if not request.session.get("authenticated", False):
            raise HTTPException(status_code=401, detail="Не авторизован")

        extension = Path(file.filename or "").suffix.lower()
        if extension not in ARTICLE_VIDEO_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Недопустимое расширение. Разрешены: mp4, webm, mov, m4v",
            )

        ARTICLE_VIDEOS_ROOT.mkdir(parents=True, exist_ok=True)
        generated_name = f"{uuid4().hex}{extension}"
        full_path = ARTICLE_VIDEOS_ROOT / generated_name

        total = 0
        with open(full_path, "wb") as out:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                total += len(chunk)
                if total > ARTICLE_MAX_VIDEO_SIZE:
                    out.close()
                    full_path.unlink(missing_ok=True)
                    raise HTTPException(status_code=413, detail="Видео слишком большое (макс 200 МБ)")
                out.write(chunk)

        return {"url": f"/uploads/articles/videos/{generated_name}"}
