"""Кадастровые работы: анкета кадастрового инженера."""
from fastapi import APIRouter, Body, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from schemas.cadastral import CadastralProfileInput, CadastralProfileResponse
from schemas.common import DocumentUrl
from services.cadastral import (
    CadastralFileKind,
    CadastralRepository,
    CadastralValidator,
    DeleteCadastralDocumentUseCase,
    GetCadastralProfileUseCase,
    ReplaceCadastralFileUseCase,
    SaveCadastralProfileUseCase,
    UploadCadastralDocumentUseCase,
)

router = APIRouter(prefix="/directions/cadastral", tags=["directions"])

UPLOAD_LIMIT = Depends(rate_limit("direction_documents", max_calls=10, window_seconds=60))


def build_validator(db: AsyncSession) -> CadastralValidator:
    return CadastralValidator(CadastralRepository(db))


@router.get("/profile", response_model=CadastralProfileResponse)
async def get_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> CadastralProfileResponse:
    """Анкета кадастрового инженера текущего исполнителя."""
    return await GetCadastralProfileUseCase(build_validator(db)).execute(user_id)


@router.put("/profile", response_model=CadastralProfileResponse)
async def save_profile(
    data: CadastralProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> CadastralProfileResponse:
    """Сохраняет анкету кадастрового инженера."""
    repo = CadastralRepository(db)
    use_case = SaveCadastralProfileUseCase(repo, CadastralValidator(repo))
    return await use_case.execute(user_id, data)


@router.post("/profile/diploma", response_model=CadastralProfileResponse, dependencies=[UPLOAD_LIMIT])
async def upload_diploma(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> CadastralProfileResponse:
    """Прикладывает диплом об образовании; прежний файл заменяется."""
    repo = CadastralRepository(db)
    use_case = ReplaceCadastralFileUseCase(repo, CadastralValidator(repo))
    return await use_case.execute(user_id, CadastralFileKind.DIPLOMA, file)


@router.post("/profile/certificate", response_model=CadastralProfileResponse, dependencies=[UPLOAD_LIMIT])
async def upload_certificate(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> CadastralProfileResponse:
    """Прикладывает аттестат кадастрового инженера; прежний файл заменяется."""
    repo = CadastralRepository(db)
    use_case = ReplaceCadastralFileUseCase(repo, CadastralValidator(repo))
    return await use_case.execute(user_id, CadastralFileKind.CERTIFICATE, file)


@router.post("/profile/documents", response_model=CadastralProfileResponse, dependencies=[UPLOAD_LIMIT])
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> CadastralProfileResponse:
    """Прикладывает дополнительный диплом или свидетельство о курсах."""
    repo = CadastralRepository(db)
    use_case = UploadCadastralDocumentUseCase(repo, CadastralValidator(repo))
    return await use_case.execute(user_id, file)


@router.delete("/profile/documents", response_model=CadastralProfileResponse)
async def delete_document(
    data: DocumentUrl = Body(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> CadastralProfileResponse:
    """Убирает дополнительный документ из анкеты."""
    repo = CadastralRepository(db)
    use_case = DeleteCadastralDocumentUseCase(repo, CadastralValidator(repo))
    return await use_case.execute(user_id, data.url)
