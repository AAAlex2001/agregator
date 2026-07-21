from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.internal_auth import require_internal_token
from models.contact_deal import ContactDealStatus
from routes.contact_deal import build_contact_dependencies, build_contact_notifier
from schemas.contact_deal import (
    AdminContactDealListResponse,
    AdminContactDealReleaseRequest,
    ContactDealDetailResponse,
)
from services.contact_deals import ContactDealPolicy, ContactDealRepository, ContactReceiptStorage
from services.contact_deals.formatters import to_detail
from services.contact_deals.use_cases import (
    GetContactDealUseCase,
    GetContactReceiptUseCase,
    ListAdminContactDealsUseCase,
    ReleaseContactByAdminUseCase,
)

router = APIRouter(
    prefix="/internal/contact-deals",
    tags=["admin-contact-deals"],
    dependencies=[Depends(require_internal_token)],
)


@router.get("", response_model=AdminContactDealListResponse)
async def list_admin_contact_deals(
    deal_status: ContactDealStatus | None = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
) -> AdminContactDealListResponse:
    items = await ListAdminContactDealsUseCase(ContactDealRepository(db)).execute(deal_status)
    return AdminContactDealListResponse(items=items, total=len(items))


@router.get("/{deal_id}", response_model=ContactDealDetailResponse)
async def get_admin_contact_deal(
    deal_id: int,
    db: AsyncSession = Depends(get_db),
) -> ContactDealDetailResponse:
    _, policy, cipher = build_contact_dependencies(db)
    return await GetContactDealUseCase(policy, cipher).execute(deal_id, None, admin=True)


@router.post("/{deal_id}/release", response_model=ContactDealDetailResponse)
async def release_admin_contact_deal(
    deal_id: int,
    payload: AdminContactDealReleaseRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> ContactDealDetailResponse:
    repository, policy, cipher = build_contact_dependencies(db)
    deal = await ReleaseContactByAdminUseCase(
        repository, policy, build_contact_notifier(db, background_tasks)
    ).execute(deal_id, payload.note)
    return to_detail(deal, None, cipher, admin=True)


@router.get("/{deal_id}/receipts/{receipt_id}")
async def download_admin_contact_receipt(
    deal_id: int,
    receipt_id: int,
    db: AsyncSession = Depends(get_db),
) -> FileResponse:
    repository = ContactDealRepository(db)
    receipt = await GetContactReceiptUseCase(ContactDealPolicy(repository)).execute(
        deal_id, receipt_id, None
    )
    storage = ContactReceiptStorage()
    try:
        path = storage.resolve(receipt.storage_key)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Файл чека не найден") from exc
    return FileResponse(
        path,
        media_type=receipt.content_type,
        filename=receipt.original_name,
        headers={"X-Content-Type-Options": "nosniff"},
    )
