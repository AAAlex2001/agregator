"""Отдача файла заявки с исходным именем."""

from urllib.parse import quote

from fastapi.responses import FileResponse, Response

from app.blitz.documents.models import OrderDocument
from app.blitz.documents.services.exceptions import DocumentNotFoundError
from app.core.private_files import private_path

PDF_TYPE = "application/pdf"
DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


def attachment(name: str) -> str:
    """Заголовок скачивания с русским именем файла."""

    return f"attachment; filename*=UTF-8''{quote(name)}"


def file_response(document: OrderDocument) -> FileResponse:
    """Файл с диска. Пропал с диска — DocumentNotFoundError."""

    path = private_path(document.path)
    if path is None:
        raise DocumentNotFoundError

    return FileResponse(path, headers={"Content-Disposition": attachment(document.name)})


def generated_response(content: bytes, name: str, media_type: str) -> Response:
    """Документ, собранный на лету: счёт, акт или проект договора."""

    return Response(content, media_type=media_type, headers={"Content-Disposition": attachment(name)})
