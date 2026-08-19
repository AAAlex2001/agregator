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
from services.design import DesignRepository, DesignValidator, UploadDesignDocumentUseCase
from services.ecology import EcologyRepository, EcologyValidator, UploadEcologyDocumentUseCase
from services.forensic import (
    ForensicRepository,
    ForensicValidator,
    UploadForensicDiplomaUseCase,
    UploadForensicDocumentUseCase,
)
from services.survey import SurveyRepository, SurveyValidator, UploadSurveyDocumentUseCase
from services.tech_diag import TechDiagRepository, TechDiagValidator, UploadTechDiagDocumentUseCase

MAX_REGISTRATION_DOCUMENTS = 20

DESIGN_SLOT_GROUPS = {
    "DESIGN_EDUCATION": "education",
    "DESIGN_NOK": "nok",
    "DESIGN_NRS": "nrs",
    "DESIGN_QUALIFICATION": "qualification",
    "DESIGN_RTN": "rtn",
}

SURVEY_SLOT_GROUPS = {
    "SURVEY_EDUCATION": "education",
    "SURVEY_NOK": "nok",
    "SURVEY_NRS": "nrs",
    "SURVEY_QUALIFICATION": "qualification",
    "SURVEY_RTN": "rtn",
}


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
    if slot == "TECH_DIAG":
        repo = TechDiagRepository(db)
        await UploadTechDiagDocumentUseCase(repo, TechDiagValidator(repo)).execute(account_id, file)
        return
    if slot == "ECOLOGY":
        repo = EcologyRepository(db)
        await UploadEcologyDocumentUseCase(repo, EcologyValidator(repo)).execute(account_id, file)
        return
    if slot in DESIGN_SLOT_GROUPS:
        repo = DesignRepository(db)
        use_case = UploadDesignDocumentUseCase(repo, DesignValidator(repo))
        await use_case.execute(account_id, DESIGN_SLOT_GROUPS[slot], file)
        return
    if slot in SURVEY_SLOT_GROUPS:
        repo = SurveyRepository(db)
        use_case = UploadSurveyDocumentUseCase(repo, SurveyValidator(repo))
        await use_case.execute(account_id, SURVEY_SLOT_GROUPS[slot], file)
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
