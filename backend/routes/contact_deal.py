from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    HTTPException,
    Request,
    Response,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.contact_deal import build_contact_cipher
from schemas.contact_deal import (
    ContactDealCreateRequest,
    ContactDealDetailResponse,
    ContactDealListResponse,
    ContactDealSignRequest,
    ContactReceiptRejectRequest,
)
from services.contact_deals import (
    ContactDealCipher,
    ContactDealPolicy,
    ContactDealRepository,
    ContactReceiptStorage,
)
from services.contact_deals.audit import build_signature_audit
from services.contact_deals.formatters import to_detail
from services.contact_deals.use_cases import (
    ConfirmContactPaymentUseCase,
    CreateContactDealUseCase,
    GetContactDealDocumentUseCase,
    GetContactDealUseCase,
    GetContactReceiptUseCase,
    ListContactDealsUseCase,
    NotifyContactAccessEventUseCase,
    RejectContactPaymentUseCase,
    SignContactDealUseCase,
    UploadContactReceiptUseCase,
)
from services.email import (
    EmailDispatcher,
    EmailRepository,
    SendContactAccessEmailUseCase,
)
from services.notifications import (
    CreateContactAccessNotificationUseCase,
    NotificationRepository,
)

router = APIRouter(prefix="/contact-deals", tags=["contact-deals"])


def build_contact_dependencies(
    db: AsyncSession,
) -> tuple[ContactDealRepository, ContactDealPolicy, ContactDealCipher]:
    repository = ContactDealRepository(db)
    return repository, ContactDealPolicy(repository), build_contact_cipher()


def build_contact_notifier(
    db: AsyncSession,
    background_tasks: BackgroundTasks,
) -> NotifyContactAccessEventUseCase:
    return NotifyContactAccessEventUseCase(
        CreateContactAccessNotificationUseCase(NotificationRepository(db)),
        SendContactAccessEmailUseCase(
            EmailRepository(db),
            EmailDispatcher(background_tasks),
        ),
    )


@router.post("", response_model=ContactDealDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_contact_deal(
    payload: ContactDealCreateRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ContactDealDetailResponse:
    repository, policy, cipher = build_contact_dependencies(db)
    deal = await CreateContactDealUseCase(
        repository,
        policy,
        cipher,
        build_contact_notifier(db, background_tasks),
    ).execute(
        payload.seller_id, user_id
    )
    return to_detail(deal, user_id, cipher)


@router.get("", response_model=ContactDealListResponse)
async def list_contact_deals(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ContactDealListResponse:
    items = await ListContactDealsUseCase(ContactDealRepository(db)).execute(user_id)
    return ContactDealListResponse(items=items, total=len(items))


@router.get("/{deal_id}", response_model=ContactDealDetailResponse)
async def get_contact_deal(
    deal_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ContactDealDetailResponse:
    _, policy, cipher = build_contact_dependencies(db)
    return await GetContactDealUseCase(policy, cipher).execute(deal_id, user_id)


@router.post("/{deal_id}/sign", response_model=ContactDealDetailResponse)
async def sign_contact_deal(
    deal_id: int,
    payload: ContactDealSignRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ContactDealDetailResponse:
    repository, policy, cipher = build_contact_dependencies(db)
    audit = build_signature_audit(
        request.client.host if request.client else None,
        request.headers.get("user-agent"),
        request.cookies.get("session_id"),
    )
    deal = await SignContactDealUseCase(
        repository, policy, build_contact_notifier(db, background_tasks)
    ).execute(
        deal_id,
        user_id,
        payload.password.get_secret_value(),
        audit,
    )
    return to_detail(deal, user_id, cipher)


@router.get("/{deal_id}/contract.pdf")
async def download_contact_contract(
    deal_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> Response:
    repository = ContactDealRepository(db)
    public_id, pdf = await GetContactDealDocumentUseCase(
        ContactDealPolicy(repository)
    ).execute(deal_id, user_id)
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="contact-contract-{public_id}.pdf"'
        },
    )


@router.post("/{deal_id}/receipt", response_model=ContactDealDetailResponse)
async def upload_contact_receipt(
    deal_id: int,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ContactDealDetailResponse:
    repository, policy, cipher = build_contact_dependencies(db)
    deal = await UploadContactReceiptUseCase(
        repository,
        policy,
        ContactReceiptStorage(),
        build_contact_notifier(db, background_tasks),
    ).execute(deal_id, user_id, file)
    return to_detail(deal, user_id, cipher)


@router.get("/{deal_id}/receipts/{receipt_id}")
async def download_contact_receipt(
    deal_id: int,
    receipt_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> FileResponse:
    repository = ContactDealRepository(db)
    receipt = await GetContactReceiptUseCase(ContactDealPolicy(repository)).execute(
        deal_id, receipt_id, user_id
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


@router.post("/{deal_id}/confirm-payment", response_model=ContactDealDetailResponse)
async def confirm_contact_payment(
    deal_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ContactDealDetailResponse:
    repository, policy, cipher = build_contact_dependencies(db)
    deal = await ConfirmContactPaymentUseCase(
        repository, policy, build_contact_notifier(db, background_tasks)
    ).execute(deal_id, user_id)
    return to_detail(deal, user_id, cipher)


@router.post("/{deal_id}/reject-payment", response_model=ContactDealDetailResponse)
async def reject_contact_payment(
    deal_id: int,
    payload: ContactReceiptRejectRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ContactDealDetailResponse:
    repository, policy, cipher = build_contact_dependencies(db)
    deal = await RejectContactPaymentUseCase(
        repository, policy, build_contact_notifier(db, background_tasks)
    ).execute(
        deal_id, user_id, payload.reason
    )
    return to_detail(deal, user_id, cipher)
