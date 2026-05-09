import json as json_lib
from datetime import date as date_type, timedelta
from typing import Literal

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from models.order import OrderStatus
from models.response import ResponseStatus, VatKind
from models.user import UserRole
from schemas.response import (
    ExpertResponseItem,
    ExpertResponseList,
    ResponseCreate,
    ResponseTab,
)
from services.email import (
    EmailDispatcher,
    EmailRepository,
    SendBiddingFinishedEmailUseCase,
    SendExpertRejectedEmailUseCase,
    SendResponseCreatedEmailUseCase,
    SendResponseUpdatedEmailUseCase,
)
from services.notifications import NotificationRepository
from services.subscriptions import SubscriptionAccess, SubscriptionRepository
from services.responses import (
    CreateResponseUseCase,
    GetResponseByIdUseCase,
    ListCustomerResponsesUseCase,
    ListExpertResponsesUseCase,
    ResponseFileStorage,
    ResponseInAppNotifier,
    ResponseRepository,
    ResponseStatusRules,
    ResponseValidator,
    UpdateResponseStatusUseCase,
    UpdateResponseUseCase,
    UploadResponseFilesUseCase,
    WithdrawResponseUseCase,
)

router = APIRouter(tags=["responses"])


def build_repo(db: AsyncSession) -> ResponseRepository:
    return ResponseRepository(db)


def build_get_response(db: AsyncSession) -> GetResponseByIdUseCase:
    return GetResponseByIdUseCase(build_repo(db))


def build_in_app(db: AsyncSession, repo: ResponseRepository) -> ResponseInAppNotifier:
    return ResponseInAppNotifier(repo, NotificationRepository(db))


def build_subscription_access(db: AsyncSession) -> SubscriptionAccess:
    return SubscriptionAccess(SubscriptionRepository(db))


def build_upload_files(db: AsyncSession, repo: ResponseRepository) -> UploadResponseFilesUseCase:
    return UploadResponseFilesUseCase(
        repo=repo,
        get_response=GetResponseByIdUseCase(repo),
        files=ResponseFileStorage(),
    )


def build_email_repo(db: AsyncSession) -> EmailRepository:
    return EmailRepository(db)


def format_sum(sum_amount: int) -> str:
    roubles = sum_amount // 100
    formatted = f"{roubles:,}".replace(",", " ")
    if sum_amount % 100:
        return f"{formatted},{sum_amount % 100:02d} ₽"
    return f"{formatted} ₽"


def to_item(
    entity,
    actor_role: UserRole | None = None,
) -> ExpertResponseItem:
    order = entity.order
    effective_status = entity.status
    date_source = entity.created_at
    if effective_status in {ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}:
        date_source = entity.updated_at or entity.created_at
    customer_name = ""
    customer_company = ""
    order_sum = ""
    if order:
        customer_name = order.company or ""
        customer_company = order.company or ""
        order_sum = "Не определено" if order.sum_amount == 0 else format_sum(order.sum_amount)

    expert = entity.expert
    expert_name = ""
    expert_avatar_url: str | None = None
    expert_rating: float | None = None
    expert_review_count = 0
    expert_public_id = ""
    rejection_reason = entity.rejection_reason
    expert_company_name = ""
    if isinstance(entity.expert_company_data, dict):
        expert_company_name = (entity.expert_company_data.get("value") or "")
    if expert:
        parts = [expert.first_name or "", expert.last_name or ""]
        expert_name = " ".join(p for p in parts if p)
        expert_avatar_url = expert.avatar_url
        expert_rating = float(expert.rating) if expert.rating is not None else None
        expert_review_count = expert.review_count or 0
        expert_public_id = expert.public_id or ""

    has_review = bool(getattr(entity, "has_review_for_customer", False)) if actor_role == UserRole.CUSTOMER else False

    order_locked = False
    if order is not None:
        order_locked = (
            order.assigned_expert_id is not None
            or order.status != OrderStatus.ACTIVE
        )

    return ExpertResponseItem(
        id=entity.id,
        order_id=entity.order_id,
        order_public_id=order.public_id if order else "",
        order_customer_id=order.customer_id if order else 0,
        status=effective_status,
        date=date_source.strftime("%d.%m.%Y"),
        comment=entity.comment,
        proposed_sum=format_sum(entity.proposed_sum_amount),
        proposed_deadline=entity.proposed_deadline.strftime("%d.%m.%Y"),
        order_title=order.title if order else "",
        order_sum=order_sum,
        order_date=order.deadline.strftime("%d.%m.%Y") if order else "",
        order_comment=order.comment if order else "",
        customer_name=customer_name,
        customer_company=customer_company,
        technical_files=order.technical_files if order and order.technical_files else [],
        response_files=entity.technical_files if entity.technical_files else [],
        badges=[
            {"text": badge.text, "variant": badge.variant.value}
            for badge in (order.badges if order else [])
        ],
        created_at=entity.created_at,
        proposed_sum_amount_raw=entity.proposed_sum_amount,
        proposed_deadline_raw=entity.proposed_deadline.isoformat(),
        previous_proposed_sum=(
            format_sum(entity.previous_proposed_sum_amount)
            if entity.previous_proposed_sum_amount is not None
            else None
        ),
        previous_proposed_deadline=(
            entity.previous_proposed_deadline.strftime("%d.%m.%Y")
            if entity.previous_proposed_deadline is not None
            else None
        ),
        expert_name=expert_name,
        expert_avatar_url=expert_avatar_url,
        expert_rating=expert_rating,
        expert_review_count=expert_review_count,
        expert_public_id=expert_public_id,
        expert_confirmed=entity.expert_confirmed or False,
        has_review=has_review,
        rejection_reason=rejection_reason,
        expert_company_name=expert_company_name,
        expert_inn=entity.expert_inn,
        vat_kind=entity.vat_kind or VatKind.NONE,
        confirm_deadline=(
            ((entity.updated_at or entity.created_at) + timedelta(days=3)).strftime("%d.%m.%Y")
            if effective_status in {ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS}
            else ""
        ),
        order_locked=order_locked,
    )


