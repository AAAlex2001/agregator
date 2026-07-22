from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database.database import get_db
from dependencies.auth import get_current_user
from models.chat import Chat, ChatMessage
from models.labor import LaborListing, LaborListingKind
from models.user import User, UserRole
from schemas.labor import (
    LaborContactResponse,
    LaborListingCreate,
    LaborListingListResponse,
    LaborListingResponse,
)
from services.email import (
    EmailDispatcher,
    EmailRepository,
    SendNewLaborListingEmailUseCase,
)
from services.notifications import (
    CreateChatMessageNotificationUseCase,
    NotificationRepository,
)

router = APIRouter(prefix="/labor", tags=["labor"])

INVITE_MESSAGE = (
    "Добрый день! Мы как раз ищем эксперта с такими областями "
    "аттестации, обсудим возможности сотрудничества?"
)
RESPONSE_MESSAGE = (
    "Добрый день! Готов рассмотреть варианты трудоустройства, "
    "расскажите подробнее что вам требуется."
)


def display_name(user: User) -> str:
    company = user.company_data or {}
    company_data = company.get("data") or {}
    company_name = (company_data.get("name") or {}).get(
        "short_with_opf"
    )
    full_name = " ".join(
        part
        for part in (user.first_name, user.last_name)
        if part
    ).strip()
    return company_name or full_name or user.email or f"Пользователь #{user.id}"


def serialize(item: LaborListing, actor_id: int) -> LaborListingResponse:
    return LaborListingResponse(
        id=item.id,
        public_id=item.public_id,
        owner_id=item.owner_id,
        owner_name=display_name(item.owner),
        owner_avatar_url=item.owner.avatar_url,
        kind=item.kind,
        certificates=item.certificates or [],
        other_profession=item.other_profession,
        region=item.region,
        employment_term=item.employment_term,
        fixed_term=item.fixed_term,
        start_date=item.start_date,
        employment_type=item.employment_type,
        current_job_status=item.current_job_status,
        is_active=item.is_active,
        is_mine=item.owner_id == actor_id,
        created_at=item.created_at,
    )


async def require_user(db: AsyncSession, user_id: int) -> User:
    query = select(User).where(User.id == user_id)
    user = (await db.execute(query)).scalars().first()

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа",
        )
    return user


@router.get("/public/{public_id}", response_model=LaborListingResponse)
async def get_public_labor_listing(
    public_id: str,
    db: AsyncSession = Depends(get_db),
) -> LaborListingResponse:
    "Публичная карточка заявки по public_id — для страницы-превью при шеринге. Без авторизации, без контактов."
    query = (
        select(LaborListing)
        .options(selectinload(LaborListing.owner))
        .where(LaborListing.public_id == public_id, LaborListing.is_active.is_(True))
    )
    item = (await db.execute(query)).scalars().first()
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заявка не найдена",
        )
    return serialize(item, actor_id=0)


@router.get("/listings", response_model=LaborListingListResponse)
async def list_labor_listings(
    kind: LaborListingKind,
    mine: bool = Query(False),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> LaborListingListResponse:
    query = (
        select(LaborListing)
        .options(selectinload(LaborListing.owner))
        .where(LaborListing.kind == kind, LaborListing.is_active.is_(True))
    )
    if mine:
        query = query.where(LaborListing.owner_id == user_id)
    else:
        query = query.where(LaborListing.owner_id != user_id)

    query = query.order_by(LaborListing.created_at.desc())
    items = list((await db.execute(query)).scalars().all())

    return LaborListingListResponse(
        items=[serialize(item, user_id) for item in items],
        total=len(items),
    )


@router.post("/listings", response_model=LaborListingResponse, status_code=status.HTTP_201_CREATED)
async def create_labor_listing(
    payload: LaborListingCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> LaborListingResponse:
    user = await require_user(db, user_id)
    certificates = [
        item.model_dump(exclude_none=True)
        for item in payload.certificates
    ]
    if payload.kind == LaborListingKind.EXPERT_AVAILABLE:
        profile_certificates = list(user.expert_certificates or [])
        if profile_certificates:
            certificates = profile_certificates

    listing = LaborListing(
        owner_id=user_id,
        owner=user,
        kind=payload.kind,
        certificates=certificates,
        other_profession=(payload.other_profession or "").strip() or None,
        region=payload.region.strip(),
        employment_term=payload.employment_term,
        fixed_term=(payload.fixed_term or "").strip() or None,
        start_date=payload.start_date,
        employment_type=payload.employment_type,
        current_job_status=payload.current_job_status,
    )
    db.add(listing)
    await db.flush()
    await SendNewLaborListingEmailUseCase(
        repo=EmailRepository(db),
        dispatcher=EmailDispatcher(background_tasks),
    ).execute(listing.id)
    return serialize(listing, user_id)


@router.delete("/listings/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def close_labor_listing(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> None:
    query = select(LaborListing).where(LaborListing.id == listing_id)
    listing = (await db.execute(query)).scalars().first()

    if listing is None or listing.owner_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заявка не найдена",
        )
    listing.is_active = False
    await db.flush()


@router.post("/listings/{listing_id}/contact", response_model=LaborContactResponse)
async def contact_labor_listing(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> LaborContactResponse:
    actor = await require_user(db, user_id)
    listing = (
        await db.execute(
            select(LaborListing)
            .options(selectinload(LaborListing.owner))
            .where(
                LaborListing.id == listing_id,
                LaborListing.is_active.is_(True),
            )
        )
    ).scalars().first()

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заявка не найдена",
        )
    if listing.owner_id == user_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Нельзя откликнуться на свою заявку",
        )

    if listing.kind == LaborListingKind.EXPERT_WANTED:
        if actor.role != UserRole.EXPERT:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Откликнуться может только эксперт",
            )
        customer_id, expert_id, message = listing.owner_id, user_id, RESPONSE_MESSAGE
    else:
        if actor.role != UserRole.LICENSE_HOLDER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Пригласить эксперта может держатель лицензии"
                ),
            )
        customer_id, expert_id, message = user_id, listing.owner_id, INVITE_MESSAGE

    chat = (
        await db.execute(
            select(Chat).where(
                Chat.labor_listing_id == listing.id,
                Chat.customer_id == customer_id,
                Chat.expert_id == expert_id,
            )
        )
    ).scalars().first()
    if chat is None:
        chat = Chat(
            labor_listing_id=listing.id,
            customer_id=customer_id,
            expert_id=expert_id,
        )
        db.add(chat)
        await db.flush()
        db.add(ChatMessage(chat_id=chat.id, sender_id=user_id, text=message))
        await db.flush()
        recipient_id = expert_id if user_id == customer_id else customer_id
        await CreateChatMessageNotificationUseCase(NotificationRepository(db)).execute(
            user_id=recipient_id,
            order_title=(
                "Поиск эксперта в штат"
                if listing.kind == LaborListingKind.EXPERT_WANTED
                else "Готов к трудовому договору"
            ),
            sender_role=UserRole.CUSTOMER if user_id == customer_id else UserRole.EXPERT,
            preview=message,
            action_url=f"/chat/{chat.uuid}",
        )
    return LaborContactResponse(chat_uuid=str(chat.uuid))
