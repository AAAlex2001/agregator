"""Документы направлений, приложенные при регистрации.

Ключ слота и файл приходят параллельными списками одной multipart-формы.
Каждый слот зовёт тот же use case, что и загрузка из кабинета: проверка типа,
размера и владельца файла одна на оба сценария.
"""
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from services.audit import AuditRepository, AuditValidator, UploadAuditDocumentUseCase
from services.cadastral import (
    CadastralFileKind,
    CadastralRepository,
    CadastralValidator,
    ReplaceCadastralFileUseCase,
    UploadCadastralDocumentUseCase,
)
from services.forensic import (
    ForensicRepository,
    ForensicValidator,
    UploadForensicDiplomaUseCase,
    UploadForensicDocumentUseCase,
)

MAX_REGISTRATION_DOCUMENTS = 20


async def attach_documents(
    db: AsyncSession,
    account_id: int,
    slots: list[str],
    files: list[UploadFile],
) -> None:
    """Кладёт приложенные при регистрации файлы в анкеты своих направлений."""
    if len(slots) != len(files):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Каждому документу должен соответствовать слот направления",
        )
    if len(files) > MAX_REGISTRATION_DOCUMENTS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"При регистрации можно приложить не более {MAX_REGISTRATION_DOCUMENTS} документов",
        )
    for slot, file in zip(slots, files, strict=True):
        await upload_to_slot(db, account_id, slot, file)


async def upload_to_slot(db: AsyncSession, account_id: int, slot: str, file: UploadFile) -> None:
    """Загружает один файл в слот анкеты своего направления."""
    if slot == "AUDIT_SUPB":
        repo = AuditRepository(db)
        await UploadAuditDocumentUseCase(repo, AuditValidator(repo)).execute(account_id, file)
        return
    if slot in ("CADASTRAL_DIPLOMA", "CADASTRAL_CERTIFICATE", "CADASTRAL"):
        repo = CadastralRepository(db)
        validator = CadastralValidator(repo)
        if slot == "CADASTRAL_DIPLOMA":
            use_case = ReplaceCadastralFileUseCase(repo, validator)
            await use_case.execute(account_id, CadastralFileKind.DIPLOMA, file)
        elif slot == "CADASTRAL_CERTIFICATE":
            use_case = ReplaceCadastralFileUseCase(repo, validator)
            await use_case.execute(account_id, CadastralFileKind.CERTIFICATE, file)
        else:
            await UploadCadastralDocumentUseCase(repo, validator).execute(account_id, file)
        return
    if slot in ("FORENSIC_DIPLOMA", "FORENSIC"):
        repo = ForensicRepository(db)
        validator = ForensicValidator(repo)
        if slot == "FORENSIC_DIPLOMA":
            await UploadForensicDiplomaUseCase(repo, validator).execute(account_id, file)
        else:
            await UploadForensicDocumentUseCase(repo, validator).execute(account_id, file)
        return
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Неизвестный слот документа: {slot}",
    )
