import json as json_lib
from datetime import date as date_type
from datetime import timedelta
from typing import Literal

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from models.order import OrderStatus
from models.response import OrderResponse as OrderResponseModel
from models.response import ResponseStatus, VatKind
from models.user import UserRole
from schemas.common import DeletedCountResponse, DetailResponse
from schemas.order import OrderDocuments
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
from services.orders.documents import OrderDocumentsService
from services.platform_settings import PlatformSettingsService
from services.responses import (
    CreateResponseUseCase,
    DeleteAllRejectedResponsesUseCase,
    DeleteRejectedResponseUseCase,
    GetResponseByIdUseCase,
    ListCustomerResponsesUseCase,
    ListExpertResponsesUseCase,
    ResponseFileStorage,
    ResponseInAppNotifier,
    ResponseRepository,
    ResponseStatusRules,
    ResponseValidator,
    RestoreWithdrawnResponseUseCase,
    UpdateResponseStatusUseCase,
    UpdateResponseUseCase,
    UploadResponseFilesUseCase,
    WithdrawResponseUseCase,
)
from services.subscriptions import SubscriptionAccess, SubscriptionRepository

router = APIRouter(tags=["responses"])


def build_repo(db: AsyncSession) -> ResponseRepository:
    return ResponseRepository(db)


def build_get_response(db: AsyncSession) -> GetResponseByIdUseCase:
    return GetResponseByIdUseCase(build_repo(db))


def build_in_app(
    db: AsyncSession,
    repo: ResponseRepository,
    dispatcher: EmailDispatcher | None = None,
) -> ResponseInAppNotifier:
    return ResponseInAppNotifier(repo, NotificationRepository(db), dispatcher)


