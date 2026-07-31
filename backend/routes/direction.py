from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from models.order import OrderWorkType
from schemas.directions import (
    CadastralProfileInput,
    CadastralProfileResponse,
    DirectionSummary,
    ForensicProfileInput,
    ForensicProfileResponse,
)
from services.directions import (
    DirectionsRepository,
    DirectionsValidator,
    GetDirectionProfileUseCase,
    ListExpertDirectionsUseCase,
    UpsertDirectionProfileUseCase,
)

router = APIRouter(tags=["directions"])


def build_validator(db: AsyncSession) -> DirectionsValidator:
    return DirectionsValidator(DirectionsRepository(db))


@router.get("/expert/directions", response_model=list[DirectionSummary])
async def list_directions(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> list[DirectionSummary]:
    "Направления исполнителя: какие есть и какие анкеты заполнены."
    return await ListExpertDirectionsUseCase(build_validator(db)).execute(user_id)


@router.get(
    "/expert/directions/cadastral/profile",
    response_model=CadastralProfileResponse,
)
async def get_cadastral_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> CadastralProfileResponse:
    "Анкета кадастрового инженера текущего исполнителя."
    return await GetDirectionProfileUseCase(build_validator(db)).execute(
        user_id, OrderWorkType.CADASTRAL.value
    )


@router.put(
    "/expert/directions/cadastral/profile",
    response_model=CadastralProfileResponse,
)
async def update_cadastral_profile(
    data: CadastralProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> CadastralProfileResponse:
    "Создаёт или обновляет анкету кадастрового инженера."
    repo = DirectionsRepository(db)
    use_case = UpsertDirectionProfileUseCase(repo, DirectionsValidator(repo))
    profile = await use_case.execute(user_id, OrderWorkType.CADASTRAL.value, data)
    await db.commit()
    return profile


@router.get(
    "/expert/directions/forensic/profile",
    response_model=ForensicProfileResponse,
)
async def get_forensic_profile(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ForensicProfileResponse:
    "Анкета судебного эксперта текущего исполнителя."
    return await GetDirectionProfileUseCase(build_validator(db)).execute(
        user_id, OrderWorkType.FORENSIC.value
    )


@router.put(
    "/expert/directions/forensic/profile",
    response_model=ForensicProfileResponse,
)
async def update_forensic_profile(
    data: ForensicProfileInput,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ForensicProfileResponse:
    "Создаёт или обновляет анкету судебного эксперта."
    repo = DirectionsRepository(db)
    use_case = UpsertDirectionProfileUseCase(repo, DirectionsValidator(repo))
    profile = await use_case.execute(user_id, OrderWorkType.FORENSIC.value, data)
    await db.commit()
    return profile
