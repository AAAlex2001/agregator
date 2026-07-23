from fastapi import APIRouter, BackgroundTasks, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from models.labor import LaborListingKind
from schemas.labor import (
    LaborContactResponse,
    LaborListingCreate,
    LaborListingListResponse,
    LaborListingResponse,
)
from services.email import (
    EmailDispatcher,
    EmailRepository,
    SendLaborResponseEmailUseCase,
    SendNewLaborListingEmailUseCase,
)
from services.labor_resources import (
    CloseLaborListingUseCase,
    ContactLaborListingUseCase,
    CreateLaborListingUseCase,
    GetPublicLaborListingUseCase,
    LaborPolicy,
    LaborRepository,
    ListLaborListingsUseCase,
)
from services.notifications import (
    CreateLaborResponseNotificationUseCase,
    NotificationRepository,
)

router = APIRouter(prefix="/labor", tags=["labor"])


def build_labor_dependencies(
    db: AsyncSession,
) -> tuple[LaborRepository, LaborPolicy]:
    repository = LaborRepository(db)
    return repository, LaborPolicy(repository)


@router.get("/public/{public_id}", response_model=LaborListingResponse)
async def get_public_labor_listing(
    public_id: str,
    db: AsyncSession = Depends(get_db),
) -> LaborListingResponse:
    repository = LaborRepository(db)
    return await GetPublicLaborListingUseCase(repository).execute(public_id)


@router.get("/listings", response_model=LaborListingListResponse)
async def list_labor_listings(
    kind: LaborListingKind,
    mine: bool = Query(False),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> LaborListingListResponse:
    return await ListLaborListingsUseCase(LaborRepository(db)).execute(
        kind,
        user_id,
        mine,
    )


@router.post(
    "/listings",
    response_model=LaborListingResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_labor_listing(
    payload: LaborListingCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> LaborListingResponse:
    repository, policy = build_labor_dependencies(db)
    send_email = SendNewLaborListingEmailUseCase(
        repo=EmailRepository(db),
        dispatcher=EmailDispatcher(background_tasks),
    )
    return await CreateLaborListingUseCase(
        repository,
        policy,
        send_email,
    ).execute(payload, user_id)


@router.delete(
    "/listings/{listing_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def close_labor_listing(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> None:
    await CloseLaborListingUseCase(LaborRepository(db)).execute(
        listing_id,
        user_id,
    )


@router.post(
    "/listings/{listing_id}/contact",
    response_model=LaborContactResponse,
)
async def contact_labor_listing(
    listing_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> LaborContactResponse:
    repository, policy = build_labor_dependencies(db)
    return await ContactLaborListingUseCase(
        repository,
        policy,
        CreateLaborResponseNotificationUseCase(NotificationRepository(db)),
        SendLaborResponseEmailUseCase(
            EmailRepository(db),
            EmailDispatcher(background_tasks),
        ),
    ).execute(listing_id, user_id)
