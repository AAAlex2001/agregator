import json as json_lib
from datetime import date as date_type
from typing import Literal

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_db
from dependencies.auth import get_current_user
from dependencies.rate_limit import rate_limit
from models.account import UserRole
from models.response import ResponseStatus, VatKind
from schemas.common import DeletedCountResponse, DetailResponse
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
    to_item,
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
) -> ExpertResponseList:
    "Возвращает отклики текущего пользователя: для заказчика — по заказам, для эксперта — свои."
    repo = build_repo(db)
    validator = ResponseValidator(repo)
    actor = await validator.require_active_user(user_id)

    if actor.role == UserRole.CUSTOMER:
        customer_use_case = ListCustomerResponsesUseCase(repo, validator)
        rows, has_more, counters = await customer_use_case.execute(
            user_id, tab, skip, limit, sort_by, sort_dir
        )
        items = [to_item(row.response, has_review=row.has_review) for row in rows]
    else:
        expert_use_case = ListExpertResponsesUseCase(repo, validator)
        responses, has_more, counters = await expert_use_case.execute(user_id, tab, skip, limit)
        items = [to_item(response) for response in responses]

    return ExpertResponseList(items=items, has_more=has_more, counters=counters)


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
    return to_item(updated)


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
    return to_item(updated)


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
    )
    restored = await use_case.execute(response_id=response_id, expert_id=user_id)
    return to_item(restored)


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