def build_subscription_access(db: AsyncSession) -> SubscriptionAccess:
    return SubscriptionAccess(SubscriptionRepository(db), PlatformSettingsService(db))


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
    entity: OrderResponseModel,
    actor_role: UserRole | None = None,
) -> ExpertResponseItem:
    order = entity.order
    effective_status = entity.status
    date_source = entity.created_at
    if effective_status in {ResponseStatus.ACCEPTED, ResponseStatus.IN_PROGRESS, ResponseStatus.COMPLETED}:
        date_source = entity.updated_at or entity.created_at
    is_finalized = effective_status == ResponseStatus.COMPLETED
    customer_name = ""
    customer_company = ""
    customer_inn = ""
    order_sum = ""
    if order:
        # Компания-организатор и её ИНН видны эксперту всегда (как и документы заказчика),
        # чтобы в «Моих откликах» было понятно, на чью заявку откликнулся.
        customer_name = order.company or ""
        customer_company = order.company or ""
        customer_inn = order.customer.inn or "" if order.customer is not None else ""
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
        expert_id=entity.expert_id,
        order_public_id=order.public_id if order else "",
        order_customer_id=order.customer_id if order else 0,
        status=effective_status,
        date=date_source.strftime("%d.%m.%Y"),
        comment=entity.comment,
        proposed_sum=format_sum(entity.proposed_sum_amount),
        proposed_start_date=(
            entity.proposed_start_date.strftime("%d.%m.%Y") if entity.proposed_start_date else ""
        ),
        proposed_deadline=entity.proposed_deadline.strftime("%d.%m.%Y"),
        order_title=order.title if order else "",
        order_sum=order_sum,
        order_start_date=(
            order.start_date.strftime("%d.%m.%Y") if order and order.start_date else ""
        ),
        order_date=order.deadline.strftime("%d.%m.%Y") if order else "",
        order_comment=order.comment if order else "",
        order_responses_deadline=(
            order.responses_deadline.isoformat() if order and order.responses_deadline else None
        ),
        order_created_at=order.created_at.isoformat() if order and order.created_at else "",
        customer_name=customer_name,
        customer_company=customer_company,
        customer_inn=customer_inn,
        order_documents=OrderDocumentsService.from_order(order) if order else OrderDocuments(),
        response_files=entity.technical_files if entity.technical_files else [],
        badges=[
            {"text": badge.text, "variant": badge.variant.value}
            for badge in (order.badges if order else [])
        ],
        created_at=entity.created_at,
        proposed_sum_amount_raw=entity.proposed_sum_amount,
        proposed_start_date_raw=(
            entity.proposed_start_date.isoformat() if entity.proposed_start_date else ""
        ),
        proposed_deadline_raw=entity.proposed_deadline.isoformat(),
        previous_comment=None if is_finalized else entity.previous_comment,
        previous_proposed_sum=(
            None if is_finalized
            else format_sum(entity.previous_proposed_sum_amount)
            if entity.previous_proposed_sum_amount is not None
            else None
        ),
        previous_proposed_start_date=(
            None if is_finalized
            else entity.previous_proposed_start_date.strftime("%d.%m.%Y")
            if entity.previous_proposed_start_date is not None
            else None
        ),
        previous_proposed_deadline=(
            None if is_finalized
            else entity.previous_proposed_deadline.strftime("%d.%m.%Y")
            if entity.previous_proposed_deadline is not None
            else None
        ),
        previous_vat_kind=None if is_finalized else entity.previous_vat_kind,
        previous_response_files=(
            None if is_finalized
            else list(entity.previous_technical_files)
            if isinstance(entity.previous_technical_files, list)
            else None
        ),
        order_previous_title=(
            None if is_finalized or order is None else order.previous_title
        ),
        order_previous_comment=(
            None if is_finalized or order is None else order.previous_comment
        ),
        order_previous_sum=(
            None if is_finalized or order is None or order.previous_sum_amount is None
            else format_sum(order.previous_sum_amount)
        ),
        order_previous_date=(
            None if is_finalized or order is None or order.previous_deadline is None
            else order.previous_deadline.strftime("%d.%m.%Y")
        ),
        order_previous_documents=(
            None if is_finalized or order is None
            else OrderDocumentsService.from_order_previous(order)
        ),
        order_previous_badges=(
            None if is_finalized or order is None
            else list(order.previous_badges)
            if isinstance(order.previous_badges, list)
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


@router.post(
    "/orders/{order_id}/responses",
    response_model=ExpertResponseItem,
    dependencies=[Depends(rate_limit("response_create", max_calls=5, window_seconds=60))],
)
async def create_response_for_order(
    order_id: int,
    background_tasks: BackgroundTasks,
    comment: str = Form(""),
    proposed_sum_amount: int = Form(...),
    proposed_start_date: str = Form(""),
    proposed_deadline: str = Form(...),
    expert_inn: str = Form(""),
    expert_company_data: str = Form(""),
    vat_kind: VatKind = Form(VatKind.NONE),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ExpertResponseItem:
    "Создаёт отклик эксперта на заказ с файлами и отправляет email-уведомление."
    data = ResponseCreate(
        comment=comment,
        proposed_sum_amount=proposed_sum_amount,
        proposed_start_date=date_type.fromisoformat(proposed_start_date) if proposed_start_date else None,
        proposed_deadline=date_type.fromisoformat(proposed_deadline),
        expert_inn=expert_inn or None,
        expert_company_data=expert_company_data or None,
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
    return to_item(created, UserRole.EXPERT)


@router.get("/responses", response_model=ExpertResponseList)
async def get_my_responses(
    tab: ResponseTab | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    sort_by: Literal["created_at", "proposed_sum_amount", "expert_rating"] = Query("created_at"),
    sort_dir: Literal["asc", "desc"] = Query("desc"),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ExpertResponseList:
    "Возвращает отклики текущего пользователя: для заказчика — по заказам, для эксперта — свои."
    repo = build_repo(db)
    validator = ResponseValidator(repo)
    actor = await validator.require_active_user(user_id)

    if actor.role == UserRole.CUSTOMER:
        use_case = ListCustomerResponsesUseCase(repo, validator)
        items, has_more, counters = await use_case.execute(
            user_id, tab, skip, limit, sort_by, sort_dir
        )
    else:
        use_case = ListExpertResponsesUseCase(repo, validator)
        items, has_more, counters = await use_case.execute(user_id, tab, skip, limit)

    return ExpertResponseList(
        items=[to_item(item, actor.role) for item in items],
        has_more=has_more,
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
) -> ExpertResponseItem:
    "Меняет статус отклика по правилам перехода с уведомлениями и проверкой подписки."
    repo = build_repo(db)
    validator = ResponseValidator(repo)
    actor = await validator.require_active_user(user_id)
    dispatcher = EmailDispatcher(background_tasks)
    send_bidding = SendBiddingFinishedEmailUseCase(
        repo=build_email_repo(db),
        dispatcher=dispatcher,
    )
    use_case = UpdateResponseStatusUseCase(
        repo=repo,
        validator=validator,
        rules=ResponseStatusRules(),
        get_response=GetResponseByIdUseCase(repo),
        in_app=build_in_app(db, repo, dispatcher),
        send_bidding_email=send_bidding,
        subscription_access=build_subscription_access(db),
    )
    updated = await use_case.execute(
        response_id=response_id, actor_id=user_id, new_status=new_status, reason=rejection_reason
    )
    return to_item(updated, actor.role)


@router.put("/responses/{response_id}", response_model=ExpertResponseItem)
async def update_response(
    response_id: int,
    background_tasks: BackgroundTasks,
    comment: str = Form(""),
    proposed_sum_amount: int = Form(...),
    proposed_start_date: str = Form(""),
    proposed_deadline: str = Form(...),
    vat_kind: VatKind = Form(VatKind.NONE),
    keep_files: str = Form(default="[]"),
    files: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ExpertResponseItem:
    "Обновляет отклик эксперта: текст, цену, даты, файлы; уведомляет заказчика."
    try:
        keep_files_list: list[str] = json_lib.loads(keep_files)
    except (ValueError, TypeError):
        keep_files_list = []

    data = ResponseCreate(
        comment=comment,
        proposed_sum_amount=proposed_sum_amount,
        proposed_start_date=date_type.fromisoformat(proposed_start_date) if proposed_start_date else None,
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
    return to_item(updated, UserRole.EXPERT)


@router.delete("/responses/{response_id}", response_model=DetailResponse)
async def withdraw_response(
    response_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DetailResponse:
    "Эксперт отзывает свой отклик; заказчик получает уведомление."
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
    return DetailResponse(detail="Отклик отозван")


@router.post("/responses/{response_id}/restore", response_model=ExpertResponseItem)
async def restore_withdrawn_response(
    response_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> ExpertResponseItem:
    "Эксперт восстанавливает ранее отозванный отклик."
    repo = build_repo(db)
    use_case = RestoreWithdrawnResponseUseCase(
        repo=repo,
        get_response=GetResponseByIdUseCase(repo),
        subscription_access=build_subscription_access(db),
    )
    restored = await use_case.execute(response_id=response_id, expert_id=user_id)
    return to_item(restored, UserRole.EXPERT)


@router.delete("/responses/rejected/all", response_model=DeletedCountResponse)
async def delete_all_rejected_responses(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DeletedCountResponse:
    "Заказчик массово удаляет все свои отклонённые отклики."
    repo = build_repo(db)
    use_case = DeleteAllRejectedResponsesUseCase(repo=repo)
    deleted = await use_case.execute(customer_id=user_id)
    return DeletedCountResponse(deleted=deleted)


@router.delete("/responses/{response_id}/rejected", response_model=DetailResponse)
async def delete_rejected_response(
    response_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user),
) -> DetailResponse:
    "Заказчик удаляет один отклонённый отклик."
    repo = build_repo(db)
    use_case = DeleteRejectedResponseUseCase(
        repo=repo,
        get_response=GetResponseByIdUseCase(repo),
    )
    await use_case.execute(response_id=response_id, customer_id=user_id)
    return DetailResponse(detail="Отклик удалён")