@router.post("/orders/{order_id}/responses", response_model=ExpertResponseItem)
async def create_response_for_order(
    order_id: int,
    background_tasks: BackgroundTasks,
    comment: str = Form(""),
    proposed_sum_amount: int = Form(...),
    proposed_deadline: str = Form(...),
    expert_inn: str = Form(...),
    expert_company_data: str = Form(...),
    vat_kind: VatKind = Form(VatKind.NONE),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    data = ResponseCreate(
        comment=comment,
        proposed_sum_amount=proposed_sum_amount,
        proposed_deadline=date_type.fromisoformat(proposed_deadline),
        expert_inn=expert_inn,
        expert_company_data=expert_company_data,
        vat_kind=vat_kind,
    )
    repo = build_repo(db)
    get_response = GetResponseByIdUseCase(repo)
    create_use_case = CreateResponseUseCase(
        repo=repo,
        validator=ResponseValidator(repo),
        get_response=get_response,
        in_app=build_in_app(db, repo),
        subscription_access=build_subscription_access(db),
    )
    created = await create_use_case.execute(order_id=order_id, expert_id=user_id, data=data)

    if files and files[0].filename:
        upload_use_case = build_upload_files(db, repo)
        created = await upload_use_case.execute(created.id, user_id, files)

    email_use_case = SendResponseCreatedEmailUseCase(
        repo=EmailRepository(db),
        dispatcher=EmailDispatcher(background_tasks),
    )
    await email_use_case.execute(created.id)
    return to_item(created)


@router.get("/responses", response_model=ExpertResponseList)
async def get_my_responses(
    tab: ResponseTab | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    sort_by: Literal["created_at", "proposed_sum_amount", "expert_rating"] = Query("created_at"),
    sort_dir: Literal["asc", "desc"] = Query("desc"),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    repo = build_repo(db)
    validator = ResponseValidator(repo)
    actor = await validator.get_actor(user_id)

    if actor.role == UserRole.CUSTOMER:
        use_case = ListCustomerResponsesUseCase(repo, validator)
        items, total, counters = await use_case.execute(
            user_id, tab, skip, limit, sort_by, sort_dir
        )
    else:
        use_case = ListExpertResponsesUseCase(repo, validator)
        items, total, counters = await use_case.execute(user_id, tab, skip, limit)

    return ExpertResponseList(
        items=[to_item(item, actor.role) for item in items],
        total=total,
        counters=counters,
    )


@router.patch("/responses/{response_id}/status", response_model=ExpertResponseItem)
async def update_response_status(
    response_id: int,
    new_status: ResponseStatus,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
    rejection_reason: str | None = Form(None, max_length=1000),
):
    repo = build_repo(db)
    send_bidding = SendBiddingFinishedEmailUseCase(
        repo=build_email_repo(db),
        dispatcher=EmailDispatcher(background_tasks),
    )
    use_case = UpdateResponseStatusUseCase(
        repo=repo,
        validator=ResponseValidator(repo),
        rules=ResponseStatusRules(),
        get_response=GetResponseByIdUseCase(repo),
        in_app=build_in_app(db, repo),
        send_bidding_email=send_bidding,
        subscription_access=build_subscription_access(db),
    )
    updated = await use_case.execute(
        response_id=response_id, actor_id=user_id, new_status=new_status, reason=rejection_reason
    )
    return to_item(updated)


@router.put("/responses/{response_id}", response_model=ExpertResponseItem)
async def update_response(
    response_id: int,
    background_tasks: BackgroundTasks,
    comment: str = Form(""),
    proposed_sum_amount: int = Form(...),
    proposed_deadline: str = Form(...),
    vat_kind: VatKind = Form(VatKind.NONE),
    keep_files: str = Form(default="[]"),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    try:
        keep_files_list: list[str] = json_lib.loads(keep_files)
    except (ValueError, TypeError):
        keep_files_list = []

    data = ResponseCreate(
        comment=comment,
        proposed_sum_amount=proposed_sum_amount,
        proposed_deadline=date_type.fromisoformat(proposed_deadline),
        vat_kind=vat_kind,
    )

    repo = build_repo(db)
    send_updated = SendResponseUpdatedEmailUseCase(
        repo=build_email_repo(db),
        dispatcher=EmailDispatcher(background_tasks),
    )
    use_case = UpdateResponseUseCase(
        repo=repo,
        validator=ResponseValidator(repo),
        get_response=GetResponseByIdUseCase(repo),
        upload_files=build_upload_files(db, repo),
        in_app=build_in_app(db, repo),
        send_updated_email=send_updated,
    )
    updated = await use_case.execute(
        response_id=response_id,
        expert_id=user_id,
        data=data,
        keep_files=keep_files_list,
        new_files=[f for f in files if f.filename] or None,
    )
    return to_item(updated)


@router.delete("/responses/{response_id}")
async def withdraw_response(
    response_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    repo = build_repo(db)
    send_rejected = SendExpertRejectedEmailUseCase(
        repo=build_email_repo(db),
        dispatcher=EmailDispatcher(background_tasks),
    )
    use_case = WithdrawResponseUseCase(
        repo=repo,
        get_response=GetResponseByIdUseCase(repo),
        in_app=build_in_app(db, repo),
        send_rejected_email=send_rejected,
        subscription_access=build_subscription_access(db),
    )
    await use_case.execute(response_id=response_id, expert_id=user_id)
    return {"detail": "Отклик отозван"}
