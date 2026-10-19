"""Проверки содержимого файлов публикаций без сети и базы."""

from io import BytesIO

import pytest
from fastapi import UploadFile
from PIL import Image, PngImagePlugin

from app.poster.media.services import storage as uploads
from app.poster.media.services.exceptions import UploadError


async def test_photo_is_checked_by_content_and_metadata_is_removed(tmp_path, monkeypatch):
    """Имя файла не влияет на формат; личные метаданные удаляются."""
    monkeypatch.setattr(uploads, "UPLOADS_DIR", tmp_path)
    output = BytesIO()
    metadata = PngImagePlugin.PngInfo()
    metadata.add_text("Author", "Личные данные")
    Image.new("RGB", (4, 4), "orange").save(output, format="PNG", pnginfo=metadata)
    file = UploadFile(file=BytesIO(output.getvalue()), filename="fake.html")
    path = await uploads.save_image(file, 1024 * 1024)
    assert path.endswith(".png")
    with Image.open(tmp_path / path) as image:
        assert image.size == (4, 4)
        assert "Author" not in image.info


async def test_unknown_video_size_is_measured_and_partial_file_is_removed(tmp_path, monkeypatch):
    """Поток без размера тоже подчиняется лимиту; незавершённый файл удаляется."""
    monkeypatch.setattr(uploads, "UPLOADS_DIR", tmp_path)
    file = UploadFile(file=BytesIO(b"0000ftypmp42" + b"x" * 50), filename="video.mp4")
    with pytest.raises(UploadError):
        await uploads.save_video(file, 20)
    assert list((tmp_path / "posts").iterdir()) == []


async def test_video_rejects_wrong_signature_and_accepts_mp4_header(tmp_path, monkeypatch):
    """Поддельное расширение не заменяет сигнатуру MP4."""
    monkeypatch.setattr(uploads, "UPLOADS_DIR", tmp_path)
    with pytest.raises(UploadError):
        await uploads.save_video(UploadFile(file=BytesIO(b"not a video")), 1024)
    content = b"0000ftypmp42" + b"x" * 10
    path = await uploads.save_video(UploadFile(file=BytesIO(content)), 1024)
    assert (tmp_path / path).read_bytes() == content


def test_delete_cannot_escape_posts_directory(tmp_path, monkeypatch):
    """Удаление ограничено папкой публикаций."""
    monkeypatch.setattr(uploads, "UPLOADS_DIR", tmp_path)
    with pytest.raises(ValueError, match="папке публикаций"):
        uploads.remove_file("../outside.txt")


@pytest.mark.parametrize("brand", [b"heic", b"mif1", b"avif", b"avis"])
async def test_image_containers_are_not_classified_as_video(brand, tmp_path, monkeypatch):
    """Общий контейнер ftyp не превращает HEIC/AVIF в видео."""
    monkeypatch.setattr(uploads, "UPLOADS_DIR", tmp_path)
    content = b"0000ftyp" + brand + b"content"
    assert not uploads.is_video_header(content)
    with pytest.raises(UploadError):
        await uploads.save_video(UploadFile(file=BytesIO(content)), 1024)
    assert not (tmp_path / "posts").exists()
